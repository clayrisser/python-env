import path from 'path';
import { python, pip } from 'python-env';

async function main() {
  await pip(['install', '-r', path.resolve(__dirname, 'requirements.txt')]);
  await python(path.resolve(__dirname, 'script.py'));
}

if (typeof require !== 'undefined' && require.main === module) main();
