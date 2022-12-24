import { Command } from '@oclif/core';

export default class Init extends Command {
  static args = {};

  static description = 'initialize eve configuration';

  static examples = [
    `<%= config.bin %> <%= command.id %>
hello world! (./src/commands/hello/world.ts)
`,
  ];

  static flags = {};

  async run(): Promise<void> {
    this.log('TODO... init');
  }
}
