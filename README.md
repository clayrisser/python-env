# python-env

[![GitHub stars](https://img.shields.io/github/stars/codejamninja/python-env.svg?style=social&label=Stars)](https://github.com/codejamninja/python-env)

> Cross platform isolated embedded python environment for npm

Please ★ this repo if you found it useful ★ ★ ★


## Features

* Isolated environment
* Embdedded environment


## Installation

This package is not intended to be used as a global dependancy.

```sh
npm install --save python-env
```


## Dependencies

* [Python](https://python.org)
* [NodeJS](https://nodejs.org)


## Usage

_script.js_
```js
import path from 'path';
import { python, pip } from 'python-env';

pip(['install', '-r', path.resolve(__dirname, 'requirements.txt')]).then(async () => {
  await python([path.resolve(__dirname, 'script.py')]);
});
```

_package.json_
```sh
{
  "scripts": {
    "python:shell": "npm run python-env",
    "python:version": "npm run python-env -- --version"
  }
}
```


## Support

Submit an [issue](https://github.com/codejamninja/python-env/issues/new)


## Screenshots

[Contribute](https://github.com/codejamninja/python-env/blob/master/CONTRIBUTING.md) a screenshot


## Contributing

Review the [guidelines for contributing](https://github.com/codejamninja/python-env/blob/master/CONTRIBUTING.md)


## License

[MIT License](https://github.com/codejamninja/python-env/blob/master/LICENSE)

[Jam Risser](https://codejam.ninja) © 2018


## Changelog

Review the [changelog](https://github.com/codejamninja/python-env/blob/master/CHANGELOG.md)


## Credits

* [Jam Risser](https://codejam.ninja) - Author


## Support on Liberapay

A ridiculous amount of coffee ☕ ☕ ☕ was consumed in the process of building this project.

[Add some fuel](https://liberapay.com/codejamninja/donate) if you'd like to keep me going!

[![Liberapay receiving](https://img.shields.io/liberapay/receives/codejamninja.svg?style=flat-square)](https://liberapay.com/codejamninja/donate)
[![Liberapay patrons](https://img.shields.io/liberapay/patrons/codejamninja.svg?style=flat-square)](https://liberapay.com/codejamninja/donate)
