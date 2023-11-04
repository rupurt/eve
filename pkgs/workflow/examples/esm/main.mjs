import { Workflow } from '@evereactor/workflow/esm';

console.log('TODO... @evereactor/workflow');

const myWorkflow = await Workflow({
  id: 'my-workflow',
  module: new URL('./my-workflow.js', import.meta.url).href,
  config: {},
});

console.log('myWorkflow: %o', myWorkflow);
