/**
 * @File: sidebar tree editor component
 * @Author: wush
 */
import { Component, EventEmitter, Input, NgModule, Output, ViewChild } from '@angular/core';
import { EnumAllAuthInfoType } from 'app/api/esd-service/enums/all-authInfo-type';
import { EnumAuditState } from 'app/api/esd-service/enums/audit-state';
import { EnumUserBasicInfo } from 'app/api/esd-service/enums/user-information-basic-info';
import { InformationsApiService } from 'app/api/esd-service/informations.api';
import { FileSystemFileInfoApiService } from 'app/api/file-system/file-infos.api';
import { GetFileInfoOutput } from 'app/api/file-system/models/get-file-info-output.model';
import { AuthService } from 'app/core/auth.service';
import { MessageService } from 'app/core/message.service';
import { SharedModule } from 'app/shared/shared.module';
import { MenuItem, TreeNode, } from 'primeng/primeng';
import { PartialObserver } from 'rxjs/Observer';
import { PhotoEditor } from './photo-editor/photo-editor';
import { PhotoEditorModule } from './photo-editor/photo-editor.module';
import { SidebarTreeModule } from './sidebar-tree.component';
import { PhotoEditorComponent } from 'app/components/photo-editor/photo-editor.component';
import { CmdInformationApiService } from 'app/api/customer-center/informations/information-api';
import { CmdInformationInfoOutput } from 'app/api/customer-center/informations/models/information-info.output';
import { environment } from 'environments/environment';
import { InformationUploadInput } from 'app/api/customer-center/informations/models/information-upload.input';
import { formatDateTime } from 'app/shared/format-date';
import { InformationTreeCodes } from 'app/custom/ticket-handler.tabs/informations-audit/information-tree-code-model';

@Component({
    selector: 'app-components-sidebar-tree-editor',
    template: `
        <div class="p-3">
            <div class="canvas-tools clearfix d-block text-nowrap">
                <div class="float-left">
                    <app-components-sidebar-tree [selectFirstNode]="true" [position]="position" [fullScreen]="fullScreen"
                                                 [appendTo]="appendTo" [renameNode]="renameNode" [contextMenuItems]="contextMenuItems"
                                                 [treeSelectionMode]="treeSelectionMode" [treeDataSource]="treeDataSource"
                                                 (onSelectedNodesChange)="handleSelectedNodesChange()"
                                                 (onTreeNodeSelect)="handleTreeNodeSelect($event)">
                    </app-components-sidebar-tree>
                    <app-components-photo-editor-tools [photoEditor]="photoEditor" [disabled]="noFile || isPowerOfAttorney()"
                                                       [isShowImgSaveButton]="isShowImgSaveButton" (saveHandler)="save($event)">
                    </app-components-photo-editor-tools>
                </div>
                <div class="float-right" *ngIf="isShowImgSaveButton && isNotOtherInfo() && isNotMergeIdCard()">
                    <button pButton type="button" (click)="access()" [disabled]="isNotAccess()"
                            icon="fa-lg fa-check" title="符合"></button>
                    <button pButton type="button" (click)="forbid()" [disabled]="isNotAudit()"
                            icon="fa-lg fa-minus" title="不符合"></button>
                    <button pButton type="button" icon="fa-lg fa-history" id="resetState"
                            (click)="resetState()"
                            [disabled]="isNotFile() || (!isNotAudit() && !isNotAccess())" title="取消符合状态"></button>
                </div>
            </div>
            <div class="clearfix">
                <app-components-photo-editor paste="true" [showTools]="false"
                        [width]="canvasWidth" [height]="canvasHeight"
                        [imagesUrl]="imagesUrl" (afterPaste)="handleAfterPaste($event)"
                        (afterCreatePhotoEditorHandler)="afterCreatePhotoEditorHandler($event)">
                </app-components-photo-editor>
            </div>
        </div>
    `,
    styles: [`
        :host::ng-deep .ui-tree-container {
            text-align: left;
        }

        :host::ng-deep .ui-sidebar-close {
            display: none;
        }
    `]
})
export class SidebarTreeEditorComponent {
    public photoEditor: PhotoEditor;
    public imagesUrl: string;
    public noFile: boolean = true;
    public isPaste: boolean = false;
    public treeDataSource: TreeNode[] = [];
    @Input() public entryId: string;
    @Input() public ticketId: number;
    @Input() public isShowImgSaveButton: boolean;
    @ViewChild(PhotoEditorComponent) public imgEditorEle: PhotoEditorComponent;
    // 刷新数据源
    @Input()
    public set refreshTreeDataSource(value: boolean) {
        if (value) {
            this.init();
        }
    }

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
     * 重命名节点
     */
    @Input() public renameNode: TreeNode;
    /**
     * 编辑器宽度
     */
    @Input() public canvasWidth: number;
    /**
     * 编辑器高度
     */
    @Input() public canvasHeight: number;
    /**
     * 树节点选择模式: single, multiple 及 checkbox
     */
    @Input() public treeSelectionMode: 'single' | 'multiple' | 'checkbox' = 'multiple';
    /**
     * 右键菜单项
     */
    @Input() public contextMenuItems: MenuItem[];

