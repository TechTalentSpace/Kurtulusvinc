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

- **Açık, yumuşak, sarıyla uyumlu palet** (siyah ve koyu zemin YOK; grafit sürüm kullanıcı kararıyla kaldırıldı): fildişi zemin `#FBF8F1`, kum bantlar `#F4EEE1` / `#EBE3D0`, çizgi `#E3DBC8`, kartlar beyaz. Metin sıcak kömür `#2C2820` (siyah değil), ikincil `#5B5446`, üçüncül `#7D7464`. Vurgu **bal sarısı** `#E3A92F` (hover `#F0BE50`) yalnızca buton/çizgi/nokta olarak; açık zeminde **vurgu metni** için koyu bal `#8F620C` (kontrast ≥ 4.5). Uyarı `#D26A3E`, WhatsApp yeşili `#25D366`.
- Vinç görseli **gerçek fotoğraf**, çizim değil; **arka plansız** tek vinç. Şu an Pexels #29502190 (ACE 16XW, Pexels lisansı, atıf gerekmez); `scripts/crane-layers.py` ile arka planı kaldırılıp turuncu→altın kaydırıldı ve bom eklemlerinden katmanlara ayrıldı. Firmanın kendi vinç fotoğrafı gelince aynı script ile yeniden üretilir.
- İş fotoğrafları: `src/assets/isler/` klasörüne atılan her görsel ana sayfadaki galeride otomatik listelenir (dosya adı alt metin olur). Klasör boşken yer tutucu grid görünür.
- Mobil-first: önce 390px, sonra 768, 1280. **Masaüstü ikincil**; kullanıcı çoğunlukla yolda, telefondan, acil durumda giriyor.
- Her ekranda alt sabit CTA çubuğu: **[Ara] [WhatsApp]** — 56px, `env(safe-area-inset-bottom)`; Ara bal sarısı, WhatsApp yeşil, ikisinde de koyu metin.
- Dokunma hedefleri ≥ 44px. Metin kontrastı WCAG AA; açık zeminde `text-crane` (bal sarısı) metin olarak KULLANMA, `text-crane-deep` kullan.
- Sosyal bağlantılar `company.json > social`'dan gelir; boş alan gösterilmez. Footer, iletişim ve JSON-LD `sameAs` aynı kaynağı okur.

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

Konsept: Fildişi zemin üzerinde arka plansız **gerçek vinç**. Sayfa açıldığında bom kapalı; scroll ettikçe teleskopik bölümler gerçek eklem yerlerinden bom ekseninde uzar (2 kademe: 2. bölüm, sonra 3. bölüm + baş). Bom tam açıldığında kanca aşağı iner ve "Hemen Ara" CTA'sını kaldırır (`y: 40 → 0`). Başlık üstte durur, bom yaklaşmadan yukarı süzülüp söner.

Uygulama:
- Varlıklar: `src/assets/crane/{carrier,boom2,boom3,hook}.png` — aynı 1100×2080 tuval, şeffaf; `astro:assets` `<Image>` ile WebP (480/720/1000, kalite 72; ayarlar `src/scripts/hero-assets.ts`). `scripts/crane-layers.py` üretir (rembg + eksen boyunca dik kesim + renk).
- `src/components/CraneHero.astro`: dört katman `absolute inset-0 object-contain` üst üste (kanca en altta, carrier en üstte). Kablo: `[data-cable-wrap]` (kanca ile taşınır) içinde `[data-cable]` (scaleY). CTA tuvalin içinde, kancanın altında.
- `src/scripts/hero.ts`: GSAP ScrollTrigger pin (`start: 'top top'`, mobil `+=220%`, masaüstü `+=260%`, `scrub: 0.6`). Geri çekilme değerleri tuval yüzdesi (`R2`, `R3`, pozitif = tabana doğru). Zaman çizelgesi: 0–0.4 boom2, 0.38–0.76 boom3, 0.12–0.37 metin çekilir, 0.78–1.0 kanca iner + CTA.
- Kapalı başlangıç `global.css`'te `.js-motion` altında CSS transform ile (flaş yok); GSAP aynı değerleri `x:0,y:0` ile devralır. JS yoksa bom açık statik.
- Sadece `transform` ve `opacity`; `will-change: transform` katmanlarda.
- **Reduced motion**: ScrollTrigger kurulmaz; bom açık, CTA görünür.
- **LCP**: carrier katmanı `index.astro` head'inden `<link rel="preload" as="image" imagesrcset>` ile preload edilir; CSS inline (`inlineStylesheets: 'always'`). Pinned bölüm `100svh`. Scroll ipucu ilk scroll'da kaybolur.

## SEO gereksinimleri

- Her sayfada benzersiz `<title>` (≤ 60 karakter) ve `<meta name="description">` (≤ 155). Şablon: `{İlçe} Vinç Kiralama | Kurtuluş Vinç — 0532 466 38 74`.
- `src/components/Seo.astro`: canonical, Open Graph, Twitter card, `og:image` (1200×630, gerçek vinç kompoziti + başlık; `pnpm og`).
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
  assets/crane/*.png        # arka plansız gerçek vinç katmanları
  assets/isler/             # iş fotoğrafları (otomatik galeri)
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
