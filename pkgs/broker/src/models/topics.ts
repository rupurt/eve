import z from 'zod';

import { CompressionType } from './compression.js';

const TopicName = z.string();
const TopicPartition = z.bigint();
const TopicCompression = z.nativeEnum(CompressionType);
const Topic = z.object({
  name: TopicName,
  partitions: TopicPartition,
  compression: TopicCompression,
});
const Topics = z.array(Topic);

const ListTopicsResult = z.object({
  topics: Topics,
});

const GetTopic = z.object({
  name: TopicName,
});
const GetTopicResult = z.object({
  topic: Topic,
});

const CreateTopic = z.object({
  name: TopicName,
  partitions: TopicPartition,
  compression: TopicCompression.optional(),
});
const CreateTopics = z.object({
  topics: z.array(CreateTopic),
});
const CreateTopicResult = z.object({
  topic: Topic,
  error: z.string().optional(),
});
const CreateTopicsResult = z.object({
  results: z.array(CreateTopicResult),
});

const DeleteTopic = z.object({
  name: TopicName,
});
const DeleteTopicResult = z.object({
  topic: Topic,
});

const topicModels = {
  TopicName,
  TopicPartition,
  TopicCompression,
  Topic,
  Topics,
  CreateTopic,
  CreateTopics,
  CreateTopicResult,
  CreateTopicsResult,
  ListTopicsResult,
  GetTopic,
  GetTopicResult,
  DeleteTopic,
  DeleteTopicResult,
};

export {
  topicModels,
  CompressionType,
  TopicName,
  TopicPartition,
  TopicCompression,
  Topic,
  Topics,
  CreateTopic,
  CreateTopics,
  CreateTopicResult,
  CreateTopicsResult,
  ListTopicsResult,
  GetTopic,
  GetTopicResult,
  DeleteTopic,
  DeleteTopicResult,
};
