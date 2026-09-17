// OG görseli (1200×630) ve apple-touch-icon üretir: pnpm og
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
// Bom açık kompozit: katmanlar zaten açık konumda; carrier en üstte olmalı (sharp resize'ı composite'tan önce uygular, o yüzden iki adım)
const full = await sharp('src/assets/crane/hook.png')
  .composite([{ input: 'src/assets/crane/boom3.png' }, { input: 'src/assets/crane/boom2.png' }, { input: 'src/assets/crane/carrier.png' }])
  .png().toBuffer();
const craneOpen = await sharp(full).resize({ height: 600 }).png().toBuffer();
const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
<defs><pattern id="g" width="56" height="56" patternUnits="userSpaceOnUse"><path d="M56 0H0v56" fill="none" stroke="#1b1f26" stroke-width="1"/></pattern>
<radialGradient id="glow" cx="72%" cy="55%" r="45%"><stop offset="0" stop-color="#c9a961" stop-opacity=".18"/><stop offset="1" stop-color="#c9a961" stop-opacity="0"/></radialGradient></defs>
<rect width="1200" height="630" fill="#0c0e11"/><rect width="1200" height="630" fill="url(#g)"/><rect width="1200" height="630" fill="url(#glow)"/>
<rect x="72" y="72" width="56" height="56" rx="14" fill="#c9a961"/>
<path d="M84 114h32M88 114v-19l21-10.5M109 84.5V114M109 84.5l7 5.3" stroke="#0c0e11" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
<text x="72" y="300" font-family="Inter Tight, Inter, Arial, sans-serif" font-size="26" font-weight="600" fill="#c9a961" letter-spacing="6">ÇEŞME · ALAÇATI</text>
<text x="72" y="380" font-family="Inter Tight, Inter, Arial, sans-serif" font-size="72" font-weight="600" fill="#ffffff">Vinç lazım.</text>
<text x="72" y="460" font-family="Inter Tight, Inter, Arial, sans-serif" font-size="72" font-weight="600" fill="#c9a961">Biz yoldayız.</text>
<text x="72" y="540" font-family="Inter Tight, Inter, Arial, sans-serif" font-size="40" font-weight="600" fill="#e8e4dc">0532 466 38 74</text>
</svg>`;
await sharp(Buffer.from(overlay)).composite([{ input: craneOpen, left: 820, top: 20 }]).png({ compressionLevel: 9 }).toFile('public/og-default.png');
const icon = readFileSync('public/favicon.svg');
await sharp(icon, { density: 400 }).resize(180, 180).png().toFile('public/apple-touch-icon.png');
console.log('ok');
