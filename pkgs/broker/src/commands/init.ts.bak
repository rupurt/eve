import { Command } from '@oclif/core';

export default class Init extends Command {
  static args = {};

  static description = 'initialize broker configuration';

  static examples = [
    `$ <%= config.bin %> <%= command.id %>
todo:
  - show config
`,
  ];

  static flags = {};

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Init);

    this.log('TODO... init');
  }
}
