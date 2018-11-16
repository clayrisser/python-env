import Virtualenv from './virtualenv';
import python from './python';
import pip from './pip';

async function main() {
  const virtualenv = new Virtualenv({});
  await virtualenv.init();
}

if (typeof require !== 'undefined' && require.main === module) main();

export { Virtualenv, python, pip };
export default { Virtualenv, python, pip };
