import Err from 'err';
import crossSpawn from 'cross-spawn';
import fetch from 'fetch-everywhere';
import fs from 'fs';
import glob from 'glob';
import ora from 'ora';
import path from 'path';
import tar from 'tar';

export default class Virtualenv {
  constructor({
    virtualenvVersion = '16.1.0',
    version = '3',
    output = path.resolve(__dirname, '..'),
    spinner = true
  }) {
    this.downloadPath = path.resolve(output, 'virtualenv.tar.gz');
    this.output = output;
    this.version = version;
    this.virtualenvVersion = virtualenvVersion;
    this.spinner = ora();
    if (!spinner) {
      this.spinner.start = f => f;
      this.spinner.stop = f => f;
      this.spinner.succeed = f => f;
    }
  }

  async init() {
    this.spinner.start('downloading virtualenv');
    await this.download();
    this.spinner.succeed('downloaded virtualenv');
    this.spinner.start('extracting virtualenv');
    this.installerPath = await this.extract();
    this.spinner.succeed('extracted virtualenv');
    await this.env();
  }

  async download() {
    const res = await fetch(
      `https://github.com/pypa/virtualenv/tarball/${this.virtualenvVersion}`
    );
    if (!res.ok) {
      throw new Err(
        `failed to get virtualenv '${this.virtualenvVersion}'`,
        res.status
      );
    }
    const stream = fs.createWriteStream(this.downloadPath);
    await new Promise((resolve, reject) => {
      res.body.pipe(stream);
      res.body.on('err', reject);
      res.body.on('finish', resolve);
    });
  }

  async extract() {
    await tar
      .extract({
        cwd: this.output,
        file: this.downloadPath,
        strict: false
      })
      .catch(err => {
        if (err.message.indexOf('zlib: unexpected end of file') <= -1) {
          throw err;
        }
      });
    return new Promise((resolve, reject) => {
      glob(path.resolve(this.output, 'pypa-virtualenv-*'), {}, (err, files) => {
        if (err) return reject(err);
        if (!files || !files.length) return resolve(null);
        return resolve(files[0]);
      });
    });
  }

  async env() {
    await crossSpawn(
      'python',
      [
        path.resolve(this.installerPath, 'src/virtualenv.py'),
        ...(this.version === '3' ? ['-p', 'python3'] : []),
        'env'
      ],
      { stdio: 'inherit' }
    );
  }
}
