import { resolve } from 'node:path';
import { createWriteStream, createReadStream } from 'node:fs';
import { mkdir, readdir, access, constants } from 'node:fs/promises';
import { Readable } from 'node:stream';

import { NotImplementedError } from '../errors.js';
import { Bucket } from '../bucket.js';
import { BucketFile } from '../bucket-file.js';
import { Adapter, GetFilesOptions } from './adapter.js';

/**
 * LocalAdapterConfig
 */
type LocalAdapterConfig = {
  directory: string;
};

/**
 * LocalAdapter
 */
class LocalAdapter extends Adapter {
  private _config: LocalAdapterConfig;

  constructor(config: LocalAdapterConfig) {
    super();
    this._config = config;
  }

  async init(): Promise<void> {
    await mkdir(this._config.directory, { recursive: true });
  }

  async listBuckets(): Promise<Bucket[]> {
    const files = await readdir(this._config.directory, {
      withFileTypes: true,
    });
    const directories = files.filter((f) => f.isDirectory());
    return directories.map((d) => ({ name: d.name }));
  }

  async getFiles(
    bucketName: string,
    _query?: GetFilesOptions,
  ): Promise<BucketFile[]> {
    const files = await readdir(`${this._config.directory}/${bucketName}`, {
      withFileTypes: true,
    });
    const filesWithoutDirectories = files.filter((f) => !f.isDirectory());
    return filesWithoutDirectories.map((f) => ({ name: f.name, source: f }));
  }

  async fileExists(bucketName: string, fileName: string): Promise<boolean> {
    const filePath = `${this._config.directory}/${bucketName}/${fileName}`;
    return access(filePath, constants.F_OK)
      .then(() => true)
      .catch(() => false);
  }

  async downloadFile(
    bucketName: string,
    fileName: string,
    targetPath: string,
  ): Promise<void> {
    const readStream = createReadStream(
      resolve(`${this._config.directory}/${bucketName}/${fileName}`),
    );
    const writeStream = createWriteStream(resolve(targetPath));

    return new Promise((resolve, reject) => {
      writeStream.on('error', reject);

      readStream
        .pipe(writeStream)
        .on('error', reject)
        .on('finish', () => {
          resolve();
        });
    });
  }

  async writeStream(
    bucketName: string,
    artifact: Buffer | Readable,
    targetPath: string,
  ): Promise<string> {
    let readStream: Readable;

    if (artifact instanceof Buffer) {
      readStream = new Readable();
      readStream.push(artifact);
      readStream.push(null);
    } else if (artifact instanceof Readable) {
      readStream = artifact;
    } else {
      throw new NotImplementedError('artifact type not supported');
    }

    const writeFilePath = `${this._config.directory}/${bucketName}/${targetPath}`;
    const writeStream = createWriteStream(writeFilePath);
    return new Promise((resolve, reject) => {
      writeStream.on('error', reject);

      readStream
        .pipe(writeStream)
        .on('error', reject)
        .on('finish', () => {
          resolve(writeFilePath);
        });
    });
  }
}

export { LocalAdapterConfig, LocalAdapter };
