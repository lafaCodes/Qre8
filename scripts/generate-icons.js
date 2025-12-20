const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 48, name: 'icon-48x48.png' },
  { size: 72, name: 'icon-72x72.png' },
  { size: 96, name: 'icon-96x96.png' },
  { size: 120, name: 'apple-touch-icon-120x120.png' },
  { size: 128, name: 'icon-128x128.png' },
  { size: 144, name: 'icon-144x144.png' },
  { size: 152, name: 'apple-touch-icon-152x152.png' },
  { size: 167, name: 'apple-touch-icon-167x167.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 256, name: 'icon-256x256.png' },
  { size: 384, name: 'icon-384x384.png' },
  { size: 512, name: 'icon-512x512.png' },
];

const maskableSizes = [
  { size: 192, name: 'maskable-192x192.png' },
  { size: 512, name: 'maskable-512x512.png' },
];

async function generateIcons() {
  const svgPath = path.join(__dirname, '../public/icons/icon.svg');
  const outputDir = path.join(__dirname, '../public/icons');

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const svgBuffer = fs.readFileSync(svgPath);

  console.log('Generating regular icons...');
  for (const { size, name } of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(outputDir, name));
    console.log(`  ✓ ${name}`);
  }

  console.log('\nGenerating maskable icons (with padding)...');
  for (const { size, name } of maskableSizes) {
    // Maskable icons need 10% padding (safe zone)
    const innerSize = Math.round(size * 0.8);
    const padding = Math.round(size * 0.1);
    
    await sharp(svgBuffer)
      .resize(innerSize, innerSize)
      .extend({
        top: padding,
        bottom: padding,
        left: padding,
        right: padding,
        background: { r: 15, g: 23, b: 42, alpha: 1 } // #0f172a - slate-900
      })
      .png()
      .toFile(path.join(outputDir, name));
    console.log(`  ✓ ${name}`);
  }

  // Copy apple-touch-icon to root public folder as well
  fs.copyFileSync(
    path.join(outputDir, 'apple-touch-icon.png'),
    path.join(__dirname, '../public/apple-touch-icon.png')
  );
  console.log('\n  ✓ Copied apple-touch-icon.png to /public');

  console.log('\n✅ All icons generated successfully!');
}

generateIcons().catch(console.error);
