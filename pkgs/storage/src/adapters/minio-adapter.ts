import { Adapter } from './adapter.js';

/**
 * MinIOAdapterConfig
 */
type MinIOAdapterConfig = {
  bucketName: string;
  targetPathPrefix: string;
};

/**
 * MinIOAdapter
 */
class MinIOAdapter extends Adapter {
  private _config: MinIOAdapterConfig;

  constructor(config: MinIOAdapterConfig) {
    super();
    this._config = config;
  }
}

export { MinIOAdapterConfig, MinIOAdapter };
