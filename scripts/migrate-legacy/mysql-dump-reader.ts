/**
 * mysqldump çıktısını akış halinde okur ve satırları nesne olarak verir.
 *
 * Neden hazır bir kütüphane değil: dump 153 MB ve tek bir INSERT satırı
 * onbinlerce kaydı taşıyabiliyor (extended insert). Tamamı belleğe alınmadan,
 * satır satır ve karakter karakter ayrıştırılıyor.
 *
 * Doğru ele alınması gerekenler:
 *  - Kaçışlı tırnak:  'O\'nun'      → O'nun
 *  - Kaçış dizileri:  \n \r \t \\ \0
 *  - Değer içindeki virgül ve parantez  → tırnak durumu takip edilerek
 *  - NULL  → null  (tırnaksız NULL literali)
 *  - Sayılar → number, geri kalan → string
 */
import * as fs from 'fs';
import { StringDecoder } from 'string_decoder';

/**
 * Dosyayı satır satır verir — `readline` kullanmadan.
 *
 * Neden kendi ayırıcımız: bu dump'ta tek bir INSERT satırı 1 MB'ı aşıyor
 * (extended insert). `readline` bu boyutta satırlarda Node sürümüne göre
 * farklı davranıyor; ölçümle doğrulandı — aynı dosyada Node 22 doğru okurken
 * Node 24 `haberler` tablosundan 37 satır düşürüyordu (41.976 yerine 41.939).
 * Aktarımın çalıştığı Node sürümüne göre veri kaybetmesi kabul edilemez.
 *
 * Burada `\n` sınırlarını kendimiz buluyor ve kalanı taşıyoruz; davranış
 * sürümden bağımsız. Satır sonundaki `\r` atılıyor (CRLF dump'ları).
 */
async function* readLines(dumpPath: string): AsyncGenerator<string> {
  const stream = fs.createReadStream(dumpPath);
  const decoder = new StringDecoder('utf8');
  let rest = '';
  for await (const chunk of stream) {
    rest += decoder.write(chunk as Buffer);
    let nl: number;
    while ((nl = rest.indexOf('\n')) !== -1) {
      const line = rest.slice(0, nl);
      rest = rest.slice(nl + 1);
      yield line.endsWith('\r') ? line.slice(0, -1) : line;
    }
  }
  rest += decoder.end();
  if (rest.length) yield rest.endsWith('\r') ? rest.slice(0, -1) : rest;
}

export type Row = Record<string, string | number | null>;

/** CREATE TABLE bloklarından kolon adlarını sırayla çıkarır. */
export async function readColumnOrder(
  dumpPath: string,
): Promise<Map<string, string[]>> {
  const result = new Map<string, string[]>();

  let current: string | null = null;
  let cols: string[] = [];

  for await (const line of readLines(dumpPath)) {
    const create = line.match(/^CREATE TABLE `([^`]+)`/);
    if (create) {
      current = create[1];
      cols = [];
      continue;
    }
    if (!current) continue;

    if (line.startsWith(')')) {
      result.set(current, cols);
      current = null;
      continue;
    }

    // Kolon satırı:  `Id` bigint(20) NOT NULL ...
    // Kısıt satırlarını (PRIMARY KEY, KEY, UNIQUE, CONSTRAINT) atla.
    const col = line.match(/^\s*`([^`]+)`\s+\S/);
    if (col) cols.push(col[1]);
  }

  return result;
}

/**
 * Tek bir INSERT satırındaki `(...),(...)` gruplarını ayrıştırır.
 * Tırnak durumu ve kaçış karakterleri takip edilir; bu yüzden değerlerin
 * içindeki virgül/parantez sorun çıkarmaz.
 */
