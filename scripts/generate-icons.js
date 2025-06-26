const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Ensure public directory exists
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Create SVG content for a clean, modern medical icon
const createSVG = (size, bgColor = '#2563eb', iconColor = '#ffffff') => `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#2563eb;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="1" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.15"/>
    </filter>
  </defs>
  
  <!-- Background with subtle radius -->
  <rect x="0" y="0" width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#bg)" />
  
  <!-- Main icon group -->
  <g transform="translate(${size/2}, ${size/2})" fill="${iconColor}" filter="url(#shadow)">
    
    <!-- Medical clipboard/chart icon -->
    <g transform="scale(${size/100})">
      <!-- Clipboard background -->
      <rect x="-18" y="-20" width="36" height="40" rx="2" fill="${iconColor}" opacity="0.9"/>
      <rect x="-16" y="-18" width="32" height="36" rx="1" fill="#1e40af" opacity="0.3"/>
      
      <!-- Clip at top -->
      <rect x="-6" y="-22" width="12" height="6" rx="1" fill="${iconColor}" opacity="0.8"/>
      
      <!-- Text lines on clipboard -->
      <rect x="-12" y="-12" width="16" height="2" rx="1" fill="#1e40af" opacity="0.6"/>
      <rect x="-12" y="-7" width="20" height="2" rx="1" fill="#1e40af" opacity="0.6"/>
      <rect x="-12" y="-2" width="18" height="2" rx="1" fill="#1e40af" opacity="0.6"/>
      <rect x="-12" y="3" width="14" height="2" rx="1" fill="#1e40af" opacity="0.6"/>
      
      <!-- Medical cross accent -->
      <g transform="translate(12, -8)" fill="#ef4444">
        <rect x="-1.5" y="-4" width="3" height="8" rx="1"/>
        <rect x="-4" y="-1.5" width="8" height="3" rx="1"/>
      </g>
      
      <!-- Stylized "C" for ClerkSmart -->
      <g transform="translate(-20, 8)" fill="${iconColor}" opacity="0.8">
        <path d="M -4 -6 Q -8 -6 -8 -2 Q -8 2 -4 2 L -2 2 L -2 0 L -4 0 Q -6 0 -6 -2 Q -6 -4 -4 -4 L -2 -4 L -2 -6 Z" />
      </g>
    </g>
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
  console.log('🎨 Generating BEAUTIFUL PWA icons for ClerkSmart...');
  
  try {
    // Generate PWA icons
    for (const icon of iconSizes) {
      const svgBuffer = Buffer.from(createSVG(icon.size));
      const outputPath = path.join(publicDir, icon.name);
      
      await sharp(svgBuffer)
        .resize(icon.size, icon.size)
        .png({ quality: 95, compressionLevel: 9 })
        .toFile(outputPath);
      
      console.log(`✅ Generated ${icon.name}`);
    }
    
    // Generate Apple touch icons
    for (const icon of appleIconSizes) {
      const svgBuffer = Buffer.from(createSVG(icon.size));
      const outputPath = path.join(publicDir, icon.name);
      
      await sharp(svgBuffer)
        .resize(icon.size, icon.size)
        .png({ quality: 95, compressionLevel: 9 })
        .toFile(outputPath);
      
      console.log(`🍎 Generated ${icon.name}`);
    }
    
    // Generate favicons
    for (const icon of faviconSizes) {
      const svgBuffer = Buffer.from(createSVG(icon.size));
      const outputPath = path.join(publicDir, icon.name);
      
      await sharp(svgBuffer)
        .resize(icon.size, icon.size)
        .png({ quality: 95, compressionLevel: 9 })
        .toFile(outputPath);
      
      console.log(`🔖 Generated ${icon.name}`);
    }
    
    // Generate main favicon.ico (using 32x32)
    const svgBuffer = Buffer.from(createSVG(32));
    await sharp(svgBuffer)
      .resize(32, 32)
      .png({ quality: 95, compressionLevel: 9 })
      .toFile(path.join(publicDir, 'favicon.png'));
    
    // Copy as favicon.ico
    await sharp(svgBuffer)
      .resize(32, 32)
      .png({ quality: 95, compressionLevel: 9 })
      .toFile(path.join(publicDir, 'favicon.ico'));
    
    // Generate source SVG for reference
    fs.writeFileSync(path.join(publicDir, 'icon.svg'), createSVG(512));
    
    console.log('🎉 GORGEOUS icons generated successfully!');
    console.log(`📁 Icons saved to: ${publicDir}`);
    console.log('🚀 Much cleaner design with medical clipboard + "C" branding!');
    
  } catch (error) {
    console.error('❌ Error generating icons:', error);
  }
}

// Run the generator
generateIcons(); 