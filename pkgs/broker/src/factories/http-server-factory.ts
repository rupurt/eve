import { Broker } from '../broker.js';
import { BrokerFactory } from './broker-factory.js';
import { ServerType } from '../server.js';
import { HTTPServer, HTTPServerConfig } from '../servers/http-server.js';

class HTTPServerFactory {
  static create(opts: HTTPServerFactoryConfig = {}): HTTPServer {
    const broker = opts.broker || BrokerFactory.create();
    const httpConfig: HTTPServerConfig = {
      ...DEFAULT_HTTP_SERVER_FACTORY_CONFIG,
      ...(opts.http || {}),
    };

    return new HTTPServer(broker, httpConfig);
  }
}

type HTTPServerFactoryConfig = {
  broker?: Broker;
  http?: Partial<HTTPServerConfig>;
};

const DEFAULT_HTTP_SERVER_FACTORY_CONFIG: HTTPServerConfig = {
  type: ServerType.HTTP,
  host: 'localhost',
  port: 8080,
  enabled: true,
};

export { HTTPServerFactory, DEFAULT_HTTP_SERVER_FACTORY_CONFIG };
