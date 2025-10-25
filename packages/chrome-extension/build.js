#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, "dist");
const srcDir = path.join(__dirname, "src");

if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true });
}

fs.mkdirSync(distDir, { recursive: true });

console.log("Building Chrome extension...");

fs.copyFileSync(
  path.join(__dirname, "manifest.json"),
  path.join(distDir, "manifest.json"),
);
console.log("✓ Copied manifest.json");

fs.copyFileSync(
  path.join(srcDir, "popup.html"),
  path.join(distDir, "popup.html"),
);
fs.copyFileSync(path.join(srcDir, "popup.js"), path.join(distDir, "popup.js"));
console.log("✓ Copied popup files");

fs.copyFileSync(
  path.join(srcDir, "content.js"),
  path.join(distDir, "content.js"),
);
console.log("✓ Copied content.js");

const vueGrabScript = path.join(__dirname, "../vue-grab/dist/index.global.js");
if (!fs.existsSync(vueGrabScript)) {
  console.error(
    'Error: vue-grab script not found. Please run "pnpm --filter vue-grab build" first.',
  );
  process.exit(1);
}

fs.copyFileSync(vueGrabScript, path.join(distDir, "vue-grab.js"));
console.log("✓ Copied vue-grab.js");

const iconsDir = path.join(distDir, "icons");
fs.mkdirSync(iconsDir, { recursive: true });

async function generateIcons() {
  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch (error) {
    console.log("⚠ sharp not installed, skipping icon generation");
    console.log(
      '  Run "npm install --save-dev sharp" and rebuild to generate icons',
    );
    return false;
  }

  const svgPath = path.join(__dirname, "chrome-icon.svg");
  if (!fs.existsSync(svgPath)) {
    console.log("⚠ chrome-icon.svg not found, skipping icon generation");
    return false;
  }

  const svgContent = fs.readFileSync(svgPath);
  const sizes = [16, 32, 48, 128];

  console.log("Generating PNG icons from SVG...");

  for (const size of sizes) {
    await sharp(svgContent)
      .resize(size, size)
      .png()
      .toFile(path.join(iconsDir, `icon${size}.png`));
    console.log(`✓ Generated icon${size}.png`);
  }

  return true;
}

async function build() {
  const iconsGenerated = await generateIcons();

  const manifestPath = path.join(distDir, "manifest.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

  if (!iconsGenerated || !fs.existsSync(path.join(iconsDir, "icon16.png"))) {
    delete manifest.action.default_icon;
    delete manifest.icons;
    console.log("✓ Updated manifest (icons optional)");
  }

  manifest.web_accessible_resources = [
    {
      resources: ["vue-grab.js"],
      matches: ["<all_urls>"],
    },
  ];

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log("✓ Updated manifest with web_accessible_resources");

  console.log("\n✨ Build complete! Extension built to dist/");
  console.log("\nTo install:");
  console.log("1. Open Chrome and go to chrome://extensions/");
  console.log('2. Enable "Developer mode"');
  console.log('3. Click "Load unpacked"');
  console.log("4. Select the dist/ directory\n");
}

build().catch(console.error);
