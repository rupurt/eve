import { BaseContext } from 'clipanion';

type UCLIContext = BaseContext & {
  cwd: string;
};

export { UCLIContext };
