import { StorageType } from '@evereactor/storage';

import { BrokerStorage, BrokerStorageConfig } from '../broker-storage.js';

class BrokerStorageFactory {
  static createLocal(opts: BrokerStorageFactoryLocalConfig): BrokerStorage {
    const config: BrokerStorageConfig = {
      type: StorageType.LOCAL,
      directory: opts.directory,
      bucketName: opts.bucketName,
    };
    return new BrokerStorage(config);
  }

  static createGCS(opts: BrokerStorageFactoryGCSConfig): BrokerStorage {
    const config: BrokerStorageConfig = {
      type: StorageType.GCS,
      projectId: opts.projectId,
      bucketName: opts.bucketName,
      keyFilename: opts.keyFilename || 'gcp_service_account.json',
    };
    return new BrokerStorage(config);
  }
}

type BrokerStorageFactoryLocalConfig = {
  directory: string;
  bucketName: string;
};

type BrokerStorageFactoryGCSConfig = {
  projectId: string;
  bucketName: string;
  keyFilename?: string;
};

export {
  BrokerStorageFactory,
  BrokerStorageFactoryLocalConfig,
  BrokerStorageFactoryGCSConfig,
};