    @Output() public onTreeNodeSelect: EventEmitter<TreeNode> = new EventEmitter();
    @Output() public onRefreshTreeDataSource: EventEmitter<void> = new EventEmitter<void>();
    /**
     * 选择的所有节点（多选）
     */
    public selectedItems: TreeNode[] = [];
    /**
     * 当前所选的节点
     */
    public selectedItem: TreeNode;
    private treeSourceCode: EnumAllAuthInfoType[];
    private imgNames: string[] = [];

    public constructor(private authService: AuthService,
        private messageService: MessageService,
        private fileSystemFileInfoApiService: FileSystemFileInfoApiService,
        private cmdInformationApiService: CmdInformationApiService,
        private informationsApiService: InformationsApiService) {
    }

    /**
     * 树内容的数据源
     */
    @Input()
    public set treeDataSourceCode(code: EnumAllAuthInfoType[]) {
        this.treeSourceCode = [].concat(code);
        this.init();
    }

    // 改变已选择的节点事件
    public handleSelectedNodesChange() {
        this.selectedItems = [].concat(event);
    }

    public handleTreeNodeSelect(node: TreeNode) {
        if (node.data.fileId) {
            this.imgNames = node.parent.children.map(item => (item.data.fileName));
        } else {
            if (node.children) {
                this.imgNames = node.children.map(item => (item.data.fileName));
            }
        }
        this.selectedItem = node;
        if (this.photoEditor) {
            this.photoEditor.clear();
        }
        if (this.selectedItem.data.operFileId || this.selectedItem.data.fileId) {
            this.viewSelectedFile();
        }
        if (this.onTreeNodeSelect) {
            this.onTreeNodeSelect.emit(node);
        }
    }

    public handleAfterPaste(file: Blob) {
        this.noFile = !this.noFile;
        const hasFile = file;
        this.isPaste = !!hasFile;
        setTimeout(() => this.noFile = !hasFile);
    }

    public afterCreatePhotoEditorHandler(editor: PhotoEditor) {
        this.photoEditor = editor;
    }

    public save(file: string) {
        if (this.isPaste) {
            // 若是粘贴，则默认为保存新增图片
            this.saveNewImage(file);
        } else if (this.selectedItem) {
            // 保存编辑后的图片
            this.saveEditImage(file);
        }
    }

    // 符合
    public access() {
        this.messageService.showLoading();
        this.auditInformation(EnumAuditState.审核通过, '图片审核通过！');
    }

    // 不符合
    public forbid() {
        this.messageService.showLoading();
        this.auditInformation(EnumAuditState.审核不通过, '图片审核不通过！');
    }

    /**
     * 资料审核
     * @param auditState 审核状态
     * @param prompt 提示
     */
    public auditInformation(auditState: EnumAuditState, prompt: string) {
        // 待审核的必须是文件
        if (this.selectedItem && this.selectedItem.data && this.selectedItem.data.fileId) {
            // 资料审核通过
            this.selectedItem.data.auditState = auditState;
            this.selectedItem.data.auditTime = formatDateTime(new Date());
            this.selectedItem.data.auditManagerId = this.authService.currentUserInfo.UserName;
            if (auditState === EnumAuditState.审核通过) {
                this.informationsApiService.getBsCategoryId(this.selectedItem.data.dataCode).subscribe(bsCategoryId => {
                    this.selectedItem.data.bsCategoryId = bsCategoryId;
                    // 更新资料
                    this.cmdInformationApiService.update(this.selectedItem.data).subscribe(res => {
                        this.messageService.info(prompt);
                        this.initTreeData();
                        this.messageService.hideLoading();
                    });
                });
            } else if (auditState === EnumAuditState.审核不通过) {
                this.selectedItem.data.operFileId = this.selectedItem.data.operFileId ?
                    this.selectedItem.data.operFileId : this.selectedItem.data.fileId;
                this.cmdInformationApiService.update(this.selectedItem.data).subscribe(res => {
                    this.messageService.info(prompt);
                    this.initTreeData();
                    this.messageService.hideLoading();
                });
            } else {
                this.cmdInformationApiService.update(this.selectedItem.data).subscribe(res => {
                    this.messageService.info(prompt);
                    this.initTreeData();
                    this.messageService.hideLoading();
                });
            }
        }
    }

    /**
     * 取消符合状态
     *
     */
    public resetState() {
        this.messageService.showLoading();
        this.auditInformation(EnumAuditState.未审核, '重置图片为未审核！');
    }

