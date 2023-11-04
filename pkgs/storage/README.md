# @evereactor/storage

Storage abstraction for event message structure

## Examples

References [examples](./examples) are available. You can run the task

```shell
> npm run examples -w @evereactor/storage
```

## Usage

### Typescript

```shell
> npm run examples:ts -w @evereactor/storage
TODO...
...
```

```ts
// examples/ts/main.ts
TODO...

/**
 * Validate that the example executed correctly. There should be:
 *
 * - 3 emitted events
 * - 1 timeout counter
 * - 2 interval counters
 */
function checkExample(
  resolve: (value?: unknown) => void,
  reject: (reason?: any) => void,
) {
  let errors: string[] = [];

  if (emissionCounter !== 3) {
    errors.push('emissionCounter !== 3');
  }
  if (timeoutCounter !== 1) {
    errors.push('timeoutCounter !== 1');
  }
  if (intervalCounter !== MAX_INTERVALS) {
    errors.push(`timeoutCounter !== ${MAX_INTERVALS}`);
  }

  if (errors.length > 0) {
    reject(new Error(errors.join('\n')));
  }
  resolve(0);
}

/**
 * Run the example and log output
 */
(async () => {
  reactor.logger.info('example starting');
  try {
    await new Promise(example);
    reactor.stop();
    reactor.logger.info('example completed successfully');
    process.exit(0);
  } catch (err) {
    reactor.stop();
    reactor.logger.error(err);
    reactor.logger.error('example did not complete successfully');
    process.exit(1);
  }
})();
```

### ESM

```shell
> npm run examples:esm -w @evereactor/storage
{"level":30,"time":1698650828459,"pid":487331,"hostname":"my-machine","msg":"example starting"}
{"level":30,"time":1698650828460,"pid":487331,"hostname":"my-machine","msg":"Reactor#start:begin"}
{"level":30,"time":1698650828460,"pid":487331,"hostname":"my-machine","msg":"Reactor#start:end"}
...
...
```

```javascript
// examples/esm/main.mjs
import { Reactor } from '@evereactor/reactor/esm';
import EventEmitter from 'node:events';

// ...
```

### CJS

```shell
> npm run examples:cjs -w @evereactor/storage
{"level":30,"time":1698650828459,"pid":487331,"hostname":"my-machine","msg":"example starting"}
{"level":30,"time":1698650828460,"pid":487331,"hostname":"my-machine","msg":"Reactor#start:begin"}
{"level":30,"time":1698650828460,"pid":487331,"hostname":"my-machine","msg":"Reactor#start:end"}
...
...
```

```javascript
// examples/cjs/main.cjs
const { Reactor } = require('@evereactor/reactor/cjs');
const EventEmitter = require('node:events');

// ...
```

### UMD

```shell
> npm run examples:umd -w @evereactor/storage
{"level":30,"time":1698650828459,"pid":487331,"hostname":"my-machine","msg":"example starting"}
{"level":30,"time":1698650828460,"pid":487331,"hostname":"my-machine","msg":"Reactor#start:begin"}
{"level":30,"time":1698650828460,"pid":487331,"hostname":"my-machine","msg":"Reactor#start:end"}
...
...
```

```javascript
const { Reactor } = require('@evereactor/reactor/umd');
const EventEmitter = require('node:events');

// ...
```
