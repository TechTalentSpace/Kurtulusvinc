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
  components/CraneHero.astro   # pinned hero bölümü + GSAP yükleyici
  components/CraneSvg.astro    # inline vinç SVG (#boom-1..4 iç içe, #hook)
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
  styles/global.css        # Tailwind tema, font-face, utility'ler
public/
  fonts/inter-tight-var.woff2  # Inter Tight değişken, wght 400–800, Türkçe alt küme (26 KB)
  _headers / vercel.json / netlify.toml
  robots.txt, favicon.svg, logo.svg, og-default.png, site.webmanifest
scripts/og.mjs             # OG görseli üretici (sharp)
```

## Hero animasyonu

- `#hero` `100svh`, ScrollTrigger ile pinlenir (mobil `+=220%`, masaüstü `+=300%`, `scrub: 0.6`).
- Bom `#boom` grubu pivot etrafında -35° döndürülmüş; `#boom-1..4` iç içe `<g>` ve yalnızca `x` ile 130 birim uzar. Her segment sonunda ilgili hizmet etiketi `opacity/y` ile gelir.
- Son %15: kablo `scaleY`, `#hook-body` `y` ile iner, "Hemen Ara" CTA `y: 40 → 0`.
- `prefers-reduced-motion: reduce` → ScrollTrigger kurulmaz, bom açık ve kanca inmiş statik gösterilir.
- GSAP `requestIdleCallback` ile yüklenir; JS gelmeden bom kapalı, CTA ve etiketler görünür (progressive enhancement).

## Deploy

- **Netlify**: `netlify.toml` + `public/_headers`; form `data-netlify="true"` ile çalışır.
- **Vercel**: `vercel.json` (cleanUrls + başlıklar). Form için Formspree endpoint'i gerekir (TODO).
- Çıktı `build.format: 'file'` → `/sss.html` gibi; `trailingSlash: 'never'` ile canonical `/sss`.

## Ölçümler (yerel, Lighthouse 12, mobil simülasyon)

| Sayfa | Perf | SEO | A11y | LCP | CLS |
|---|---|---|---|---|---|
| `/` | 100 | 100 | 100 | 1.4 s | 0 |
| `/alacati-vinc-kiralama` | 100 | 100 | 100 | 1.2 s | 0 |

JS: tek bundle 116 KB / **46 KB gzip** (GSAP core + ScrollTrigger + hero). Font 26 KB. Hero SVG ~7 KB.

## TODO — firma tarafından doğrulanacaklar

Uydurma bilgi yazılmadı; aşağıdakiler koda `TODO:` olarak işaretli.

1. **Sokak adresi** — `company.json > address.streetAddress/postalCode`; footer, iletişim ve JSON-LD `PostalAddress`.
2. **Çalışma saatleri** — `company.json > openingHours`; JSON-LD `openingHoursSpecification` eklenecek, iletişim sayfasındaki "TODO: çalışma saatleri" metni.
3. **Hizmetler ve tonajlar** — `company.json > services[].capacityNote` ve `bullets` içindeki "TODO" satırları (makine parkı, tonaj, bom uzunluğu, sepet yüksekliği, hiyap kapasitesi, tekne kaldırma kapasitesi).
4. **Neden biz — 4. madde** — 7/24 hizmet, sigorta ve belge iddiaları teyit edilince `index.astro > why[3]`.
5. **İş fotoğrafları** — `index.astro` yer tutucu grid; gerçek fotoğraflar `src/assets/` altına, `astro:assets` ile.
6. **Sosyal medya / Google Maps** — `company.json > social`; JSON-LD `sameAs`.
7. **E-posta** — `company.json > email` boş.
8. **Form** — Vercel'e deploy edilirse Formspree endpoint'i (`index.astro`, `iletisim.astro`).
9. **Alan adı** — `kurtulusvinc.com` varsayım; `company.json > siteUrl`.
10. **Referans / yorum** — sitede yok; gerçek müşteri yorumu gelince eklenecek bölüm.
