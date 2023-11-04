const { Storage, StorageType } = require('@evereactor/storage/cjs');

(async () => {
  const local = await Storage({
    type: StorageType.LOCAL,
    directory: '.examples/storage'
  })
  console.log('storage type=local', local);

  local.init();
})();
