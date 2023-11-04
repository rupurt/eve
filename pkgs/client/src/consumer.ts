import { Header } from '@evereactor/protocol';

import { Logger } from './logger.js';
import { NotImplementedError } from './error.js';

/**
 * A client that consumes records from an Eve cluster.
 *
 * This client transparently handles the failure of Eve brokers, and transparently adapts as
 * topic partitions it fetches migrate within the cluster. This client also interacts with
 * the broker to allow groups of consumers to load balance consumption using consumer groups.
 *
 * The consumer maintains connections to the necessary brokers to fetch data. Failure to
 * close the consumer after use will leak these connections.
 */
class Consumer {
  private _brokers: string[];
  private _logger: ReturnType<typeof Logger>;

  constructor(opts: ConsumerOptions) {
    this._brokers = opts.brokers;
    this._logger = opts.logger || Logger();
  }

  async close(_timeout?: number): Promise<void> {
    throw new NotImplementedError(`${this.constructor}#close not implemented`);
  }

  commitAsync(): void {
    throw new NotImplementedError(
      `${this.constructor}#commitAsync not implemented`,
    );
  }

  commitSync(): void {
    throw new NotImplementedError(
      `${this.constructor}#commitSync not implemented`,
    );
  }

  committed(): void {
    throw new NotImplementedError(
      `${this.constructor}#committed not implemented`,
    );
  }

  endOffsets(): void {
    throw new NotImplementedError(
      `${this.constructor}#endOffsets not implemented`,
    );
  }

  enforceRebalance(): void {
    throw new NotImplementedError(
      `${this.constructor}#enforceRebalance not implemented`,
    );
  }

  groupMetadata(): void {
    throw new NotImplementedError(
      `${this.constructor}#groupMetadata not implemented`,
    );
  }

  listTopics(): void {
    throw new NotImplementedError(
      `${this.constructor}#listTopics not implemented`,
    );
  }

  metrics(): void {
    throw new NotImplementedError(
      `${this.constructor}#metrics not implemented`,
    );
  }

  pause(): void {
    throw new NotImplementedError(`${this.constructor}#pause not implemented`);
  }

  paused(): void {
    throw new NotImplementedError(`${this.constructor}#paused not implemented`);
  }

  poll(_timeout?: number): void {
    throw new NotImplementedError(`${this.constructor}#poll not implemented`);
  }

  resume(): void {
    throw new NotImplementedError(`${this.constructor}#resume not implemented`);
  }

  seek(): void {
    throw new NotImplementedError(`${this.constructor}#seek not implemented`);
  }

  seekToBeginning(): void {
    throw new NotImplementedError(
      `${this.constructor}#seekToBeginning not implemented`,
    );
  }

  seekToEnd(): void {
    throw new NotImplementedError(
      `${this.constructor}#seekToEnd not implemented`,
    );
  }

  subscribe(_topics: string | string[]): void {
    throw new NotImplementedError(
      `${this.constructor}#subscribe not implemented`,
    );
  }

  subscription(): void {
    throw new NotImplementedError(
      `${this.constructor}#subscription not implemented`,
    );
  }

  unsubscribe(): void {
    throw new NotImplementedError(
      `${this.constructor}#unsubscribe not implemented`,
    );
  }

  wakeup(): void {
    throw new NotImplementedError(`${this.constructor}#wakeup not implemented`);
  }
}

/**
 * ConsumerOptions
 */
type ConsumerOptions = {
  brokers: string[];
  groupId?: string;
  logger?: ReturnType<typeof Logger>;
};

/**
 * ConsumerRecord
 */
type ConsumerRecord = {
  key: Uint8Array;
  value?: Uint8Array;
  headers: Header[];
};

/**
 * ConsumerAck
 */
type ConsumerAck = {
  offset: BigInt;
};

export { ConsumerOptions, Consumer, ConsumerRecord, ConsumerAck };
