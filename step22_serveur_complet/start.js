import { spawn } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nodemon = spawn('nodemon', ['app.js'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

nodemon.on('close', (code) => {
  process.exit(code);
});