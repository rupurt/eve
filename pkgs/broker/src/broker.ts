import z from 'zod';
import { Storage, StorageConfig } from '@evereactor/storage';

import { Logger } from './logger.js';
import {
  CompressionType,
  CreateTopic,
  CreateTopicResult,
  Topic,
  CreateRecord,
  CreateRecordResult,
  Record,
  ListRecords,
} from './models';

/**
 * Broker's are responsible for storing and fullfilling requests for records in topics.
 */
class Broker {
  private _logger: ReturnType<typeof Logger>;
  private _storage: ReturnType<typeof Storage>;

  /**
   * Create a new `Broker` instance
   *
   * ```ts
   * const storageConfig = {};
   * const broker = new Broker({ storage: storageConfig });
   * ```
   *
   * @param config - broker options
   * @returns a new `Broker` instance
   */
  constructor(config: BrokerConfig) {
    this._logger = config.logger || Logger({});
    this._storage = Storage(config.storage);
  }

  /**
   * Create a new topic
   *
   * @param topics - the topics to create
   * @returns a promise listener
   */
  async createTopics(
    topics: z.infer<typeof CreateTopic>[],
  ): Promise<z.infer<typeof CreateTopicResult>[]> {
    const results = topics.map((ct) => {
      const topic = {
        name: ct.name,
        partitions: ct.partitions,
        compression: ct.compression || CompressionType.NONE,
      };
      // this._storage.writeStream('todo-eve-instance', );
      return {
        topic: topic,
        // error: 'TODO',
      };
    });

    return results;
  }

  /**
   * List all topics
   *
   * @returns a promise listener
   */
  async listTopics(): Promise<z.infer<typeof Topic>[]> {
    return [
      { name: 'test-topic', partitions: 3n, compression: CompressionType.NONE },
    ];
  }

  /**
   * Get a topic by name
   *
   * @param name - the name of the topic to get
   * @returns a promise listener
   */
  async getTopic(name: string): Promise<z.infer<typeof Topic>> {
    return {
      name: name,
      partitions: 3n,
      compression: CompressionType.NONE,
    };
  }

  /**
   * Delete a topic
   *
   * @param name - the name of the topic to delete
   * @returns a promise listener
   */
  async deleteTopic(_name: string): Promise<void> {}

  /**
   * Create records in a topic
   *
   * @param records - the records to create
   * @returns a promise listener
   */
  async createRecords(
    records: z.infer<typeof CreateRecord>[],
  ): Promise<z.infer<typeof CreateRecordResult>[]> {
    const results = records.map((cr) => {
      const record = {
        topic: cr.topic,
        partition: cr.partition,
        offset: 0n,
        compression: cr.compression || CompressionType.NONE,
        timestamp: 0n,
        key: cr.key,
        value: cr.value,
      };
      // this._storage.writeStream('todo-eve-instance', );
      return {
        record: record,
        // error: 'TODO',
      };
    });

    return results;
  }

  /**
   * List records from a topic
   *
   * @param params - the params to list records
   * @returns a promise listener
   */
  async listRecords(
    _params: z.infer<typeof ListRecords>,
  ): Promise<z.infer<typeof Record>[]> {
    return [
      {
        topic: 'todo-topic',
        partition: 0n,
        offset: 0n,
        timestamp: 0n,
        compression: CompressionType.NONE,
        key: Buffer.from('todo-record-key'),
        value: Buffer.from('todo-record-value'),
      },
    ];
  }

  /**
   * Close the broker and cleanup. This includes closing the http server
   *
   * ```ts
   * await broker.close();
   * ```
   *
   * @returns a promise listener
   */
  async close(): Promise<void> {
    this._logger.info('stopping broker');
  }
}

/**
 * BrokerConfig
 */
type BrokerConfig = {
  logger?: ReturnType<typeof Logger>;
  storage: StorageConfig;
};

export { Broker, BrokerConfig };
