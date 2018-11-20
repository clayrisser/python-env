import crossSpawn from 'cross-spawn';
import path from 'path';

export default async function pip(args) {
  if (!Array.isArray(args)) args = [args];
  return new Promise((resolve, reject) => {
    const cp = crossSpawn(path.resolve(__dirname, '../env/bin/pip'), args, {
      stdio: 'inherit'
    });
    cp.on('close', resolve);
    cp.on('error', reject);
  });
}
