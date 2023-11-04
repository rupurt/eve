import { Workflow } from '@evereactor/workflow';

import type { Workflow as MyWorkflow } from './my-workflow.js';

console.log('TODO... @evereactor/workflow');

const myWorkflow = await Workflow<MyWorkflow>({
  id: 'my-workflow',
  module: new URL('./my-workflow.js', import.meta.url).href,
  config: {},
});

console.log('myWorkflow: %o', myWorkflow);
