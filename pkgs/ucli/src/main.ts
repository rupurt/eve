import { Builtins, Cli } from 'clipanion';

import { version } from '../package.json';
import { UCLIContext, UCLIBroker, UCLIDefault, UCLIInit } from './commands';

const cli = new Cli<UCLIContext>({
  binaryLabel: 'Eve',
  binaryName: 'eve',
  binaryVersion: version,
});

cli.register(Builtins.DefinitionsCommand);
cli.register(Builtins.HelpCommand);
cli.register(Builtins.TokensCommand);
cli.register(Builtins.VersionCommand);

cli.register(UCLIDefault);
cli.register(UCLIInit);
cli.register(UCLIBroker);

const argv = process.argv.slice(2);
if (argv.length == 0) {
  argv.push('.');
}

cli.runExit(argv, {
  cwd: process.cwd(),
});
