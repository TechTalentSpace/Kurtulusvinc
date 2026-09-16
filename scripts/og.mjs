// OG görseli (1200×630) ve apple-touch-icon üretir: pnpm og
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs>
 <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0v48" fill="none" stroke="#182028" stroke-width="1"/></pattern>
 <pattern id="hz" width="24" height="24" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)"><rect width="12" height="24" fill="#f5b301"/><rect x="12" width="12" height="24" fill="#0b0f14"/></pattern>
 <linearGradient id="gy" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd34d"/><stop offset="1" stop-color="#e0a300"/></linearGradient>
</defs>
<rect width="1200" height="630" fill="#0b0f14"/>
<rect width="1200" height="630" fill="url(#grid)"/>
<rect x="0" y="618" width="1200" height="12" fill="url(#hz)"/>
<!-- vinç silüeti (sağ) -->
<g transform="translate(560 60) scale(0.62)">
 <line x1="0" y1="660" x2="1000" y2="660" stroke="#232c36" stroke-width="3"/>
 <rect x="18" y="580" width="110" height="18" fill="#c98f00"/><rect x="24" y="598" width="16" height="50" fill="#2a3441"/><rect x="8" y="646" width="48" height="12" rx="2" fill="#2a3441"/>
 <rect x="560" y="580" width="110" height="18" fill="#c98f00"/><rect x="648" y="598" width="16" height="50" fill="#2a3441"/><rect x="632" y="646" width="48" height="12" rx="2" fill="#2a3441"/>
 <line x1="372" y1="562" x2="345" y2="440" stroke="#2a3441" stroke-width="18" stroke-linecap="round"/>
 <rect x="70" y="556" width="540" height="56" rx="8" fill="#1a222c" stroke="#0b0f14" stroke-width="3"/>
 <rect x="70" y="600" width="540" height="12" fill="url(#hz)"/>
 <path d="M500 556v-72a12 12 0 0 1 12-12h70l30 34v50z" fill="url(#gy)" stroke="#0b0f14" stroke-width="3"/>
 <path d="M514 486h60l22 26v20h-82z" fill="#0b0f14"/>
 <rect x="112" y="486" width="86" height="72" rx="4" fill="#2a3441" stroke="#0b0f14" stroke-width="3"/>
 <rect x="150" y="470" width="190" height="90" rx="10" fill="url(#gy)" stroke="#0b0f14" stroke-width="3"/>
 <path d="M262 478h60a10 10 0 0 1 10 10v44h-70z" fill="#0b0f14"/>
 <g><circle cx="130" cy="620" r="40" fill="#0b0f14" stroke="#232c36" stroke-width="3"/><circle cx="130" cy="620" r="20" fill="#2a3441"/><circle cx="232" cy="620" r="40" fill="#0b0f14" stroke="#232c36" stroke-width="3"/><circle cx="232" cy="620" r="20" fill="#2a3441"/><circle cx="436" cy="620" r="40" fill="#0b0f14" stroke="#232c36" stroke-width="3"/><circle cx="436" cy="620" r="20" fill="#2a3441"/><circle cx="538" cy="620" r="40" fill="#0b0f14" stroke="#232c36" stroke-width="3"/><circle cx="538" cy="620" r="20" fill="#2a3441"/></g>
 <g transform="translate(230 520) rotate(-35)">
  <rect x="-44" y="-15" width="266" height="30" rx="5" fill="url(#gy)" stroke="#0b0f14" stroke-width="3"/>
  <rect x="148" y="-11.5" width="206" height="23" rx="4" fill="#f5b301" stroke="#0b0f14" stroke-width="2.5"/>
  <rect x="298" y="-9" width="188" height="18" rx="3.5" fill="#ffc627" stroke="#0b0f14" stroke-width="2.5"/>
  <rect x="448" y="-6.5" width="170" height="13" rx="3" fill="#f5b301" stroke="#0b0f14" stroke-width="2.5"/>
  <rect x="598" y="-4.5" width="152" height="9" rx="2.5" fill="#ffd34d" stroke="#0b0f14" stroke-width="2"/>
  <circle cx="750" cy="0" r="9" fill="#2a3441" stroke="#0b0f14" stroke-width="2"/>
 </g>
 <g transform="translate(843 91)"><line x1="0" y1="0" x2="0" y2="120" stroke="#8b96a3" stroke-width="3"/><g transform="translate(0 120)"><rect x="-11" y="0" width="22" height="26" rx="4" fill="#2a3441"/><path d="M0 26v10c0 12 -18 12 -18 0" fill="none" stroke="#f5b301" stroke-width="6" stroke-linecap="round"/></g></g>
</g>
<!-- logo + metin -->
<rect x="72" y="80" width="64" height="64" rx="12" fill="#f5b301"/>
<path d="M86 128h36M90 128V106l24-12M114 94v34M114 94l8 6" stroke="#0b0f14" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
<text x="72" y="270" font-family="Inter Tight, Inter, Arial, sans-serif" font-size="72" font-weight="800" fill="#ffffff">Kurtuluş Vinç</text>
<text x="72" y="340" font-family="Inter Tight, Inter, Arial, sans-serif" font-size="40" font-weight="700" fill="#f5b301">Çeşme · Alaçatı · Urla</text>
<text x="72" y="410" font-family="Inter Tight, Inter, Arial, sans-serif" font-size="28" font-weight="600" fill="#c9d1da">Mobil vinç · Sepetli platform · Hiyap nakliye</text>
<text x="72" y="520" font-family="Inter Tight, Inter, Arial, sans-serif" font-size="44" font-weight="800" fill="#ffffff">0532 466 38 74</text>
</svg>`;
await sharp(Buffer.from(og)).png({ compressionLevel: 9, palette: true }).toFile('public/og-default.png');
const icon = readFileSync('public/favicon.svg');
await sharp(icon, { density: 400 }).resize(180, 180).png().toFile('public/apple-touch-icon.png');
console.log('ok');
