import { topicModels } from './topics.js';
import { recordModels } from './records.js';
import { probeModels } from './probes.js';

const models = {
  ...topicModels,
  ...recordModels,
  ...probeModels,
};

export { models };

export * from './compression.js';
export * from './topics.js';
export * from './records.js';
export * from './probes.js';
