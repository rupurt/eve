const { parentPort } = require('node:worker_threads');
const { Consumer, Logger } = require('@evereactor/client');

const logger = Logger({ level: 'trace' });

const consumer = new Consumer({
  brokers: ['localhost:19092'],
  logger: logger,
});

parentPort?.on('message', (event) => {
  if (event === 'start') {
    logger.info('starting consumer');
  }
});

// consumer.subscribe('eve.example.client');

// while (true) {
//   const records = consumer.poll();
//   console.log('records consumed: %o', records);
// }
