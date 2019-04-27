/**
 * @File: Photo editor history, redo/undo
 * @Author: wush
 */

import { PhotoEditor } from './photo-editor';

export class PhotoEditorHistory {
    private state: string[];
    private mods = 0;
    private editor: PhotoEditor;

    private get canvas() {
        return this.editor.canvas;
    }

    public constructor(editor: PhotoEditor) {
        this.editor = editor;
        this.state = [];

        this.canvas.on(
            'object:modified', () => {
                this.setHistory(true);
            },
            'object:added', () => {
                this.setHistory(true);
            });
    }

    public undo() {
        let pre = 0;
        if (this.mods < this.state.length) {
            pre = this.state.length - 1 - this.mods - 1;
            pre = pre < 0 ? 0 : pre;

            this.mods += 1;
        }

        this.canvas.clear();
        this.loadFromJSON(this.state[pre]);
        this.canvas.renderAll();
    }

    public redo() {
        if (this.mods > 0) {
            this.canvas.clear().renderAll();
            this.loadFromJSON(this.state[this.state.length - 1 - this.mods + 1]);
            this.canvas.renderAll();
            this.mods -= 1;
        }
    }

    public reset() {
        this.state = [];
        this.mods = 0;
    }

    public setHistory(saveHistory: boolean) {
        if (saveHistory === true) {
            const history = JSON.stringify(this.canvas);
            this.state.push(history);
        }
    }

    private loadFromJSON(json: string) {
        this.canvas.loadFromJSON(json,
            this.canvas.renderAll.bind(this.canvas),
            (o: any, object: any) => {
                object.selectable = !!this.editor.drawShape;
                this.editor.imageObj = object;
        });
    }
}
