#!/usr/bin/env node

function main() {
  require('../lib/pip').default(process.args.slice(2));
}

if (typeof require !== 'undefined' && require.main === module) main();
