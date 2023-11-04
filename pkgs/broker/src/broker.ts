import { Logger } from './logger.js';
import { HTTPServer, HTTPServerOptions } from './http-server.js';

/**
 * Broker options
 */
type BrokerOptions = {
  http: HTTPServerOptions;
  logger?: ReturnType<typeof Logger>;
};

/**
 * The `Broker` class is the main entry point for the broker.
 */
class Broker {
  private _opts: BrokerOptions;
  private _httpServer: HTTPServer;
  private _logger: ReturnType<typeof Logger>;

  /**
   * Create a new `Broker` instance
   *
   * ```ts
   * const broker = new Broker({ http: { host: '::', port: 8080 } });
   * ```
   *
   * @param opts - broker options
   * @returns a new `Broker` instance
   */
  constructor(opts: BrokerOptions) {
    this._opts = opts;
    this._httpServer = new HTTPServer(this._opts.http);
    this._logger = opts?.logger || Logger({});
  }

  /**
   * Start listening on the http server
   *
   * ```ts
   * await broker.listen();
   * ```
   *
   * @returns a promise listener
   */
  listen(): Promise<void> {
    return this._httpServer.listen();
  }

  /**
   * Close the http server
   */
  async close() {
    return this._httpServer.close();
  }
}

export { BrokerOptions, Broker };
