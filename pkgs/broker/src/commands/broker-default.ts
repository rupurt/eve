import { Command, Option } from 'clipanion';

import { BrokerContext } from './broker-context.js';

class BrokerDefault extends Command<BrokerContext> {
  scriptName = Option.String();
  rest = Option.Proxy();
  // subcommand = Option.Proxy();

  static paths = [Command.Default];

  async execute() {
    return await this.cli.run(['start', ...this.rest], {});
  }
}

export { BrokerDefault };
