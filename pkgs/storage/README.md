# @evereactor/storage

Persistent storage abstraction to object stores for `eve` topic and record structures

- [x] [LocalAdapter](./src/adapters/local-adapter.ts)
- [x] [GCSAdapter](./src/adapters/gcs-adapter.ts)
- [ ] [S3Adapter](./src/adapters/s3-adapter.ts)
- [ ] [R2Adapter](./src/adapters/r2-adapter.ts)
- [ ] [MinIOAdapter](./src/adapters/minio-adapter.ts)

## Examples

Reference [examples](./examples) are available. You can run the task

```shell
$ LOCAL_ADAPTER_ENABLED=true \
GCS_ADAPTER_ENABLED=true \
GCS_BUCKET=eve-gcs-bucket \
GCS_PROJECT_ID=eve \
npm run examples:ts -w @evereactor/storage
```

## Usage

### Typescript

```shell
$ LOCAL_ADAPTER_ENABLED=true \
GCS_ADAPTER_ENABLED=true \
GCS_BUCKET=eve-gcs-bucket \
GCS_PROJECT_ID=eve \
npm run examples:ts -w @evereactor/storage
> @evereactor/storage@0.0.1 examples:ts
> bun run examples/ts/main.ts

Examples
====================
LOCAL_ADAPTER_ENABLED: true
GCS_ADAPTER_ENABLED: true

LocalAdapter
====================
#listBuckets
  - local-bucket-1
  - local-bucket-2
...
```

```ts
// examples/ts/main.ts
import fs from 'node:fs';
import { resolve } from 'node:path';
import { Storage, StorageType } from '@evereactor/storage';

const LOCAL_ADAPTER_ENABLED =
  process.env.LOCAL_ADAPTER_ENABLED == 'true' || false;
const GCS_ADAPTER_ENABLED = process.env.GCS_ADAPTER_ENABLED == 'true' || false;
const GCS_PROJECT_ID = process.env.GCS_PROJECT_ID;
const GCS_BUCKET = process.env.GCS_BUCKET;
const HELLO_TXT = 'hello.txt';

(async () => {
  console.log('Examples');
  console.log('====================');
  console.log('LOCAL_ADAPTER_ENABLED: %o', LOCAL_ADAPTER_ENABLED);
  console.log('GCS_ADAPTER_ENABLED: %o', GCS_ADAPTER_ENABLED);
  console.log('');

  /**
   * LocalAdapter
   */
  if (LOCAL_ADAPTER_ENABLED) {
    const LOCAL_STORAGE_DIR = '.examples/storage/ts';
    const LOCAL_BUCKET_1 = 'local-bucket-1';
    const LOCAL_BUCKET_2 = 'local-bucket-2';

    const localAdapter = Storage({
      type: StorageType.LOCAL,
      directory: LOCAL_STORAGE_DIR,
    });
    await localAdapter.init();
    console.log('LocalAdapter');
    console.log('====================');

    fs.mkdirSync(`${LOCAL_STORAGE_DIR}/${LOCAL_BUCKET_1}`, { recursive: true });
    fs.mkdirSync(`${LOCAL_STORAGE_DIR}/${LOCAL_BUCKET_2}`, { recursive: true });
    fs.writeFileSync(`${LOCAL_STORAGE_DIR}/other-file.txt`, '');
    const localBuckets = await localAdapter.listBuckets();
    console.log('#listBuckets');
    localBuckets.forEach((b) => {
      console.log(`  - ${b.name}`);
    });
// ...
```

### ESM

```shell
$ LOCAL_ADAPTER_ENABLED=true \
GCS_ADAPTER_ENABLED=true \
GCS_BUCKET=eve-gcs-bucket \
GCS_PROJECT_ID=eve \
npm run examples:esm -w @evereactor/storage
> @evereactor/storage@0.0.1 examples:esm
> bun run examples/esm/main.mjs

Examples
====================
LOCAL_ADAPTER_ENABLED: true
GCS_ADAPTER_ENABLED: true

LocalAdapter
====================
#listBuckets
  - local-bucket-1
  - local-bucket-2
...
```

```javascript
// examples/esm/main.mjs
import fs from 'node:fs';
import { resolve } from 'node:path';
import { Storage, StorageType } from '@evereactor/storage/esm';

// ...
```

### CJS

```shell
$ LOCAL_ADAPTER_ENABLED=true \
GCS_ADAPTER_ENABLED=true \
GCS_BUCKET=eve-gcs-bucket \
GCS_PROJECT_ID=eve \
npm run examples:cjs -w @evereactor/storage
> @evereactor/storage@0.0.1 examples:cjs
> bun run examples/cjs/main.cjs

Examples
====================
LOCAL_ADAPTER_ENABLED: true
GCS_ADAPTER_ENABLED: true

LocalAdapter
====================
#listBuckets
  - local-bucket-1
  - local-bucket-2
...
```

```javascript
// examples/cjs/main.cjs
const fs = require('node:fs');
const { resolve } = require('node:path');
const { Storage, StorageType } = require('@evereactor/storage/cjs');

// ...
```

### UMD

```shell
$ LOCAL_ADAPTER_ENABLED=true \
GCS_ADAPTER_ENABLED=true \
GCS_BUCKET=eve-gcs-bucket \
GCS_PROJECT_ID=eve \
npm run examples:cjs -w @evereactor/storage
> @evereactor/storage@0.0.1 examples:umd
> bun run examples/umd/main.js

Examples
====================
LOCAL_ADAPTER_ENABLED: true
GCS_ADAPTER_ENABLED: true

LocalAdapter
====================
#listBuckets
  - local-bucket-1
  - local-bucket-2
...
```

```javascript
const fs = require('node:fs');
const { resolve } = require('node:path');
const { Storage, StorageType } = require('@evereactor/storage/umd');

// ...
```
