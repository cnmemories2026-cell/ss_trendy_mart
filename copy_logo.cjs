const fs = require('fs');
const path = require('path');

const src = 'C:/Users/chand/.gemini/antigravity/brain/a34f9639-09bb-4036-8430-167eb5d2a829/.user_uploaded/media_1787203872270.jpg';
const dest = path.join(__dirname, 'public', 'logo.jpg');

try {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log('Successfully copied logo to public/logo.jpg');
  } else {
    console.log('Logo src file not found');
  }
} catch (e) {
  console.error('Error copying logo:', e);
}
