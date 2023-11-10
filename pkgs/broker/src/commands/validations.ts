import * as t from 'typanion';

const isPort = t.applyCascade(t.isNumber(), [
  t.isInteger(),
  t.isInInclusiveRange(1, 65535),
]);

export { isPort };
