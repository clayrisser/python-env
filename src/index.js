import Virtualenv from './virtualenv';

async function main() {
  const virtualenv = new Virtualenv({});
  await virtualenv.init();
}

if (typeof require !== 'undefined' && require.main === module) main();

export { Virtualenv };
export default { Virtualenv };
