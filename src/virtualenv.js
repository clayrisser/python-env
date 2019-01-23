import Err from 'err';
import crossSpawn from 'cross-spawn';
import fetch from 'fetch-everywhere';
import fs from 'fs';
import glob from 'glob';
import ora from 'ora';
import path from 'path';
import pkgDir from 'pkg-dir';
import tar from 'tar';
import { os } from 'js-info';

const { env } = process;

export default class Virtualenv {
  constructor({
    virtualenvVersion = '16.1.0',
    version = '2',
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

  get minicondaInstaller() {
    if (os.win) {
      if (os.win64) {
        return 'https://repo.anaconda.com/miniconda/Miniconda3-latest-Windows-x86_64.exe';
      }
      return 'https://repo.anaconda.com/miniconda/Miniconda3-latest-Windows-x86.exe';
    }
    return '';
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
    return null;
  }

  async ensurePython() {
    if (os.win) {
      const pythonPath = path.resolve(env.USERPROFILE, 'Miniconda3/python.exe');
      if (fs.existsSync(pythonPath)) return pythonPath;
      if (!fs.existsSync(path.resolve(this.output, 'miniconda.exe'))) {
        this.spinner.start('downloading miniconda');
        const res = await fetch(this.minicondaInstaller);
        if (!res.ok) throw new Err('failed to download miniconda', res.status);
        const stream = fs.createWriteStream(
          path.resolve(this.output, 'miniconda.exe')
        );
        await new Promise((resolve, reject) => {
          res.body.pipe(stream);
          res.body.on('err', reject);
          res.body.on('finish', resolve);
        });
        await new Promise(r => setTimeout(r, 1000));
        this.spinner.succeed('downloaded miniconda');
      }
      this.spinner.start('installing miniconda');
      await new Promise((resolve, reject) => {
        const cp = crossSpawn(
          path.resolve(this.output, 'miniconda.exe'),
          [
            '/InstallationType=JustMe',
            '/RegisterPython=0',
            '/S',
            `/D=${path.resolve(env.USERPROFILE, 'Miniconda3')}`
          ],
          { stdio: 'inherit' }
        );
        cp.on('close', resolve);
        cp.on('error', reject);
      });
      this.spinner.succeed('installed miniconda');
      return pythonPath;
    }
    return null;
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
      glob(path.resolve(this.output, 'pypa-virtualenv-*'), {}, (err, files) => {
        if (err) return reject(err);
        if (!files || !files.length) return resolve(null);
        return resolve(files[0]);
      });
    });
  }

  async env(pythonPath) {
    const virtualenvPath = await this.getVirtualenvPath();
    return new Promise((resolve, reject) => {
      const cp = crossSpawn(
        pythonPath || 'python',
        [
          path.resolve(virtualenvPath, 'src/virtualenv.py'),
          ...(!os.win && this.version === '3' ? ['-p', 'python3'] : []),
          'env'
        ],
        { stdio: 'inherit' }
      );
      cp.on('close', resolve);
      cp.on('error', reject);
    });
  }
}
