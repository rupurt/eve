import { Adapter } from './adapter.js';

/**
 * S3AdapterOptions
 */
type S3AdapterOptions = {
  bucketName: string;
  targetPathPrefix: string;
};

/**
 * S3Adapter
 */
class S3Adapter extends Adapter {
  private _opts: S3AdapterOptions;

  constructor(opts: S3AdapterOptions) {
    super();
    this._opts = opts;
  }
}

export { S3AdapterOptions, S3Adapter as Adapter };
