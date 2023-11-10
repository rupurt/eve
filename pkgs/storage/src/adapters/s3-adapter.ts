import { Adapter } from './adapter.js';

/**
 * S3AdapterConfig
 */
type S3AdapterConfig = {
  bucketName: string;
  targetPathPrefix: string;
};

/**
 * S3Adapter
 */
class S3Adapter extends Adapter {
  private _config: S3AdapterConfig;

  constructor(config: S3AdapterConfig) {
    super();
    this._config = config;
  }
}

export { S3AdapterConfig, S3Adapter };
