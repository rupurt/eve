import { BaseContext } from 'clipanion';

type Context = BaseContext & {
  cwd: string;
};

export { Context };
