const { execSync } = require('child_process');
const fs = require('fs');
try {
  const out = execSync('node node_modules/typescript/bin/tsc -b', { encoding: 'utf8' });
  fs.writeFileSync('tsc_out.log', out || 'No errors.');
} catch (e) {
  fs.writeFileSync('tsc_out.log', (e.stdout || '') + '\n' + (e.stderr || ''));
}
