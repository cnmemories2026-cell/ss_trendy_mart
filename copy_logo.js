// Utility script to copy uploaded image if needed
const fs = require('fs');
const path = require('path');

const srcPath = 'C:/Users/chand/.gemini/antigravity/brain/df08dbce-a8b6-440c-b365-2bc92cbe4d32/.user_uploaded/media_1787204862865.jpg';
const destPublic = path.join(__dirname, 'public', 'logo.jpg');

try {
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPublic);
    console.log('Successfully copied logo to:', destPublic);
  } else {
    console.log('Source path not found:', srcPath);
  }
} catch (err) {
  console.error('Copy error:', err);
}
