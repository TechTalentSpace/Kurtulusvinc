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

- Koyu zemin (`#0B0F14` civarı), vurgu rengi vinç sarısı (`#F5B301`), ikincil turuncu-kırmızı uyarı tonu. Endüstriyel ama premium: geniş boşluk, büyük tipografi, ince grid çizgileri, "şantiye şeridi" (sarı-siyah diyagonal) mikro detaylar.
- Mobil-first: önce 390px, sonra 768, 1280. Masaüstü mobilin büyütülmüşü değil; mobil tasarım birincil.
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

Konsept: Ekranda sabitlenmiş (pinned) bir mobil vinç silüeti. Kullanıcı scroll ettikçe teleskopik bom 4 kademe uzar; her kademe açıldığında yanında bir hizmet başlığı belirir. Bom tam açıldığında kanca aşağı iner ve "Hemen Ara" CTA'sını "kaldırır" (CTA yukarı kayarak ortaya gelir).

Uygulama:
- Vinç tamamen **inline SVG** (`src/components/CraneHero.astro`): şasi, kabin, dayama ayakları, taban bom + 4 teleskopik segment (`<g id="boom-1..4">`), kanca (`<g id="hook">`). Her segment bir `<g>`; uzama `translate` ile (path morph yok).
- GSAP: `ScrollTrigger.create({ trigger: '#hero', start: 'top top', end: '+=300%', pin: true, scrub: 0.6 })`. Bir timeline üzerinde segmentler sırayla `x` ekseninde (bom yatay ~35° eğik) uzar; her segmentin sonunda ilgili hizmet etiketi `opacity/y` ile gelir.
- Sadece `transform` ve `opacity` anime et. `will-change: transform` segmentlerde.
- Kanca: son %15'lik scroll'da `y` ile iner, CTA butonu `y: 40 → 0`.
- **Reduced motion**: `matchMedia('(prefers-reduced-motion: reduce)')` true ise ScrollTrigger kurma; bom açık halde statik göster, hizmet etiketleri normal akışta.
- **LCP koruma**: Hero'nun ilk boyalı hali SVG + başlık; SVG inline olduğu için ekstra istek yok. GSAP `client:idle` ile yüklenir, o ana kadar bom kapalı halde görünür (JS gelmeden de anlamlı).
- Mobilde pin süresi `+=220%`, masaüstünde `+=300%`. Pinned bölüm yüksekliği `100svh` (`100vh` değil).
- Scroll ipucu: hero altında ince "aşağı kaydır" animasyonu, ilk scroll'dan sonra kaybolur.

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
  components/CraneHero.astro
  components/CraneSvg.astro
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
