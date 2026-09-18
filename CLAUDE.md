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

- **Palet kamyondan gelir** (kullanıcı kararı: siyah/koyu zemin yok, sarı-siyah şantiye yok, grafit yok): Iveco mavisi `#1D3F9F` (vurgu, başlık vurgusu, kicker), tabela sarısı `#F4C430` (yalnızca butonlar; hover `#FFD75A`), zemin Çeşme gökyüzü `#E3EEF8`/`#C9DCEE` ve kum `#F7F2E8`, sayfa zemini `#F5F8FC`, kartlar beyaz, çizgi `#D7DFE9`. Metin lacivert-kömür `#172033` (siyah değil), ikincil `#45506A`, üçüncül `#5E6981`. Yol şeridi `#5E6981`. WhatsApp yeşili `#25D366`, koyu yeşil metin `#117A40`.
- Görseller **gerçek**: firmanın kendi fotoğrafları (`src/assets/isler/`), hero'da firmanın mavi Iveco çekicisi arka planı kaldırılmış (`src/assets/truck/`, `scripts/truck-layers.py`). Çizim/ikon vinç yok.
- Ton: Çeşme/Alaçatı yazlık; ferah, güneşli, sakin. Sıradışılık hero'da (yol hikâyesi), sadelik geri kalanda.
- Mobil-first; masaüstü ikincil. Alt sabit CTA çubuğu: **[Ara] [WhatsApp]** — sarı / yeşil, koyu metin, 56px, safe-area.
- Dokunma hedefleri ≥ 44px. Kontrast AA: açık zeminde sarı metin KULLANMA; vurgu metni `text-sea`.
- Sosyal bağlantılar `company.json > social`'dan; boş alan gösterilmez.

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

1. **Hero — "Yol"** (aşağıda ayrı bölüm)
2. Hizmetler (4 kart, her biri hizmet sayfasına gider) — "Ne taşırız, ne kaldırırız"
3. Çalışma bölgesi — stilize yarımada SVG haritası; ilçeler scroll'da sırayla yanar
4. Neden biz — 3–4 somut madde; doğrulanmamış iddia yazma, `TODO` bırak
5. Yolda çektiklerimiz — `src/assets/isler/` otomatik galeri (firma fotoğrafları)
6. SSS (FAQPage schema)
7. İletişim — tıkla-ara, WhatsApp, kısa form

## Hero animasyonu spesifikasyonu — "Yol"

Konsept: Kurtuluş'un mavi Iveco'su ("Italiano Stallone") ekranın altında, yolun üstünde durur. Scroll ettikçe kamyon değil dünya hareket eder: durak şeridi sola akar, tekerlekler alınan mesafeye göre gerçekten döner, yol çizgisi kayar, kamyon hafif sallanır, bulutlar paralaks yapar. Her durak gerçek bir iş fotoğrafı + 2 satır hikâye (Marina → Şantiye → Tersane → Bağ → Villa). Kamyon her durakta "mola" verir (hold), sonra devam eder. Son durak: "Neredesiniz?" + Ara / Konum gönder.

Uygulama:
- `src/components/RoadHero.astro`: `#hero` `100svh` pinned. Katmanlar: gökyüzü gradyanı + güneş + bulutlar (`[data-cloud]`), durak şeridi `[data-track]` (flex, `--stop-w`, `--stop-gap`, `--track-pad` ile ilk durak merkezde), yol `[data-road]` + kayan çizgi `[data-road-line]` (repeating-gradient, periyot 96px), kamyon `[data-truck]` (kesilmiş PNG → WebP) + 5 tekerlek `[data-wheel]` (daire PNG, yüzde konumlu, `translate(-50%,-50%)`).
- `src/scripts/road.ts`: GSAP ScrollTrigger pin (`start: 'top top'`, mobil `+=480%`, masaüstü `+=420%`, `scrub: 0.8`). Timeline: her durak için `state.x → -(durak merkezi - ekran merkezi)` (`power2.inOut`, süre 1) + 0.45 mola. `apply()` tek yerden: track `x`, tekerlek `rotation = mesafe / (π·çap) · 360`, yol çizgisi `x = -(mesafe % 96)`, kamyon `y = sin(mesafe/11)·1.6`, bulutlar `x = -mesafe·k`. Girişte kamyon sağdan gelir (`xPercent 120 → 0`, 1.8s) ve tekerlekler döner (`state.entry`).
- Yalnızca `transform`; `will-change: transform` şerit, kamyon, tekerlek, yol çizgisinde.
- **JS yoksa / reduced motion**: hero pinlenmez; şerit `overflow-x: auto` + `scroll-snap` ile parmakla kaydırılır (`html:not(.js-motion)` kuralları `global.css`'te).
- **LCP**: kamyon görseli `index.astro` head'inden `imagesrcset` ile preload; durak fotoğrafları `loading="eager"` (pinned bölümde hepsi görünür olacak), 420/640/900 genişlik. CSS inline.
- Kamyon fotoğrafı değişirse: `python3 scripts/truck-layers.py foto.jpg` → `CROP`/`WHEELS` güncellenir, çıktı yüzdeleri `RoadHero.astro > WHEELS`'e yazılır.

## SEO gereksinimleri

- Her sayfada benzersiz `<title>` (≤ 60 karakter) ve `<meta name="description">` (≤ 155). Şablon: `{İlçe} Vinç Kiralama | Kurtuluş Vinç — 0532 466 38 74`.
- `src/components/Seo.astro`: canonical, Open Graph, Twitter card, `og:image` (1200×630, kamyon + başlık; `pnpm og`).
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
- Tek font dosyası ≤ 60 KB. Hero kamyon WebP (mobil) ≤ 120 KB.
- Her sayfa build sonrası `pnpm build && pnpm preview` ile test edilir; Lighthouse CI yapılandırması ekle (`lighthouserc.json`).

## Dosya yapısı

```
src/
  data/company.json        # isim, telefon, siteUrl, hizmetler, sosyal linkler
  data/districts.json      # slug, ad, benzersiz içerik, öne çıkan iş tipleri
  data/faq.json
  assets/truck/*.png        # arka plansız Kurtuluş kamyonu + 5 tekerlek dairesi
  assets/isler/*.webp       # firma iş fotoğrafları (hero durakları + galeri)
  components/RoadHero.astro
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
  scripts/road.ts          # GSAP yol timeline'ı, tekerlek/yol/bulut hesapları
  styles/global.css
```

## Çalışma kuralları

- Küçük, çalışır adımlarla ilerle: önce iskelet + veri + SEO, sonra hero animasyonu, sonra harita ve cila. Her adımda `pnpm build` yeşil olmalı.
- Commit mesajları Türkçe, kısa.
- Bilinmeyen firma bilgisi için uydurma; `TODO:` bırak ve sonunda tüm TODO'ları listele.
- Tasarım kararlarında bu dosyaya sadık kal; "daha güvenli/sade" diye kurumsal şablona kayma. Sıradışılık hero'da, sadelik geri kalanda.
