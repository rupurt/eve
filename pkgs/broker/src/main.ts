import { Builtins, Cli } from 'clipanion';

import { version } from '../package.json';
import {
  BrokerContext,
  BrokerDefault,
  BrokerConfig,
  BrokerInit,
  BrokerStart,
  BrokerStop,
} from './commands';

const cli = new Cli<BrokerContext>({
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
cli.register(BrokerInit);
cli.register(BrokerStart);
cli.register(BrokerStop);

const argv = process.argv.slice(2);
if (argv.length == 0) {
  argv.push('.');
}

cli.runExit(argv, {
  cwd: process.cwd(),
});
