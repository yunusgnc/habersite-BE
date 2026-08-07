# HaberSite API — Multi-Tenant Haber Platformu

NestJS + Prisma + PostgreSQL tabanlı çoklu kiracılı (multi-tenant) haber sitesi backend'i.

## Kurulum

```bash
npm install
npx prisma generate
```

## Veritabanı

PostgreSQL gereklidir. `.env` dosyasındaki `DATABASE_URL`'i düzenleyin:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/habersite?schema=public"
```

Migration ve seed:

```bash
npx prisma migrate dev --name init
npx ts-node prisma/seed.ts
```

## Çalıştırma

```bash
npm run start:dev    # Geliştirme (watch mode)
npm run build        # Production build
npm run start:prod   # Production
```

API varsayılan olarak `http://localhost:4000` üzerinde çalışır.

## API Endpoints

| Modül | Prefix | Açıklama |
|-------|--------|----------|
| Auth | `/api/auth` | Login, Register, Profil |
| Articles | `/api/articles` | Haber CRUD, listeleme, arama |
| Categories | `/api/categories` | Kategori yönetimi (hiyerarşik) |
| Authors | `/api/authors` | Köşe yazarı yönetimi |
| Media | `/api/media` | Medya yükleme/kütüphane |
| Comments | `/api/comments` | Yorum sistemi (moderasyonlu) |
| Breaking News | `/api/breaking-news` | Son dakika şeridi |
| Ads | `/api/ads` | Reklam yönetimi |
| Widgets | `/api/widgets` | Widget yapılandırması |
| Pages | `/api/pages` | Statik sayfa yönetimi |
| Users | `/api/users` | Kullanıcı/rol yönetimi |
| Tenants | `/api/tenants` | Kiracı yönetimi (Super Admin) |
| Redirects | `/api/redirects` | SEO yönlendirmeleri |
| Newsletters | `/api/newsletters` | E-bülten abonelik |
| Audit Log | `/api/audit-log` | İşlem geçmişi |
| Health | `/api/health` | Sağlık kontrolü |

## Multi-Tenant

Her istek `x-tenant-id` header'ı veya `Host` header'ından (domain eşleştirme) tenant çözümlemesi yapar.

## Varsayılan Kullanıcılar (Seed)

| Email | Şifre | Rol |
|-------|-------|-----|
| admin@habersite.com | admin123 | ADMIN |
| editor@habersite.com | admin123 | EDITOR |
