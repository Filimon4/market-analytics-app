import { Tree } from '@src/common/utils/treeBuilder/interfaces';

export type RoleEntity = {
  id: number;
  title: string;
  code: string;
  default: 0 | 1;
  tree: Tree;
  deleted: 0 | 1;
};
