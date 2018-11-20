import crossSpawn from 'cross-spawn';
import path from 'path';
import { os } from 'js-info';

export default async function pip(args) {
  if (!Array.isArray(args)) args = [args];
  const pip = path.resolve(
    __dirname,
    '../env',
    os.win ? 'Scripts/pip.exe' : 'bin/pip'
  );
  return new Promise((resolve, reject) => {
    const cp = crossSpawn(pip, args, {
      stdio: 'inherit'
    });
    cp.on('close', resolve);
    cp.on('error', reject);
  });
}
