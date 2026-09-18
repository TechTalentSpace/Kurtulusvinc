// OG görseli (1200×630) ve apple-touch-icon üretir: pnpm og
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
const truck = await sharp('src/assets/truck/truck.png').resize({ width: 760 }).png().toBuffer();
const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9dcee"/><stop offset=".7" stop-color="#e3eef8"/><stop offset="1" stop-color="#f7f2e8"/></linearGradient>
<radialGradient id="sun" cx="82%" cy="18%" r="30%"><stop offset="0" stop-color="#f4c430" stop-opacity=".55"/><stop offset="1" stop-color="#f4c430" stop-opacity="0"/></radialGradient></defs>
<rect width="1200" height="630" fill="url(#sky)"/><rect width="1200" height="630" fill="url(#sun)"/>
<rect x="0" y="586" width="1200" height="44" fill="#5e6981"/><rect x="0" y="606" width="1200" height="3" fill="#f5f8fc" opacity=".7"/>
<rect x="72" y="72" width="56" height="56" rx="14" fill="#1d3f9f"/>
<path d="M84 114h32M88 114v-19l21-10.5M109 84.5V114M109 84.5l7 5.3" stroke="#f4c430" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
<text x="72" y="210" font-family="Inter Tight, Inter, Arial, sans-serif" font-size="24" font-weight="600" fill="#1d3f9f" letter-spacing="6">ÇEŞME · ALAÇATI · YARIMADA</text>
<text x="72" y="290" font-family="Inter Tight, Inter, Arial, sans-serif" font-size="66" font-weight="600" fill="#172033">Çeşme'nin yükünü</text>
<text x="72" y="362" font-family="Inter Tight, Inter, Arial, sans-serif" font-size="66" font-weight="600" fill="#1d3f9f">biz taşırız.</text>
<text x="72" y="430" font-family="Inter Tight, Inter, Arial, sans-serif" font-size="40" font-weight="600" fill="#172033">0532 466 38 74</text>
</svg>`;
await sharp(Buffer.from(overlay)).composite([{ input: truck, left: 420, top: 236 }]).png({ compressionLevel: 9 }).toFile('public/og-default.png');
const icon = readFileSync('public/favicon.svg');
await sharp(icon, { density: 400 }).resize(180, 180).png().toFile('public/apple-touch-icon.png');
console.log('ok');
