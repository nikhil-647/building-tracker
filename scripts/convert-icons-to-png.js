// Convert SVG icons to PNG using sharp
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '..', 'public');
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function convertSVGtoPNG() {
  console.log('Converting SVG icons to PNG...\n');
  
  for (const size of sizes) {
    const svgPath = path.join(publicDir, `icon-${size}x${size}.svg`);
    const pngPath = path.join(publicDir, `icon-${size}x${size}.png`);
    
    try {
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(pngPath);
      
      console.log(`✓ Converted icon-${size}x${size}.svg → icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`✗ Failed to convert icon-${size}x${size}.svg:`, error.message);
    }
  }
  
  console.log('\n✅ PNG icon conversion complete!');
}

convertSVGtoPNG().catch(console.error);

