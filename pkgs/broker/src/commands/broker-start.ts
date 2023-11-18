import { Command, Option } from 'clipanion';
// import { StorageConfig, StorageType } from '@evereactor/storage';
//
// import { Logger } from '../logger.js';
// import { Broker, BrokerConfig } from '../broker.js';
import { BrokerContext } from './broker-context.js';
import { isPort } from './validations.js';
import {
  BrokerFactory,
  BrokerServerFactory,
  DEFAULT_HTTP_SERVER_CONFIG,
} from '../factories';

class BrokerStart extends Command<BrokerContext> {
  config = Option.String('-c,--config', 'eve.broker.yaml', {
    description: 'path to configuration file `[default:eve.broker.yaml]`',
  });
  host = Option.String('-h,--host', '[::]', {
    description: 'host to listen on `[default:[::]]`',
  });
  port = Option.String('-p,--port', '8080', {
    description: 'port to listen on `[default:8080]`',
    validator: isPort,
  });
  logLevel = Option.String('-l,--log-level', 'info', {
    description: 'log level `[default:info]`',
  });

  static usage = Command.Usage({
    description: 'start a broker with a http listener',
    details:
      'This command will start an eve broker with a http listener to manage topics of streaming records over object storage.',
    examples: [
      ['Start an eve broker from the default configuration file', '$0 start'],
      [
        'Start an eve broker from a custom configuration file',
        '$0 start --config eve.superbroker.yaml',
      ],
    ],
  });

  static paths = [['start']];
  async execute() {
    // const logger = Logger({ level: this.logLevel });
    // const storageConfig: StorageConfig = {
    //   type: StorageType.LOCAL,
    //   directory: '.eve/broker1',
    // };
    // const httpConfig = { host: this.host, port: this.port };
    // const config: BrokerConfig = {
    //   logger: logger,
    //   storage: storageConfig,
    //   http: httpConfig,
    // };
    // const broker = Broker(config);
    //
    // process.once('SIGINT', async () => await broker.close());
    // process.once('SIGTERM', async () => await broker.close());
    //
    // broker.listen();

    const broker = BrokerFactory.create();
    const childConfigs = [
      { ...DEFAULT_HTTP_SERVER_CONFIG, host: this.host, port: this.port },
    ];
    const server = BrokerServerFactory.create(broker, childConfigs);

    process.once('SIGINT', async () => await server.close());
    process.once('SIGTERM', async () => await server.close());

    server.listen();
  }
}

export { BrokerStart };
