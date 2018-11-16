import crossSpawn from 'cross-spawn';
import path from 'path';

async function main() {
  await crossSpawn(
    path.resolve(__dirname, '../env/bin/python'),
    process.argv.slice(2),
    { stdio: 'inherit' }
  );
}

main();
