export { run } from '@oclif/core';

// eslint-disable-next-line unicorn/prefer-top-level-await
(async () => {
  const oclif = await import('@oclif/core');
  await oclif.execute({ development: true, dir: __dirname });
})();
