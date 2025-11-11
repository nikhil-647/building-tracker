// Simple script to generate PWA icons
// This creates SVG icons that can be converted to PNG using a service or tool

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Simple SVG template with Flame icon (Tapas logo)
const generateSVG = (size) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#0a0a0a"/>
  <g transform="translate(${size/2}, ${size/2})">
    <!-- Flame icon -->
    <path 
      d="M ${-size*0.15} ${size*0.25} C ${-size*0.15} ${size*0.1} ${-size*0.08} ${-size*0.05} 0 ${-size*0.25} C ${size*0.08} ${-size*0.05} ${size*0.15} ${size*0.1} ${size*0.15} ${size*0.25} C ${size*0.15} ${size*0.35} ${size*0.08} ${size*0.4} 0 ${size*0.4} C ${-size*0.08} ${size*0.4} ${-size*0.15} ${size*0.35} ${-size*0.15} ${size*0.25} Z"
      fill="#f97316"
      stroke="#fb923c"
      stroke-width="${size*0.01}"
    />
    <!-- Inner flame -->
    <path 
      d="M ${-size*0.08} ${size*0.2} C ${-size*0.08} ${size*0.1} ${-size*0.04} ${size*0.02} 0 ${-size*0.1} C ${size*0.04} ${size*0.02} ${size*0.08} ${size*0.1} ${size*0.08} ${size*0.2} C ${size*0.08} ${size*0.28} ${size*0.04} ${size*0.32} 0 ${size*0.32} C ${-size*0.04} ${size*0.32} ${-size*0.08} ${size*0.28} ${-size*0.08} ${size*0.2} Z"
      fill="#fbbf24"
    />
  </g>
</svg>`;
};

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate SVG files
sizes.forEach(size => {
  const svg = generateSVG(size);
  const filename = `icon-${size}x${size}.svg`;
  fs.writeFileSync(path.join(publicDir, filename), svg);
  console.log(`✓ Generated ${filename}`);
});

console.log('\n📝 SVG icons generated successfully!');
console.log('To create PNG icons, you can:');
console.log('1. Use an online converter like cloudconvert.com');
console.log('2. Use ImageMagick: convert icon-512x512.svg icon-512x512.png');
console.log('3. Use a design tool like Figma or Inkscape\n');
console.log('For now, the manifest.json will reference these SVG files.');
console.log('Browsers will handle the conversion automatically.\n');

// Update manifest to use SVG files temporarily
const manifestPath = path.join(publicDir, 'manifest.json');
if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  // Update icons to reference both PNG and SVG
  manifest.icons = manifest.icons.map(icon => {
    const size = icon.sizes.split('x')[0];
    return {
      ...icon,
      src: `/icon-${icon.sizes}.png`,
      // Fallback to SVG if PNG doesn't exist
      type: 'image/png'
    };
  });
  
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('✓ Updated manifest.json');
}

