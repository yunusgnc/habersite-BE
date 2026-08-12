"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_dump_reader_1 = require("./scripts/migrate-legacy/mysql-dump-reader");
const D = '/Users/yunusbeto/Downloads/kayseritimes.sql';
(async () => {
    const order = await (0, mysql_dump_reader_1.readColumnOrder)(D);
    console.log('kolon haritası tablo sayısı:', order.size, '| haberler kolonu:', order.get('haberler')?.length);
    const counts = {};
    for await (const { table } of (0, mysql_dump_reader_1.readRows)(D, new Set(['haberler', 'makaleler', 'yazarlar', 'videolar', 'haberkategori', 'yorumlar', 'resmi_ilanlar', 'galeriler', 'galeriresim', 'haberresim', 'settings', 'sayfa', 'kunye']), order)) {
        counts[table] = (counts[table] ?? 0) + 1;
    }
    console.log('\nsatır sayıları:');
    for (const [k, v] of Object.entries(counts).sort((a, b) => b[1] - a[1]))
        console.log(`  ${k.padEnd(16)} ${v}`);
    console.log('\nhaberler beklenen: 41976 →', counts.haberler === 41976 ? 'DOĞRU ✓' : `YANLIŞ (${counts.haberler})`);
})();
//# sourceMappingURL=count.js.map