function parseValueGroups(segment: string): (string | number | null)[][] {
  const groups: (string | number | null)[][] = [];

  let i = 0;
  const n = segment.length;

  while (i < n) {
    // Sıradaki grubun başlangıcını bul
    while (i < n && segment[i] !== '(') i++;
    if (i >= n) break;
    i++; // '(' atla

    const row: (string | number | null)[] = [];
    let buf = '';
    let inQuote = false;
    // Değerin tırnaklı gelip gelmediğini AYRI tutuyoruz. Dize içine işaret
    // gömmek, içeriği o işaretle başlayan bir değeri bozardı.
    let wasQuoted = false;
    let done = false;

    const push = () => {
      row.push(wasQuoted ? buf : finalizeUnquoted(buf));
      buf = '';
      wasQuoted = false;
    };

    while (i < n && !done) {
      const ch = segment[i];

      if (inQuote) {
        if (ch === '\\') {
          // Kaçış dizisi — bir sonraki karakteri yorumla
          const next = segment[i + 1];
          switch (next) {
            case 'n':
              buf += '\n';
              break;
            case 'r':
              buf += '\r';
              break;
            case 't':
              buf += '\t';
              break;
            case '0':
              buf += '\0';
              break;
            case 'b':
              buf += '\b';
              break;
            case 'Z':
              buf += '\x1a';
              break;
            default:
              buf += next; // \' \" \\ ve diğerleri birebir
          }
          i += 2;
          continue;
        }
        if (ch === "'") {
          // İki tırnak yan yana ise kaçışlı tırnak ('' → ')
          if (segment[i + 1] === "'") {
            buf += "'";
            i += 2;
            continue;
          }
          inQuote = false;
          i++;
          continue;
        }
        buf += ch;
        i++;
        continue;
      }

      // Tırnak dışında
      if (ch === "'") {
        inQuote = true;
        wasQuoted = true;
        i++;
        continue;
      }
      if (ch === ',') {
        push();
        i++;
        continue;
      }
      if (ch === ')') {
        push();
        done = true;
        i++;
        continue;
      }
      buf += ch;
      i++;
    }

    if (row.length) groups.push(row);
  }

  return groups;
}

/**
 * Tirnaksiz degerler: NULL literali, sayi veya beklenmeyen ciplak metin.
 * Tirnakli degerler buradan gecmez - "007" gibi dizeler ve slug'lar sayiya
 * cevrilip bozulmasin.
 */
function finalizeUnquoted(raw: string): string | number | null {
  const t = raw.trim();
  if (t === '') return null;
  if (t.toUpperCase() === 'NULL') return null;

  const num = Number(t);
  return Number.isFinite(num) ? num : t;
}

/**
 * Belirtilen tabloların satırlarını sırayla üretir. Bellekte yalnızca tek bir
 * INSERT satırı tutulur, bu yüzden 153 MB dump sorunsuz işlenir.
 */
export async function* readRows(
  dumpPath: string,
  tables: Set<string>,
  columnOrder: Map<string, string[]>,
): AsyncGenerator<{ table: string; row: Row }> {
  for await (const line of readLines(dumpPath)) {
    if (!line.startsWith('INSERT INTO')) continue;

    const m = line.match(/^INSERT INTO `([^`]+)` VALUES /);
    if (!m) continue;
    const table = m[1];
    if (!tables.has(table)) continue;

    const cols = columnOrder.get(table);
    if (!cols) continue;

    const segment = line.slice(m[0].length);
    for (const values of parseValueGroups(segment)) {
      const row: Row = {};
      // Kolon sayısı uyuşmazsa (şema değişikliği) eldeki kadarını al.
      for (let c = 0; c < cols.length && c < values.length; c++) {
        row[cols[c]] = values[c];
      }
      yield { table, row };
    }
  }
}

/** Yardımcılar — dump değerleri tip olarak gevşek geldiği için. */
export const asStr = (v: unknown): string =>
  v === null || v === undefined ? '' : String(v);

export const asInt = (v: unknown): number => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : 0;
};

export const asBool = (v: unknown): boolean => asInt(v) === 1;

/**
 * mysqldump datetime'ı Date'e çevirir. '0000-00-00 00:00:00' MySQL'in
 * "tarih yok" değeri — null döner, aksi halde Invalid Date üretir.
 */
export const asDate = (v: unknown): Date | null => {
  const s = asStr(v).trim();
  if (!s || s.startsWith('0000-00-00')) return null;
  const d = new Date(s.replace(' ', 'T') + 'Z');
  return Number.isNaN(d.getTime()) ? null : d;
};
