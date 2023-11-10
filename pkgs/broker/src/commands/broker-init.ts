import { Command, Option } from 'clipanion';

import { BrokerContext } from './broker-context.js';

class BrokerInit extends Command<BrokerContext> {
  config = Option.String('-c,--config', 'eve.yaml', {
    description: 'path to config file `[default:eve.yaml]`',
  });
  replace = Option.Boolean('-r,--replace', false, {
    description: 'overwrite an existing configuration file `[default:false]`',
  });

  static usage = Command.Usage({
    description: 'initialize a brokers configuration file',
    details: `
      This command will remove the specified packages from the current workspace. If the \`-A,--all\` option is set, the operation will be applied to all workspaces from the current project.
    `,
    examples: [
      ['Create a new configuration file', '$0 init'],
      ['Replace an existing configuration file', '$0 init --replace'],
    ],
  });

  static paths = [['init']];
  async execute() {
    console.log('TODO... broker init');
  }
}

export { BrokerInit };
