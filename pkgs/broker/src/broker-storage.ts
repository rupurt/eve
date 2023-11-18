import { z } from 'zod';
import { Storage, StorageConfig, StorageContainer } from '@evereactor/storage';

import { CompressionType, Topic } from './models';

/**
 * BrokerStorage
 */
class BrokerStorage {
  private _bucketName: string;
  private _storage: StorageContainer;

  constructor(config: BrokerStorageConfig) {
    this._bucketName = config.bucketName;
    this._storage = Storage(config);
  }

  init(): Promise<void> {
    return this._storage.init();
  }

  createTopic() {
  }

  async listTopics(): Promise<z.infer<typeof Topic>[]> {
    const files = await this._storage.getFiles(this._bucketName);

    return files.map(f => {
      return {
        name: f.name,
        // TODO:
        // - how should I reac this off disk?
        partitions: 1n,
        // TODO:
        // - how should I reac this off disk?
        compression: CompressionType.NONE,
      }
    });
  }
}

/**
 * BrokerStorageConfig
 */
type BrokerStorageConfig = StorageConfig & {
  bucketName: string;
};

export { BrokerStorage, BrokerStorageConfig };
