import { Command } from '@oclif/core';
import config from '../config';

export default class Config extends Command {
  static args = {};

  static description = 'display broker configuration';

  static examples = [
    `$ <%= config.bin %> <%= command.id %>
todo:
  - show config
`,
  ];

  static flags = {};

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Config);

    this.log('TODO... config');
    console.log(config);
  }
}
