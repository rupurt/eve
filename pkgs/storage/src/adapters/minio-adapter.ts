import { Adapter } from './adapter.js';

/**
 * MinIOAdapterConfig
 */
type MinIOAdapterConfig = {
  keyFilename: string;
  projectId: string;
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
