// Create placeholder screenshots for PWA
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '..', 'public');

// Create a simple placeholder screenshot
const createScreenshot = async (width, height, filename, text) => {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#0a0a0a"/>
      <text
        x="50%"
        y="50%"
        font-family="Arial, sans-serif"
        font-size="48"
        fill="#f97316"
        text-anchor="middle"
        dominant-baseline="middle"
      >
        ${text}
      </text>
      <g transform="translate(${width/2}, ${height/2 - 80})">
        <path 
          d="M -30 50 C -30 20 -16 -10 0 -50 C 16 -10 30 20 30 50 C 30 70 16 80 0 80 C -16 80 -30 70 -30 50 Z"
          fill="#f97316"
          stroke="#fb923c"
          stroke-width="2"
        />
        <path 
          d="M -16 40 C -16 20 -8 4 0 -20 C 8 4 16 20 16 40 C 16 56 8 64 0 64 C -8 64 -16 56 -16 40 Z"
          fill="#fbbf24"
        />
      </g>
    </svg>
  `;
  
  const buffer = Buffer.from(svg);
  await sharp(buffer)
    .png()
    .toFile(path.join(publicDir, filename));
  
  console.log(`✓ Created ${filename}`);
};

async function createScreenshots() {
  console.log('Creating placeholder screenshots...\n');
  
  try {
    await createScreenshot(1280, 720, 'screenshot-wide.png', 'Tapas Fitness Tracker');
    await createScreenshot(750, 1334, 'screenshot-narrow.png', 'Tapas');
    
    console.log('\n✅ Screenshots created successfully!');
    console.log('💡 Replace these with actual app screenshots for better PWA experience.\n');
  } catch (error) {
    console.error('Error creating screenshots:', error);
  }
}

createScreenshots();

