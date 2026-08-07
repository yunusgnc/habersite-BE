import {
  Injectable,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';
import ffmpegPath from 'ffmpeg-static';
import { fileTypeFromBuffer } from 'file-type';

const MAX_UPLOAD_BYTES = 200 * 1024 * 1024; // 200 MB before compression
const TARGET_MAX_BYTES = 50 * 1024 * 1024;  // 50 MB target after compression
const ALLOWED_MIMES = new Set([
  'video/mp4',
  'video/webm',
  'video/quicktime', // .mov
  'video/x-matroska', // .mkv
]);

type CompressResult = {
  url: string;         // relative path stored (/uploads/videos/tenant/xxx.mp4)
  absolutePath: string;
  size: number;        // final size in bytes
  durationSec?: number;
};

@Injectable()
export class VideoUploadService {
  private readonly logger = new Logger(VideoUploadService.name);
  private readonly uploadRoot: string;

  constructor() {
    this.uploadRoot = process.env.UPLOAD_DIR
      ? path.resolve(process.env.UPLOAD_DIR)
      : path.resolve(process.cwd(), 'uploads');
  }

  async uploadAndCompress(
    tenantId: string,
    file: Express.Multer.File,
  ): Promise<CompressResult> {
    if (!file || !file.buffer) {
      throw new BadRequestException('No file uploaded');
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      throw new BadRequestException(
        `Dosya çok büyük (max ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)}MB).`,
      );
    }

    // Magic byte MIME sniff
    const detected = await fileTypeFromBuffer(file.buffer).catch(() => null);
    const effectiveMime = detected?.mime ?? file.mimetype;
    if (!ALLOWED_MIMES.has(effectiveMime)) {
      throw new BadRequestException(
        `Desteklenmeyen video formatı: ${effectiveMime}. .mp4 / .webm / .mov / .mkv kabul edilir.`,
      );
    }

    // Prepare dirs
    const tenantDir = path.join(this.uploadRoot, 'videos', tenantId);
    await fs.promises.mkdir(tenantDir, { recursive: true });

    // Write raw upload to temp file so ffmpeg can read from disk (streaming).
    const stamp = Date.now();
    const rand = Math.random().toString(36).slice(2, 8);
    const tempPath = path.join(tenantDir, `.tmp-${stamp}-${rand}`);
    const finalName = `${stamp}-${rand}.mp4`;
    const finalPath = path.join(tenantDir, finalName);
    await fs.promises.writeFile(tempPath, file.buffer);

    try {
      // If ffmpeg is unavailable, save raw and hope the browser can play it.
      if (!ffmpegPath) {
        this.logger.warn('ffmpeg-static binary not found — saving raw upload.');
        await fs.promises.rename(tempPath, finalPath);
      } else {
        await this.transcodeToH264(ffmpegPath, tempPath, finalPath);
        await fs.promises.unlink(tempPath).catch(() => {});
      }

      const stat = await fs.promises.stat(finalPath);
      const durationSec = await this.probeDuration(finalPath).catch(() => undefined);

      return {
        url: `/uploads/videos/${tenantId}/${finalName}`,
        absolutePath: finalPath,
        size: stat.size,
        durationSec,
      };
    } catch (err) {
      await fs.promises.unlink(tempPath).catch(() => {});
      await fs.promises.unlink(finalPath).catch(() => {});
      this.logger.error('Video upload failed', err as Error);
      throw new InternalServerErrorException(
        'Video işlenirken bir hata oluştu.',
      );
    }
  }

  /**
   * Transcode any input video to a web-friendly H.264/AAC MP4.
   * - Cap resolution to 1280x720 (down-scales only, never up-scales)
   * - CRF 28 target — visually near-transparent at ~1-3 Mbps for 720p
   * - +faststart moves the moov atom to the front for progressive playback
   * - Two-pass avoided (single pass is ~3× faster; CRF handles quality well)
   */
  private transcodeToH264(
    ffmpeg: string,
    input: string,
    output: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const args = [
        '-y',
        '-i', input,
        '-c:v', 'libx264',
        '-preset', 'veryfast',
        '-crf', '28',
        '-pix_fmt', 'yuv420p',
        '-vf', "scale='min(1280,iw)':'-2'",
        '-c:a', 'aac',
        '-b:a', '128k',
        '-movflags', '+faststart',
        '-max_muxing_queue_size', '9999',
        output,
      ];

      const proc = spawn(ffmpeg, args, { stdio: ['ignore', 'ignore', 'pipe'] });
      let stderr = '';
      proc.stderr.on('data', (d) => {
        stderr += d.toString();
      });
      proc.once('error', reject);
      proc.once('exit', (code) => {
        if (code === 0) resolve();
        else reject(new Error(`ffmpeg exit ${code}: ${stderr.slice(-500)}`));
      });
    });
  }

  /**
   * Read duration via ffprobe-style output from ffmpeg stderr.
   * Cheap enough — we already have ffmpeg on disk.
   */
  private probeDuration(file: string): Promise<number | undefined> {
    if (!ffmpegPath) return Promise.resolve(undefined);
    return new Promise((resolve) => {
      const proc = spawn(ffmpegPath!, ['-i', file], {
        stdio: ['ignore', 'ignore', 'pipe'],
      });
      let stderr = '';
      proc.stderr.on('data', (d) => (stderr += d.toString()));
      proc.once('exit', () => {
        const m = stderr.match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/);
        if (!m) return resolve(undefined);
        const h = Number(m[1]);
        const min = Number(m[2]);
        const s = Number(m[3]);
        resolve(Math.round(h * 3600 + min * 60 + s));
      });
      proc.once('error', () => resolve(undefined));
    });
  }

  /** Server-declared limits for the admin UI. */
  static readonly LIMITS = {
    maxUploadBytes: MAX_UPLOAD_BYTES,
    targetMaxBytes: TARGET_MAX_BYTES,
    allowedMimes: [...ALLOWED_MIMES],
  };
}
