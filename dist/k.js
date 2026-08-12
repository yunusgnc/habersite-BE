"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_dump_reader_1 = require("./scripts/migrate-legacy/mysql-dump-reader");
const D = '/Users/yunusbeto/Downloads/kayseritimes.sql';
(async () => {
    const order = await (0, mysql_dump_reader_1.readColumnOrder)(D);
    for await (const { table, row: r } of (0, mysql_dump_reader_1.readRows)(D, new Set(['kunye']), order)) {
        if (table !== 'kunye')
            continue;
        for (const f of ['Diger', 'YasalUyari']) {
            const v = (0, mysql_dump_reader_1.asStr)(r[f]);
            const hasHtml = /<\/?(p|div|span|strong|br|a|table)\b/i.test(v);
            console.log(`\n=== ${f}  (${v.length} karakter · HTML içeriyor: ${hasHtml ? 'EVET' : 'hayır'})`);
            console.log(v.slice(0, 320).replace(/\r?\n/g, '⏎'));
        }
        console.log('\n=== tablo alanlarında HTML var mı:');
        for (const f of ['TicaretUnvani', 'YonetimYeri', 'YerSaglayiciAdresi', 'Editorler', 'HaberAjanslari']) {
            const v = (0, mysql_dump_reader_1.asStr)(r[f]);
            console.log(`  ${f.padEnd(20)} HTML=${/<\/?[a-z]+\b/i.test(v) ? 'EVET' : 'hayır'}  satırlı=${/\r?\n/.test(v) ? 'evet' : 'hayır'}`);
        }
    }
})();
//# sourceMappingURL=k.js.map