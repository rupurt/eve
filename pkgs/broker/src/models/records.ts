import z from 'zod';

import { CompressionType } from './compression.js';
import { TopicName, TopicPartition } from './topics.js';

const RecordOffset = z.bigint();
const RecordTimestamp = z.bigint();
const RecordCompression = z.nativeEnum(CompressionType);
const RecordKey = z.instanceof(Uint8Array);
const RecordValue = z.instanceof(Uint8Array);
const Record = z.object({
  topic: TopicName,
  partition: TopicPartition,
  offset: RecordOffset,
  timestamp: RecordTimestamp,
  compression: RecordCompression,
  key: RecordKey,
  value: RecordValue,
});
const Records = z.array(Record);

const CreateRecord = z.object({
  topic: TopicName,
  partition: TopicPartition,
  key: RecordKey,
  value: RecordValue,
  compression: RecordCompression.optional(),
});
const CreateRecords = z.object({
  records: z.array(CreateRecord),
});
const CreateRecordResult = z.object({
  record: Record,
  error: z.string().optional(),
});
const CreateRecordsResult = z.object({
  results: z.array(CreateRecordResult),
});

const ListRecords = z.object({
  topics: z.array(TopicName),
});
const ListRecordsResult = z.object({
  records: Records,
});

const recordModels = {
  RecordOffset,
  RecordTimestamp,
  RecordCompression,
  RecordKey,
  RecordValue,
  Record,
  Records,
  CreateRecord,
  CreateRecords,
  CreateRecordResult,
  CreateRecordsResult,
  ListRecords,
  ListRecordsResult,
};

export {
  recordModels,
  RecordOffset,
  RecordTimestamp,
  RecordCompression,
  RecordKey,
  RecordValue,
  Record,
  Records,
  CreateRecord,
  CreateRecords,
  CreateRecordResult,
  CreateRecordsResult,
  ListRecords,
  ListRecordsResult,
};
