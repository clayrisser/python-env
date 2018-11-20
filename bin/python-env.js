#!/usr/bin/env node

require('idempotent-babel-polyfill');

function main() {
  require('../lib/python').default(process.argv.slice(2));
}

if (typeof require !== 'undefined' && require.main === module) main();