    /**
     * 授权委托书有如下限制：
     *  只能进行符合、不符合、撤销操作；
     *  不能进行右键、图片编辑等操作
     */
    public isPowerOfAttorney() {
        return this.selectedItem && this.selectedItem.data && this.selectedItem.data.code === EnumUserBasicInfo.授权委托书;
    }

    public isNotMergeIdCard(): boolean {
        const mergeIdCardCode = EnumUserBasicInfo.合并身份证;
        return this.isNotFile() || (this.selectedItem && this.selectedItem.data.fileId && this.selectedItem.data.code !== mergeIdCardCode);
    }

    public isNotFile(): boolean {
        return !this.selectedItem || (this.selectedItem && !this.selectedItem.data.fileId);
    }

    public isNotAudit() {
        return this.isNotFile() || (this.selectedItem && this.selectedItem.data.auditState === EnumAuditState.审核不通过);
    }

    public isNotAccess() {
        return this.isNotFile() || (this.selectedItem && this.selectedItem.data.auditState === EnumAuditState.审核通过);
    }

    // 重置编辑器大小
    public resizeCanvas(width: number, height: number) {
        this.imgEditorEle.photoEditor.resizeCanvas(width, height);
    }

    // 不是其他认证资料
    public isNotOtherInfo() {
        return !this.isNotFile()
            && (this.isBaseInfo() && this.isShowImgSaveButton);
    }

    private isOtherInfo() {
        return this.selectedItem && this.selectedItem.data && this.selectedItem.data.isBackAudit
            && this.selectedItem.data.code !== EnumUserBasicInfo.合并身份证;
    }

    private isBaseInfo() {
        return this.selectedItem && this.selectedItem.data && (!this.selectedItem.data.isBackAudit
            || this.selectedItem.data.code === EnumUserBasicInfo.合并身份证);
    }

    private viewSelectedFile() {
        const partialObserver: PartialObserver<GetFileInfoOutput> = {
            next: (value) => {
                this.messageService.hideLoading();
                if (value && value.downloadUrl) {
                    this.imagesUrl = value.downloadUrl;
                    this.noFile = !this.noFile;
                    setTimeout(() => this.noFile = false);
                } else {
                    this.messageService.error('文件信息不存在或已被删除!');
                }
            },
            error: () => {
                this.messageService.hideLoading();
                this.messageService.error('文件信息不存在或已被删除!');
            }
        };
        // 其他资料认证图片
        if (this.isOtherInfo()) {
            this.messageService.showLoading();
            this.fileSystemFileInfoApiService.getFileInfo(this.selectedItem.data.fileId).subscribe(partialObserver);
        } else if (this.isBaseInfo()) {
            this.messageService.showLoading();
            this.fileSystemFileInfoApiService
                .getFileInfo(this.selectedItem.data.operFileId || this.selectedItem.data.fileId)
                .subscribe(partialObserver);
        } else {
            this.photoEditor.clear();
        }
    }

    // 初始化数据
    private init() {
        this.isPaste = false;
        this.initTreeData();
    }

    // 获取资料树
    private initTreeData() {
        if (this.entryId && this.treeSourceCode) {
            this.cmdInformationApiService.getOtherTabInformationTree(this.entryId, this.treeSourceCode).subscribe(res => {
                this.treeDataSource = [];
                setTimeout(() => this.treeDataSource = res);
            });
        }
    }

    /**
     * 保存编辑后的文件
     * @param file
     */
    private saveEditImage(file: string) {
        if (this.selectedItem && this.selectedItem.data.id) {
            this.messageService.showLoading();
            const fileMap = new Map<string, string>();
            fileMap.set(`${this.selectedItem.data.fileName}.png`, file);
            const partialObserver: PartialObserver<any> = {
                next: () => {
                    this.init();
                    if (this.onRefreshTreeDataSource) {
                        this.onRefreshTreeDataSource.emit();
                    }
                    this.messageService.hideLoading();
                    this.messageService.success('保存成功！');
                }
            };
            // 其他认证信息图片保存
            const params: InformationUploadInput = { bucketName: environment.fileSystemBucketName, accessType: 'Public' };
            this.informationsApiService
                .postOtherInformationTree(params, fileMap)
                .subscribe((value) => {
                    // 更新选择结点数据信息
                    this.selectedItem.data.fileId = value[0].id;
                    this.selectedItem.data.fileName = value[0].fileName;
                    this.selectedItem.data.updateBy = this.authService.currentUserInfo.UserName;
                    this.selectedItem.data.updateDate = formatDateTime(new Date());

                    const informationTreeCodes = new InformationTreeCodes();
                    // 如果是其他资料保存，则认证状态为通过
                    if (informationTreeCodes.isOtherInformation(this.selectedItem.data.dataCode)) {
                        this.selectedItem.data.auditState = EnumAuditState.审核通过;
                        this.selectedItem.data.auditTime = formatDateTime(new Date());
                    }

                    this.cmdInformationApiService.update(this.selectedItem.data).subscribe(partialObserver);
                });
        }
    }

