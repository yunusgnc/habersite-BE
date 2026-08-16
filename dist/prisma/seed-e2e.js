"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.E2E = exports.VARSAYILAN_E2E_SIFRE = void 0;
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const bcrypt = __importStar(require("bcryptjs"));
require("dotenv/config");
exports.VARSAYILAN_E2E_SIFRE = 'e2e-yerel-test-2026';
const adapter = new adapter_pg_1.PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new client_1.PrismaClient({ adapter });
exports.E2E = {
    kiracıA: { slug: 'e2e-a', domain: 'e2e-a.test', ad: 'E2E Kiracı A' },
    kiracıB: { slug: 'e2e-b', domain: 'e2e-b.test', ad: 'E2E Kiracı B' },
    adminEposta: 'e2e-admin@test.local',
    yazarEposta: 'e2e-yazar@test.local',
    bEpostası: 'e2e-b-admin@test.local',
};
async function kiracıKur(bilgi, sifreHash, kullanicilar) {
    const kiracı = await prisma.tenant.upsert({
        where: { slug: bilgi.slug },
        update: { name: bilgi.ad, domain: bilgi.domain, active: true },
        create: {
            name: bilgi.ad,
            slug: bilgi.slug,
            domain: bilgi.domain,
            locale: 'tr',
            timezone: 'Europe/Istanbul',
        },
    });
    for (const k of kullanicilar) {
        await prisma.user.upsert({
            where: { tenantId_email: { tenantId: kiracı.id, email: k.email } },
            update: { passwordHash: sifreHash, name: k.name, role: k.role, active: true },
            create: {
                tenantId: kiracı.id,
                email: k.email,
                name: k.name,
                role: k.role,
                passwordHash: sifreHash,
            },
        });
    }
    await prisma.category.upsert({
        where: { tenantId_slug: { tenantId: kiracı.id, slug: 'e2e-gundem' } },
        update: {},
        create: {
            tenantId: kiracı.id,
            name: 'E2E Gündem',
            slug: 'e2e-gundem',
        },
    });
    return kiracı;
}
async function main() {
    if (process.env.NODE_ENV === 'production') {
        throw new Error('Bu tohum betiği üretimde çalıştırılamaz: test kullanıcıları canlı ' +
            'veritabanına yazılmamalı.');
    }
    const sifre = process.env.E2E_PASSWORD?.trim() || exports.VARSAYILAN_E2E_SIFRE;
    const hash = await bcrypt.hash(sifre, 10);
    const a = await kiracıKur(exports.E2E.kiracıA, hash, [
        { email: exports.E2E.adminEposta, name: 'E2E Admin', role: client_1.UserRole.ADMIN },
        { email: exports.E2E.yazarEposta, name: 'E2E Yazar', role: client_1.UserRole.REPORTER },
    ]);
    const b = await kiracıKur(exports.E2E.kiracıB, hash, [
        { email: exports.E2E.bEpostası, name: 'E2E B Admin', role: client_1.UserRole.ADMIN },
    ]);
    const bAdmin = await prisma.user.findUniqueOrThrow({
        where: { tenantId_email: { tenantId: b.id, email: exports.E2E.bEpostası } },
    });
    await prisma.article.upsert({
        where: { tenantId_slug: { tenantId: b.id, slug: 'e2e-b-gizli-haber' } },
        update: {},
        create: {
            tenantId: b.id,
            createdById: bAdmin.id,
            title: 'B KİRACISININ GİZLİ HABERİ',
            slug: 'e2e-b-gizli-haber',
            content: 'Bu haber yalnızca B kiracısına ait.',
            status: 'PUBLISHED',
            publishedAt: new Date(),
        },
    });
    const A = a.id;
    await prisma.author.upsert({
        where: { tenantId_slug: { tenantId: A, slug: 'e2e-yazar' } },
        update: {},
        create: { tenantId: A, name: 'E2E Yazar Profili', slug: 'e2e-yazar' },
    });
    await prisma.page.upsert({
        where: { tenantId_slug: { tenantId: A, slug: 'e2e-sayfa' } },
        update: {},
        create: {
            tenantId: A,
            title: 'E2E Sayfa',
            slug: 'e2e-sayfa',
            content: '<p>E2E test sayfası.</p>',
        },
    });
    await prisma.gallery.upsert({
        where: { tenantId_slug: { tenantId: A, slug: 'e2e-galeri' } },
        update: {},
        create: { tenantId: A, title: 'E2E Galeri', slug: 'e2e-galeri' },
    });
    await prisma.video.upsert({
        where: { tenantId_slug: { tenantId: A, slug: 'e2e-video' } },
        update: {},
        create: {
            tenantId: A,
            title: 'E2E Video',
            slug: 'e2e-video',
            videoUrl: 'https://example.invalid/e2e.mp4',
        },
    });
    const varsaGec = async (ad, bul, olustur) => {
        if (await bul())
            return;
        await olustur();
        console.log(`  + ${ad}`);
    };
    await varsaGec('reklam', () => prisma.ad.findFirst({ where: { tenantId: A, name: 'E2E Reklam' } }), () => prisma.ad.create({
        data: { tenantId: A, name: 'E2E Reklam', position: 'HEADER_TOP' },
    }));
    await varsaGec('duyuru', () => prisma.announcement.findFirst({ where: { tenantId: A, title: 'E2E Duyuru' } }), () => prisma.announcement.create({ data: { tenantId: A, title: 'E2E Duyuru' } }));
    await varsaGec('son dakika', () => prisma.breakingNews.findFirst({ where: { tenantId: A, title: 'E2E Son Dakika' } }), () => prisma.breakingNews.create({ data: { tenantId: A, title: 'E2E Son Dakika' } }));
    await varsaGec('popup', () => prisma.popup.findFirst({ where: { tenantId: A, title: 'E2E Popup' } }), () => prisma.popup.create({ data: { tenantId: A, title: 'E2E Popup' } }));
    console.log('E2E tohumu hazır:');
    console.log(`  Kiracı A: ${a.id} (${exports.E2E.kiracıA.domain})`);
    console.log(`  Kiracı B: ${b.id} (${exports.E2E.kiracıB.domain})`);
    console.log(`  Admin   : ${exports.E2E.adminEposta}`);
    console.log(`  Yazar   : ${exports.E2E.yazarEposta}`);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed-e2e.js.map