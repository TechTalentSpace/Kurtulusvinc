# Kurtuluş Vinç — kurtulusvinc.com

Çeşme/Alaçatı merkezli vinç firmasının statik tanıtım sitesi. YEAP Event sitesinin (DarkStar) şablonu üzerine kurulmuştur; hero bölümünde firmanın kendi vinç videosu sessiz ve döngüsel oynar. Tüm kararlar `CLAUDE.md` içinde.

## Çalıştırma

Build adımı yok, saf HTML/CSS/JS.

```bash
python3 -m http.server 4325     # http://127.0.0.1:4325/
```

Deploy: Vercel (`vercel.json`, `cleanUrls: true`). Depoyu bağlamak yeterli.

## Yapı

```
index.html                       Ana sayfa: hero video, hizmetler, galeri, bölgeler, iletişim
hizmet-*.html                    4 hizmet sayfası
*-vinc-kiralama.html             8 ilçe sayfası (benzersiz içerik)
sss.html / iletisim.html / 404.html
sitemap.xml / robots.txt
assets/
  css/theme.css                  Şablon CSS'i (düzenlenmez)
  css/theme-colors.css           Şablon renkleri
  css/site.css                   Siteye özel stiller (galeri, bölge kartları, logo, form)
  js/theme.js                    Şablon JS'i (düzenlenmez)
  js/site.js                     Hero video güvencesi + WhatsApp formu
  vendor/                        jQuery, Bootstrap, GSAP, Slick, Parallax, offcanvas-nav, Icomoon
  images/                        Firma fotoğrafları + şablon arka planları + logo
  video/vinc-video.mp4           Hero videosu (1280×720, ~20 sn, 12 MB)
api/                             YEAP'ten gelen form fonksiyonları — bu sitede kullanılmıyor
```

## Hero videosunu değiştirmek

Yeni videoyu `assets/video/vinc-video.mp4` olarak kopyalayın. Poster görselini de değiştirmek isterseniz `assets/images/hero-poster.webp` dosyasını güncelleyin. Başka düzenleme gerekmez.

## İş fotoğrafları

`assets/images/` içindeki `*.webp` dosyaları firmanın kendi fotoğraflarıdır. Ana sayfadaki galeri ve sayfa başlıkları bu dosyalardan beslenir; yeni fotoğraf eklerken ilgili `<figure>` bloğunu kopyalayın.

## İletişim formu

Backend yok. Form gönderildiğinde `assets/js/site.js` metni WhatsApp mesajına çevirip `wa.me/905324663874` bağlantısını açar.

## TODO — firma tarafından doğrulanacaklar

1. **Sokak adresi** — şu an yalnızca "Çeşme / Alaçatı, İzmir" yazıyor (`iletisim.html`, footer, JSON-LD).
2. **Çalışma saatleri** — `iletisim.html` içinde TODO yorumu.
3. **Tonaj ve kapasite** — hizmet sayfalarındaki TODO yorumları (makine parkı, bom uzunluğu, sepet yüksekliği, hiyap ve tekne kaldırma kapasitesi).
4. **Instagram hesabı** — henüz eklenmedi; Facebook grubu bağlantısı doğrulanmalı.
5. **E-posta adresi** — sitede yok.
6. **Alan adı** — `kurtulusvinc.com` varsayım.
7. **Yeni fotoğraf ve video** — sahadan gelen her yeni görsel galeriye eklenebilir.
8. **Şablon lisansı** — DarkStar ticari bir temadır; bu ikinci site için lisans durumu firma tarafından kontrol edilmeli.
