import { Readable } from 'node:stream';

import {
  Adapter,
  GCSAdapter,
  GCSAdapterConfig,
  LocalAdapter,
  LocalAdapterConfig,
  MinIOAdapter,
  MinIOAdapterConfig,
  R2Adapter,
  R2AdapterConfig,
  S3Adapter,
  S3AdapterConfig,
} from './adapters/index.js';
import { NotImplementedError } from './errors.js';

/**
 * StorageType
 */
enum StorageType {
  LOCAL = 'local',
  GCS = 'gcs',
  S3 = 's3',
  R2 = 'r2',
  MINIO = 'minio',
}

/**
 * LocalStorageConfig
 */
type LocalStorageConfig = LocalAdapterConfig & {
  type: StorageType.LOCAL;
};

/**
 * GCSStorageConfig
 */
type GCSStorageConfig = GCSAdapterConfig & {
  type: StorageType.GCS;
};

/**
 * S3StorageConfig
 */
type S3StorageConfig = S3AdapterConfig & {
  type: StorageType.S3;
};

/**
 * R2StorageConfig
 */
type R2StorageConfig = R2AdapterConfig & {
  type: StorageType.R2;
};

/**
 * MinIOStorageConfig
 */
type MinIOStorageConfig = MinIOAdapterConfig & {
  type: StorageType.MINIO;
};

/**
 * StorageConfig
 */
type StorageConfig =
  | LocalStorageConfig
  | GCSStorageConfig
  | S3StorageConfig
  | R2StorageConfig
  | MinIOStorageConfig;

/**
 * StorageContainer
 */
class StorageContainer {
  private _adapter: Adapter;

  constructor(adapter: Adapter) {
    this._adapter = adapter;
  }

  init(): ReturnType<Adapter['init']> {
    return this._adapter.init();
  }

  listBuckets(): ReturnType<Adapter['listBuckets']> {
    return this._adapter.listBuckets();
  }

  getFiles(bucketName: string): ReturnType<Adapter['getFiles']> {
    return this._adapter.getFiles(bucketName);
  }

  fileExists(
    bucketName: string,
    fileName: string,
  ): ReturnType<Adapter['fileExists']> {
    return this._adapter.fileExists(bucketName, fileName);
  }

  downloadFile(
    bucketName: string,
    fileName: string,
    targetPath: string,
  ): ReturnType<Adapter['downloadFile']> {
    return this._adapter.downloadFile(bucketName, fileName, targetPath);
  }

  writeStream(
    bucketName: string,
    artifact: Buffer | Readable,
    targetPath: string,
  ): Promise<string> {
    return this._adapter.writeStream(bucketName, artifact, targetPath);
  }
}

/**
 * Storage
 */
function Storage(config: StorageConfig): StorageContainer {
  let adapter: Adapter;

  switch (config.type) {
    case StorageType.LOCAL: {
      adapter = new LocalAdapter(config);
      break;
    }
    case StorageType.S3: {
      adapter = new S3Adapter(config);
      break;
    }
    case StorageType.GCS: {
      adapter = new GCSAdapter(config);
      break;
    }
    case StorageType.MINIO: {
      adapter = new MinIOAdapter(config);
      break;
    }
    case StorageType.R2: {
      adapter = new R2Adapter(config);
      break;
    }
    default: {
      throw new NotImplementedError('storage adapter not implemented');
    }
  }

  return new StorageContainer(adapter);
}

export {
  StorageType,
  LocalStorageConfig,
  GCSStorageConfig,
  S3StorageConfig,
  R2StorageConfig,
  MinIOStorageConfig,
  StorageConfig,
  StorageContainer,
  Storage,
};
