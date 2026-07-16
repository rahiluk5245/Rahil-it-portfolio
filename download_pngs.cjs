const https = require('https');
const fs = require('fs');
const path = require('path');

const icons = [
  { name: 'windows.png', url: 'https://img.icons8.com/color/512/windows-10.png' },
  { name: 'server.png', url: 'https://img.icons8.com/color/512/server.png' },
  { name: 'network.png', url: 'https://img.icons8.com/color/512/wi-fi-router.png' },
  { name: 'support.png', url: 'https://img.icons8.com/color/512/online-support.png' },
  { name: 'laptop.png', url: 'https://img.icons8.com/color/512/laptop.png' },
  { name: 'azure.png', url: 'https://img.icons8.com/color/512/azure.png' },
  { name: 'pos.png', url: 'https://img.icons8.com/color/512/pos-terminal.png' },
  { name: 'office.png', url: 'https://img.icons8.com/color/512/microsoft-office-2019.png' }
];

const destDir = path.join(__dirname, 'public', 'images', 'it-pngs');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

Promise.all(icons.map(icon => {
  return new Promise((resolve, reject) => {
    const dest = path.join(destDir, icon.name);
    const file = fs.createWriteStream(dest);
    https.get(icon.url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    }, response => {
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
  console.log('All PNGs downloaded successfully.');
}).catch(err => {
  console.error('Error downloading PNGs:', err);
});
