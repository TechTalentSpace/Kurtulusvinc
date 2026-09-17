// OG görseli (1200×630) ve apple-touch-icon üretir: pnpm og
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
const photo = await sharp('src/assets/hero-crane.jpg').resize(1200, 630, { fit: 'cover', position: 'attention' }).toBuffer();
const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c0e11" stop-opacity=".55"/><stop offset=".45" stop-color="#0c0e11" stop-opacity=".25"/><stop offset="1" stop-color="#0c0e11" stop-opacity=".95"/></linearGradient></defs>
<rect width="1200" height="630" fill="url(#g)"/>
<rect x="72" y="72" width="56" height="56" rx="14" fill="#c9a961"/>
<path d="M84 114h32M88 114v-19l21-10.5M109 84.5V114M109 84.5l7 5.3" stroke="#0c0e11" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
<text x="72" y="470" font-family="Inter Tight, Inter, Arial, sans-serif" font-size="30" font-weight="600" fill="#c9a961" letter-spacing="6">ÇEŞME · ALAÇATI · YARIMADA</text>
<text x="72" y="540" font-family="Inter Tight, Inter, Arial, sans-serif" font-size="64" font-weight="600" fill="#ffffff">Kurtuluş Vinç</text>
<text x="640" y="540" font-family="Inter Tight, Inter, Arial, sans-serif" font-size="44" font-weight="600" fill="#e8e4dc">0532 466 38 74</text>
</svg>`;
await sharp(photo).composite([{ input: Buffer.from(overlay) }]).png({ compressionLevel: 9 }).toFile('public/og-default.png');
const icon = readFileSync('public/favicon.svg');
await sharp(icon, { density: 400 }).resize(180, 180).png().toFile('public/apple-touch-icon.png');
console.log('ok');