    // 黏贴图片时，获取文件名
    private getFileName(): string {
        // 保存黏贴的图片
        let imgName = this.selectedItem.data.dataName;
        let isCanSave = false;
        let number = 1;
        // 当前选中是文件，则获取上级资料name
        if (this.selectedItem.data.fileId) {
            while (!isCanSave) {
                const index = this.imgNames.findIndex(item => {
                    let currentFileName = item.toLowerCase();
                    const lastIndex = currentFileName.lastIndexOf('.');
                    currentFileName = currentFileName.substring(0, lastIndex);
                    return currentFileName === `${this.selectedItem.parent.data.dataName}${number}`;
                });
                if (index >= 0) {
                    number++;
                } else {
                    isCanSave = true;
                    imgName = `${this.selectedItem.parent.data.dataName}${number}.jpg`;
                }
            }
        } else {
            imgName = `${this.selectedItem.data.dataName}1`;
            if (this.selectedItem.children) {
                while (!isCanSave) {
                    const index = this.imgNames.findIndex(item => {
                        let currentFileName = item.toLowerCase();
                        const lastIndex = currentFileName.lastIndexOf('.');
                        currentFileName = currentFileName.substring(0, lastIndex);
                        return currentFileName === `${this.selectedItem.data.dataName}${number}`;
                    });
                    if (index >= 0) {
                        number++;
                    } else {
                        isCanSave = true;
                        imgName = `${this.selectedItem.data.dataName}${number}.jpg`;
                    }
                }
            }
        }
        // 记住左边已存在的文件名
        this.imgNames.push(imgName);
        return imgName;
    }

    /**
     * 保存黏贴的图片
     * @param file
     */
    private saveNewImage(file: string) {
        if (!this.selectedItem) {
            this.messageService.warn('请选择文件夹！');
            return;
        }
        if (this.selectedItems.length > 1) {
            this.messageService.warn('已选择多个文件（夹），无法区分要保存的文件夹目录，请明确选择单个文件夹目录！');
            return;
        }
        const imgName = `${this.getFileName()}`;
        const fileMap = new Map<string, string>();
        fileMap.set(`${imgName}`, file);
        if (imgName) {
            this.messageService.showLoading();
            const partialObserver: PartialObserver<void | Object> = {
                next: () => {
                    this.init();
                    if (this.onRefreshTreeDataSource) {
                        this.onRefreshTreeDataSource.emit();
                    }
                    this.messageService.success('保存成功！');
                    this.messageService.hideLoading();
                },
                error: (err) => {
                    this.messageService.hideLoading();
                    this.messageService.error(err.message);
                }
            };
            // 保存其他认证资料
            const params: InformationUploadInput = { bucketName: environment.fileSystemBucketName, accessType: 'Public' };
            this.informationsApiService.postOtherInformationTree(params, fileMap)
                .subscribe((res) => {
                    const cmdInformationInfoOutput = new CmdInformationInfoOutput();
                    cmdInformationInfoOutput.entryId = this.entryId;
                    cmdInformationInfoOutput.createBy = this.authService.currentUserInfo.UserName;
                    cmdInformationInfoOutput.createDate = formatDateTime(new Date());
                    cmdInformationInfoOutput.fileId = res[0].id;
                    cmdInformationInfoOutput.fileName = imgName;
                    cmdInformationInfoOutput.dataCode = this.selectedItem.data.dataCode;
                    cmdInformationInfoOutput.dataName = this.selectedItem.data.dataName;
                    cmdInformationInfoOutput.auditState = EnumAuditState.审核通过;
                    cmdInformationInfoOutput.platForm = 'AdminSite';
                    cmdInformationInfoOutput.fromMarket = 'AdminSite';
                    cmdInformationInfoOutput.isDeleted = 0;
                    cmdInformationInfoOutput.upLoadType = 'admin';
                    cmdInformationInfoOutput.dataType = 0;
                    cmdInformationInfoOutput.dataSource = 'TicketSystem';

                    this.cmdInformationApiService.add(cmdInformationInfoOutput).subscribe(partialObserver);
                });
        }
    }
}

@NgModule({
    imports: [
        SharedModule,
        SidebarTreeModule,
        PhotoEditorModule
    ],
    declarations: [
        SidebarTreeEditorComponent
    ],
    exports: [SidebarTreeEditorComponent],
    entryComponents: [],
    providers: [
        InformationsApiService,
        FileSystemFileInfoApiService,
        CmdInformationApiService
    ]
})
export class SidebarTreeEditorModule { }

// tslint:disable:max-file-line-count
