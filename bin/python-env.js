#!/usr/bin/env node

function main() {
  require('../lib/python').default(process.argv.slice(2));
}

if (typeof require !== 'undefined' && require.main === module) main();
