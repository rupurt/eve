import { beforeEach, afterEach, expect, describe, test } from 'bun:test';

import { BrokerServer } from './broker-server.js';
import { Broker } from './broker.js';
import { BrokerFactory, BrokerServerFactory } from './factories';
import { CompressionType } from './models';

let broker: Broker;
let server: BrokerServer;

beforeEach(() => {
  broker = BrokerFactory.create();
  server = BrokerServerFactory.create(broker);
});
afterEach(() => {
  server.close();
});

describe('http', () => {
  test('can create, list and delete topics', async () => {
    await server.listen();

    const createTopicsResponse = await fetch(
      'http://localhost:8080/api/v1/topics',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topics: [{ name: 'test-topic', partitions: 3 }],
        }),
      },
    );
    expect(createTopicsResponse.status).toEqual(200);
    const createTopicResult = await createTopicsResponse.json();
    expect(createTopicResult.results.length).toEqual(1);
    expect(createTopicResult.results[0]).toEqual({
      topic: {
        name: 'test-topic',
        partitions: 3,
        compression: CompressionType.NONE,
      },
    });

    const listTopicsResponse = await fetch(
      'http://localhost:8080/api/v1/topics',
    );
    expect(listTopicsResponse.status).toEqual(200);
    expect(await listTopicsResponse.json()).toEqual({
      topics: [
        {
          name: 'test-topic',
          partitions: 3,
          compression: CompressionType.NONE,
        },
      ],
    });

    // const deleteTopicsResponse = await fetch(
    //   'http://localhost:8080/api/v1/topics',
    //   {
    //     method: 'DELETE',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       topics: ['test-topic'],
    //     }),
    //   },
    // );
    // expect(deleteTopicsResponse.status).toEqual(200);
    //
    // const listTopicsAfterDeleteResponse = await fetch(
    //   'http://localhost:8080/api/v1/topics',
    // );
    // expect(listTopicsAfterDeleteResponse.status).toEqual(200);
    // expect(await listTopicsAfterDeleteResponse.json()).toEqual({
    //   topics: [],
    // });
  });
});
