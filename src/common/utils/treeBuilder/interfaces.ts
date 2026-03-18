export interface Tree {
  nodes: TreeNode[];
  defaultCheckedKeys?: string[];
  checkable?: boolean;
  draggable?: boolean;
}

export interface TreeNode {
  key: string | number;
  label: string;
  children?: TreeNode[] | undefined;
  disabled?: boolean;
  isLeaf?: boolean;
  checkboxDisabled?: boolean;
}
