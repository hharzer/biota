export type FactoryRuleAuthor = 'self' | 'owner' | 'assignee' | 'admin';

export interface FactoryRuleDefinitionPathsOptions {
  immutablePaths?: string[];
}

export interface FactoryRuleDefinitionPaths {
  admin?: FactoryRuleDefinitionPathsOptions;
  self?: FactoryRuleDefinitionPathsOptions;
  owner?: FactoryRuleDefinitionPathsOptions;
  assignee?: FactoryRuleDefinitionPathsOptions;
}
export interface FactoryRuleDefinition<T = FactoryRuleAuthor[] | boolean> {
  immutablePaths?: string[];
  get?: T;
  getHistory?: T;
  getHistoryWhenDeleted?: T;
  getHistoryWhenExpired?: T;
  insert?: T;
  insertHistory?: T;
  update?: T;
  replace?: T;
  delete?: T;
  getWhenDeleted?: T;
  updateWhenDeleted?: T;
  replaceWhenDeleted?: T;
  forgetWhenDeleted?: T;
  expire?: T;
  getWhenExpired?: T;
  updateWhenExpired?: T;
  replaceWhenExpired?: T;
  forgetWhenExpired?: T;
  forget?: T;
  restore?: T;
  remember?: T;
  setOwner?: T;
  removeOwner?: T;
  setAssignee?: T;
  removeAssignee?: T;
  setRole?: T;
  removeRole?: T;
}
