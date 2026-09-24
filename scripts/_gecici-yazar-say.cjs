require('dotenv/config');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const p = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
(async () => {
  const g = await p.author.groupBy({ by: ['tenantId'], _count: { _all: true } });
  console.log(JSON.stringify(g));
  await p.$disconnect();
})().catch((e) => { console.error(String(e.message || e).slice(0, 300)); process.exit(1); });
