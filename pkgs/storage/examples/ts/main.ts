import { Storage, StorageType } from '@evereactor/storage';

const local = await Storage({
  type: StorageType.LOCAL,
  directory: '.examples/storage',
});
console.log('storage type=local', local);

local.init();
