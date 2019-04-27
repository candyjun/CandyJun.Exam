/**
 * @File: information tree component
 * @Author: wush
 */
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContextMenuModule, MenuItem, TreeModule, TreeNode } from 'primeng/primeng';
import { AutofocusDirectiveModule } from './auto-focus.directive';
import { SafeHtmlPipeModule } from './safe-html.pipe';
import { TreeHandler } from '../core/tree-handler';

@Component({
    selector: 'app-components-information-tree',
    template: `
        <div class="p-3" *ngIf="!loading && (value && value.length === 0)">
            <h5 class="text-danger"><i class="fa fa-exclamation-triangle"></i> 暂无数据！</h5>
        </div>
        <p-tree [value]="value"
                [style]="style"
                [loading]="loading"
                [selectionMode]="selectionMode"
                [(selection)]="selectedItems"
                (onNodeSelect)="handleNodeSelect($event)"
                (onNodeUnselect)="handleNodeUnselect()"
                (onNodeContextMenuSelect)="handleNodeContextMenuSelect($event)"
                [contextMenu]="cm">
            <ng-template let-node pTemplate="default">
                <input *ngIf="isRename && nodeToRename === node"
                       (blur)="renameHandler()"
                       [(ngModel)]="node.data.fileRename"
                       type="text" appAutoFocus style="width:100%">
                <span *ngIf="(!isRename || isRename && nodeToRename !== node)">
                    <span *ngIf="node?.data?.supInfoTimes" class="text-primary">{{node?.data?.supInfoTimes}} - </span>
                    <span *ngIf="selectedItems && selectedItems.includes(node)"
                          [ngClass]="{'border rounded border-warning text-warning': selectionMode === 'checkbox' && node === activeNode}"
                          [innerHTML]="node.label | appSafeHtml"></span>
                    <span *ngIf="!(selectedItems && selectedItems.includes(node))"
                          [attr.title]="node.data.synCtobsStatus === -1 ? ('对接业务系统失败：' + node.data.synCtobsRemark) : ''"
                          [class.text-success]="node.data.synCtobsStatus === 1"
                          [class.text-danger]="node.data.synCtobsStatus === -1"
                          [innerHTML]="node.label | appSafeHtml"></span>
                </span>
            </ng-template>
        </p-tree>
        <p-contextMenu appendTo="body" #cm [model]="contextMenuItems"></p-contextMenu>
    `
})
export class InformationTreeComponent {

    public nodeToRename: TreeNode;
    public isRename = false;
    /**
     * 显示 loading
     */
    @Input() public loading: boolean;
    /**
     * 默认选择第一个节点
     */
    @Input() public selectFirstNode: boolean = false;

    /**
     * 树的结构内容数据
     */
    @Input()
    public set value(data: TreeNode[]) {
        if (data) {
            this.dataSource = data;

            if (data.length && this.selectedItems) {
                this.initSelectedItems();
            } else if (data.length && this.selectFirstNode) {
                const node = data[0];
                this.selectedNodes = [node];
                this.handleNodeSelect({ originalEvent: null, node });
            }
        }
    }

    public get value() {
        return this.dataSource;
    }

    /**
     * 树节点选择模式： single, multiple 和 checkbox
     */
    @Input() public selectionMode: 'single' | 'multiple' | 'checkbox' = 'single';

    /**
     * 右键菜单项
     */
    @Input() public contextMenuItems: MenuItem[];

    /**
     * 自定义样式
     */
    @Input() public style: any = { height: '700px', 'overflow-y': 'auto' };

    /**
     * 改变已选择的节点事件
     */
    @Output() public onSelectedNodesChange: EventEmitter<TreeNode[]> = new EventEmitter();

    /**
     * 节点选择事件
     */
    @Output() public onNodeSelect: EventEmitter<any> = new EventEmitter();

    /**
     * 取消节点选择事件
     */
    @Output() public onNodeUnselect: EventEmitter<any> = new EventEmitter();

    /**
     * 选择节点右键菜单事件
     */
    @Output() public onNodeContextMenuSelect: EventEmitter<any> = new EventEmitter();

    /**
     * 重命名
     */
    @Output() public onRename: EventEmitter<TreeNode> = new EventEmitter();

    public activeNode: TreeNode;

    private dataSource: TreeNode[];

    private selectedNodes: TreeNode[];

    public get selectedItems() {
        return this.selectedNodes;
    }

    /**
     * 已选择的节点
     */
    public set selectedItems(items: TreeNode[]) {
        if (this.onSelectedNodesChange) {
            this.onSelectedNodesChange.emit(items);
            this.selectedNodes = items;
        }
    }

    /**
     * 重命名节点
     */
    @Input()
    public set renameNode(node: TreeNode) {
        if (node) {
            this.isRename = true;
            this.nodeToRename = node;
        }
    }

    public handleNodeSelect(event: { originalEvent: MouseEvent, node: TreeNode }) {
        this.activeNode = event.node;
        if (this.onNodeSelect && event.node) {
            this.onNodeSelect.emit(event);
        }
    }

    public handleNodeUnselect() {
        this.activeNode = null;
        if (this.onNodeUnselect) {
            this.onNodeUnselect.emit();
        }
    }

    public handleNodeContextMenuSelect(event: { originalEvent: MouseEvent, node: TreeNode }) {
        if (this.onNodeContextMenuSelect && event.node) {
            this.onNodeContextMenuSelect.emit(event);
        }
    }

    public renameHandler() {
        if (this.onRename) {
            this.onRename.emit(this.nodeToRename);
        }

        this.isRename = false;
        this.nodeToRename = null;
    }

    /**
     * 切换显示节点（上一个/下一个）
     */
    public switchNode(direction: 'previous' | 'next') {
        if (!this.selectedNodes || this.selectedNodes.length !== 1) {
            return;
        }
        const selectedNode = this.selectedNodes[0];
        const siblingNodes = selectedNode.parent ? selectedNode.parent.children : this.value;
        if (siblingNodes.length === 1) {
            return;
        }
        let currentIndex = siblingNodes.findIndex(p => p === selectedNode);
        if (direction === 'previous') {
            currentIndex = currentIndex === 0 ? siblingNodes.length - 1 : currentIndex - 1;
        }
        if (direction === 'next') {
            currentIndex = currentIndex === siblingNodes.length - 1 ? 0 : currentIndex + 1;
        }
        this.selectedNodes = [siblingNodes[currentIndex]];
        this.handleNodeSelect({ originalEvent: null, node: siblingNodes[currentIndex] });
    }

    private initSelectedItems() {
        const containsNode = (selectItems: any[], node: any) => {
            return !!selectItems.find(x => (x.parent === node.parent && x.code === node.code)
                || (x.data.fileId && node.data.fileId && x.data.fileId === node.data.fileId));
        };

        this.selectedNodes = TreeHandler.settingSelectedItems(this.selectionMode, this.dataSource, this.selectedNodes, containsNode);
    }
}

@NgModule({
    imports: [
        CommonModule,
        TreeModule,
        FormsModule,
        ContextMenuModule,
        AutofocusDirectiveModule,
        SafeHtmlPipeModule
    ],
    declarations: [InformationTreeComponent],
    exports: [InformationTreeComponent]
})
export class InformationTreeModule { }
