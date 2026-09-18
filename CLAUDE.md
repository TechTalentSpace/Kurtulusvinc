# Kurtuluş Vinç — Web Sitesi Projesi

Çeşme/Alaçatı merkezli vinç firması için statik tanıtım sitesi. Site, firmanın kendi **YEAP Event** sitesinin (DarkStar tabanlı) şablonu ve yapısı üzerine kurulmuştur. Hero bölümünde firmanın kendi vinç videosu sessiz ve döngüsel olarak arka planda oynar. Bu dosya tüm kararların tek kaynağıdır; sapma gerekiyorsa önce sor.

## Firma bilgileri (doğrulanmış / doğrulanmamış)

- İsim: **Kurtuluş Vinç**
- Telefon: **0532 466 38 74** → `tel:+905324663874`, WhatsApp: `https://wa.me/905324663874`
- Adres: **DOĞRULANMADI** — sayfada adres yerine "Çeşme / Alaçatı, İzmir" yazılır, JSON-LD'de yalnızca `addressLocality: Çeşme`.
- Çalışma saatleri: **DOĞRULANMADI** (`iletisim.html` içinde `TODO` yorumu).
- Hizmetler ve tonajlar: tonaj/kapasite **DOĞRULANMADI**, ilgili satırlar HTML yorumu olarak `TODO` işaretlidir.
  1. Mobil Vinç Kiralama
  2. Sepetli Vinç / Personel Platformu
  3. Hiyap (Kamyon Üstü Vinç) ile Nakliye
  4. Tekne & İnşaat Vinç Hizmeti
- Çalışma bölgesi: Çeşme, Alaçatı, Ilıca, Dalyan, Urla, Gülbahçe, Karaburun, Mordoğan, Seferihisar, Güzelbahçe, İzmir.
- Sosyal: Facebook grubu `https://www.facebook.com/groups/227913824378539/`. Instagram: **TODO**.

Uydurma referans, uydurma tonaj, uydurma yorum, uydurma sayaç YAZMA. Bilinmeyen alanlara HTML yorumu olarak `TODO:` bırak.

## Teknik yapı

- **Statik HTML** (build adımı yok). Şablon: DarkStar teması, `yeapevent` reposundan alındı.
- Kütüphaneler `assets/vendor/` altında: jQuery, Bootstrap 5, GSAP + ScrollTrigger + ScrollSmoother, Slick, Parallax.js, hc-offcanvas-nav, Icomoon.
- Tema dosyaları: `assets/css/theme.css`, `assets/css/theme-colors.css`, `assets/js/theme.js`. **Bu dosyalar düzenlenmez**; site özel kuralları `assets/css/site.css` ve `assets/js/site.js` içine yazılır.
- Dil: Türkçe, tek dil. `<html lang="tr">`. Çok dilli anahtar (`data-lang-key`) kullanılmaz.
- Font: Google Fonts (Bebas Neue, Lato, Poppins, Syncopate) — şablonun kendi seçimi.
- Deploy: Vercel (`vercel.json`, `cleanUrls: true`). `api/` klasörü YEAP'ten gelen Supabase form fonksiyonlarıdır; bu sitede kullanılmıyor.

## Hero

- `index.html` içinde tek slaytlı carousel; arka planda `assets/video/vinc-video.mp4` (`autoplay muted loop playsinline`), poster `assets/images/hero-poster.webp`.
- Videoyu değiştirmek için: yeni dosyayı `assets/video/vinc-video.mp4` olarak kopyala, gerekiyorsa posteri güncelle. Başka hiçbir yeri değiştirmeye gerek yok.
- `assets/js/site.js` otomatik oynatmayı garantiler (sessize alır, ilk dokunuşta tekrar dener).

## Sayfa yapısı

```
index.html                       Ana sayfa (hero video, hizmetler, galeri, bölgeler, iletişim)
hizmet-mobil-vinc-kiralama.html  4 hizmet sayfası
hizmet-sepetli-vinc.html
hizmet-hiyap-nakliye.html
hizmet-tekne-insaat-vinc.html
<ilce>-vinc-kiralama.html        8 ilçe: cesme, alacati, ilica, urla, gulbahce, karaburun, seferihisar, guzelbahce
sss.html                         FAQPage
iletisim.html
404.html
sitemap.xml, robots.txt
```

Her ilçe sayfasında o ilçeye özgü **benzersiz** içerik vardır (Alaçatı taş ev çatıları, Çeşme marina tekne indirme, Urla bağ evi prefabrik vb.). Kopya şablon metin yazma.

## Tasarım dili

- Şablonun koyu (dark) teması korunur. Renk değişikliği gerekirse `assets/css/theme-colors.css` üzerinden yapılır.
- Görseller **gerçek**: firmanın kendi fotoğrafları (`assets/images/*.webp`) ve kendi vinç videosu. Çizim/ikon vinç yok.
- Mobil-first. Dokunma hedefleri ≥ 44px. Alt sabit CTA çubuğu **yok** (kullanıcı kararı).
- İletişim formu backend istemez: `assets/js/site.js` formu WhatsApp mesajına çevirir.

## SEO gereksinimleri

- Her sayfada benzersiz `<title>` (≤ 60 karakter) ve `description` (≤ 155). Şablon: `{İlçe} Vinç Kiralama | Kurtuluş Vinç — 0532 466 38 74`.
- Canonical, Open Graph, Twitter card her sayfada.
- JSON-LD: ana sayfa `HomeAndConstructionBusiness`; hizmet sayfaları `Service` + `provider`; ilçe sayfaları `Service` + `areaServed` + `BreadcrumbList`; SSS `FAQPage`.
- H1 her sayfada bir tane; ilçe sayfası H1: "{İlçe} Vinç Kiralama".
- Görsellerde açıklayıcı Türkçe `alt`. NAP (isim-adres-telefon) her yerde birebir aynı.
- Yeni sayfa eklenince `sitemap.xml` güncellenir.

## Çalışma kuralları

- Şablonun yapısını bozma; yeni bölüm eklerken mevcut `sk__` sınıflarını kullan.
- Commit mesajları Türkçe, kısa.
- Bilinmeyen firma bilgisi için uydurma; HTML yorumu olarak `TODO:` bırak ve sonunda tüm TODO'ları listele.
- Yerel önizleme: `python3 -m http.server 4325` ve `http://127.0.0.1:4325/`.
