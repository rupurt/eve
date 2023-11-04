import { Adapter } from './adapter.js';

/**
 * R2AdapterOptions
 */
type R2AdapterOptions = {
  bucketName: string;
  targetPathPrefix: string;
};

/**
 * R2Adapter
 */
class R2Adapter extends Adapter {
  private _opts: R2AdapterOptions;

  constructor(opts: R2AdapterOptions) {
    super();
    this._opts = opts;
  }

  async init(): Promise<void> {
    await super.init();
  }
}

export { R2AdapterOptions, R2Adapter as Adapter };
