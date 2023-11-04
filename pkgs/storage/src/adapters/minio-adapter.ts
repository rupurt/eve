import { Adapter } from './adapter.js';

/**
 * MinIOAdapterOptions
 */
type MinIOAdapterOptions = {
  bucketName: string;
  targetPathPrefix: string;
};

/**
 * MinIOAdapter
 */
class MinIOAdapter extends Adapter {
  private _opts: MinIOAdapterOptions;

  constructor(opts: MinIOAdapterOptions) {
    super();
    this._opts = opts;
  }

  async init(): Promise<void> {
    await super.init();
  }
}

export { MinIOAdapterOptions, MinIOAdapter as Adapter };
