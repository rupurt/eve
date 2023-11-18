import { beforeEach, afterEach, describe, expect, test } from 'bun:test';

import { Broker } from './broker.js';
import { BrokerFactory } from './factories/broker-factory.js';
import { CompressionType } from './models';

let broker: Broker;

beforeEach(() => {
  broker = BrokerFactory.create();
});
afterEach(() => {
  broker.close();
});

describe('#createTopics', () => {
  test('persists the topic without compression by default', async () => {
    const result = await broker.createTopics([
      { name: 'test-topic-1', partitions: 3n },
      { name: 'test-topic-2', partitions: 2n },
    ]);

    expect(result.length).toEqual(2);
    expect(result[0]).toEqual({
      topic: {
        name: 'test-topic-1',
        partitions: 3n,
        compression: CompressionType.NONE,
      },
    });
    expect(result[1]).toEqual({
      topic: {
        name: 'test-topic-2',
        partitions: 2n,
        compression: CompressionType.NONE,
      },
    });
  });

  test('can assign a compression type', async () => {
    const result = await broker.createTopics([
      {
        name: 'test-topic',
        partitions: 3n,
        compression: CompressionType.GZIP,
      },
    ]);

    expect(result).toEqual([
      {
        topic: {
          name: 'test-topic',
          partitions: 3n,
          compression: CompressionType.GZIP,
        },
      },
    ]);
  });

  test.skip('returns an error when the topic name is invalid', async () => {
    const result = await broker.createTopics([
      { name: 'invalid#topic-name', partitions: 3n },
    ]);

    expect(result).toEqual([
      {
        topic: null,
        error: 'invalid topic name, todo.... what are the valid characters?',
      },
    ]);
  });

  test.skip('returns an error when partitions < 1', async () => {
    const result = await broker.createTopics([
      { name: 'topic-name', partitions: 0n },
    ]);

    expect(result).toEqual([
      {
        topic: null,
        error: 'invalid partitions, must be > 0',
      },
    ]);
  });
});

describe('#listTopics', () => {
  test.skip('returns a list of topics', async () => {
    const result = await broker.listTopics();

    expect(result.length).toEqual(2);
    expect(result[0]).toEqual({
      name: 'test-topic-1',
      partitions: 3n,
      compression: CompressionType.NONE,
    });
    expect(result[1]).toEqual({
      name: 'test-topic-2',
      partitions: 2n,
      compression: CompressionType.NONE,
    });
  });
});

describe('#getTopic', () => {
  test('returns a topic by name', async () => {
    const result = await broker.getTopic('test-topic-1');

    expect(result).toEqual({
      name: 'test-topic-1',
      partitions: 3n,
      compression: CompressionType.NONE,
    });
  });
});

describe('#deleteTopic', () => {
  test.skip('deletes a topic by name', async () => {
    const result = await broker.deleteTopic('test-topic-1');

    expect(result).toEqual({
      name: 'test-topic-1',
      partitions: 3n,
      compression: CompressionType.NONE,
    });
  });
});

describe('#createRecords', () => {
  test('persists the record without compression by default', async () => {
    const result = await broker.createRecords([
      {
        topic: 'test-topic-1',
        partition: 0n,
        key: Buffer.from('record-key-1'),
        value: Buffer.from('record-value-1'),
      },
    ]);

    expect(result.length).toEqual(1);
    const recordResult = result[0];
    expect(recordResult.record.topic).toEqual('test-topic-1');
    expect(recordResult.record.partition).toEqual(0n);
    expect(recordResult.record.offset).toEqual(0n);
    expect(recordResult.record.compression).toEqual(CompressionType.NONE);
    expect(recordResult.record.key).toEqual(Buffer.from('record-key-1'));
    expect(recordResult.record.value).toEqual(Buffer.from('record-value-1'));
  });
});

describe('#listRecords', () => {
  test('returns a list of records', async () => {
    const result = await broker.listRecords({ topics: [] });

    expect(result.length).toEqual(1);
    // expect(result[0]).toEqual({
    //   name: 'test-topic-1',
    //   partitions: 3n,
    //   compression: CompressionType.NONE,
    // });
    // expect(result[1]).toEqual({
    //   name: 'test-topic-2',
    //   partitions: 2n,
    //   compression: CompressionType.NONE,
    // });
  });
});
