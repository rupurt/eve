import { Command, Option } from 'clipanion';

import { Context } from './context';

class BrokerConfig extends Command<Context> {
  config = Option.String('-c,--config', 'eve.yaml', {
    description: 'path to config file `[default:eve.yaml]`',
  });

  static usage = Command.Usage({
    description: `display broker configuration`,
    details: `
      This command will remove the specified packages from the current workspace. If the \`-A,--all\` option is set, the operation will be applied to all workspaces from the current project.
    `,
    examples: [
      [`Remove a dependency from the current project`, `$0 remove lodash`],
      [
        `Remove a dependency from all workspaces at once`,
        `$0 remove lodash --all`,
      ],
    ],
  });

  static paths = [['config']];
  async execute() {
    console.log('config - %o', this.config);
    console.log('cwd - %o', this.context.cwd);
    console.log('import.meta - %o', import.meta);
  }
}

export { BrokerConfig };
