import { HTTPServer, HTTPServerOptions } from './http_server';

/**
 * Broker options
 */
type BrokerOptions = {
  http: HTTPServerOptions;
};

/**
 * The `Broker` class is the main entry point for the broker.
 */
class Broker {
  private _options: BrokerOptions;
  private _httpServer: HTTPServer;

  /**
   * Create a new `Broker` instance
   *
   * ```ts
   * const broker = new Broker({ http: { host: '::', port: 8080 } });
   * ```
   *
   * @param options - broker options
   * @returns a new `Broker` instance
   */
  constructor(options: BrokerOptions) {
    this._options = options;
    this._httpServer = new HTTPServer(this._options.http);
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
}

export { BrokerOptions, Broker };
