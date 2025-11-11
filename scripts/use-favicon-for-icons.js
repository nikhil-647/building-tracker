// Use your existing favicon.svg to generate proper app icons
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '..', 'public');
const faviconPath = path.join(publicDir, 'favicon.svg');
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateIconsFromFavicon() {
  console.log('Generating PWA icons from favicon.svg...\n');
  
  // Check if favicon.svg exists
  if (!fs.existsSync(faviconPath)) {
    console.error('❌ favicon.svg not found!');
    console.log('Please ensure you have a favicon.svg in the public folder.');
    return;
  }

  try {
    for (const size of sizes) {
      const outputPath = path.join(publicDir, `icon-${size}x${size}.png`);
      
      await sharp(faviconPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 10, g: 10, b: 10, alpha: 1 } // Dark background
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✓ Generated icon-${size}x${size}.png`);
    }
    
    console.log('\n✅ All icons generated from favicon.svg!');
  } catch (error) {
    console.error('Error generating icons:', error.message);
  }
}

generateIconsFromFavicon();

