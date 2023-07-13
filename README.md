# python-env

[![GitHub stars](https://img.shields.io/github/stars/codejamninja/python-env.svg?style=social&label=Stars)](https://github.com/codejamninja/python-env)

> Cross platform isolated embedded python environment for npm

![](assets/python-env.png)

Please ★ this repo if you found it useful ★ ★ ★


## Features

* Isolated embedded python environment
* Call into python from node
* Works on MacOS, Linux and Microsoft Windows 32 and 64 bit


## Installation

This package is not intended to be used as a global dependancy.

_Python 3_
```sh
npm install --save python-env
```

_Python 2_
```sh
npm install --save python-env@python2
```


## Dependencies

* [Python](https://python.org)
* [NodeJS](https://nodejs.org)


## Usage

_script.js_
```js
import { python, pip } from 'python-env';

async function main() {
  await pip(['install', '-r', 'requirements.txt']);
  await python(['script.py']);
}

main();
```

_package.json_
```sh
{
  "scripts": {
    "pip:install": "python-pip install -r requirements.txt",
    "python:script": "python-env src/script.py",
    "python:shell": "python-env",
    "python:version": "python-env --version"
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
