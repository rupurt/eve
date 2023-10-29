# @evereactor/reactor

Reactive reactor for timers and events

## Usage

### Typescript

```shell
> npx tsx pkgs/reactor/examples/ts/main.ts
{"level":30,"time":1698554579018,"pid":157607,"hostname":"my-machine","msg":"reactor setTimeout elapsed timeout=200ms"}
{"level":30,"time":1698554579817,"pid":157607,"hostname":"my-machine","msg":"reactor setInterval elapsed counter=1"}
{"level":30,"time":1698554580818,"pid":157607,"hostname":"my-machine","msg":"reactor setInterval elapsed counter=2"}
{"level":30,"time":1698554581818,"pid":157607,"hostname":"my-machine","msg":"reactor setInterval elapsed counter=3"}
...
```

```ts
// examples/ts/main.ts
import { Reactor } from '@evereactor/reactor';
import EventEmitter from 'node:events';

const reactor = new Reactor();
reactor.start();

reactor.setTimeout(() => {
  reactor.logger.info('reactor setTimeout elapsed timeout=200ms');
}, 200);

let intervalTicks = 0;
reactor.setInterval(() => {
  intervalTicks += 1;
  reactor.logger.info(
    `reactor setInterval elapsed counter=${intervalTicks}`,
  );
}, 1000);

const emitter = new EventEmitter();
reactor.on('event', (event) => {});
```

### ESM

```shell
> node --experimental-detect-module pkgs/reactor/examples/esm/main.mjs
{"level":30,"time":1698554579018,"pid":157607,"hostname":"my-machine","msg":"reactor setTimeout elapsed timeout=200ms"}
{"level":30,"time":1698554579817,"pid":157607,"hostname":"my-machine","msg":"reactor setInterval elapsed counter=1"}
{"level":30,"time":1698554580818,"pid":157607,"hostname":"my-machine","msg":"reactor setInterval elapsed counter=2"}
{"level":30,"time":1698554581818,"pid":157607,"hostname":"my-machine","msg":"reactor setInterval elapsed counter=3"}
...
```

```javascript
// examples/esm/main.mjs
import { Reactor } from '@evereactor/reactor/esm';
import EventEmitter from 'node:events';

const reactor = new Reactor();
reactor.start();

reactor.setTimeout(() => {
  reactor.logger.info('reactor setTimeout elapsed timeout=200ms');
}, 200);

let intervalTicks = 0;
reactor.setInterval(() => {
  intervalTicks += 1;
  reactor.logger.info(
    `reactor setInterval elapsed counter=${intervalTicks}`,
  );
}, 1000);

const emitter = new EventEmitter();
reactor.on('event', (event) => { });
```

### CJS

```shell
> node pkgs/reactor/examples/cjs/main.cjs
{"level":30,"time":1698554579018,"pid":157607,"hostname":"my-machine","msg":"reactor setTimeout elapsed timeout=200ms"}
{"level":30,"time":1698554579817,"pid":157607,"hostname":"my-machine","msg":"reactor setInterval elapsed counter=1"}
{"level":30,"time":1698554580818,"pid":157607,"hostname":"my-machine","msg":"reactor setInterval elapsed counter=2"}
{"level":30,"time":1698554581818,"pid":157607,"hostname":"my-machine","msg":"reactor setInterval elapsed counter=3"}
...
```

```javascript
// examples/cjs/main.cjs
const { Reactor } = require('@evereactor/reactor/cjs');
const EventEmitter = require('node:events');

const reactor = new Reactor();
reactor.start();

reactor.setTimeout(() => {
  reactor.logger.info('reactor setTimeout elapsed timeout=200ms');
}, 200);

let intervalTicks = 0;
reactor.setInterval(() => {
  intervalTicks += 1;
  reactor.logger.info(
    `reactor setInterval elapsed counter=${intervalTicks}`,
  );
}, 1000);

const emitter = new EventEmitter();
reactor.on('event', (event) => { });
```

### UMD

```shell
> node pkgs/reactor/examples/umd/main.js
{"level":30,"time":1698554579018,"pid":157607,"hostname":"my-machine","msg":"reactor setTimeout elapsed timeout=200ms"}
{"level":30,"time":1698554579817,"pid":157607,"hostname":"my-machine","msg":"reactor setInterval elapsed counter=1"}
{"level":30,"time":1698554580818,"pid":157607,"hostname":"my-machine","msg":"reactor setInterval elapsed counter=2"}
{"level":30,"time":1698554581818,"pid":157607,"hostname":"my-machine","msg":"reactor setInterval elapsed counter=3"}
...
```

```javascript
const { Reactor } = require('@evereactor/reactor/umd');
const EventEmitter = require('node:events');

const reactor = new Reactor();
reactor.start();

reactor.setTimeout(() => {
  reactor.logger.info('reactor setTimeout elapsed timeout=200ms');
}, 200);

let intervalTicks = 0;
reactor.setInterval(() => {
  intervalTicks += 1;
  reactor.logger.info(
    `reactor setInterval elapsed counter=${intervalTicks}`,
  );
}, 1000);

const emitter = new EventEmitter();
reactor.on('event', (event) => { });
```
