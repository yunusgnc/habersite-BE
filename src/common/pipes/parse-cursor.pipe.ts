import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseCursorPipe implements PipeTransform<string | undefined> {
  transform(value: string | undefined): string | undefined {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    // Validate that the cursor is a non-empty string (typically a CUID or UUID)
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new BadRequestException('Invalid cursor format');
    }

    return value.trim();
  }
}
