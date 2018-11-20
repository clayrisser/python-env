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
    this.spinner.start('downloading virtualenv');
    await this.download();
    this.spinner.succeed('downloaded virtualenv');
    this.spinner.start('extracting virtualenv');
    this.installerPath = await this.extract();
    this.spinner.succeed('extracted virtualenv');
    const pythonPath = await this.installPython();
    await this.env(pythonPath);
  }

  async installPython() {
    if (os.win) {
      let pythonDownload = 'https://www.python.org/ftp/python/3.7.1/python-3.7.1-embed-win32.zip';
      if (os.win64) {
        pythonDownload = 'https://www.python.org/ftp/python/3.7.1/python-3.7.1-embed-amd64.zip';
      }
      const res = await fetch(pythonDownload);
      if (!res.ok) throw new Err('failed to get python', res.status);
      const stream = fs.createWriteStream(path.resolve(this.output, 'python3.zip'));
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
      return path.resolve(this.output, 'python3/python.exe');
    }
      const hasPython = await new Promise((resolve, reject) => {
        const cp = crossSpawn('where python')
        let message = ''
        cp.stdout.on('data', (data) => {
          message += data.toString();
        });
        cp.on('close', () => {
          return resolve(message);
        });
        cp.on('error', () => {
          return resolve(null);
        });
      });
      if (hasPython) return null;
      const pythonPath = path.resolve(
        env.USERPROFILE,
        '.windows-build-tools/python27/python.exe'
      );
      if (fs.existsSync(pythonPath)) return null;
      this.spinner.start('installing python');
      crossSpawn(
        'call',
        [
          path.resolve(__dirname, '../tools/elevate.bat'),
          'npm\ install\ --global\ --production\ windows-build-tools'
        ]
      );
      let installed = false;
      while(!installed) {
        if (fs.existsSync(pythonPath)) {
          await new Promise(r => setTimeout(r, 1000));
          installed = true;
        }
      }
      await new Promise(r => setTimeout(r, 5000));
      this.spinner.succeed('installed python');
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
    return new Promise((resolve, reject) => {
      glob(path.resolve(this.output, 'pypa-virtualenv-*'), {}, (err, files) => {
        if (err) return reject(err);
        if (!files || !files.length) return resolve(null);
        return resolve(files[0]);
      });
    });
  }

  async env(pythonPath) {
    return crossSpawn(
      pythonPath || 'python',
      [
        path.resolve(this.installerPath, 'src/virtualenv.py'),
        ...(!os.win && this.version === '3' ? ['-p', 'python3'] : []),
        'env'
      ],
      { stdio: 'inherit' }
    );
  }
}
