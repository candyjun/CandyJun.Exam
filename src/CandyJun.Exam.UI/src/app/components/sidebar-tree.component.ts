/**
 * @File: sidebar tree component
 * @Author: wush
 */
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, Output, ViewChild } from '@angular/core';
import { SidebarModule } from 'primeng/components/sidebar/sidebar';
import { ButtonModule, MenuItem, TreeNode } from 'primeng/primeng';
import { InformationTreeModule, InformationTreeComponent } from './information-tree.component';
import { TreeHandler } from 'app/core/tree-handler';

@Component({
    selector: 'app-components-sidebar-tree',
    template: `
        <div class="ui-inputgroup">
            <button type="button" class="btn first" title="上一张" (click)="switchNode('previous')">
                <i class="fa fa-caret-left"></i>
            </button>
            <button type="button" *ngIf="isShow" (click)="visibleSidebar = true"
                    [attr.title]="selectedMessage.detailMessage" class="btn">
                <i class="fa fa-bars"></i>
                <span [innerHTML]="selectedMessage.shortMessage" class="w-6 text-nowrap"
                      style="display: inline-block; text-overflow: ellipsis;"></span>
            </button>
            <button type="button" class="btn last" title="下一张" (click)="switchNode('next')">
                <i class="fa fa-caret-right"></i>
            </button>
        </div>
        <p-sidebar [(visible)]="visibleSidebar" [position]="position" [fullScreen]="fullScreen"
                   [appendTo]="appendTo" [style]="{width:'30em'}" (onHide)="handleHideSidebar()">
            <app-components-information-tree
                    [selectionMode]="treeSelectionMode" [value]="treeDataSource"
                    [loading]="loading" [selectFirstNode]="selectFirstNode"
                    [style]="{'width': '100%', 'height': '100%'}"
                    [contextMenuItems]="contextMenuItems" [renameNode]="renameNode"
                    (onRename)="renameHandler($event)" (onNodeSelect)="handleTreeNodeSelect($event)"
                    (onNodeUnselect)="handleTreeNodeUnselect()"
                    (onNodeContextMenuSelect)="handleTreeNodeSelect($event)"
                    (onSelectedNodesChange)="selectedNodesChange($event)"></app-components-information-tree>
        </p-sidebar>
    `,
    styles: [`
        .btn {
            color: #20a0ff;
            background-color: white;
            height: 29px;
            border: 1px solid #ccc;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            cursor: pointer;
        }

        .btn.first {
            border-right: 0 !important;
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
        }

        .btn.last {
            border-left: 0 !important;
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
        }
    `]
})
export class SidebarTreeComponent {

    /**
     * 是否显示打开侧边栏的按钮
     */
    @Input() public isShow: boolean = true;

    /**
     * 默认选择第一个节点
     */
    @Input() public selectFirstNode: boolean = false;

    /**
     * 侧边栏位置（left, right, top, bottom），默认为 left
     */
    @Input() public position: 'left' | 'right' | 'top' | 'bottom' = 'left';

    /**
     * 是否全屏显示，默认为 false
     */
    @Input() public fullScreen: boolean = false;

    /**
     * 侧边栏附加的标签节点，可以为 body 或其他节点变量
     */
    @Input() public appendTo: string;

    /**
     * 显示 loading
     */
    @Input() public loading: boolean;

    /**
     * 重命名节点
     */
    @Input() public renameNode: TreeNode;

    /**
     * 树内容的数据源
     */
    @Input() public treeDataSource: TreeNode[];

    /**
     * 树节点选择模式: single, multiple 及 checkbox
     */
    @Input() public treeSelectionMode: string = 'single';

    /**
     * 右键菜单项
     */
    @Input() public contextMenuItems: MenuItem[];

    /**
     * 重命名
     */
    @Output() public onRename: EventEmitter<TreeNode> = new EventEmitter();

    /**
     * 改变已选择的节点事件
     */
    @Output() public onSelectedNodesChange: EventEmitter<TreeNode[]> = new EventEmitter();

    @Output() public onShow: EventEmitter<any> = new EventEmitter();

    @Output() public onHide: EventEmitter<TreeNode[]> = new EventEmitter();

    @Output() public onTreeNodeSelect: EventEmitter<TreeNode> = new EventEmitter();

    @Output() public onTreeNodeUnSelect: EventEmitter<TreeNode> = new EventEmitter();

    @ViewChild(InformationTreeComponent) public informationTree: InformationTreeComponent;

    public visibleSidebar: boolean = false;

    public selectedItems: TreeNode[] = [];

    public selectedMessage: {
        shortMessage: string,
        detailMessage: string,
    } = {
        shortMessage: '点击选择',
        detailMessage: '点击选择'
    };

    /**
     * 切换显示节点（上一个/下一个）
     */
    public switchNode(direction: 'previous' | 'next') {
        this.informationTree.switchNode(direction);
    }

    public handleHideSidebar(/*event: Event*/) {
        this.setDetailMessage();

        if (this.onHide) {
            this.onHide.emit(this.selectedItems);
        }
    }

    public handleTreeNodeSelect(event: { originalEvent: MouseEvent, node: TreeNode }) {
        if (this.onTreeNodeSelect) {
            if (!this.visibleSidebar) {
                this.selectedItems = [event.node];
                this.setDetailMessage();
            } else {
                this.visibleSidebar = false;
            }
            this.onTreeNodeSelect.emit(event.node);
        }
    }

    public handleTreeNodeUnselect() {
        if (this.onTreeNodeUnSelect) {
            this.onTreeNodeUnSelect.emit();
        }
    }

    /**
     * 改变已选择的节点事件
     */
    public selectedNodesChange(event: TreeNode[]) {
        this.selectedItems = [].concat(event);
        if (this.onSelectedNodesChange) {
            this.onSelectedNodesChange.emit(this.selectedItems);
        }
    }

    public renameHandler(event: TreeNode) {
        if (this.onRename) {
            this.onRename.emit(event);
        }
    }

    private getDetailSelectedMessage(node: TreeNode) {
        const result: TreeNode[] = TreeHandler.treePath(node);
        return result.map(x => x.label).join(' > ');
    }

    private setDetailMessage() {
        const selectedNodes = [].concat(this.selectedItems);
        this.selectedItems = selectedNodes;

        if (selectedNodes.length) {
            this.selectedMessage.shortMessage = selectedNodes.map(item => item.label).join(' , ');

            this.selectedMessage.detailMessage = selectedNodes.map(item => {
                return this.getDetailSelectedMessage(item);
            }).join(' | ');
        }
    }
}

@NgModule({
    imports: [
        CommonModule,
        SidebarModule,
        ButtonModule,
        InformationTreeModule
    ],
    declarations: [SidebarTreeComponent],
    exports: [SidebarTreeComponent]
})
export class SidebarTreeModule {}
