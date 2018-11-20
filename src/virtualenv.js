import Err from 'err';
import crossSpawn from 'cross-spawn';
import fetch from 'fetch-everywhere';
import fs from 'fs';
import glob from 'glob';
import ora from 'ora';
import path from 'path';
import pkgDir from 'pkg-dir';
import tar from 'tar';
import unzip from 'unzip';
import { os } from 'js-info'

const { env } = process;

export default class Virtualenv {
  constructor({
    virtualenvVersion = '16.1.0',
    version = '3',
    output = path.resolve(pkgDir.sync(__dirname)),
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
    const pythonPath = await this.ensurePython();
    await this.ensureVirtualenv();
    await this.env(pythonPath);
  }

  async ensureVirtualenv() {
    const virtualenvPath = await this.getVirtualenvPath();
    if (fs.existsSync(virtualenvPath)) return null;
    this.spinner.start('downloading virtualenv');
    await this.download();
    this.spinner.succeed('downloaded virtualenv');
    this.spinner.start('extracting virtualenv');
    await this.extract();
    this.spinner.succeed('extracted virtualenv');
  }

  async ensurePython() {
    if (os.win) {
      const pythonPath = path.resolve(this.output, 'python3/python.exe');
      if (fs.existsSync(path.resolve(this.output, 'python3'))) {
        return pythonPath;
      }
      this.spinner.start('downloading python');
      let pythonDownload = 'https://www.python.org/ftp/python/3.7.1/python-3.7.1-embed-win32.zip';
      if (os.win64) {
        pythonDownload = 'https://www.python.org/ftp/python/3.7.1/python-3.7.1-embed-amd64.zip';
      }
      let res = await fetch(pythonDownload);
      if (!res.ok) throw new Err('failed to download python', res.status);
      let stream = fs.createWriteStream(
        path.resolve(this.output, 'python3.zip')
      );
      await new Promise((resolve, reject) => {
        res.body.pipe(stream);
        res.body.on('err', reject);
        res.body.on('finish', resolve);
      });
      await new Promise((resolve, reject) => {
        const stream = fs.createReadStream(
          path.resolve(this.output, 'python3.zip')
        ).pipe(unzip.Extract({
          path: path.resolve(this.output, 'python3')
        }));
        stream.on('close', resolve);
        stream.on('error', reject);
      });
      res = await fetch('https://bootstrap.pypa.io/get-pip.py');
      if (!res.ok) throw new Err('failed to download pip', res.status);
      stream = fs.createWriteStream(
        path.resolve(this.output, 'get-pip.py')
      );
      await new Promise((resolve, reject) => {
        res.body.pipe(stream);
        res.body.on('err', reject);
        res.body.on('finish', resolve);
      });
      this.spinner.succeed('downloaded python');
      await new Promise((resolve, reject) => {
        const cp = crossSpawn(
          pythonPath,
          [
            path.resolve(this.output, 'get-pip.py')
          ],
          { stdio: 'inherit' }
        );
        cp.on('close', resolve);
        cp.on('error', reject);
      });
      return pythonPath;
    }
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
    await new Promise(r => setTimeout(r, 100));
  }

  async getVirtualenvPath() {
    return new Promise((resolve, reject) => {
      glob(path.resolve(
        this.output,
        'pypa-virtualenv-*'
      ), {}, (err, files) => {
        if (err) return reject(err);
        if (!files || !files.length) return resolve(null);
        return resolve(files[0]);
      });
    });
  }

  async env(pythonPath) {
    const virtualenvPath = await this.getVirtualenvPath();
    return crossSpawn(
      pythonPath || 'python',
      [
        path.resolve(virtualenvPath, 'src/virtualenv.py'),
        ...(!os.win && this.version === '3' ? ['-p', 'python3'] : []),
        'env'
      ],
      { stdio: 'inherit' }
    );
  }
}
