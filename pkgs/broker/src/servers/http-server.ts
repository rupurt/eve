import Fastify from 'fastify';
import { FastifyZod, buildJsonSchemas, register } from 'fastify-zod';

import { Broker } from '../broker.js';
import { Server, ServerType } from '../server.js';
import { CompressionType, models } from '../models';

// Global augmentation, as suggested by
// https://www.fastify.io/docs/latest/Reference/TypeScript/#creating-a-typescript-fastify-plugin
declare module 'fastify' {
  interface FastifyInstance {
    readonly zod: FastifyZod<typeof models>;
  }
}

/**
 * A HTTP server for brokers
 */
class HTTPServer implements Server {
  private _broker: Broker;
  private _config: HTTPServerConfig;
  private _fastify: ReturnType<typeof Fastify>;

  /**
   * Create a new `HTTPServer` instance
   */
  constructor(broker: Broker, config: HTTPServerConfig) {
    this._broker = broker;
    this._config = config;
    this._fastify = Fastify({ logger: true });
  }

  /**
   * Listen for requests
   *
   * @returns a promise listener
   */
  async listen(): Promise<string> {
    await this._registerRouteSchemas();
    this._addCreateTopicsRoute();
    this._addListTopicsRoute();
    this._addGetTopicRoute();
    this._addDeleteTopicRoute();
    this._addCreateRecordsRoute();
    this._addListRecordsRoute();
    this._addPingRoute();

    const { host, port } = this._config;
    return this._fastify.listen({ host, port });
  }

  /**
   * Wait for the server to be ready
   *
   * @returns a promise listener
   */
  async ready(): Promise<void> {
    return this._fastify.ready();
  }

  /**
   * Close the server
   *
   * @returns a promise listener
   */
  async close(): Promise<void> {
    return this._fastify.close();
  }

  async _registerRouteSchemas(): Promise<void> {
    await register(this._fastify, {
      jsonSchemas: buildJsonSchemas(models),
      swaggerOptions: SWAGGER_OPTIONS,
      swaggerUiOptions: SWAGGER_UI_OPTIONS,
    });
  }

  private _addCreateTopicsRoute() {
    this._fastify.zod.post(
      '/api/v1/topics',
      {
        operationId: 'createTopics',
        body: 'CreateTopics',
        reply: 'CreateTopicsResult',
      },
      async ({ body: { topics } }) => {
        const results = await this._broker.createTopics(topics);
        return { results: results };
      },
    );
  }

  private _addListTopicsRoute() {
    this._fastify.zod.get(
      '/api/v1/topics',
      {
        operationId: 'listTopics',
        reply: 'ListTopicsResult',
      },
      async () => {
        const topics = await this._broker.listTopics();
        return { topics: topics };
      },
    );
  }

  private _addGetTopicRoute() {
    this._fastify.zod.get(
      '/api/v1/topics/:name',
      {
        operationId: 'getTopic',
        params: 'GetTopic',
        reply: 'GetTopicResult',
      },
      async ({ params: { name } }) => {
        const topic = await this._broker.getTopic(name);
        return { topic: topic };
      },
    );
  }

  private _addDeleteTopicRoute() {
    this._fastify.zod.delete(
      '/api/v1/topics/:name',
      {
        operationId: 'deleteTopic',
        params: 'DeleteTopic',
        reply: 'DeleteTopicResult',
      },
      async ({ params: { name } }) => {
        const result = await this._broker.deleteTopic(name);
        return result;
      },
    );
  }

  private _addCreateRecordsRoute() {
    this._fastify.zod.post(
      '/api/v1/records',
      {
        operationId: 'createRecords',
        body: 'CreateRecords',
        reply: 'CreateRecordsResult',
      },
      async ({ body: { records: createRecords } }) => {
        // const result = await this._broker.createRecords(createRecords);
        // return result;
      },
    );
  }

  private _addListRecordsRoute() {
    this._fastify.zod.get(
      '/api/v1/records',
      {
        operationId: 'listRecords',
        params: 'ListRecords',
        reply: 'ListRecordsResult',
      },
      async ({ params }) => {
        const records = await this._broker.listRecords(params);
        return { records: records };
      },
    );
  }

  private _addPingRoute() {
    this._fastify.zod.get(
      '/probes/ping',
      {
        operationId: 'ping',
        reply: 'Pong',
      },
      async () => {
        return { pong: Date.now() };
      },
    );
  }
}

const SWAGGER_OPTIONS = {
  swagger: {
    info: {
      title: '@evereactor/broker',
      description: 'JSON/HTTP API for eve brokers',
      version: '0.0.1',
    },
  },
};
const SWAGGER_UI_OPTIONS = {
  theme: {
    title: '@evereactor/broker - SwaggerUI',
  },
};

type HTTPServerConfig = {
  type: ServerType.HTTP;
  enabled: boolean;
  host: string;
  port: number;
};

export { HTTPServer, HTTPServerConfig };
