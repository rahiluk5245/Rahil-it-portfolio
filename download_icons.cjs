const https = require('https');
const fs = require('fs');
const path = require('path');

const icons = [
  { name: 'windows.svg', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/windows8/windows8-original.svg' },
  { name: 'azure.svg', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azure/azure-original.svg' },
  { name: 'sqlserver.svg', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/microsoftsqlserver/microsoftsqlserver-plain.svg' },
  { name: 'powershell.svg', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/powershell/powershell-original.svg' },
  { name: 'linux.svg', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg' },
  { name: 'network.svg', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/networkx/networkx-original.svg' },
  { name: 'amazon.svg', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg' },
  { name: 'trello.svg', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/trello/trello-original.svg' }
];

const destDir = path.join(__dirname, 'public', 'images', 'it-icons');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

Promise.all(icons.map(icon => {
  return new Promise((resolve, reject) => {
    const dest = path.join(destDir, icon.name);
    const file = fs.createWriteStream(dest);
    https.get(icon.url, response => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', err => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
})).then(() => {
  console.log('All icons downloaded successfully.');
}).catch(err => {
  console.error('Error downloading icons:', err);
});
