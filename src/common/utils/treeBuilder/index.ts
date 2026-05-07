import type { Tree, TreeNode } from './interfaces';

export class TreeBuilder {
  /**
   * Строит дерево для разрешений (rolePermission)
   * @param data - массив из твоего JSON (rolePermission)
   * @returns готовый массив
   */
  static buildPermissionTree(data: any[]): Tree {
    if (!data || data.length === 0)
      return {
        nodes: [],
      };

    const nodeMap = new Map<number, TreeNode>();
    const roots: TreeNode[] = [];

    // 1. Создаём все узлы
    for (const item of data) {
      const p = item.persmission;

      const node: TreeNode = {
        key: p.code,
        label: p.name,
        children: [],
        isLeaf: false,
        checked: item.granted,
      };

      nodeMap.set(p.id, node);
    }

    // 2. Привязываем детей (сохраняем порядок из массива с бэка)
    for (const item of data) {
      const p = item.persmission;
      const node = nodeMap.get(p.id)!;

      if (p.parentId === null) {
        roots.push(node);
      } else {
        const parent = nodeMap.get(p.parentId);
        if (parent) {
          parent.children!.push(node);
        }
      }
    }

    // 3. Финализация листьев
    for (const node of nodeMap.values()) {
      if (!node.children || node.children.length === 0) {
        node.isLeaf = true;
        node.children = undefined;
      }
    }

    return {
      nodes: roots,
      checkable: true,
      cascade: true,
    };
  }
}
