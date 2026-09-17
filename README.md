# Kurtuluş Vinç — kurtulusvinc.com

Çeşme/Alaçatı merkezli vinç firması için mobil öncelikli, scroll-animasyonlu, yerel SEO odaklı tanıtım sitesi. Tüm kararlar `CLAUDE.md` içinde.

## Çalıştırma

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # dist/ üretir
pnpm preview    # build çıktısını sunar
pnpm check      # Astro + TypeScript kontrolü
pnpm og         # public/og-default.png ve apple-touch-icon.png üretir
pnpm lhci       # Lighthouse CI (lighthouserc.json), önce pnpm build
```

Node 22, pnpm 10. Stack: Astro 5 (statik), Tailwind 4, GSAP 3 + ScrollTrigger (yalnızca hero), TypeScript.

## Yapı

```
src/
  data/company.json        # isim, telefon, siteUrl, hizmetler, adres (placeholder)
  data/districts.json      # 8 ilçe: slug, başlık, açıklama, benzersiz içerik, iş tipleri
  data/faq.json            # SSS (FAQPage şeması buradan üretilir)
  assets/crane/*.png           # arka plansız gerçek vinç katmanları (aynı tuval)
  assets/isler/                # iş fotoğrafları: buraya atılan her görsel galeride listelenir
  components/CraneHero.astro   # pinned katmanlı hero + GSAP yükleyici
  components/RegionMap.astro   # stilize yarımada haritası, ilçeler scroll'da yanar
  components/StickyCta.astro   # alt sabit [Ara] [WhatsApp] çubuğu
  components/Seo.astro         # title/description/canonical/OG/Twitter
  components/JsonLd.astro      # sayfa tipine göre JSON-LD
  layouts/Base.astro
  pages/index.astro
  pages/hizmetler/[slug].astro
  pages/[ilce]-vinc-kiralama.astro
  pages/iletisim.astro
  pages/sss.astro
  pages/404.astro
  scripts/hero.ts          # ScrollTrigger timeline, reduced-motion dalı
  scripts/hero-assets.ts   # hero katman görsel ayarları (genişlik/kalite/sizes)
  styles/global.css        # Tailwind tema, font-face, utility'ler
public/
  fonts/inter-tight-var.woff2  # Inter Tight değişken, wght 400–800, Türkçe alt küme (26 KB)
  _headers / vercel.json / netlify.toml
  robots.txt, favicon.svg, logo.svg, og-default.png, site.webmanifest
scripts/og.mjs             # OG görseli üretici (vinç kompoziti + metin, sharp)
scripts/crane-layers.py    # fotoğraftan arka plansız katmanlar (rembg), eklem kesimi, renk
```

## Tasarım dili

Açık ve yumuşak: fildişi zemin (`#FBF8F1`), kum bantlar, beyaz kartlar, sıcak kömür metin (`#2C2820`, siyah değil), bal sarısı vurgu (`#E3A92F`) ve açık zeminde okunur koyu bal (`#8F620C`) vurgu metni. Mobil birincil.

## Hero

- Arka plansız gerçek vinç (Pexels #29502190, atıf gerekmez), dört şeffaf katman: şasi+taban bom, 2. bölüm, 3. bölüm+baş, kanca.
- Scroll'da bölümler bom ekseninde sırayla uzar, kanca iner ve "Hemen Ara" CTA'sını kaldırır. Yalnızca transform/opacity.
- `prefers-reduced-motion` → bom açık, statik.
- **Kendi vincinizle değiştirmek için:** bom açık, yandan/çapraz, düz arka planlı net bir fotoğraf; `pip install rembg onnxruntime pillow numpy`, sonra `python3 scripts/crane-layers.py foto.jpg`. Script'teki eksen noktaları (`P1`, `P2`), eklem y'leri ve kanca kutusu yeni fotoğrafa göre güncellenir; çıktıdaki yüzdeler `hero.ts` (`R2`, `R3`) ve `global.css` (`.js-motion` kapalı hal) içine yazılır. Sonra `pnpm og`.

## İş fotoğrafları

`src/assets/isler/` içine `jpg/png/webp` atın; ana sayfadaki "Sahadan" galerisi otomatik dolar. Dosya adı alt metin olur (`alacati-cati-montaji.jpg` → "alacati cati montaji"); Türkçe karakter kullanılabilir. Klasör boşken yer tutucu grid görünür.

## Sosyal bağlantılar

`src/data/company.json > social`: `instagram`, `facebook`, `facebookPage`, `googleMaps`. Dolu olanlar footer'da ve iletişim sayfasında görünür, JSON-LD `sameAs`'e girer. WhatsApp `company.whatsapp`.

## Deploy

- **Netlify**: `netlify.toml` + `public/_headers`; form `data-netlify="true"` ile çalışır.
- **Vercel**: `vercel.json` (cleanUrls + başlıklar). Form için Formspree endpoint'i gerekir (TODO).
- Çıktı `build.format: 'file'` → `/sss.html` gibi; `trailingSlash: 'never'` ile canonical `/sss`.

## Ölçümler (yerel, Lighthouse 12, mobil simülasyon)

| Sayfa | Perf | SEO | A11y | LCP | CLS |
|---|---|---|---|---|---|
| `/` | 99 | 100 | 100 | 2.3 s | 0 |
| `/alacati-vinc-kiralama` | 100 | 100 | 100 | 1.2 s | 0 |

JS: tek bundle 116 KB / **46 KB gzip** (GSAP core + ScrollTrigger + hero). Font 26 KB. Hero katmanları WebP, mobilde toplam ~115 KB (carrier 69 KB LCP). CSS inline.

## TODO — firma tarafından doğrulanacaklar

Uydurma bilgi yazılmadı; aşağıdakiler koda `TODO:` olarak işaretli.

1. **Sokak adresi** — `company.json > address.streetAddress/postalCode`; footer, iletişim ve JSON-LD `PostalAddress`.
2. **Çalışma saatleri** — `company.json > openingHours`; JSON-LD `openingHoursSpecification` eklenecek, iletişim sayfasındaki "TODO: çalışma saatleri" metni.
3. **Hizmetler ve tonajlar** — `company.json > services[].capacityNote` ve `bullets` içindeki "TODO" satırları (makine parkı, tonaj, bom uzunluğu, sepet yüksekliği, hiyap kapasitesi, tekne kaldırma kapasitesi).
4. **Neden biz — 4. madde** — 7/24 hizmet, sigorta ve belge iddiaları teyit edilince `index.astro > why[3]`.
5. **İş fotoğrafları** — `src/assets/isler/` klasörüne atılınca otomatik galeri. Facebook/Instagram giriş duvarı nedeniyle oradan çekilemedi.
6. **Sosyal medya / Google Maps** — `company.json > social`; JSON-LD `sameAs`.
7. **E-posta** — `company.json > email` boş.
8. **Form** — Vercel'e deploy edilirse Formspree endpoint'i (`index.astro`, `iletisim.astro`).
9. **Alan adı** — `kurtulusvinc.com` varsayım; `company.json > siteUrl`.
10. **Referans / yorum** — sitede yok; gerçek müşteri yorumu gelince eklenecek bölüm.
11. **Hero vinci** — şu an Pexels stok fotoğrafı (ACE 16XW, altın tona kaydırıldı). Firmanın kendi vinciyle değiştirilecek (yöntem yukarıda).
12. **Instagram** — hesap URL'si `company.json > social.instagram`; Facebook grubu arama sonucundan eklendi, doğrulanmalı.
