import z from 'zod';

const Pong = z.object({
  pong: z.number(),
});

const TopicId = z.object({
  id: z.string(),
});

enum TopicCompressionType {
  NONE = 'none',
  ZSTD = 'zstd',
  GZIP = 'gzip',
  ZIP = 'zip',
  BROTLI = 'brotli',
  SNAPPY = 'snappy',
}

const TopicCompression = z.nativeEnum(TopicCompressionType);

const Topic = TopicId.extend({
  compression: TopicCompression,
});

const Topics = z.object({
  topics: z.array(Topic),
});

const CreateTopicResult = z.object({
  error: z.string().optional(),
});

const Record = z.object({
  key: z.string(),
  offset: z.bigint(),
  timestamp: z.bigint(),
});

const Records = z.object({
  records: z.array(Record),
});

const CreateRecordResult = z.object({
  error: z.string().optional(),
});

const models = {
  Pong,
  TopicId,
  TopicCompression,
  Topic,
  Topics,
  CreateTopicResult,
  Record,
  Records,
  CreateRecordResult,
};

export {
  models,
  Pong,
  TopicId,
  TopicCompressionType,
  TopicCompression,
  Topic,
  Topics,
  CreateTopicResult,
  Record,
  Records,
  CreateRecordResult,
};
