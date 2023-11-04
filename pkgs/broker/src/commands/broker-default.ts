import { Command, Option } from 'clipanion';

import { Context } from './context';

class BrokerDefault extends Command<Context> {
  scriptName = Option.String();
  rest = Option.Proxy();
  // subcommand = Option.Proxy();

  static paths = [Command.Default];

  async execute() {
    return await this.cli.run(['config', ...this.rest], {});
  }
}

export { BrokerDefault };
