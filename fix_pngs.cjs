const https = require('https');
const fs = require('fs');
const path = require('path');

const icons = [
  { name: 'network.png', url: 'https://img.icons8.com/color/512/wi-fi-connected.png' },
  { name: 'azure.png', url: 'https://img.icons8.com/color/512/cloud.png' }
];

const destDir = path.join(__dirname, 'public', 'images', 'it-pngs');

Promise.all(icons.map(icon => {
  return new Promise((resolve, reject) => {
    const dest = path.join(destDir, icon.name);
    const file = fs.createWriteStream(dest);
    https.get(icon.url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, response => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        https.get(response.headers.location, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res2 => {
          res2.pipe(file);
          file.on('finish', () => { file.close(); resolve(); });
        });
      } else {
        response.pipe(file);
        file.on('finish', () => { file.close(); resolve(); });
      }
    }).on('error', err => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
})).then(() => {
  console.log('Fixed PNGs downloaded.');
});
