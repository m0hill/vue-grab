#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, 'dist');
const srcDir = path.join(__dirname, 'src');

// Clean dist directory
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true });
}

// Create dist directory
fs.mkdirSync(distDir, { recursive: true });

console.log('Building Chrome extension...');

// Copy manifest.json
fs.copyFileSync(
  path.join(__dirname, 'manifest.json'),
  path.join(distDir, 'manifest.json')
);
console.log('✓ Copied manifest.json');

// Copy popup files
fs.copyFileSync(
  path.join(srcDir, 'popup.html'),
  path.join(distDir, 'popup.html')
);
fs.copyFileSync(
  path.join(srcDir, 'popup.js'),
  path.join(distDir, 'popup.js')
);
console.log('✓ Copied popup files');

// Copy content script
fs.copyFileSync(
  path.join(srcDir, 'content.js'),
  path.join(distDir, 'content.js')
);
console.log('✓ Copied content.js');

// Copy vue-grab built script from the vue-grab package
const vueGrabScript = path.join(__dirname, '../vue-grab/dist/index.global.js');
if (!fs.existsSync(vueGrabScript)) {
  console.error('Error: vue-grab script not found. Please run "pnpm --filter vue-grab build" first.');
  process.exit(1);
}

fs.copyFileSync(
  vueGrabScript,
  path.join(distDir, 'vue-grab.js')
);
console.log('✓ Copied vue-grab.js');

// Create icons directory
const iconsDir = path.join(distDir, 'icons');
fs.mkdirSync(iconsDir, { recursive: true });

// Generate simple placeholder icons (text-based)
// In a real extension, you'd want proper icon files
const createIcon = (size) => {
  const canvas = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#4CAF50"/>
  <text x="50%" y="50%" font-size="${size * 0.6}" fill="white" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-weight="bold">VG</text>
</svg>`;
  return canvas;
};

// Note: Chrome extensions need PNG icons, not SVG
// For now, we'll create a simple README in the icons folder
fs.writeFileSync(
  path.join(iconsDir, 'README.md'),
  `# Icons

Please add the following icon files to this directory:
- icon16.png (16x16 pixels)
- icon48.png (48x48 pixels)
- icon128.png (128x128 pixels)

You can generate these from an SVG or create them using an image editor.

For now, the extension will work without icons, but they are recommended for a better user experience.

Suggested design: Green background (#4CAF50) with white "VG" text.
`
);

console.log('✓ Created icons directory (add PNG icons manually)');

// Update manifest to make icons optional
const manifestPath = path.join(distDir, 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

// Make icons optional by removing them if they don't exist
if (!fs.existsSync(path.join(iconsDir, 'icon16.png'))) {
  delete manifest.action.default_icon;
  delete manifest.icons;
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('✓ Updated manifest (icons optional)');
}

// Also need to update manifest to allow vue-grab.js as web_accessible_resource
manifest.web_accessible_resources = [{
  resources: ['vue-grab.js'],
  matches: ['<all_urls>']
}];

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log('✓ Updated manifest with web_accessible_resources');

console.log('\n✨ Build complete! Extension built to dist/');
console.log('\nTo install:');
console.log('1. Open Chrome and go to chrome://extensions/');
console.log('2. Enable "Developer mode"');
console.log('3. Click "Load unpacked"');
console.log('4. Select the dist/ directory\n');
