import type { FastifyZod } from 'fastify-zod';

import Fastify from 'fastify';
import { buildJsonSchemas, register } from 'fastify-zod';

import { Logger } from './logger.js';
import { models } from './models.js';

// Global augmentation, as suggested by
// https://www.fastify.io/docs/latest/Reference/TypeScript/#creating-a-typescript-fastify-plugin
declare module 'fastify' {
  interface FastifyInstance {
    readonly zod: FastifyZod<typeof models>;
  }
}

/**
 * HTTPServer
 */
class HTTPServer {
  private _opts: HTTPServerConfig;
  private _fastify: ReturnType<typeof Fastify>;
  private _logger: ReturnType<typeof Logger>;

  constructor(opts: HTTPServerConfig) {
    this._opts = opts;
    this._logger = opts?.logger || Logger({});
    this._fastify = Fastify({ logger: true });
  }

  /**
   * Register route schemas
   */
  async registerRouteSchemas(): Promise<void> {
    await register(this._fastify, {
      jsonSchemas: buildJsonSchemas(models),
      // swaggerOptions: {
      //   // See https://github.com/fastify/fastify-swagger
      // },
      // swaggerUiOptions: {
      //   // See https://github.com/fastify/fastify-swagger-ui
      // },
      // transformSpec: {
      //   // optional, see below
      // },
    });
  }

  /**
   * Add a route to the fastify http server
   *
   */
  addRoute(callback: (zod: FastifyZod<typeof models>) => void) {
    return callback(this._fastify.zod);
  }

  /**
   * Listen on the fastify http server
   *
   * @returns void
   */
  async listen(): Promise<void> {
    const opts = { host: this._opts.host, port: this._opts.port };
    const address = await this._fastify.listen(opts);

    this._logger.info(`broker listening on address="${address}"`);
  }

  /**
   * Close the fastify http server
   *
   * @returns a promise encapsulating undefined
   */
  close(): Promise<undefined> {
    return this._fastify.close();
  }
}

/**
 * HTTPServerOptions
 */
type HTTPServerConfig = {
  // TOOD: maybe IP address type ???
  host: string;
  port: number;
  logger?: ReturnType<typeof Logger>;
};

export { HTTPServer, HTTPServerConfig };
