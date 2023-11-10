import { Adapter } from './adapter.js';

/**
 * R2AdapterConfig
 */
type R2AdapterConfig = {
  bucketName: string;
  targetPathPrefix: string;
};

/**
 * R2Adapter
 */
class R2Adapter extends Adapter {
  private _config: R2AdapterConfig;

  constructor(config: R2AdapterConfig) {
    super();
    this._config = config;
  }
}

export { R2AdapterConfig, R2Adapter };
