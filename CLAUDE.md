# Kurtuluş Vinç — Web Sitesi Projesi

Çeşme/Alaçatı merkezli vinç firması için mobil öncelikli, scroll-animasyonlu, yerel SEO odaklı tanıtım sitesi. Hedef: telefondan giren kişi ilk 3 saniyede "vay" desin, 10 saniye içinde arayabilsin. Bu dosya tüm kararların tek kaynağıdır; sapma gerekiyorsa önce sor.

## Firma bilgileri (doğrulanmış / doğrulanmamış)

- İsim: **Kurtuluş Vinç** (site başlığında "Kurtuluş Vinç Çeşme Alaçatı")
- Telefon: **0532 466 38 74** → `tel:+905324663874`, WhatsApp: `https://wa.me/905324663874`
- Adres: **DOĞRULANMADI** — `src/data/company.json` içinde `address` alanını placeholder bırak, sayfada adres yerine "Çeşme / Alaçatı, İzmir" yaz.
- Hizmetler ve tonajlar: **DOĞRULANMADI** — aşağıdaki varsayılan listeyi kullan, her biri `company.json`'dan gelsin ki tek yerden düzeltilsin:
  1. Mobil Vinç Kiralama
  2. Sepetli Vinç / Personel Platformu
  3. Hiyap (Kamyon Üstü Vinç) ile Nakliye
  4. İnşaat & Tekne Vinç Hizmeti (yat kızaklama, çatı, prefabrik, konteyner)
- Çalışma bölgesi: Çeşme, Alaçatı, Ilıca, Dalyan, Urla, Gülbahçe, Karaburun, Mordoğan, Seferihisar, Güzelbahçe, İzmir.

Uydurma referans, uydurma tonaj, uydurma yorum YAZMA. Bilinmeyen alanlara `TODO:` yorumu bırak.

## Teknik stack

- **Astro 5** (statik çıktı), **Tailwind 4**, **GSAP 3 + ScrollTrigger** (sadece hero ve birkaç reveal için, `client:visible` island).
- TypeScript. Paket yöneticisi: pnpm.
- Görseller: `astro:assets` ile WebP/AVIF, `loading="lazy"` (hero hariç).
- Deploy hedefi: Vercel veya Netlify. Alan adı: `kurtulusvinc.com` (varsayım; `company.json`'daki `siteUrl`'den oku).
- Dil: Türkçe. `<html lang="tr">`.
- Font: Tek bir değişken font (ör. Inter Tight veya Space Grotesk, self-hosted, `font-display: swap`). Google Fonts CDN kullanma.

Kullanma: React, Three.js/R3F, Lottie, Framer Motion, jQuery, herhangi bir UI kit. Sebep: mobil performans bütçesi.

## Tasarım dili

