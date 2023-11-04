const { Storage, StorageType } = require('@evereactor/storage/umd');

(async () => {
  const local = await Storage({
    type: StorageType.LOCAL,
    directory: '.examples/storage'
  })
  console.log('storage type=local', local);

  local.init();
})();
