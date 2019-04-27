/**
 * @File: tree handler
 * @Author: wush
 */
import { TreeNode } from 'primeng/primeng';

export class TreeHandler {

    /**
     * 复制符合条件的树结构
     *
     * @static
     * @template TTreeNode 树节点类型
     * @param {TTreeNode} root 根结点
     * @param {(node: TTreeNode) => boolean} conditionFn 条件方法
     * @returns {TTreeNode} 符合条件的树结构
     * @memberof TreeHandler
     * @example
     *      const conditionFn = (node: TypedTreeNode<GetInformationOutput>) => node.data.fileId;
     *      const tempNode = TreeHandler.clone(root, conditionFn);
     */
    public static clone<TTreeNode extends TreeNode>(root: TTreeNode, conditionFn: (node: TTreeNode) => boolean): TTreeNode {

        const copy = (node: TTreeNode) => { return Object.assign({}, node, { parent: null, children: [] }); };

        const recursiveNodes = (node: TTreeNode) => {
            if (node.children && node.children.length === 0) {
                if (conditionFn(node)) {
                    return copy(node);
                } else {
                    return null;
                }
            }

            const output = copy(node);
            if (node.children) {
                node.children.forEach(function (item) {
                    const child = recursiveNodes(<TTreeNode>item);
                    if (child) {
                        child.label = (child.children && child.children.length) ?
                            `${child.data.dataName}(${child.children.length})`
                            : child.data.dataName;
                        output.children.push(child);
                    }
                });
            }
            return output;
        };

        return recursiveNodes(root);
    }

    /**
     * 复制树结构
     * @param nodes 原始树节点集合
     * @param assignNode 需要更改的树节点属性值集合
     */
    public static copyTree<TTreeNode extends TreeNode>(nodes: TTreeNode[], assignNode?: TTreeNode | TreeNode) {
        if (!nodes.length) {
            return [];
        }

        const recursiveNodes = (node: TTreeNode) => {
            const newNode = Object.assign({}, node, { parent: null, children: [] }, assignNode);
            if (node.children && node.children.length) {
                node.children.forEach(p => {
                    const childNode = recursiveNodes(<TTreeNode>p);
                    childNode.parent = newNode;
                    newNode.children.push(childNode);
                });
            }
            return newNode;
        };

        return nodes.map(p => (recursiveNodes(p)));
    }

    /**
     * 节点的路径
     *
     * @static
     * @template TTreeNode 树节点类型
     * @param {TTreeNode} node 节点
     * @returns {TTreeNode[]} 节点路径所经过的节点列表
     * @memberof TreeHandler
     */
    public static treePath<TTreeNode extends TreeNode>(node: TTreeNode): TTreeNode[] {
        const result: TTreeNode[] = [];

        const recursiveNodes = (treeNode: TTreeNode) => {
            if (!treeNode.parent) {
                result.push(treeNode);
                return;
            }

            recursiveNodes(<TTreeNode>treeNode.parent);
            result.push(treeNode);
        };

        recursiveNodes(node);

        return result;
    }

    /**
     * 设置结点选中状态
     *
     * @static
     * @template TTreeNode 树节点类型
     * @param {('single' | 'multiple' | 'checkbox')} [selectionMode='multiple'] 节点选择类型
     * @param {TTreeNode[]} roots 根节点列表
     * @param {TTreeNode[]} selectedNodes 选中节点列表
     * @param {(selectedNodes: TTreeNode[], node: TTreeNode) => boolean} nodeSelectedFn 判断节点选中的方法
     * @returns {TTreeNode[]} 选中状态的结点列表
     * @memberof TreeHandler
     * @example
     *     const containsNode = (selectItems: TreeNode[], node: TreeNode) => {
     *       return !!selectItems.find(x => isEqual(x.data, node.data);
     *      };
     *
     *      this.selectedNodes = TreeHandler.settingSelectedItems('multiple', roots, this.selectedNodes, containsNode);
     */
    public static settingSelectedItems<TTreeNode extends TreeNode>(
        selectionMode: 'single' | 'multiple' | 'checkbox' = 'multiple',
        roots: TTreeNode[],
        selectedNodes: TTreeNode[],
        nodeSelectedFn: (selectedNodes: TTreeNode[], node: TTreeNode) => boolean
    ): TTreeNode[] {
        return selectionMode === 'single'
            ? this.settingSingleSelectionMode(roots, selectedNodes, nodeSelectedFn)
            : this.settingMultipleSelectionMode(roots, selectedNodes, nodeSelectedFn);
    }

    /**
     * 设置单选状态下的结点选中状态
     *
     * @private
     * @static
     * @template TTreeNode 树节点类型
     * @param {TTreeNode[]} roots 根节点列表
     * @param {TTreeNode[]} selectedNodes 选中节点列表
     * @param {(selectedNodes: TTreeNode[], node: TTreeNode) => boolean} nodeSelectedFn 判断节点选中的方法
     * @returns {TTreeNode[]} 选中状态的结点列表
     * @memberof TreeHandler
     */
    private static settingSingleSelectionMode<TTreeNode extends TreeNode>(
        roots: TTreeNode[],
        selectedNodes: TTreeNode[],
        nodeSelectedFn: (selectedNodes: TTreeNode[], node: TTreeNode) => boolean): TTreeNode[] {

        const temp = [].concat(selectedNodes);
        const selected: TTreeNode[] = [];

        const recursiveNodes = (node: TTreeNode) => {
            if (selected.length) {
                return;
            }

            if (node.selectable && nodeSelectedFn(temp, node)) {
                selected.push(node);
                return;
            }

            node.children.forEach(item => {
                recursiveNodes(<TTreeNode>item);
            });
        };

        roots.forEach(item => {
            recursiveNodes(item);
        });

        return selected;
    }

    /**
     * 设置多选状态下的结点选中状态
     *
     * @private
     * @static
     * @template TTreeNode 树节点类型
     * @param {TTreeNode[]} roots 根节点列表
     * @param {TTreeNode[]} selectedNodes 选中节点列表
     * @param {(selectedNodes: TTreeNode[], node: TTreeNode) => boolean} nodeSelectedFn 判断节点选中的方法
     * @returns {TTreeNode[]} 选中状态的结点列表
     * @memberof TreeHandler
     */
    private static settingMultipleSelectionMode<TTreeNode extends TreeNode>(
        roots: TTreeNode[],
        selectedNodes: TTreeNode[],
        nodeSelectedFn: (selectedNodes: TTreeNode[], node: TTreeNode) => boolean): TTreeNode[] {

        const temp = [].concat(selectedNodes);
        const selected: TTreeNode[] = [];

        const difference = function (arr1: TreeNode[], arr2: TreeNode[]) {
            return arr1.filter(function (i) { return arr2.indexOf(i) < 0; });
        };

        const recursiveNodes = (node: TTreeNode) => {
            if (nodeSelectedFn(temp, node)) {
                selected.push(node);
            }

            if (node.children === null || node.children.length === 0) {
                return;
            }

            node.children.forEach(item => {
                recursiveNodes(<TTreeNode>item);
            });

            if (node.children.length) {
                const count = difference(node.children, selected).length;
                if (count === 0) {
                    selected.push(node);
                }

                node.partialSelected = count > 0;
            }
        };

        roots.forEach(item => {
            recursiveNodes(item);
        });
        return selected;
    }
}
