/**
 * @File: 文件上传
 * @Author: wush
 */
import { Component, EventEmitter, Input, NgModule, Output, ViewChild } from '@angular/core';
import { FileUploadModule } from 'primeng/primeng';
import { SharedModule } from '../shared/shared.module';
import { SafeHtmlPipeModule } from './safe-html.pipe';

@Component({
    selector: 'app-components-file-upload',
    template: `
        <div class="container">
            <h4 *ngIf="messageTitle"><span [innerHTML]="messageTitle | appSafeHtml"></span></h4>
            <h6 *ngIf="messageTip">
                <strong>温馨提示：</strong>
                <span [innerHTML]="messageTip | appSafeHtml"></span>
            </h6>
            <p>请确认您上传的资料是
                <span class="text-warning">清晰的、未经修改</span>的扫描件或者照片，
                <span class="text-warning">要求如下：</span></p>
            <ul>
                <li>文件最大限制为<span class="text-warning"> {{formatBytes(maxFileSizeLimit)}}</span></li>
                <li> 文件格式为 {{acceptableTypes}}</li>
            </ul>
            <div class="border">
                <p-fileUpload #fileUpload
                              name="demo[]" chooseLabel="选择文件" uploadLabel="上传所选文件" cancelLabel="取消"
                              invalidFileSizeMessageSummary="{0}: 文件大小超出限制范围，"
                              invalidFileSizeMessageDetail="上传文件的大小不能超过{0}。"
                              invalidFileTypeMessageSummary="{0}: 无效的文件类型，"
                              invalidFileTypeMessageDetail="请确保文件的类型为: {0}。"
                              [multiple]="multiple"
                              [accept]="accept"
                              [maxFileSize]="maxFileSizeLimit"
                              [showUploadButton]="true"
                              [auto]="auto"
                              [customUpload]="true"
                              (uploadHandler)="upload($event)"
                              (onSelect)="select($event)"
                              (onRemove)="remove()">
                    <ng-template let-file let-i="index" pTemplate="file">
                        <div class="ui-fileupload-row">
                            <div><img [src]="file.objectURL" *ngIf="fileUpload.isImage(file)" [width]="fileUpload.previewWidth"/></div>
                            <div>{{file.name}}</div>
                            <div>{{fileUpload.formatSize(file.size)}}</div>
                            <div>
                                <button type="button" icon="fa-close" pButton (click)="fileUpload.remove(i)"></button>
                            </div>
                        </div>
                    </ng-template>
                </p-fileUpload>
            </div>
        </div>
    `
})
export class FileUploadComponent {

    public newAddFiles: number = 0;
    public maxFileSizeLimit = Math.pow(1024, 2);
    /**
     * 覆盖上传(可重复上传，但不能超过文件总数、文件大小等限制)
     */
    @Input() public uploadCover: boolean = false;
    @Input() public uploadedFiles: number = 0;
    @Input() public multiple = '';

    /**
     * 清除当前所有的文件
     */
    @Input()
    public set clearAllFiles(value: boolean) {
        if (value) {
            this.fileUploadComponentRef.clear();
            this.clearAllFiles = false;
        }
    }

    @Input()
    public set maxFileSize(num: number) {
        this.maxFileSizeLimit = num * Math.pow(1024, 2);
    }

    @Input()
    public set accept(acceptableTypes: string) {
        this.acceptableTypes = acceptableTypes || this.acceptableTypes;
    }

    public get accept() {
        return `${this.acceptableTypes.toLowerCase()},${this.acceptableTypes.toUpperCase()}`;
    }

    @Input() public auto = false;
    @Input() public messageTitle: string;
    @Input() public messageTip: string;
    @Output() public uploadHandler: EventEmitter<File[]> = new EventEmitter<File[]>();

    /**
     * 用于清除当前所有的文件
     */
    @ViewChild('fileUpload')
    public fileUploadComponentRef: any;

    public acceptableTypes: string = '.png,.jpg,.jpeg,.gif';

    public constructor() {
        //
    }

    public select(event: { originalEvent: Event, files: File[] }) {
        if (!this.uploadCover && event.files) {
            //
        }

        this.newAddFiles += !this.uploadCover && event.files ? event.files.length : 0;
    }

    /**
     * 移除文件
     */
    public remove() {
        if (this.newAddFiles) {
            this.newAddFiles -= 1;
        }
    }

    /**
     * 自定上传方式
     */
    public upload(event: { files: File[] }) {
        this.uploadHandler.emit(event.files);
    }

    public formatBytes(bytes: number, decimals?: number) {
        if (bytes === 0) { return '0 Bytes'; }
        const k = 1024;
        const dm = decimals || 2;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    }
}

@NgModule({
    imports: [SharedModule, FileUploadModule, SafeHtmlPipeModule],
    declarations: [FileUploadComponent],
    exports: [FileUploadComponent]
})
export class AppFileUploadModule { }
