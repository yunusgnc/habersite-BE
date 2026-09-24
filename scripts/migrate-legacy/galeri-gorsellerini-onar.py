"""
Galeri görsellerini arşivdeki boyut alt klasöründen kurtarır (tek seferlik).

Sorun: aktarımda galeri öğeleri `resimler/galeriresim/<ad>` altında aranıyordu.
Eski site küçültülmüş sürümleri `resimler/galeriresim/750/<ad>` altında
tutuyor ve 738 öğenin 470'inin YALNIZCA bu alt klasörde karşılığı var.
Sayısal adlarda başka klasöre bakılmadığı için (yazar fotoğrafını habere kapak
yapmamak adına doğru bir kural) bu dosyalar çözülemiyor, 22 galeri boş
kalıyordu. Dosyalar R2'ye zaten yüklenmişti; eksik olan yalnızca DB kaydı.

Kalıcı düzeltme `media-url-kudus.ts` içinde (boyutAltKlasorleri). Bu betik
o düzeltmeden ÖNCE aktarılmış kiracıyı onarmak için.

Üretilen SQL yalnızca INSERT içerir ve `WHERE NOT EXISTS` ile mevcut kayıtları
çiftlemez; elle girilmiş açıklamalar korunur.

Kullanım:
  1) DB galerilerini dışa aktar (id|slug|görsel_sayısı satırları):
     psql -tAF"|" -c "SELECT g.id, g.slug, ... " > /tmp/db_galeriler.txt
  2) python3 galeri-gorsellerini-onar.py    → /tmp/galeri_onar.sql
  3) psql -v ON_ERROR_STOP=1 -f /tmp/galeri_onar.sql
"""
import re, os, sys, secrets, string

DUMP = "/Users/yunusbeto/Downloads/kayserianahaber_db-18.09.2026.sql"
KOK = "/Users/yunusbeto/Downloads/kayserianahaber.com-gorseller-18.09.2026/resimler/galeriresim"
TID = "cmuefnzzm00000tmqkolq23tu"
CDN = "https://kayserianahaber-cdn.makasda.com"
ONEK = f"{CDN}/uploads/{TID}/legacy/resimler/galeriresim"

kok_dosya = {f for f in os.listdir(KOK) if os.path.isfile(os.path.join(KOK, f))}
alt_dosya = set(os.listdir(os.path.join(KOK, "750")))

def blok(tablo):
    acik, buf = False, []
    with open(DUMP, encoding="utf-8", errors="replace") as f:
        for line in f:
            if line.startswith(f"INSERT INTO `{tablo}`"): acik = True
            if acik:
                buf.append(line)
                if line.rstrip().endswith(";"): acik = False
    return "".join(buf)

# dump galerileri: slug -> eski id
gseg = blok("galleries")
slug2id = {}
for m in re.finditer(r"\((\d+),(?:\d+|NULL),'((?:[^'\\]|\\.)*)','((?:[^'\\]|\\.)*)','((?:[^'\\]|\\.)*)'", gseg):
    slug2id[m.group(4)] = int(m.group(1))

# gallery_items: (id, gallery_id, 'image', 'description', sort_order, ...)
iseg = blok("gallery_items")
ogeler = {}
for m in re.finditer(r"\((\d+),(\d+|NULL),(NULL|'(?:[^'\\]|\\.)*'),(NULL|'(?:[^'\\]|\\.)*'),(-?\d+)", iseg):
    gid = m.group(2)
    if gid == "NULL": continue
    img_raw, desc_raw, sort = m.group(3), m.group(4), int(m.group(5))
    if img_raw == "NULL": continue
    img = img_raw[1:-1]
    desc = None if desc_raw == "NULL" else desc_raw[1:-1]
    if not img: continue
    ogeler.setdefault(int(gid), []).append((img, desc, sort))

def coz(img):
    """Orijinal öncelikli; yoksa 750px sürüm. Aynı görselin iki boyutu."""
    if img in kok_dosya: return f"{ONEK}/{img}"
    if img in alt_dosya: return f"{ONEK}/750/{img}"
    return None

def cuid():
    abc = string.ascii_lowercase + string.digits
    return "c" + "".join(secrets.choice(abc) for _ in range(24))

def kacir(s):
    return s.replace("\\", "\\\\").replace("'", "''") if s else None

satirlar = [l.strip() for l in open("/tmp/db_galeriler.txt", encoding="utf-8") if l.strip()]
sql = []
ekle_top = 0
eslesmeyen = []
for s in satirlar:
    db_id, slug, mevcut = s.split("|")
    eski = slug2id.get(slug)
    if eski is None:
        eslesmeyen.append(slug); continue
    istenen = []
    for img, desc, sort in sorted(ogeler.get(eski, []), key=lambda x: x[2]):
        u = coz(img)
        if u: istenen.append((u, desc, sort))
    if not istenen: continue
    for i, (u, desc, sort) in enumerate(istenen):
        cap = kacir(desc)
        capv = f"'{cap}'" if cap else "NULL"
        sql.append(
            f"INSERT INTO gallery_images (id, gallery_id, url, caption, sort_order) "
            f"SELECT '{cuid()}', '{db_id}', '{u}', {capv}, {i} "
            f"WHERE NOT EXISTS (SELECT 1 FROM gallery_images WHERE gallery_id='{db_id}' AND url='{u}');"
        )
        ekle_top += 1

print(f"eşleşmeyen galeri: {len(eslesmeyen)} {eslesmeyen[:5]}", file=sys.stderr)
print(f"üretilen INSERT  : {ekle_top}", file=sys.stderr)
open("/tmp/galeri_onar.sql", "w", encoding="utf-8").write("BEGIN;\n" + "\n".join(sql) + "\nCOMMIT;\n")
