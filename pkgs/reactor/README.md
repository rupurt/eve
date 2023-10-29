# @evereactor/reactor

Reactive event loop for timers and events

## Examples

References [examples](./examples) are available. You can run the task

```shell
> npm run examples -w @evereactor/examples
```

## Usage

### Typescript

```shell
> npx tsx pkgs/reactor/examples/ts/main.ts
{"level":30,"time":1698650828459,"pid":487331,"hostname":"my-machine","msg":"example starting"}
{"level":30,"time":1698650828460,"pid":487331,"hostname":"my-machine","msg":"Reactor#start:begin"}
{"level":30,"time":1698650828460,"pid":487331,"hostname":"my-machine","msg":"Reactor#start:end"}
{"level":20,"time":1698650828461,"pid":487331,"hostname":"my-machine","msg":"Reactor#tick:begin"}
{"level":30,"time":1698650828461,"pid":487331,"hostname":"my-machine","msg":"reactor emit event=\"hello:world\", args=[\"Lebron\"], counter=1"}
{"level":20,"time":1698650828461,"pid":487331,"hostname":"my-machine","msg":"Reactor#tick:end"}
{"level":20,"time":1698650828461,"pid":487331,"hostname":"my-machine","msg":"Reactor#tick:begin"}
{"level":30,"time":1698650828461,"pid":487331,"hostname":"my-machine","msg":"reactor emit event=\"hello:world\", args=[\"David\"], counter=2"}
{"level":20,"time":1698650828461,"pid":487331,"hostname":"my-machine","msg":"Reactor#tick:end"}
{"level":20,"time":1698650828461,"pid":487331,"hostname":"my-machine","msg":"Reactor#tick:begin"}
{"level":30,"time":1698650828461,"pid":487331,"hostname":"my-machine","msg":"reactor emit event=\"hello:world\", args=[\"Taylor\"], counter=3"}
{"level":20,"time":1698650828461,"pid":487331,"hostname":"my-machine","msg":"Reactor#tick:end"}
{"level":20,"time":1698650828561,"pid":487331,"hostname":"my-machine","msg":"Reactor#tick:begin"}
{"level":30,"time":1698650828561,"pid":487331,"hostname":"my-machine","msg":"reactor setTimeout elapsed timeout=200ms, counter=1"}
{"level":20,"time":1698650828561,"pid":487331,"hostname":"my-machine","msg":"Reactor#tick:end"}
{"level":20,"time":1698650828659,"pid":487331,"hostname":"my-machine","msg":"Reactor#tick:begin"}
{"level":30,"time":1698650828660,"pid":487331,"hostname":"my-machine","msg":"reactor setInterval elapsed counter=1"}
{"level":20,"time":1698650828660,"pid":487331,"hostname":"my-machine","msg":"Reactor#tick:end"}
{"level":20,"time":1698650828859,"pid":487331,"hostname":"my-machine","msg":"Reactor#tick:begin"}
{"level":30,"time":1698650828859,"pid":487331,"hostname":"my-machine","msg":"reactor setInterval elapsed counter=2"}
{"level":20,"time":1698650828860,"pid":487331,"hostname":"my-machine","msg":"Reactor#tick:end"}
{"level":30,"time":1698650828860,"pid":487331,"hostname":"my-machine","msg":"Reactor#stop:begin"}
{"level":30,"time":1698650828860,"pid":487331,"hostname":"my-machine","msg":"Reactor#stop:end"}
{"level":30,"time":1698650828860,"pid":487331,"hostname":"my-machine","msg":"example completed successfully"}
...
```

```ts
// examples/ts/main.ts
import { Reactor } from '@evereactor/reactor';
import EventEmitter from 'node:events';

const reactor = new Reactor({ logger: logger({ level: 'trace' }) });
const externalEmitter = new EventEmitter();
const MAX_INTERVALS = 2;
let emissionCounter = 0;
let timeoutCounter = 0;
let intervalCounter = 0;

function example(
  resolve: (value?: unknown) => void,
  reject: (reason?: any) => void,
): void {
  const interval = reactor.setInterval(() => {
    intervalCounter += 1;
    reactor.logger.info(
      `reactor setInterval elapsed counter=${intervalCounter}`,
    );
    if (intervalCounter >= MAX_INTERVALS) {
      reactor.clearInterval(interval);
      checkExample(resolve, reject);
    }
  }, 200);

  reactor.setTimeout(() => {
    timeoutCounter += 1;
    reactor.logger.info(
      `reactor setTimeout elapsed timeout=200ms, counter=${timeoutCounter}`,
    );
  }, 100);

  reactor.onEmitter(externalEmitter, 'hello:world', (...args: any[]) => {
    emissionCounter += 1;
    reactor.logger.info(
      `reactor emit event="hello:world", args=${JSON.stringify(
        args,
      )}, counter=${emissionCounter}`,
    );
  });

  reactor.start();
  externalEmitter.emit('hello:world', 'Lebron');
  externalEmitter.emit('hello:world', 'David');
  externalEmitter.emit('hello:world', 'Taylor');
}

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
> node --experimental-detect-module pkgs/reactor/examples/esm/main.mjs
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
> node pkgs/reactor/examples/cjs/main.cjs
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
> node pkgs/reactor/examples/umd/main.js
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
