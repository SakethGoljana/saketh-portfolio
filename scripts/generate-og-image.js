const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0A0E14"/>
      <stop offset="50%" stop-color="#05080B"/>
      <stop offset="100%" stop-color="#020305"/>
    </linearGradient>
    <radialGradient id="aura" cx="80%" cy="20%" r="60%">
      <stop offset="0%" stop-color="#10B981" stop-opacity="0.18"/>
      <stop offset="60%" stop-color="#059669" stop-opacity="0.04"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="s-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7CF4D4"/>
      <stop offset="50%" stop-color="#10B981"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
    <linearGradient id="text-grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#aura)"/>

  <!-- Subtle 40px Tech Grid Lines -->
  <g stroke="rgba(255,255,255,0.03)" stroke-width="1">
    <line x1="100" y1="0" x2="100" y2="630"/>
    <line x1="300" y1="0" x2="300" y2="630"/>
    <line x1="500" y1="0" x2="500" y2="630"/>
    <line x1="700" y1="0" x2="700" y2="630"/>
    <line x1="900" y1="0" x2="900" y2="630"/>
    <line x1="1100" y1="0" x2="1100" y2="630"/>
    <line x1="0" y1="150" x2="1200" y2="150"/>
    <line x1="0" y1="315" x2="1200" y2="315"/>
    <line x1="0" y1="480" x2="1200" y2="480"/>
  </g>

  <!-- Outer Border -->
  <rect x="24" y="24" width="1152" height="582" rx="20" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1.5"/>

  <!-- Brand Mark 'S' (Top Right Feature) -->
  <g transform="translate(1000, 70)">
    <path d="M 70 28 C 70 16, 58 12, 48 12 C 34 12, 26 20, 26 32 C 26 44, 36 47, 48 51 C 60 56, 70 59, 70 69 C 70 80, 60 84, 48 84 C 34 84, 26 78, 26 68" 
          fill="none" 
          stroke="url(#s-grad)" 
          stroke-width="14" 
          stroke-linecap="round" 
          stroke-linejoin="round" />
  </g>

  <!-- Status Pill -->
  <g transform="translate(80, 80)">
    <rect width="270" height="36" rx="18" fill="rgba(16, 185, 129, 0.12)" stroke="rgba(16, 185, 129, 0.3)" stroke-width="1"/>
    <circle cx="20" cy="18" r="5" fill="#10B981"/>
    <text x="36" y="23" fill="#7CF4D4" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" letter-spacing="1.5">SAKETH GOLJANA · PORTFOLIO</text>
  </g>

  <!-- Main Headline -->
  <text x="80" y="220" fill="url(#text-grad)" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="52" font-weight="800" letter-spacing="-1.5">
    Lead Architect &amp;
  </text>
  <text x="80" y="285" fill="#10B981" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="52" font-weight="800" letter-spacing="-1.5">
    Mobile Software Engineer.
  </text>

  <!-- Description -->
  <text x="80" y="360" fill="#94A3B8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="400" line-height="32">
    Engineering production cross-platform mobile apps, modern web platforms,
  </text>
  <text x="80" y="395" fill="#94A3B8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="400">
    and intelligent automation systems with obsessive craft and zero-knowledge privacy.
  </text>

  <!-- Tech Tags -->
  <g transform="translate(80, 450)">
    <!-- Tag 1 -->
    <rect x="0" y="0" width="165" height="38" rx="10" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
    <text x="20" y="24" fill="#E2E8F0" font-family="monospace" font-size="14" font-weight="600">React Native 0.88</text>

    <!-- Tag 2 -->
    <rect x="180" y="0" width="135" height="38" rx="10" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
    <text x="200" y="24" fill="#E2E8F0" font-family="monospace" font-size="14" font-weight="600">Expo SDK 58</text>

    <!-- Tag 3 -->
    <rect x="330" y="0" width="115" height="38" rx="10" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
    <text x="350" y="24" fill="#E2E8F0" font-family="monospace" font-size="14" font-weight="600">Next.js 16</text>

    <!-- Tag 4 -->
    <rect x="460" y="0" width="130" height="38" rx="10" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
    <text x="480" y="24" fill="#E2E8F0" font-family="monospace" font-size="14" font-weight="600">TypeScript</text>

    <!-- Tag 5: Flagship -->
    <rect x="605" y="0" width="220" height="38" rx="10" fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.3)" stroke-width="1"/>
    <text x="625" y="24" fill="#7CF4D4" font-family="monospace" font-size="14" font-weight="700">★ Dispatch Mobile App</text>
  </g>

  <!-- Bottom Details Bar -->
  <g transform="translate(80, 545)">
    <text x="0" y="16" fill="#64748B" font-family="monospace" font-size="15" font-weight="600">
      sakethgoljana.tech · hello@sakethgoljana.tech · +91 90594 78739
    </text>
  </g>
</svg>
`;

async function main() {
  const publicDir = path.join(__dirname, '..', 'public');
  const outPng = path.join(publicDir, 'og-image.png');
  const outSvg = path.join(publicDir, 'og-image.svg');

  fs.writeFileSync(outSvg, svg);
  console.log('Saved public/og-image.svg');

  await sharp(Buffer.from(svg))
    .png({ quality: 95 })
    .toFile(outPng);
  console.log('Generated public/og-image.png (1200x630)');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
