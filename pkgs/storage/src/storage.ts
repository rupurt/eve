import type { LocalAdapterOptions } from './adapters/local-adapter.js';
import type { GCSAdapterOptions } from './adapters/gcs-adapter.js';
import type { S3AdapterOptions } from './adapters/s3-adapter.js';
import type { R2AdapterOptions } from './adapters/r2-adapter.js';
import type { MinIOAdapterOptions } from './adapters/minio-adapter.js';
import { Adapter } from './adapters/adapter.js';

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
 * LocalStorageOptions
 */
type LocalStorageOptions = LocalAdapterOptions & {
  type: StorageType.LOCAL;
};

/**
 * GCSStorageOptions
 */
type GCSStorageOptions = GCSAdapterOptions & {
  type: StorageType.GCS;
};

/**
 * S3StorageOptions
 */
type S3StorageOptions = S3AdapterOptions & {
  type: StorageType.S3;
};

/**
 * R2StorageOptions
 */
type R2StorageOptions = R2AdapterOptions & {
  type: StorageType.R2;
};

/**
 * MinIOStorageOptions
 */
type MinIOStorageOptions = MinIOAdapterOptions & {
  type: StorageType.MINIO;
};

/**
 * StorageOptions
 */
type StorageOptions =
  | LocalStorageOptions
  | GCSStorageOptions
  | S3StorageOptions
  | R2StorageOptions
  | MinIOStorageOptions;

/**
 * StorageContainer
 */
class StorageContainer {
  private _adapter: Adapter;

  constructor(adapter: Adapter) {
    this._adapter = adapter;
  }

  init() {
    this._adapter.init();
  }
}

/**
 * Storage
 */
async function Storage(opts: StorageOptions): Promise<StorageContainer> {
  const { Adapter } = await import(`./adapters/${opts.type}-adapter.js`);
  const adapter: Adapter = new Adapter(opts);
  return new StorageContainer(adapter);
}

export {
  StorageType,
  LocalStorageOptions,
  GCSStorageOptions,
  S3StorageOptions,
  R2StorageOptions,
  MinIOStorageOptions,
  StorageOptions,
  StorageContainer,
  Storage,
};
