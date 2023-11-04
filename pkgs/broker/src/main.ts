import { Builtins, Cli } from 'clipanion';

import { version } from '../package.json';
import { Context } from './commands/context';
import { BrokerDefault, BrokerConfig } from './commands';

const cli = new Cli<Context>({
  binaryLabel: `Eve broker`,
  binaryName: 'broker',
  binaryVersion: version,
});

cli.register(Builtins.DefinitionsCommand);
cli.register(Builtins.HelpCommand);
cli.register(Builtins.TokensCommand);
cli.register(Builtins.VersionCommand);

cli.register(BrokerDefault);
cli.register(BrokerConfig);

const argv = process.argv.slice(2);
if (argv.length == 0) {
  argv.push('.');
}

cli.runExit(argv, {
  cwd: process.cwd(),
});
