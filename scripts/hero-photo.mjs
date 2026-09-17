// Hero fotoğrafını hazırlar: filigranı kırpar, koyu/elit renk düzeni uygular.
// Kullanım: node scripts/hero-photo.mjs <kaynak.jpg>
// Çıktı: src/assets/hero-crane.jpg (astro:assets bunu WebP/AVIF'e çevirir)
import sharp from 'sharp';
const src = process.argv[2];
if (!src) { console.error('kaynak dosya gerekli'); process.exit(1); }
const meta = await sharp(src).metadata();
const cropBottom = Math.round(meta.height * 0.06); // alt filigran şeridi
await sharp(src)
  .extract({ left: 0, top: 0, width: meta.width, height: meta.height - cropBottom })
  .modulate({ saturation: 0.55, brightness: 0.9 })
  .linear(1.1, -16) // kontrast
  .recomb([[1.04, 0.02, 0], [0, 1.0, 0], [0, 0.02, 0.92]]) // hafif sıcak, mavi kısık
  .sharpen({ sigma: 0.8 })
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile('src/assets/hero-crane.jpg');
console.log('src/assets/hero-crane.jpg', meta.width, meta.height - cropBottom);
