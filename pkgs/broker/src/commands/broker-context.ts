import { BaseContext } from 'clipanion';

type BrokerContext = BaseContext & {
  cwd: string;
};

export { BrokerContext };
