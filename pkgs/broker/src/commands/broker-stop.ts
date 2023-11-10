import { Command, Option } from 'clipanion';

import { BrokerContext } from './broker-context.js';
import { isPort } from './validations.js';

class BrokerStop extends Command<BrokerContext> {
  host = Option.String('-h,--host', '[::]', {
    description: 'host broker is listening on `[default:[::]]`',
  });
  port = Option.String('-p,--port', '8080', {
    description: 'port broker is listening on `[default:8080]`',
    validator: isPort,
  });

  static usage = Command.Usage({
    description: "stop a running broker via it's http listener",
    details: `
      This command will remove the specified packages from the current workspace. If the \`-A,--all\` option is set, the operation will be applied to all workspaces from the current project.
    `,
    examples: [
      ['Stop an eve broker running on the default host and port', '$0 stop'],
      [
        'Stop an eve broker running on a custom host and port',
        '$0 stop --host localhost --port 8081',
      ],
    ],
  });

  static paths = [['stop']];
  async execute() {
    console.log(
      'TODO... broker stop - host: %o, port: %o',
      this.host,
      this.port,
    );
  }
}

export { BrokerStop };
