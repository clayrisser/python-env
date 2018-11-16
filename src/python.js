import crossSpawn from 'cross-spawn';
import path from 'path';

export default async function python(args) {
  return crossSpawn(path.resolve(__dirname, '../env/bin/python'), args, {
    stdio: 'inherit'
  });
}
