const { spawn } = require('child_process');
const path = require('path');

const k6Bin = process.env.K6_BIN || (process.platform === 'win32' ? 'C:\\Program Files\\k6\\k6.exe' : 'k6');
const scriptPath = path.join(__dirname, '..', 'k6', 'smoke-test.js');

const child = spawn(k6Bin, ['run', scriptPath], {
  stdio: 'inherit',
  shell: false,
});

child.on('error', (error) => {
  console.error(`Failed to start k6: ${error.message}`);
  process.exit(1);
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
