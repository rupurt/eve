import { Worker } from 'node:worker_threads';
import { Broker, BrokerConfig } from '@evereactor/broker';
import { LocalStorageConfig, StorageType } from '@evereactor/storage';
import { Logger } from '@evereactor/client';

const TIMEOUT = 5000;

class TimeoutError extends Error {}

const logger = Logger({ level: 'trace' });

const storageConfig: LocalStorageConfig = {
  type: StorageType.LOCAL,
  directory: '.examples/broker1',
};

const brokerConfig: BrokerConfig = {
  storage: storageConfig,
  http: { host: '[::]', port: 19092 },
};
const broker = new Broker(brokerConfig);

const producerWorker = new Worker(
  new URL('./example-producer.js', import.meta.url),
);
let producerFinished = false;

const consumerWorker = new Worker(
  new URL('./example-consumer.js', import.meta.url),
);
let consumerFinished = false;

const example = new Promise(async (resolve, reject) => {
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

  await broker.listen();
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
