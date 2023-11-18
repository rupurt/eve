import { UnknownTransportError } from './errors.js';
import { Broker } from './broker.js';
import { Server, ServerType } from './server.js';
import { HTTPServer, HTTPServerConfig } from './servers';

class BrokerServer {
  private _broker: Broker;
  private _config: BrokerServerConfig;
  private _children: Server[];

  constructor(broker: Broker, config: BrokerServerConfig) {
    this._broker = broker;
    this._config = config;

    const enabledTransports = this._config.childConfigs.filter(
      (c) => c.enabled,
    );
    this._children = enabledTransports.map((c) => {
      if (c.type == ServerType.HTTP) {
        return new HTTPServer(broker, c);
      }
      throw new UnknownTransportError(`unknown transport type "${c.type}"`);
    });
  }

  async listen(): Promise<void> {
    await Promise.all(this._children.map((t) => t.listen()));
  }

  async close(): Promise<void> {
    await Promise.all(this._children.map((t) => t.close()));
  }
}

type BrokerServerConfig = {
  childConfigs: ChildServerConfig[];
};

type ChildServerConfig = HTTPServerConfig;

export { BrokerServer, BrokerServerConfig, ChildServerConfig };
