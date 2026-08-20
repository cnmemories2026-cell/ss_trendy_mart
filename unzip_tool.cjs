const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function unzip(zipFilePath, destDir) {
  console.log('Reading zip file:', zipFilePath);
  if (!fs.existsSync(zipFilePath)) {
    throw new Error('Zip file not found: ' + zipFilePath);
  }

  const buf = fs.readFileSync(zipFilePath);
  console.log('Zip file size:', buf.length, 'bytes');

  // Find End of Central Directory (EOCD) signature: 0x06054b50
  let eocdOffset = -1;
  for (let i = buf.length - 22; i >= 0; i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) {
      eocdOffset = i;
      break;
    }
  }

  if (eocdOffset === -1) {
    throw new Error('EOCD signature not found');
  }

  const totalEntries = buf.readUInt16LE(eocdOffset + 10);
  const cdOffset = buf.readUInt32LE(eocdOffset + 16);
  console.log(`Found ${totalEntries} entries in Central Directory`);

  let currentCdOffset = cdOffset;
  const rawEntries = [];

  for (let i = 0; i < totalEntries; i++) {
    if (buf.readUInt32LE(currentCdOffset) !== 0x02014b50) {
      throw new Error(`Invalid Central Directory signature at ${currentCdOffset}`);
    }

    const compressionMethod = buf.readUInt16LE(currentCdOffset + 10);
    const compressedSize = buf.readUInt32LE(currentCdOffset + 20);
    const uncompressedSize = buf.readUInt32LE(currentCdOffset + 24);
    const fileNameLen = buf.readUInt16LE(currentCdOffset + 28);
    const extraLen = buf.readUInt16LE(currentCdOffset + 30);
    const commentLen = buf.readUInt16LE(currentCdOffset + 32);
    const localHeaderOffset = buf.readUInt32LE(currentCdOffset + 42);

    const fileName = buf.toString('utf8', currentCdOffset + 46, currentCdOffset + 46 + fileNameLen);
    currentCdOffset += 46 + fileNameLen + extraLen + commentLen;

    // Skip directories
    if (fileName.endsWith('/') || fileName.endsWith('\\')) {
      continue;
    }

    // Read local header
    if (buf.readUInt32LE(localHeaderOffset) !== 0x04034b50) {
      throw new Error(`Invalid Local Header signature at ${localHeaderOffset}`);
    }
    const localFileNameLen = buf.readUInt16LE(localHeaderOffset + 26);
    const localExtraLen = buf.readUInt16LE(localHeaderOffset + 28);
    const dataOffset = localHeaderOffset + 30 + localFileNameLen + localExtraLen;

    const compressedData = buf.subarray(dataOffset, dataOffset + compressedSize);
    let fileData;
    if (compressionMethod === 0) {
      fileData = compressedData;
    } else if (compressionMethod === 8) {
      fileData = zlib.inflateRawSync(compressedData);
    } else {
      throw new Error(`Unsupported compression method: ${compressionMethod}`);
    }

    rawEntries.push({
      originalName: path.basename(fileName),
      fullName: fileName,
      data: fileData,
      size: fileData.length
    });
  }

  // Sort entries naturally (e.g. page_1, page_2, ... page_10)
  rawEntries.sort((a, b) => {
    return a.originalName.localeCompare(b.originalName, undefined, { numeric: true, sensitivity: 'base' });
  });

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const results = [];
  rawEntries.forEach((entry, idx) => {
    const ext = path.extname(entry.originalName) || '.jpg';
    const sequentialName = `page_${idx + 1}${ext}`;
    const preservedName = entry.originalName;
    
    // Save with sequential name
    const seqDestPath = path.join(destDir, sequentialName);
    fs.writeFileSync(seqDestPath, entry.data);

    // Also save with original name if different
    const origDestPath = path.join(destDir, preservedName);
    if (origDestPath !== seqDestPath) {
      fs.writeFileSync(origDestPath, entry.data);
    }

    results.push({
      index: idx + 1,
      fileName: sequentialName,
      originalName: preservedName,
      publicPath: `/products/${sequentialName}`,
      originalPublicPath: `/products/${preservedName}`,
      sizeBytes: entry.size
    });
  });

  // Write JSON report
  const reportPath = path.join(destDir, 'products_list.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2), 'utf8');

  // Also write to public/products.json
  const publicJsonPath = path.join(destDir, '..', 'products_list.json');
  fs.writeFileSync(publicJsonPath, JSON.stringify(results, null, 2), 'utf8');

  const relativePaths = results.map(r => r.publicPath);
  const jsonOutput = JSON.stringify(relativePaths, null, 2);
  fs.writeFileSync(path.join(destDir, 'extracted_paths.json'), jsonOutput, 'utf8');

  console.log(`Successfully extracted ${results.length} files to ${destDir}`);
  return results;
}

// Execute if run directly
try {
  const zipPath = 'C:/Users/chand/Downloads/ilovepdf_pages-to-jpg.zip';
  const targetDir = 'c:/Users/chand/OneDrive/Desktop/ss trendy mart/public/products';
  const results = unzip(zipPath, targetDir);
  console.log('RESULT_JSON_START');
  console.log(JSON.stringify(results.map(r => r.publicPath), null, 2));
  console.log('RESULT_JSON_END');
} catch (err) {
  console.error('Error during unzip:', err);
}

module.exports = { unzip };
