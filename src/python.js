import crossSpawn from 'cross-spawn';
import path from 'path';
import { os } from 'js-info';

export default async function python(args) {
  if (!Array.isArray(args)) args = [args];
  const python = path.resolve(
    __dirname,
    '../env',
    os.win ? 'Scripts/python.exe' : 'bin/python'
  );
  return new Promise((resolve, reject) => {
    const cp = crossSpawn(python, args, {
      stdio: 'inherit'
    });
    cp.on('close', resolve);
    cp.on('error', reject);
  });
}
