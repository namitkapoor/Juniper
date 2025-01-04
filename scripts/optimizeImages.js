const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = 'public/images';
const outputDir = 'public/images/optimized';

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function optimizeImage(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .resize(1200, 800, { // Max dimensions
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 80 }) // Convert to WebP format
      .toFile(outputPath.replace(/\.[^.]+$/, '.webp'));

    console.log(`Optimized: ${path.basename(inputPath)}`);
  } catch (error) {
    console.error(`Error optimizing ${inputPath}:`, error);
  }
}

async function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const inputPath = path.join(dirPath, file);
    const stat = fs.statSync(inputPath);

    if (stat.isDirectory()) {
      await processDirectory(inputPath);
    } else if (/\.(jpg|jpeg|png)$/i.test(file)) {
      const relativePath = path.relative(inputDir, dirPath);
      const outputPath = path.join(outputDir, relativePath, file);

      // Create output subdirectory if it doesn't exist
      const outputSubDir = path.dirname(outputPath);
      if (!fs.existsSync(outputSubDir)) {
        fs.mkdirSync(outputSubDir, { recursive: true });
      }

      await optimizeImage(inputPath, outputPath);
    }
  }
}

processDirectory(inputDir); 