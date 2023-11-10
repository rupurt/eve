import { Storage, StorageConfig } from '@evereactor/storage';

import { Logger } from './logger.js';
import { HTTPServer, HTTPServerConfig } from './http-server.js';
import { TopicCompressionType } from './models.js';

/**
 * The `Broker` class is the main entry point for the broker.
 */
class Broker {
  private _config: BrokerConfig;
  private _logger: ReturnType<typeof Logger>;
  private _storage: ReturnType<typeof Storage>;
  private _httpServer: HTTPServer;

  /**
   * Create a new `Broker` instance
   *
   * ```ts
   * const broker = new Broker({ http: { host: '::', port: 8080 } });
   * ```
   *
   * @param config - broker options
   * @returns a new `Broker` instance
   */
  constructor(config: BrokerConfig) {
    this._config = config;
    this._logger = config.logger || Logger({});
    this._storage = Storage(config.storage);
    this._httpServer = new HTTPServer(this._config.http);
  }

  /**
   * Start the broker. This includes starting the http server
   *
   * ```ts
   * broker.listen();
   * ```
   *
   * @returns a promise listener
   */
  async listen(): Promise<ReturnType<typeof HTTPServer.prototype.listen>> {
    this._logger.info(
      `starting broker storage type="${this._config.storage.type}"`,
    );

    await this._storage.init();

    await this._httpServer.registerRouteSchemas();
    this._addPingRoute();
    this._addTopicRoutes();
    this._addRecordRoutes();
    return this._httpServer.listen();
  }

  /**
   * Close the broker and cleanup. This includes closing the http server
   *
   * ```ts
   * await broker.close();
   * ```
   *
   * @returns a promise listener
   */
  close(): ReturnType<typeof HTTPServer.prototype.close> {
    this._logger.info('stopping broker');
    return this._httpServer.close();
  }

  private _addPingRoute() {
    this._httpServer.addRoute((zod) => {
      zod.get(
        '/api/v1/ping',
        {
          operationId: 'ping',
          reply: 'Pong',
        },
        async () => {
          return { pong: Date.now() };
        },
      );
    });
  }

  private _addTopicRoutes() {
    this._httpServer.addRoute((zod) => {
      zod.get(
        '/api/v1/topics',
        {
          operationId: 'listTopics',
          reply: 'Topics',
        },
        async () => {
          const topics = [
            { id: 'todo-topic', compression: TopicCompressionType.NONE },
          ];

          return { topics };
        },
      );
    });
    this._httpServer.addRoute((zod) => {
      zod.post(
        '/api/v1/topics',
        {
          operationId: 'createTopic',
          reply: 'CreateTopicResult',
        },
        async () => {
          return {};
        },
      );
    });
    this._httpServer.addRoute((zod) => {
      zod.get(
        '/api/v1/topics/:id',
        {
          operationId: 'getTopic',
          reply: 'Topic',
        },
        async () => {
          return {
            id: 'todo-topic',
            compression: TopicCompressionType.NONE,
          };
        },
      );
    });
  }

  private _addRecordRoutes() {
    this._httpServer.addRoute((zod) => {
      zod.get(
        '/api/v1/records',
        {
          operationId: 'listRecords',
          reply: 'Records',
        },
        async () => {
          const records = [
            {
              topic: 'todo-topic',
              offset: 0n,
              timestamp: 0n,
              key: 'todo-record',
              value: 'todo-value',
            },
          ];

          return { records };
        },
      );
    });
    this._httpServer.addRoute((zod) => {
      zod.post(
        '/api/v1/records',
        {
          operationId: 'createRecord',
          reply: 'CreateRecordResult',
        },
        async () => {
          return {};
        },
      );
    });
  }
}

/**
 * BrokerConfig
 */
type BrokerConfig = {
  logger?: ReturnType<typeof Logger>;
  storage: StorageConfig;
  http: HTTPServerConfig;
};

export { Broker, BrokerConfig };
