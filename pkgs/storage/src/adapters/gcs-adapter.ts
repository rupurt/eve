import { Storage as GCSStorage } from '@google-cloud/storage';

import { Adapter } from './adapter.js';

/**
 * GCSAdapterOptions
 */
type GCSAdapterOptions = {
  keyFilename: string;
  projectId: string;
  bucketName: string;
  targetPathPrefix: string;
};

/**
 * GCSAdapter
 */
class GCSAdapter extends Adapter {
  private _opts: GCSAdapterOptions;
  private _storage?: GCSStorage;

  constructor(opts: GCSAdapterOptions) {
    super();
    this._opts = opts;
  }

  async init(): Promise<void> {
    await super.init();

    this._storage = new GCSStorage({
      keyFilename: this._opts.keyFilename,
      projectId: this._opts.projectId,
    });
  }
}

export { GCSAdapterOptions, GCSAdapter as Adapter };
