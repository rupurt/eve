import fsPromises from 'fs/promises';

import { Adapter } from './adapter.js';

/**
 * LocalAdapterOptions
 */
type LocalAdapterOptions = {
  directory: string;
};

/**
 * LocalAdapter
 */
class LocalAdapter extends Adapter {
  private _opts: LocalAdapterOptions;

  constructor(opts: LocalAdapterOptions) {
    super();
    this._opts = opts;
  }

  async init(): Promise<void> {
    await super.init();
    await fsPromises.mkdir(this._opts.directory, { recursive: true });
  }
}

export { LocalAdapterOptions, LocalAdapter as Adapter };
