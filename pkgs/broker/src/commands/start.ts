import { Command } from '@oclif/core';

import { Broker, BrokerOptions } from '../broker';

export default class Start extends Command {
  static args = {};

  static description = 'start the broker';

  static examples = [
    `<%= config.bin %> <%= command.id %>
hello world! (./src/commands/hello/world.ts)
`,
  ];

  static flags = {};

  async run(): Promise<void> {
    const opts: BrokerOptions = {
      http: {
        host: '::',
        port: 3000,
      },
    };
    const broker = new Broker(opts);

    await broker.listen();
  }
}
