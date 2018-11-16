import crossSpawn from 'cross-spawn';
import path from 'path';

export default async function pip(args) {
  if (!Array.isArray(args)) args = [args];
  return crossSpawn(path.resolve(__dirname, '../env/bin/pip'), args, {
    stdio: 'inherit'
  });
}
