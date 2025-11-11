// Generate all icon sizes from a single 512x512 source
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '..', 'public');
const sourceIcon = path.join(publicDir, 'icon-512x512.png');
const sizes = [72, 96, 128, 144, 152, 192, 384];

async function generateAllSizes() {
  console.log('Generating all icon sizes from icon-512x512.png...\n');
  
  // Check if source exists
  if (!fs.existsSync(sourceIcon)) {
    console.error('❌ icon-512x512.png not found!');
    console.log('Please create a 512x512 PNG icon first.');
    console.log('\nYou can:');
    console.log('1. Design one in Figma/Canva');
    console.log('2. Use https://progressier.com/pwa-icons-and-ios-splash-screen-generator');
    console.log('3. Save it as public/icon-512x512.png');
    return;
  }

  try {
    for (const size of sizes) {
      const outputPath = path.join(publicDir, `icon-${size}x${size}.png`);
      
      await sharp(sourceIcon)
        .resize(size, size, {
          kernel: sharp.kernel.lanczos3
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✓ Generated icon-${size}x${size}.png`);
    }
    
    console.log('\n✅ All icon sizes generated!');
    console.log('Remember to clear cache and reinstall PWA to see changes.\n');
  } catch (error) {
    console.error('Error generating icons:', error.message);
  }
}

generateAllSizes();

