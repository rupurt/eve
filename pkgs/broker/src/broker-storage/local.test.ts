import { beforeEach, afterEach, describe, expect, test } from 'bun:test';
import fsPromises from 'node:fs/promises';

import { BrokerStorage } from '../broker-storage.js';
import { BrokerStorageFactory } from '../factories';

let brokerStorage: BrokerStorage;

beforeEach(() => {
  brokerStorage = BrokerStorageFactory.createLocal({
    directory: '/tmp/broker-storage',
    bucketName: 'bucket-1',
  });
});
afterEach(() => {
  // brokerStorage.delete();
});

describe('#createTopic', () => {
  test.skip('saves the topic to local disk', async () => {
    brokerStorage.createTopic();

    const topicStat = await fsPromises.stat('/tmp/broker-storage/bucket-1/topics/topic-1');
    expect(topicStat.isDirectory()).toEqual(true);
  });
});

describe('#listTopics', () => {
  test('returns a list of topics', async () => {
    await fsPromises.mkdir('/tmp/broker-storage/bucket-1/topics/topic-1', { recursive: true });
    await fsPromises.mkdir('/tmp/broker-storage/bucket-1/topics/topic-2', { recursive: true });

    const topics = await brokerStorage.listTopics();

    expect(topics.length).toEqual(2);
    const topic1 = topics[0];
    expect(topic1.name).toEqual('topic-1');
    const topic2 = topics[1];
    expect(topic2.name).toEqual('topic-2');
  });
});

describe('#getTopic', () => {
  test('todo', () => {
    expect(1).toEqual(1);
  });
});

describe('#deleteTopic', () => {
  test('todo', () => {
    expect(1).toEqual(1);
  });
});
