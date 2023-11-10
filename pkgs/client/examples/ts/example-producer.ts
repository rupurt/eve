import { parentPort } from 'node:worker_threads';
import { Producer, Logger } from '@evereactor/client';

const logger = Logger({ level: 'trace' });

const producer = new Producer({
  brokers: ['http://localhost:19092'],
  topic: 'eve.example.client',
  logger: logger,
});

parentPort?.on('message', async (event) => {
  if (event === 'start') {
    logger.info('starting producer');

    await Promise.all([
      producer.send({
        value: Buffer.from(JSON.stringify({ hello: 'world 1' })),
      }),
      producer.send({
        value: Buffer.from(JSON.stringify({ hello: 'world 2' })),
      }),
      producer.send({
        value: Buffer.from(JSON.stringify({ hello: 'world 3' })),
      }),
    ]);

    parentPort?.postMessage('finished');
  }
});
