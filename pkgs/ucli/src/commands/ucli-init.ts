import { Command, Option } from 'clipanion';

import { UCLIContext } from './ucli-context.js';

class UCLIInit extends Command<UCLIContext> {
  config = Option.String('-c,--config', 'eve.yaml', {
    description: 'path to configuration file `[default:eve.yaml]`',
  });
  replace = Option.Boolean('-r,--replace', false, {
    description: 'overwrite an existing configuration file `[default:false]`',
  });

  static usage = Command.Usage({
    description: 'Initialize an eve configuration file',
    details: `
      This command will create an \`eve.yaml\` configuration file from a series of prompts.
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

export { UCLIInit };
