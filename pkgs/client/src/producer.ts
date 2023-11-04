import { Header } from '@evereactor/protocol';

import { Logger } from './logger.js';
import { NotImplementedError } from './error.js';

/**
 * An Eve client that publishes records to the Eve cluster.
 */
class Producer {
  private _brokers: string[];
  private _topic: string;
  private _logger: ReturnType<typeof Logger>;

  constructor(opts: ProducerOptions) {
    this._brokers = opts.brokers;
    this._topic = opts.topic;
    this._logger = opts.logger || Logger();
  }

  async close(_timeout?: number): Promise<void> {
    throw new NotImplementedError(`${this.constructor}#close not implemented`);
  }

  abortTransaction(): void {
    throw new NotImplementedError(
      `${this.constructor}#abortTransaction not implemented`,
    );
  }

  beginTransaction(): void {
    throw new NotImplementedError(
      `${this.constructor}#beginTransaction not implemented`,
    );
  }

  commitTransaction(): void {
    throw new NotImplementedError(
      `${this.constructor}#commitTransaction not implemented`,
    );
  }

  flush(): void {
    throw new NotImplementedError(`${this.constructor}#flush not implemented`);
  }

  initTransactions(): void {
    throw new NotImplementedError(
      `${this.constructor}#initTransactions not implemented`,
    );
  }

  metrics(): void {
    throw new NotImplementedError(
      `${this.constructor}#metrics not implemented`,
    );
  }

  async send<T extends ProducerRecord>(
    record: T,
    _callback?: Function,
  ): Promise<ProducerAck> {
    return new Promise(async (resolve, reject) => {
      this._logger.debug(`${this.constructor.name}#send begin`);
      this._logger.debug(`${this.constructor.name} record - %o`, record);
      this._logger.debug(`${this.constructor.name}#send end`);

      const brokerUrl = `http://${this._brokers[0]}`;

      this._logger.debug('@@@@@@@@@@ BROKER URL: %o', brokerUrl);

      return fetch(brokerUrl, {
        method: 'POST',
        body: JSON.stringify({ message: 'Hello from Bun!' }),
        headers: { 'Content-Type': 'application/json' },
      })
        .then((response) => {
          this._logger.debug('@@@@@@@@@@ RESPONSE: %o', response);
          resolve({ offset: 1n });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  sendOffsetsToTransaction(): void {
    throw new NotImplementedError(
      `${this.constructor}#sendOffsetsToTransaction not implemented`,
    );
  }
}

/**
 * ProducerOptions
 */
type ProducerOptions = {
  brokers: string[];
  topic: string;
  logger?: ReturnType<typeof Logger>;
};

/**
 * ProducerRecord
 */
type ProducerRecord = {
  key?: Uint8Array;
  value?: Uint8Array;
  headers?: Header[];
};

/**
 * ProducerAck
 */
type ProducerAck = {
  offset: BigInt;
};

export { Producer, ProducerOptions, ProducerRecord, ProducerAck };
