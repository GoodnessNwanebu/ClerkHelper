const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Ensure public directory exists
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Create SVG content for a medical stethoscope icon
const createSVG = (size, bgColor = '#2563eb', iconColor = '#ffffff') => `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.3"/>
    </filter>
  </defs>
  
  <!-- Background circle -->
  <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 4}" fill="url(#bg)" stroke="#1e40af" stroke-width="2"/>
  
  <!-- Stethoscope design -->
  <g transform="translate(${size/2}, ${size/2})" fill="${iconColor}" filter="url(#shadow)">
    <!-- Main tube -->
    <path d="M-25,-20 Q-30,-10 -25,0 Q-20,10 -10,15 Q0,20 10,15 Q20,10 25,0 Q30,-10 25,-20" 
          stroke="${iconColor}" stroke-width="3" fill="none"/>
    
    <!-- Left earpiece -->
    <circle cx="-25" cy="-20" r="4" fill="${iconColor}"/>
    <path d="M-25,-24 Q-30,-30 -35,-25 Q-30,-20 -25,-24" stroke="${iconColor}" stroke-width="2" fill="none"/>
    
    <!-- Right earpiece -->
    <circle cx="25" cy="-20" r="4" fill="${iconColor}"/>
    <path d="M25,-24 Q30,-30 35,-25 Q30,-20 25,-24" stroke="${iconColor}" stroke-width="2" fill="none"/>
    
    <!-- Chest piece -->
    <circle cx="0" cy="20" r="8" fill="${iconColor}" stroke="${iconColor}" stroke-width="2"/>
    <circle cx="0" cy="20" r="5" fill="none" stroke="#1e40af" stroke-width="1"/>
    
    <!-- Medical cross on chest piece -->
    <path d="M-2,16 L2,16 L2,18 L4,18 L4,22 L2,22 L2,24 L-2,24 L-2,22 L-4,22 L-4,18 L-2,18 Z" 
          fill="#ef4444"/>
  </g>
</svg>`;

// Icon sizes to generate
const iconSizes = [
  { size: 72, name: 'icon-72x72.png' },
  { size: 96, name: 'icon-96x96.png' },
  { size: 128, name: 'icon-128x128.png' },
  { size: 144, name: 'icon-144x144.png' },
  { size: 152, name: 'icon-152x152.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 384, name: 'icon-384x384.png' },
  { size: 512, name: 'icon-512x512.png' },
];

// Apple touch icons
const appleIconSizes = [
  { size: 57, name: 'apple-touch-icon-57x57.png' },
  { size: 60, name: 'apple-touch-icon-60x60.png' },
  { size: 72, name: 'apple-touch-icon-72x72.png' },
  { size: 76, name: 'apple-touch-icon-76x76.png' },
  { size: 114, name: 'apple-touch-icon-114x114.png' },
  { size: 120, name: 'apple-touch-icon-120x120.png' },
  { size: 144, name: 'apple-touch-icon-144x144.png' },
  { size: 152, name: 'apple-touch-icon-152x152.png' },
  { size: 180, name: 'apple-touch-icon-180x180.png' },
];

// Favicon sizes
const faviconSizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 48, name: 'favicon-48x48.png' },
];

async function generateIcons() {
  console.log('🎨 Generating PWA icons for ClerkSmart...');
  
  try {
    // Generate PWA icons
    for (const icon of iconSizes) {
      const svgBuffer = Buffer.from(createSVG(icon.size));
      const outputPath = path.join(publicDir, icon.name);
      
      await sharp(svgBuffer)
        .resize(icon.size, icon.size)
        .png({ quality: 90, compressionLevel: 9 })
        .toFile(outputPath);
      
      console.log(`✅ Generated ${icon.name}`);
    }
    
    // Generate Apple touch icons
    for (const icon of appleIconSizes) {
      const svgBuffer = Buffer.from(createSVG(icon.size));
      const outputPath = path.join(publicDir, icon.name);
      
      await sharp(svgBuffer)
        .resize(icon.size, icon.size)
        .png({ quality: 90, compressionLevel: 9 })
        .toFile(outputPath);
      
      console.log(`🍎 Generated ${icon.name}`);
    }
    
    // Generate favicons
    for (const icon of faviconSizes) {
      const svgBuffer = Buffer.from(createSVG(icon.size));
      const outputPath = path.join(publicDir, icon.name);
      
      await sharp(svgBuffer)
        .resize(icon.size, icon.size)
        .png({ quality: 90, compressionLevel: 9 })
        .toFile(outputPath);
      
      console.log(`🔖 Generated ${icon.name}`);
    }
    
    // Generate main favicon.ico (using 32x32)
    const svgBuffer = Buffer.from(createSVG(32));
    await sharp(svgBuffer)
      .resize(32, 32)
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(path.join(publicDir, 'favicon.png'));
    
    // Generate source SVG for reference
    fs.writeFileSync(path.join(publicDir, 'icon.svg'), createSVG(512));
    
    console.log('🎉 All icons generated successfully!');
    console.log(`📁 Icons saved to: ${publicDir}`);
    
  } catch (error) {
    console.error('❌ Error generating icons:', error);
  }
}

// Run the generator
generateIcons(); 