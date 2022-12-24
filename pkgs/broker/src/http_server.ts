import Fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify';
// import { Server, IncomingMessage, ServerResponse } from 'http';

type HTTPServerOptions = {
  // TOOD: maybe IP address type ???
  host: string;
  port: number;
};

class HTTPServer {
  private _options: HTTPServerOptions;
  private _httpServer: FastifyInstance;

  constructor(options: HTTPServerOptions) {
    this._options = options;
    this._httpServer = Fastify({});

    const opts: RouteShorthandOptions = {
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              pong: {
                type: 'string',
              },
            },
          },
        },
      },
    };

    this._httpServer.get('/ping', opts, async (request, reply) => {
      return { pong: 'it worked!' };
    });
  }

  async listen() {
    try {
      await this._httpServer.listen({
        host: this._options.host,
        port: this._options.port,
      });

      const address = this._httpServer.server.address();
      const port = typeof address === 'string' ? address : address?.port;

      console.log('server listening - address=%o, port=%o', address, port);
    } catch (err) {
      this._httpServer.log.error(err);
      process.exit(1);
    }
  }
}

export { HTTPServerOptions, HTTPServer };
