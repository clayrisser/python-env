const crossSpawn = require('cross-spawn');
const fs = require('fs-extra');
const path = require('path');

function main() {
  const libPath = path.resolve(__dirname, '../lib')
  crossSpawn('node', [libPath], {
    stdio: 'inherit'
  });
}

if (typeof require !== 'undefined' && require.main === module) main();
