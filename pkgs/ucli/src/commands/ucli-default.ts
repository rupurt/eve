import { Command, Option } from 'clipanion';

import { UCLIContext } from './ucli-context.js';

class UCLIDefault extends Command<UCLIContext> {
  scriptName = Option.String();
  rest = Option.Proxy();
  // subcommand = Option.Proxy();

  static paths = [Command.Default];

  async execute() {
    return await this.cli.run(['broker start', ...this.rest], {});
  }
}

export { UCLIDefault };
