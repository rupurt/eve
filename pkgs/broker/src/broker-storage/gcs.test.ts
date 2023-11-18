import { beforeEach, afterEach, expect, test } from 'bun:test';

import { BrokerStorage } from '../broker-storage.js';
import { BrokerStorageFactory } from '../factories';

let brokerStorage: BrokerStorage;

// beforeEach(() => {
//   brokerStorage = BrokerStorageFactory.createGCS({
//   });
// });
// afterEach(() => {
//   // brokerStorage.delete();
// });
//
// test('can create, list and delete topics', async () => {
//   expect(1).toEqual(1);
// });
