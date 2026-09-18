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
  assets/truck/*.png           # arka plansız Kurtuluş kamyonu + 5 tekerlek dairesi
  assets/isler/*.webp          # firma iş fotoğrafları: hero durakları + galeri (buraya atılan her görsel galeride listelenir)
  components/RoadHero.astro    # "Yol" hero'su: pinned, duraklar + kamyon + tekerlekler
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
  scripts/road.ts          # ScrollTrigger yol timeline'ı (track, tekerlek, yol çizgisi, bulut)
  styles/global.css        # Tailwind tema, font-face, utility'ler
public/
  fonts/inter-tight-var.woff2  # Inter Tight değişken, wght 400–800, Türkçe alt küme (26 KB)
  _headers / vercel.json / netlify.toml
  robots.txt, favicon.svg, logo.svg, og-default.png, site.webmanifest
scripts/og.mjs             # OG görseli üretici (kamyon + metin, sharp)
scripts/truck-layers.py    # kamyon fotoğrafından arka plansız araç + tekerlek daireleri (rembg)
```

## Tasarım dili

Palet kamyondan: Iveco mavisi (`#1D3F9F`) ve tabela sarısı (`#F4C430`, yalnızca butonlar); zemin Çeşme gökyüzü ve kum, kartlar beyaz, metin lacivert-kömür (siyah değil). Mobil birincil.

## Hero — "Yol"

- Kurtuluş'un mavi Iveco'su (arka planı kaldırılmış gerçek fotoğraf) yolun üstünde durur; scroll ile duraklar sola akar, tekerlekler mesafeye göre döner, yol çizgisi kayar, kamyon hafif sallanır.
- 5 durak = 5 gerçek iş fotoğrafı (marina, şantiye, tersane, bağ, villa) + son durak "Neredesiniz?" ile Ara / Konum gönder.
- JS yoksa veya `prefers-reduced-motion`: pin yok, duraklar parmakla kaydırılır (scroll-snap).
- **Kamyon fotoğrafını değiştirmek için:** yandan, düz arka planlı net bir fotoğraf; `pip install rembg onnxruntime pillow numpy`, `python3 scripts/truck-layers.py foto.jpg`; script'teki `CROP` ve `WHEELS` (tekerlek merkez/yarıçap) yeni fotoğrafa göre güncellenir, çıktıdaki yüzdeler `RoadHero.astro > WHEELS` listesine yazılır. Sonra `pnpm og`.

## İş fotoğrafları

`src/assets/isler/` içine `jpg/png/webp` atın; ana sayfadaki "Yolda çektiklerimiz" galerisi otomatik dolar. Hero durakları `RoadHero.astro` içindeki `stops` listesinden (dosya adıyla) seçilir. Dosya adı alt metin olur (`alacati-cati-montaji.jpg` → "alacati cati montaji"); Türkçe karakter kullanılabilir. Klasör boşken yer tutucu grid görünür.

## Sosyal bağlantılar

`src/data/company.json > social`: `instagram`, `facebook`, `facebookPage`, `googleMaps`. Dolu olanlar footer'da ve iletişim sayfasında görünür, JSON-LD `sameAs`'e girer. WhatsApp `company.whatsapp`.

## Deploy

- **Netlify**: `netlify.toml` + `public/_headers`; form `data-netlify="true"` ile çalışır.
- **Vercel**: `vercel.json` (cleanUrls + başlıklar). Form için Formspree endpoint'i gerekir (TODO).
- Çıktı `build.format: 'file'` → `/sss.html` gibi; `trailingSlash: 'never'` ile canonical `/sss`.

## Ölçümler (yerel, Lighthouse 12, mobil simülasyon)

| Sayfa | Perf | SEO | A11y | LCP | CLS |
|---|---|---|---|---|---|
| `/` | 97 | 100 | 100 | 2.6 s | 0 |
| `/alacati-vinc-kiralama` | 100 | 100 | 100 | 1.2 s | 0 |

JS: tek bundle 116 KB / **46 KB gzip** (GSAP core + ScrollTrigger + yol). Font 26 KB. Kamyon WebP mobilde 110 KB, ilk durak fotoğrafı ~35 KB, diğer duraklar lazy. CSS inline. LCP simülasyonda hedefin biraz üstünde (metin + font); gerçek cihazda daha iyi.

## TODO — firma tarafından doğrulanacaklar

Uydurma bilgi yazılmadı; aşağıdakiler koda `TODO:` olarak işaretli.

1. **Sokak adresi** — `company.json > address.streetAddress/postalCode`; footer, iletişim ve JSON-LD `PostalAddress`.
2. **Çalışma saatleri** — `company.json > openingHours`; JSON-LD `openingHoursSpecification` eklenecek, iletişim sayfasındaki "TODO: çalışma saatleri" metni.
3. **Hizmetler ve tonajlar** — `company.json > services[].capacityNote` ve `bullets` içindeki "TODO" satırları (makine parkı, tonaj, bom uzunluğu, sepet yüksekliği, hiyap kapasitesi, tekne kaldırma kapasitesi).
4. **Neden biz — 4. madde** — 7/24 hizmet, sigorta ve belge iddiaları teyit edilince `index.astro > why[3]`.
5. **İş fotoğrafları** — 5 firma fotoğrafı eklendi; yenileri `src/assets/isler/` klasörüne atılınca galeriye girer.
6. **Sosyal medya / Google Maps** — `company.json > social`; JSON-LD `sameAs`.
7. **E-posta** — `company.json > email` boş.
8. **Form** — Vercel'e deploy edilirse Formspree endpoint'i (`index.astro`, `iletisim.astro`).
9. **Alan adı** — `kurtulusvinc.com` varsayım; `company.json > siteUrl`.
10. **Referans / yorum** — sitede yok; gerçek müşteri yorumu gelince eklenecek bölüm.
11. **Hero kamyonu** — firmanın zeytin ağaçlı Iveco fotoğrafından kesildi; daha temiz/yüksek çözünürlüklü bir yandan fotoğraf gelirse `truck-layers.py` ile yenilenir.
12. **Instagram** — hesap URL'si `company.json > social.instagram`; Facebook grubu arama sonucundan eklendi, doğrulanmalı.
