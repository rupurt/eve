/**
 * Workflow factory which dynamically imports the workflow module and creates an instance
 *
 * @param opts - WorkflowOptions
 * @returns Promise<T>
 */
async function Workflow<C extends WorkflowConfig, T extends WorkflowBase<C>>(
  id: string,
  workerType: Class<T> | URL | string,
  config: C,
): Promise<T> {
  if (typeof workerType == 'function') {
    return new workerType(id, config);
  }

  const moduleUrl: string =
    workerType instanceof URL ? workerType.href : workerType;
  const { Workflow } = await import(moduleUrl);
  return new Workflow(id, config);
}

/**
 * WorkflowBase
 */
class WorkflowBase<C extends WorkflowConfig> {
  protected _id: string;
  protected _config: C;

  constructor(id: string, config: C) {
    this._id = id;
    this._config = config;
  }
}

/**
 * WorkflowConfig
 */
type WorkflowConfig = Record<string, any>;

/**
 * Utility type to encforce that a type can be instantiated
 */
type Class<T> = new (...args: any[]) => T;

/**
 * WorkflowCompose
 */
function WorkflowCompose<C extends WorkflowConfig, T extends WorkflowBase<C>>(
  workflows: T[],
): ComposedWorkflow<C, T> {
  return new ComposedWorkflow(workflows);
}
Workflow.compose = WorkflowCompose;

/**
 * ComposedWorkflow
 */
class ComposedWorkflow<C extends WorkflowConfig, T extends WorkflowBase<C>> {
  private _workflows: T[];

  constructor(workflows: T[]) {
    this._workflows = workflows;
  }

  start() {
    console.log(
      'TODO... ComposedWorkflow#start - workflows: %o',
      this._workflows,
    );
  }
}

export { Workflow, WorkflowBase, WorkflowConfig, ComposedWorkflow };
