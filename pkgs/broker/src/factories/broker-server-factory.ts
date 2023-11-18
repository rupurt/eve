import { Broker } from '../broker.js';
import {
  BrokerServer,
  BrokerServerConfig,
  ChildServerConfig,
} from '../broker-server.js';
import { ServerType } from '../server.js';
import { HTTPServerConfig } from '../servers';

class BrokerServerFactory {
  static create(
    broker: Broker,
    childConfigs?: ChildServerConfig[],
  ): BrokerServer {
    const config: BrokerServerConfig = {
      childConfigs: childConfigs || [DEFAULT_HTTP_SERVER_CONFIG],
    };
    return new BrokerServer(broker, config);
  }
}

const DEFAULT_HTTP_SERVER_CONFIG: HTTPServerConfig = {
  type: ServerType.HTTP,
  enabled: true,
  host: '[::]',
  port: 8080,
};

export { BrokerServerFactory, DEFAULT_HTTP_SERVER_CONFIG };
