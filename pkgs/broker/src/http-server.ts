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

    this._httpServer.addHook('onRequest', (request, reply, done) => {
      console.log('####################### on request');
      console.log(request);
      console.log(reply);
      // Some code
      done();
    });

    const pingOpts: RouteShorthandOptions = {
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

    this._httpServer.get('/ping', pingOpts, async (request, reply) => {
      return { pong: 'it worked!' };
    });

    const getTopicsOpts: RouteShorthandOptions = {
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              msg: {
                type: 'string',
              },
            },
          },
        },
      },
    };

    this._httpServer.get(
      '/api/v1/topics',
      getTopicsOpts,
      async (request, reply) => {
        return { msg: 'GET /api/v1/topics' };
      },
    );

    const postTopicsOpts: RouteShorthandOptions = {
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              msg: {
                type: 'string',
              },
            },
          },
        },
      },
    };

    this._httpServer.post(
      '/api/v1/topics',
      postTopicsOpts,
      async (request, reply) => {
        return { msg: 'POST /api/v1/topics' };
      },
    );

    const getRecordsOpts: RouteShorthandOptions = {
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              msg: {
                type: 'string',
              },
            },
          },
        },
      },
    };

    this._httpServer.get(
      '/api/v1/records',
      getRecordsOpts,
      async (request, reply) => {
        return { msg: 'GET api/v1/records' };
      },
    );

    const postRecordsOpts: RouteShorthandOptions = {
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              msg: {
                type: 'string',
              },
            },
          },
        },
      },
    };

    this._httpServer.post(
      '/api/v1/records',
      postRecordsOpts,
      async (request, reply) => {
        return { msg: 'POST /api/v1/records' };
      },
    );
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

  async close() {
    return this._httpServer.close();
  }
}

export { HTTPServerOptions, HTTPServer };
