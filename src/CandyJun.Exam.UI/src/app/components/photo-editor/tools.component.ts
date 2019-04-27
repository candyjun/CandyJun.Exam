import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PhotoEditor } from './photo-editor';
import { ToolSetting, ZoomType } from './photo-editor.model';
import { Shapes } from './shapes';
import { PhotoEditorTool } from './tools.enum';

@Component({
    selector: 'app-components-photo-editor-tools',
    templateUrl: './tools.component.html'
})
export class PhotoEditorToolsComponent {
    @Input() public isShowImgSaveButton: boolean = true;
    @Input() public tools: PhotoEditorTool[];
    @Input() public disabled: boolean = false;
    @Output() public saveHandler: EventEmitter<string> = new EventEmitter();
    public toolSetting: ToolSetting = { color: '#fc1d00', strokeWidth: 2 };
    private editor: PhotoEditor;

    @Input()
    public set photoEditor(editor: PhotoEditor) {
        if (editor) {
            this.editor = editor;
            // 传引用
            this.editor.changeToolSetting(this.toolSetting);
        }
    }

    public zoomIn() { return this.editor.zoom(ZoomType.ZoomIn); }

    public zoomOut() { return this.editor.zoom(ZoomType.ZoomOut); }

    public rotateLeft() { return this.editor.rotate(-90); }

    public rotateRight() { return this.editor.rotate(90); }

    public cropIt() { return this.editor.cropSelected(); }

    public line() {
        this.toolSetting.strokeWidth = 2;
        return this.editor.drawShape(Shapes.Line);
    }

    public line2x() {
        this.toolSetting.strokeWidth = 4;
        return this.editor.drawShape(Shapes.Line);
    }

    public rectangle() { return this.editor.drawShape(Shapes.Rectangle); }

    public type() { return this.editor.type(); }

    public undo() { return this.editor.undo(); }

    public redo() { return this.editor.redo(); }

    public save() {
        if (this.saveHandler) {
            this.saveHandler.emit(this.editor.previewResult());
        }
    }

    public clear() {
        this.editor.clear();
        this.disabled = true;
    }

}
