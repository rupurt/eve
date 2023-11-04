import { Worker } from 'node:worker_threads';
import { Broker } from '@evereactor/broker/esm';
import { Logger } from '@evereactor/client/esm';

const TIMEOUT = 5000;

class TimeoutError extends Error {}

const logger = Logger({ level: 'trace' });

const brokerOpts = { http: { host: '::', port: 19092 } };
const broker = new Broker(brokerOpts);

const producerWorker = new Worker(
  new URL('./example-producer.mjs', import.meta.url),
);
let producerFinished = false;

const consumerWorker = new Worker(
  new URL('./example-consumer.mjs', import.meta.url),
);
let consumerFinished = false;

const example = new Promise((resolve, reject) => {
  producerWorker.on('message', (event) => {
    if (event == 'finished') {
      producerFinished = true;
      logger.info('producer finished');
    }
    if (producerFinished && consumerFinished) {
      resolve('ok');
    }
  });
  consumerWorker.on('message', (event) => {
    if (event == 'finished') {
      consumerFinished = true;
      logger.info('consumer finished');
    }
    if (producerFinished && consumerFinished) {
      resolve('ok');
    }
  });

  broker.listen();
  producerWorker.postMessage('start');
  consumerWorker.postMessage('start');

  setTimeout(() => {
    reject(new TimeoutError(`example did not complete within ${TIMEOUT}ms`));
  }, TIMEOUT);
});

(async () => {
  logger.info('starting example');
  try {
    const result = await example;
    logger.info('example completed successfully - result: %o', result);
  } catch (err) {
    logger.error(err.message);
  } finally {
    producerWorker.terminate();
    consumerWorker.terminate();
    await broker.close();
  }
})();
