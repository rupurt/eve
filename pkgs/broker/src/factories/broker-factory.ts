import { StorageConfig, StorageType } from '@evereactor/storage';

import { Logger } from '../logger.js';
import { Broker } from '../broker.js';

class BrokerFactory {
  static create(): Broker {
    return new Broker(DEFAULT_BROKER_CONFIG);
  }
}

const DEFAULT_STORAGE_CONFIG: StorageConfig = {
  type: StorageType.LOCAL,
  directory: 'eve-test-instance',
};
const DEFAULT_LOGGER = Logger({
  enabled: process.env.LOG_ENABLED == 'true',
  level: process.env.LOG_LEVEL || 'trace',
});
const DEFAULT_HTTP_CONFIG = {
  host: '[::]',
  port: 18080,
  logger: DEFAULT_LOGGER,
};
const DEFAULT_BROKER_CONFIG = {
  storage: DEFAULT_STORAGE_CONFIG,
  http: DEFAULT_HTTP_CONFIG,
  logger: DEFAULT_LOGGER,
};

export { BrokerFactory };
