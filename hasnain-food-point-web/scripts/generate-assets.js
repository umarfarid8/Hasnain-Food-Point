import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ICON_SOURCE = 'C:/Users/dell/.gemini/antigravity-ide/brain/bcd13e7e-b313-4221-986d-095ba560720c/app_icon_master_1786940552107.jpg';
const SPLASH_SOURCE = 'C:/Users/dell/.gemini/antigravity-ide/brain/bcd13e7e-b313-4221-986d-095ba560720c/splash_screen_raw_1786940581136.jpg';

const RES_DIR = path.resolve(__dirname, '../android/app/src/main/res');

const ICON_DENSITIES = [
  { dir: 'mipmap-mdpi', size: 48, fgSize: 108 },
  { dir: 'mipmap-hdpi', size: 72, fgSize: 162 },
  { dir: 'mipmap-xhdpi', size: 96, fgSize: 216 },
  { dir: 'mipmap-xxhdpi', size: 144, fgSize: 324 },
  { dir: 'mipmap-xxxhdpi', size: 192, fgSize: 432 }
];

const SPLASH_DENSITIES = [
  { dir: 'drawable', width: 480, height: 800 },
  { dir: 'drawable-port-mdpi', width: 320, height: 480 },
  { dir: 'drawable-port-hdpi', width: 480, height: 800 },
  { dir: 'drawable-port-xhdpi', width: 720, height: 1280 },
  { dir: 'drawable-port-xxhdpi', width: 960, height: 1600 },
  { dir: 'drawable-port-xxxhdpi', width: 1280, height: 1920 },
  { dir: 'drawable-land-mdpi', width: 480, height: 320 },
  { dir: 'drawable-land-hdpi', width: 800, height: 480 },
  { dir: 'drawable-land-xhdpi', width: 1280, height: 720 },
  { dir: 'drawable-land-xxhdpi', width: 1600, height: 960 },
  { dir: 'drawable-land-xxxhdpi', width: 1920, height: 1280 }
];

async function generateRoundIcon(sourceBuffer, size) {
  const circleSvg = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="#000"/></svg>`
  );

  return sharp(sourceBuffer)
    .resize(size, size, { fit: 'cover' })
    .composite([{ input: circleSvg, blend: 'dest-in' }])
    .png()
    .toBuffer();
}

async function generateForegroundIcon(sourceBuffer, fgSize) {
  // Center the icon inside adaptive 108x108 grid (safe zone is central 66%)
  const innerSize = Math.round(fgSize * 0.72);
  const innerBuffer = await sharp(sourceBuffer)
    .resize(innerSize, innerSize, { fit: 'contain' })
    .png()
    .toBuffer();

  return sharp({
    create: {
      width: fgSize,
      height: fgSize,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
  .composite([{ input: innerBuffer, gravity: 'center' }])
  .png()
  .toBuffer();
}

async function run() {
  console.log('Generating Android icons and splash screens...');

  // 1. Process Icons
  const iconBuffer = await sharp(ICON_SOURCE).toBuffer();

  for (const { dir, size, fgSize } of ICON_DENSITIES) {
    const targetDir = path.join(RES_DIR, dir);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Standard square/rounded icon
    await sharp(iconBuffer)
      .resize(size, size, { fit: 'cover' })
      .png()
      .toFile(path.join(targetDir, 'ic_launcher.png'));

    // Round launcher icon
    const roundBuffer = await generateRoundIcon(iconBuffer, size);
    fs.writeFileSync(path.join(targetDir, 'ic_launcher_round.png'), roundBuffer);

    // Adaptive icon foreground
    const fgBuffer = await generateForegroundIcon(iconBuffer, fgSize);
    fs.writeFileSync(path.join(targetDir, 'ic_launcher_foreground.png'), fgBuffer);

    console.log(`✓ Generated icons for ${dir} (${size}x${size}, fg ${fgSize}x${fgSize})`);
  }

  // 2. Process Splash Screens
  const splashBuffer = await sharp(SPLASH_SOURCE).toBuffer();

  for (const { dir, width, height } of SPLASH_DENSITIES) {
    const targetDir = path.join(RES_DIR, dir);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    await sharp(splashBuffer)
      .resize(width, height, { fit: 'cover', position: 'center' })
      .png()
      .toFile(path.join(targetDir, 'splash.png'));

    console.log(`✓ Generated splash for ${dir} (${width}x${height})`);
  }

  // 3. Generate master icon in public folder for web PWA / favicon
  const publicDir = path.resolve(__dirname, '../public');
  await sharp(iconBuffer)
    .resize(512, 512, { fit: 'cover' })
    .png()
    .toFile(path.join(publicDir, 'app-icon.png'));

  console.log('All Android and web icon assets generated successfully!');
}

run().catch((err) => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
