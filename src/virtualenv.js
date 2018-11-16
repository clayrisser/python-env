import Err from 'err';
import ora from 'ora';
import fetch from 'fetch-everywhere';
import fs from 'fs';
import path from 'path';
import tar from 'tar';

export default class Virtualenv {
  constructor({
    version = '16.1.0',
    output = path.resolve(__dirname, '..'),
    spinner = true
  }) {
    this.downloadPath = path.resolve(output, 'virtualenv.tar.gz');
    this.output = output;
    this.version = version;
    this.spinner = ora();
    if (!spinner) {
      this.spinner.start = f => f;
      this.spinner.succeed = f => f;
    }
  }

  async init() {
    this.spinner.start('downloading virtualenv');
    await this.download();
    this.spinner.succeed('downloaded virtualenv');
    this.spinner.start('extracting virtualenv');
    await this.extract();
    this.spinner.succeed('extracted virtualenv');
  }

  async download() {
    const res = await fetch(
      `https://github.com/pypa/virtualenv/tarball/${this.version}`
    );
    if (!res.ok) {
      throw new Err(`failed to get virtualenv '${this.version}'`, res.status);
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
  }
}
