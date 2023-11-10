import { resolve } from 'node:path';
import { Readable } from 'node:stream';
// import type { Storage as GCSStorage } from '@google-cloud/storage';
import { Storage as GCSStorage } from '@google-cloud/storage';

import { NotImplementedError, NotInitializedError } from '../errors.js';
import { Bucket } from '../bucket.js';
import { BucketFile } from '../bucket-file.js';
import { Adapter, GetFilesOptions } from './adapter.js';

/**
 * GCSAdapterConfig
 */
type GCSAdapterConfig = {
  keyFilename: string;
  projectId: string;
};

/**
 * GCSAdapter
 */
class GCSAdapter extends Adapter {
  private _config: GCSAdapterConfig;
  private _storage?: GCSStorage;

  constructor(config: GCSAdapterConfig) {
    super();
    this._config = config;
  }

  async init(): Promise<void> {
    // const gcs = await import('@google-cloud/storage');
    this._storage = new GCSStorage({
      keyFilename: this._config.keyFilename,
      projectId: this._config.projectId,
    });
  }

  async listBuckets(): Promise<Bucket[]> {
    if (this._storage) {
      // const [gcsBuckets] = await this._storage.getBuckets();
      const buckets: Bucket[] = [];
      return buckets;
    } else {
      throw new NotInitializedError(
        `${this.constructor.name} is not initialized`,
      );
    }
  }

  async getFiles(
    bucketName: string,
    query?: GetFilesOptions,
  ): Promise<BucketFile[]> {
    if (this._storage) {
      const [gcsFiles] = await this._storage.bucket(bucketName).getFiles(query);

      return gcsFiles.map((f) => {
        return {
          name: f.name,
          source: f,
        };
      });
    } else {
      throw new NotInitializedError(
        `${this.constructor.name} is not initialized`,
      );
    }
  }

  async fileExists(bucketName: string, fileName: string): Promise<boolean> {
    if (this._storage) {
      const [exists] = await this._storage
        .bucket(bucketName)
        .file(fileName)
        .exists();
      return exists;
    } else {
      throw new NotInitializedError(
        `${this.constructor.name} is not initialized`,
      );
    }
  }

  async downloadFile(
    bucketName: string,
    fileName: string,
    targetPath: string,
  ): Promise<void> {
    if (this._storage) {
      const file = this._storage.bucket(bucketName).file(fileName);
      await file.download({ destination: resolve(targetPath) });
    } else {
      throw new NotInitializedError(
        `${this.constructor.name} is not initialized`,
      );
    }
  }

  async writeStream(
    bucketName: string,
    artifact: Buffer | Readable,
    targetPath: string,
  ): Promise<string> {
    if (this._storage) {
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

      const file = this._storage.bucket(bucketName).file(targetPath, {});
      const writeStream = file.createWriteStream();
      return new Promise((resolve, reject) => {
        writeStream.on('error', reject);

        readStream
          .pipe(writeStream)
          .on('error', reject)
          .on('finish', () => {
            resolve(file.publicUrl());
          });
      });
    } else {
      throw new NotInitializedError(
        `${this.constructor.name} is not initialized`,
      );
    }
  }
}

export { GCSAdapterConfig, GCSAdapter };
