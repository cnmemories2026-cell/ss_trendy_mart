const { unzip } = require('./unzip_tool.cjs');
const path = require('path');
const fs = require('fs');

const zipFiles = [
  'C:/Users/chand/Downloads/ilovepdf_pages-to-jpg (2).zip',
  'C:/Users/chand/Downloads/ilovepdf_pages-to-jpg (3).zip',
  'C:/Users/chand/Downloads/ilovepdf_pages-to-jpg (1).zip',
  'C:/Users/chand/Downloads/ilovepdf_pages-to-jpg.zip'
];

let targetZip = zipFiles.find(z => fs.existsSync(z));

if (!targetZip) {
  console.log('Zip file not found, creating directory structure');
  process.exit(0);
}

console.log('Extracting zip file:', targetZip);
const destDir = path.join(__dirname, 'public', 'products');

try {
  const results = unzip(targetZip, destDir);
  console.log('Extracted', results.length, 'images to', destDir);
} catch (err) {
  console.error('Error during extraction:', err.message);
}
