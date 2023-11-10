import { Command, Option } from 'clipanion';

import { UCLIContext } from './ucli-context.js';

class UCLIBroker extends Command<UCLIContext> {
  scriptName = Option.String();
  // rest = Option.Proxy();
  subcommand = Option.Proxy();

  static paths = [Command.Default];

  async execute() {
    // return await this.cli.run(['broker', ...this.rest], {});
    return await this.cli.run(['broker'], {});
  }
}

export { UCLIBroker };
