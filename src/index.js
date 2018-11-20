import 'idempotent-babel-polyfill';
import Virtualenv from './virtualenv';
import python from './python';
import pip from './pip';

async function main() {
  try {
    const virtualenv = new Virtualenv({});
    await virtualenv.init();
  } catch (err) {
    console.error(err);
  }
}

if (typeof require !== 'undefined' && require.main === module) main();

export { Virtualenv, python, pip };
export default { Virtualenv, python, pip };
