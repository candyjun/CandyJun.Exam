import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { PhotoEditor } from './photo-editor';

@Component({
    selector: 'app-components-photo-editor',
    template: `
        <div class="canvas-tools" *ngIf="showTools" pageButtonView>
            <app-components-photo-editor-tools [isShowImgSaveButton]="isShowImgSaveButton"
                    [photoEditor]="photoEditor" [disabled]="noFile" (saveHandler)="save($event)">
            </app-components-photo-editor-tools>
        </div>

        <div (mouseover)="handleMouseOver(photoEditor)" (mouseout)="handleMouseOut()">
            <canvas id="imgEditCanvas" #canvasEle [ngClass]="{'active-canvas': isActiveCanvas}"
                    style="-moz-user-select: none; cursor: crosshair;" width="800" height="500"></canvas>
        </div>
    `
})
export class PhotoEditorComponent implements OnInit {
    @Input() public isShowImgSaveButton: boolean;
    @ViewChild('canvasEle') public canvasEle: ElementRef;
    @Input() public showTools: boolean = true;
    @Input() public width: number;
    @Input() public height: number;
    @Output() public afterCreatePhotoEditorHandler: EventEmitter<PhotoEditor> = new EventEmitter();
    @Output() public saveHandler: EventEmitter<any> = new EventEmitter();
    @Output() public afterPaste: EventEmitter<{ file: Blob }> = new EventEmitter();
    public photoEditor: PhotoEditor;
    public noFile: boolean = true;
    private canPaste: boolean;
    private urls: string[] = [];
    private activateCanvas: PhotoEditor;

    public get isActiveCanvas() {
        return this.canPaste && this.photoEditor && this.activateCanvas && this.activateCanvas === this.photoEditor;
    }

    @Input()
    public set paste(input: boolean) {
        if (input) {
            window.addEventListener('paste', (e: any) => {
                if (this.isActiveCanvas) {
                    this.photoEditor.pasteImage(e);

                    const items = (e.clipboardData || (<any>e).originalEvent.clipboardData).items;
                    let pasteFile: Blob;
                    for (const i of items) {
                        if (i.type.indexOf('image') === 0) {
                            pasteFile = i.getAsFile();
                        }
                    }

                    this.noFile = !this.noFile;

                    const noFile = !pasteFile;
                    setTimeout(() => this.noFile = noFile);

                    if (this.afterPaste && pasteFile) {
                        this.afterPaste.emit({ file: pasteFile });
                    }

                    e.stopPropagation();
                    e.preventDefault();
                }
            });
        }

        this.canPaste = input;
    }

    @Input()
    public set imagesUrl(images: string | string[]) {
        if (images && images.length) {
            this.urls = [].concat(images);
            this.noFile = false;
            if (this.photoEditor) {
                this.addImages();
            }
        } else {
            this.noFile = true;
        }
    }

    public ngOnInit() {
        setTimeout(() => {
            this.photoEditor = new PhotoEditor(this.canvasEle.nativeElement);
            if (this.width || this.height) {
                this.photoEditor.resizeCanvas(this.width, this.height);
            }
            this.addImages();
            if (this.afterCreatePhotoEditorHandler) {
                this.afterCreatePhotoEditorHandler.emit(this.photoEditor);
            }
        }, 1000);
    }

    public save(event: string) {
        if (this.saveHandler) {
            this.saveHandler.emit(event);
        }
    }

    public handleMouseOver(editor: PhotoEditor) {
        this.activateCanvas = editor;
    }

    public handleMouseOut() {
        this.activateCanvas = null;
    }

    private addImages() {
        this.noFile = this.urls.length === 0;

        this.photoEditor.resetHistory();
        this.photoEditor.clear();
        this.urls.forEach(item => {
            this.photoEditor.addImage(item, false);
        });
    }
}
