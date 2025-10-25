#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const svgContent = fs.readFileSync(
  path.join(__dirname, "chrome-icon.svg"),
  "utf8",
);

const sizes = [16, 32, 48, 128];

async function generateIcons() {
  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch (error) {
    console.error("Error: sharp is not installed.");
    console.error("Please install it by running: npm install --save-dev sharp");
    console.error(
      "\nAlternatively, you can generate icons manually from chrome-icon.svg using an online converter or design tool.",
    );
    process.exit(1);
  }

  const iconsDir = path.join(__dirname, "dist", "icons");

  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  console.log("Generating PNG icons from SVG...");

  for (const size of sizes) {
    await sharp(Buffer.from(svgContent))
      .resize(size, size)
      .png()
      .toFile(path.join(iconsDir, `icon${size}.png`));
    console.log(`✓ Generated icon${size}.png`);
  }

  console.log("✨ All icons generated successfully!");
}

generateIcons().catch(console.error);
