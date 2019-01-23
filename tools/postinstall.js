const crossSpawn = require('cross-spawn');
const path = require('path');

function main() {
  const libPath = path.resolve(__dirname, '../lib');
  crossSpawn('node', [libPath], {
    stdio: 'inherit'
  });
}

if (typeof require !== 'undefined' && require.main === module) main();
