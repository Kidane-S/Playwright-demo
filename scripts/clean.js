const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const targets = [
  path.join(root, 'playwright-report'),
  path.join(root, 'test-results'),
  path.join(root, 'blob-report'),
  path.join(root, 'test-output.txt'),
  path.join(root, 'test-output-utf8.txt'),
  path.join(root, 'playwright', '.cache'),
  path.join(root, 'playwright', '.auth'),
];

for (const target of targets) {
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
    console.log(`Removed ${path.relative(root, target)}`);
  }
}

console.log('Cleanup complete');