- **Elit, sakin palet** (sarı-siyah şantiye görünümü istenmiyor): grafit zemin `#0C0E11` / `#13161B`, sıcak fildişi metin `#E8E4DC`, ikincil gri `#9AA0A8`, tek vurgu **pirinç** `#C9A961` (hover `#E0C27C`), kısık uyarı `#C7573A`. Şantiye şeridi yok; onun yerine ince pirinç hairline. Başlıklar `font-semibold`, sıkı tracking; ağır extrabold kullanma.
- Vinç görseli **gerçek fotoğraf** olmalı, çizim/ikon değil. Şu an `src/assets/hero-crane.jpg` (Flickr, Rab., CC BY 2.0; kırpılıp renk düzenlendi, footer'da atıf var). Firmanın kendi vinç fotoğrafı gelince aynı dosya adıyla değiştir, `scripts/hero-photo.mjs` ile aynı grade'i uygula, atıf satırını kaldır.
- Mobil-first: önce 390px, sonra 768, 1280. **Masaüstü ikincil**; kullanıcı çoğunlukla yolda, telefondan, acil durumda giriyor. Mobil görünüm elit ve hızlı olmalı; masaüstü onun düzgün genişletilmiş hali.
- Her ekranda alt sabit CTA çubuğu: **[Ara] [WhatsApp]** — 56px yükseklik, `env(safe-area-inset-bottom)` dikkate al.
- Dokunma hedefleri ≥ 44px. Metin kontrastı WCAG AA.

## Sayfa yapısı

```
/                              Ana sayfa (hero animasyonu burada)
/hizmetler/[slug]              4 hizmet sayfası
/[ilce]-vinc-kiralama          İlçe landing'leri: cesme, alacati, ilica, urla, gulbahce, karaburun, seferihisar, guzelbahce
/iletisim
/sss
```

İlçe sayfaları `src/data/districts.json`'dan dinamik route ile üretilir. Her ilçe için **benzersiz** 150–250 kelime içerik (o ilçeye özgü iş tipleri: Alaçatı taş ev çatıları, Çeşme marina tekne indirme, Urla bağ evi prefabrik vb.). Kopya şablon metin yazma; Google bunu cezalandırır.

## Ana sayfa akışı

1. **Hero — "Bom Uzuyor, Hizmet Açılıyor"** (aşağıda ayrı bölüm)
2. Hizmetler (4 kart, her biri hizmet sayfasına gider)
3. Çalışma bölgesi — Çeşme yarımadasının stilize SVG haritası; ilçeler scroll'da sırayla yanar, her biri ilçe sayfasına link
4. Neden biz — 3–4 somut madde (hızlı ulaşım, sigortalı operatör, 7/24) — doğrulanmamış iddia yazma, `TODO` bırak
5. İş fotoğrafları — placeholder grid, `TODO: gerçek fotoğraflar`
6. SSS (5–6 soru, FAQPage schema ile)
7. İletişim — tıkla-ara, WhatsApp, kısa form (Netlify Forms veya Formspree)

## Hero animasyonu spesifikasyonu

Konsept: Tam ekran **gerçek vinç fotoğrafı** (pinned). Scroll ettikçe vinç kameraya yaklaşır ve sola doğru geçer (kamera itişi), ton koyulaşır, başlık yukarı süzülür. Sonda hero sönerek hizmetlere bırakır. Mesaj acil-odaklı: "Vinç lazım. Biz yoldayız." + telefon CTA + "Konum gönder" (WhatsApp).

Uygulama:
- `src/components/CraneHero.astro`: `astro:assets` `<Picture>` (AVIF/WebP, 480/768/1024, `loading="eager"`, `fetchpriority="high"`), üstte iki gradient katmanı + `[data-hero-shade]` (scroll'da koyulaşır).
- `src/scripts/hero.ts`: GSAP `ScrollTrigger` pin (`start: 'top top'`, mobil `+=120%`, masaüstü `+=140%`, `scrub: 0.6`). Fotoğraf `scale 1.06 → 1.28`, `xPercent → -9` (mobil) / `-6` (masaüstü), metin `yPercent -18`, son %35'te metin `opacity .15`. Yükte kısa giriş: fotoğraf `scale 1.14 → 1`, metin satırları `y/opacity` stagger.
- Sadece `transform` ve `opacity`. `will-change: transform` fotoğraf katmanında.
- **Reduced motion**: ScrollTrigger ve giriş animasyonu kurulmaz; her şey statik.
- **LCP**: hero fotoğrafı LCP öğesidir; inline `<picture>` ile ilk HTML'de, preload gerekmez. GSAP `requestIdleCallback` ile yüklenir.
- Pinned bölüm `100svh`. Scroll ipucu ilk scroll'da kaybolur.
- Eski SVG bom animasyonu kaldırıldı (kullanıcı kararı: çizim değil gerçek vinç).

## SEO gereksinimleri

- Her sayfada benzersiz `<title>` (≤ 60 karakter) ve `<meta name="description">` (≤ 155). Şablon: `{İlçe} Vinç Kiralama | Kurtuluş Vinç — 0532 466 38 74`.
- `src/components/Seo.astro`: canonical, Open Graph, Twitter card, `og:image` (1200×630, vinç silüeti + logo).
- JSON-LD (`src/components/JsonLd.astro`):
  - Ana sayfa: `HomeAndConstructionBusiness` + `Organization` + `WebSite`; `telephone`, `areaServed` (ilçe listesi), `openingHoursSpecification` (`TODO`), `address` (`addressLocality: Çeşme`, `addressRegion: İzmir`, `addressCountry: TR`; sokak adresi doğrulanınca eklenecek).
  - Hizmet sayfaları: `Service` + `provider`.
  - İlçe sayfaları: `Service` + `areaServed` tek ilçe + `BreadcrumbList`.
  - SSS: `FAQPage`.
- `@astrojs/sitemap`, `robots.txt`, `_headers` ile cache ve güvenlik başlıkları.
- H1 her sayfada bir tane; ilçe sayfası H1: "{İlçe} Vinç Kiralama".
- Görsellerde açıklayıcı Türkçe `alt`.
- NAP (isim-adres-telefon) sitede, JSON-LD'de ve footer'da birebir aynı format.

## Performans bütçesi (mobil, Lighthouse)

- Performans ≥ 90, SEO 100, Erişilebilirlik ≥ 95.
- LCP ≤ 2,0 s (hedef), kesin sınır 2,5 s. CLS < 0,05. INP < 200 ms.
- Toplam JS ≤ 80 KB gzip (GSAP core + ScrollTrigger ≈ 35 KB dahil). Başka kütüphane eklemeden önce sor.
- Tek font dosyası ≤ 60 KB. Hero SVG ≤ 30 KB.
- Her sayfa build sonrası `pnpm build && pnpm preview` ile test edilir; Lighthouse CI yapılandırması ekle (`lighthouserc.json`).

## Dosya yapısı

```
src/
  data/company.json        # isim, telefon, siteUrl, hizmetler, sosyal linkler
  data/districts.json      # slug, ad, benzersiz içerik, öne çıkan iş tipleri
  data/faq.json
  assets/hero-crane.jpg     # gerçek vinç fotoğrafı (LCP)
  components/CraneHero.astro
  components/StickyCta.astro
  components/RegionMap.astro
  components/Seo.astro
  components/JsonLd.astro
  layouts/Base.astro
  pages/index.astro
  pages/hizmetler/[slug].astro
  pages/[ilce]-vinc-kiralama.astro
  pages/iletisim.astro
  pages/sss.astro
  scripts/hero.ts          # GSAP timeline, reduced-motion kontrolü
  styles/global.css
```

## Çalışma kuralları

- Küçük, çalışır adımlarla ilerle: önce iskelet + veri + SEO, sonra hero animasyonu, sonra harita ve cila. Her adımda `pnpm build` yeşil olmalı.
- Commit mesajları Türkçe, kısa.
- Bilinmeyen firma bilgisi için uydurma; `TODO:` bırak ve sonunda tüm TODO'ları listele.
- Tasarım kararlarında bu dosyaya sadık kal; "daha güvenli/sade" diye kurumsal şablona kayma. Sıradışılık hero'da, sadelik geri kalanda.
