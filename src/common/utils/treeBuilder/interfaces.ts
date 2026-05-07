export interface Tree {
  nodes: TreeNode[];
  checkable?: boolean;
  cascade?: boolean;
}

export interface TreeNode {
  key: string | number;
  label: string;
  children?: TreeNode[] | undefined;
  disabled?: boolean;
  isLeaf?: boolean;
  checked?: boolean;
}
