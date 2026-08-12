"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_dump_reader_1 = require("./scripts/migrate-legacy/mysql-dump-reader");
const DUMP = '/Users/yunusbeto/Downloads/kayseritimes.sql';
(async () => {
    const order = await (0, mysql_dump_reader_1.readColumnOrder)(DUMP);
    for await (const { table, row: r } of (0, mysql_dump_reader_1.readRows)(DUMP, new Set(['sayfa']), order)) {
        if (table !== 'sayfa')
            continue;
        console.log(`--- Id=${(0, mysql_dump_reader_1.asStr)(r.Id)} "${(0, mysql_dump_reader_1.asStr)(r.SayfaBaslik)}"`);
        console.log(`    SayfaLinki="${(0, mysql_dump_reader_1.asStr)(r.SayfaLinki)}"  Durum=${(0, mysql_dump_reader_1.asStr)(r.Durum)}  Menu=${(0, mysql_dump_reader_1.asStr)(r.Menu)}`);
        console.log(`    Aciklama="${(0, mysql_dump_reader_1.asStr)(r.Aciklama).slice(0, 80)}"`);
        console.log(`    İçerik uzunluğu: ${(0, mysql_dump_reader_1.asStr)(r.SayfaIcerik).length} karakter`);
        console.log(`    İlk 160: ${(0, mysql_dump_reader_1.asStr)(r.SayfaIcerik).replace(/\s+/g, ' ').slice(0, 160)}`);
    }
})();
//# sourceMappingURL=p.js.map