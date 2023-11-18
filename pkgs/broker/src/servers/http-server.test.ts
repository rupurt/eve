import { beforeEach, afterEach, describe, test } from 'node:test';
import assert from 'node:assert';

import {
  BrokerFactory,
  HTTPServerFactory,
  DEFAULT_HTTP_SERVER_FACTORY_CONFIG,
} from '../factories';
import { Broker } from '../broker';
import { HTTPServer } from './http-server.js';

let httpServer: HTTPServer;
let broker: Broker;

beforeEach(async () => {
  broker = BrokerFactory.create();
  httpServer = HTTPServerFactory.create({
    broker: broker,
    http: { port: DEFAULT_HTTP_SERVER_FACTORY_CONFIG.port },
  });

  await httpServer.listen();
  await httpServer.ready();
});
afterEach(() => {
  httpServer.close();
  broker.close();
});

describe('POST /api/v1/topics', () => {
  test.skip('can create 1 or more topics', async () => {
    const response = await fetch(url('/api/v1/topics'), { method: 'POST' });
    assert.equal(response.status, 200);
    const result = await response.json();
    assert.deepEqual(result.topics, [
      { name: 'test-topic', partitions: 3, compression: 'none' },
    ]);
  });
});

describe('GET /api/v1/topics', () => {
  test('returns a list of topics from the broker', async () => {
    const response = await fetch(url('/api/v1/topics'), { method: 'GET' });
    assert.equal(response.status, 200);
    const result = await response.json();
    assert.deepEqual(result.topics, [
      { name: 'test-topic', partitions: 3, compression: 'none' },
    ]);
  });
});

describe('GET /api/v1/topics/:name', () => {
  test('returns the found topic from the broker', async () => {
    const response = await fetch(url('/api/v1/topics/test-topic'), {
      method: 'GET',
    });
    assert.equal(response.status, 200);
    const result = await response.json();
    assert.deepEqual(result.topic, {
      name: 'test-topic',
      partitions: 3,
      compression: 'none',
    });
  });

  test.skip('returns a 404 when the topic does not exist', async () => {
    const response = await fetch(url('/api/v1/topics/i-dont-exist'), {
      method: 'GET',
    });
    assert.equal(response.status, 404);
  });

  test.skip('returns a 422 when the topic name has invalid characters', async () => {
    const response = await fetch(url('/api/v1/topics/invalid#topic'), {
      method: 'GET',
    });
    assert.equal(response.status, 422);
    const result = await response.json();
    assert.equal(result.error, 'TODO...');
  });
});

describe('DELETE /api/v1/topics/:name', () => {
  test.skip('returns the found topic from the broker', async () => {
    const response = await fetch(url('/api/v1/topics/test-topic'), {
      method: 'DELETE',
    });
    assert.equal(response.status, 200);
    const result = await response.json();
    assert.equal(result.error, 'TODO...');
  });

  test.skip('returns a 404 when the topic does not exist', async () => {
    const response = await fetch(url('/api/v1/topics/i-dont-exist'), {
      method: 'DELETE',
    });
    assert.equal(response.status, 404);
  });

  test.skip('returns a 422 when the topic name has invalid characters', async () => {
    const response = await fetch(url('/api/v1/topics/invalid#topic'), {
      method: 'DELETE',
    });
    assert.equal(response.status, 422);
    const result = await response.json();
    assert.equal(result.error, 'TODO...');
  });
});

describe('POST /api/v1/records', () => {
  test.skip('can create 1 or more records', async () => {
    const response = await fetch(url('/api/v1/records'), { method: 'POST' });
    assert.equal(response.status, 200);
    const result = await response.json();
    assert.deepEqual(result.topics, [
      {
        topic: 'test-topic',
        partition: 1,
        key: 'record-1',
        value: 'todo...',
        partitions: 3,
        compression: 'none',
      },
    ]);
  });
});

describe('GET /api/v1/records', () => {
  test.skip('returns a list of records from the broker', async () => {
    const response = await fetch(url('/api/v1/records'), { method: 'GET' });
    assert.equal(response.status, 200);
    const result = await response.json();
    assert.deepEqual(result.records, [
      {
        topic: 'test-topic',
        partition: 1,
        key: 'record-1',
        value: 'todo...',
        partitions: 3,
        compression: 'none',
      },
    ]);
  });
});

describe('GET /probes/ping', () => {
  test('returns the unix time of the server', async () => {
    const response = await fetch(url('/probes/ping'), { method: 'GET' });
    assert.equal(response.status, 200);
    const result = await response.json();
    assert.equal(result.pong > 0, true);
  });
});

describe('GET /documentation', () => {
  test('serves swagger openapi documentation', async () => {
    const response = await fetch(url('/documentation'), {
      method: 'GET',
    });
    assert.equal(response.status, 200);
    assert.match(await response.text(), /@evereactor\/broker - SwaggerUI/);
  });
});

function url(path: string): string {
  return `http://localhost:${DEFAULT_HTTP_SERVER_FACTORY_CONFIG.port}${path}`;
}
