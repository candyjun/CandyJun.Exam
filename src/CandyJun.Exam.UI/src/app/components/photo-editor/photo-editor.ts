/**
 * @File: PhotoEditor
 * @Author: wush
 * @Description: 包含核心操作(画图、缩放、旋转及裁剪等)
 * @Example:
 *    html:
 *       <canvas #canvasEle width="800" height="500"></canvas>
 *
 *    ts:
 *      import { PhotoEditor } from './photo-editor';
 *
 *      cosnt photoEditor = new PhotoEditor(this.canvasEle.nativeElement);
 */

import { PhotoEditorHistory } from './photo-editor.history';
import { ToolSetting, ZoomType } from './photo-editor.model';
import { ShapeFactory } from './shape-factory';
import { Shapes } from './shapes';

declare let fabric: any;

export class PhotoEditor {
    public canvas: any;
    public startPointer = { x: 0, y: 0 };
    public cropImage = { width: 0, height: 0 };
    public isMouseDown = false;
    public imageObj: any;
    private drawingShape: Shapes;
    private shapeFactory: ShapeFactory;
    private photoEditorHistory: PhotoEditorHistory;
    private toolSetting: ToolSetting = { color: '#fc1d00', strokeWidth: 2 };

    public constructor(canvasElement: HTMLCanvasElement, toolSetting?: ToolSetting) {
        this.canvas = new fabric.Canvas(canvasElement, {
            isDrawingMode: false,
            selection: false,
            centeredRotation: true,
            preserveObjectStacking: true,
        });

        this.toolSetting = toolSetting || this.toolSetting;
        this.shapeFactory = new ShapeFactory(this.canvas, this.toolSetting);
        this.photoEditorHistory = new PhotoEditorHistory(this);

        this.canvas.on({
            'mouse:down': (event: MouseEvent) => this.mouseDownHandler(event),
            'mouse:move': (event: MouseEvent) => this.mouseMoveHandler(event),
            'mouse:up': (/*event: MouseEvent*/) => this.mouseUpHandler(/*event*/),
        });

        this.canvas.wrapperEl.onmousewheel = (event: MouseWheelEvent) => this.mousewheelHandler(event);
        this.canvas.upperCanvasEl.ondblclick = (event: MouseEvent) => this.dblclickHandler(event);
    }

    /**
     * 清空
     */
    public clear() {
        this.drawingShape = null;
        this.canvas.clear().renderAll();
    }

    /**
     * 修改设置
     * @param toolSetting 线条颜色、粗细设置
     */
    public changeToolSetting(toolSetting: ToolSetting) {
        if (toolSetting !== this.toolSetting) {
            this.toolSetting = toolSetting;
            this.shapeFactory = new ShapeFactory(this.canvas, this.toolSetting);
        }
    }

    /**
     * 重置 canvas 大小
     * @param width 重置后 canvas 的宽度
     * @param height 重置后 canvas 的高度
     */
    public resizeCanvas(width: number, height: number) {
        this.canvas.setHeight(height);
        this.canvas.setWidth(width);
        this.canvas.renderAll();
    }

    /**
     * 添加图片
     * @param src 图片数据源
     * @param scaleToWidth 是否适配 canvas 大小
     * @param isClear 是否先清空再添加
     */
    public addImage(src: string, scaleToWidth: boolean = true, isClear: boolean = false) {
        const options = {
            left: 0,
            top: 0,
            strokeWidth: 0
        };
        this.loadImage(src, options, scaleToWidth, isClear);
    }

    /**
     * 粘贴图片到 canvas
     *
     * @param {*} event - paste event
     * @example
     *      window.addEventListener('paste', (e: any) => this.photoEditor.pasteImage(e));
     */
    public pasteImage(event: any) {
        const items = (event.clipboardData || (<any>event).originalEvent.clipboardData).items;
        let pasteFile;
        for (const i of items) {
            if (i.type.indexOf('image') === 0) {
                pasteFile = i.getAsFile();
            }
        }
        if (pasteFile) {
            const reader = new FileReader();
            reader.onload = (e: any) => this.addImage(e.target.result, false);
            reader.readAsDataURL(pasteFile);
        }
    }

    /**
     * 画图（类型: Arrow/Circle/Ellipse/Line/Rectangle）
     */
    public drawShape(shape: Shapes) {
        this.groupAll();
        this.imageSelectable(false);
        this.drawingShape = shape;
    }

    /**
     * 剪切
     */
    public cropSelected() {
        this.groupAll();
        this.imageSelectable(false);
        this.drawingShape = Shapes.RectangleCrop;
    }

    /**
     * 预览
     */
    public previewResult() {
        this.groupAll();
        this.resetOperator();

        // 新建 canvas, 并按图片实际大小输出, 不按原图
        const originImageCanvas = new fabric.Canvas();
        this.imageObj.padding = 0;
        const rect =  this.imageObj.getBoundingRect();
        originImageCanvas.setHeight(rect.height);
        originImageCanvas.setWidth(rect.width);
        originImageCanvas.add(this.imageObj);
        originImageCanvas.centerObject(this.imageObj);
        originImageCanvas.renderAll();
        return originImageCanvas.toDataURL('png');
    }

    /**
     * 输入文本
     */
    public type() {
        this.addText();
        this.resetOperator();
    }

    /**
     * 旋转
     */
    public rotate(angleOffset: number) {
        if (!this.imageObj) {
            return;
        }

        this.groupAll();
        const angle = this.imageObj.angle + angleOffset;
        this.imageObj.setAngle(angle).setCoords();
        this.canvas.renderAll();
        this.photoEditorHistory.setHistory(true);
        this.resetOperator();
    }

    /**
     * 缩放
     * @param type 缩放类型（放大、缩小）
     */
    public zoom(type: ZoomType) {
        switch (type) {
            case ZoomType.ZoomIn: {
                this.setZoom(this.canvas.getZoom() * 1.5);
                break;
            }
            default: {
                this.setZoom(this.canvas.getZoom() / 1.5);
                break;
            }
        }
        this.photoEditorHistory.setHistory(true);
        this.resetOperator();
    }

    /**
     * 撤销
     */
    public undo() {
        this.photoEditorHistory.undo();
        this.resetOperator();
    }

    /**
     * 重复
     */
    public redo() {
        this.photoEditorHistory.redo();
        this.resetOperator();
    }

    /**
     * 重置历史记录
     */
    public resetHistory() {
        this.photoEditorHistory.reset();
    }

    /**
     * 设置放大/缩小
     * @param zoom 放大/缩小倍数
     */
    private setZoom(zoom: number) {
        const SCALE_FACTOR = zoom;
        const objects = this.canvas.getObjects();
        for (const i in objects) {
            if (i) {
                const scaleX = objects[i].scaleX;
                const scaleY = objects[i].scaleY;
                const left = objects[i].left;
                const top = objects[i].top;

                const tempScaleX = scaleX * SCALE_FACTOR;
                const tempScaleY = scaleY * SCALE_FACTOR;
                const tempLeft = left * SCALE_FACTOR;
                const tempTop = top * SCALE_FACTOR;

                objects[i].scaleX = tempScaleX;
                objects[i].scaleY = tempScaleY;
                objects[i].left = tempLeft;
                objects[i].top = tempTop;

                objects[i].setCoords();
            }
        }
        this.groupAll();
        this.canvas.renderAll();
    }

    /**
     * 获取鼠标坐标
     * @param event MouseEvent
     */
    private getPointer(event: MouseEvent) {
        return this.canvas.getPointer(event.view);
    }

    /**
     * Mouse down 事件
     * @param event MouseEvent
     */
    private mouseDownHandler(event: MouseEvent) {

        this.isMouseDown = true;

        if (this.drawingShape && this.isInRange(event)) {
            const eventPointer = this.getPointer(event);
            this.startPointer = {
                x: eventPointer.x,
                y: eventPointer.y
            };

            this.shapeFactory.provider.get(this.drawingShape).startDraw(this.startPointer);
        }
    }

    /**
     * Mouse move 事件
     * @param event MouseEvent
     */
    private mouseMoveHandler(event: MouseEvent) {
        if (!this.isMouseDown) {
            return;
        }

        if (this.drawingShape && this.isInRange(event)) {
            const eventPointer = this.getPointer(event);
            const pointer = {
                x: eventPointer.x,
                y: eventPointer.y
            };

            if (this.drawingShape === Shapes.RectangleCrop) {
                this.cropImage.width = Math.abs(this.startPointer.x - pointer.x);
                this.cropImage.height = Math.abs(this.startPointer.y - pointer.y);
            }

            this.isMouseDown = true;
            this.shapeFactory.provider.get(this.drawingShape).drawing(pointer);
        }
    }

    /**
     * Mouse up 事件
     */
    private mouseUpHandler(/*event: MouseEvent*/) {
        this.isMouseDown = false;

        if (this.drawingShape) {
            if (this.drawingShape === Shapes.RectangleCrop) {
                this.cropSelectedHandler(/*event*/);
                this.resetOperator();
            } else {
                this.shapeFactory.provider.get(this.drawingShape).endDraw();
                this.photoEditorHistory.setHistory(true);
            }
        }
    }

    /**
     * Mouse wheel 事件
     * @param event MouseWheelEvent
     */
    private mousewheelHandler(event: MouseWheelEvent): boolean {
        const target = this.canvas.findTarget(event);
        const delta = event.wheelDelta / 1000;

        if (target) {
            target.scaleX += delta;
            target.scaleY += delta;

            // constrain
            if (target.scaleX < 0.07) {
                target.scaleX = 0.07;
                target.scaleY = 0.07;
            }
            // constrain
            if (target.scaleY > 3) {
                target.scaleX = 3;
                target.scaleY = 3;
            }
            target.setCoords();
            this.canvas.renderAll();
        }

        return false;
    }

    /**
     * 双击事件
     * @param event MouseEvent
     */
    private dblclickHandler(event: MouseEvent) {
        const activeObject = this.canvas.getActiveObject();
        if (activeObject && activeObject.type !== 'i-text') {
            this.imageSelectable(true);
            const eventPointer = this.getPointer(event);
            const options = {
                top: eventPointer.y,
                left: eventPointer.x
            };
            this.addText(options);
        }
    }

    /**
     * 是否在图片范围内
     * @param event MouseEvent
     */
    private isInRange(event: MouseEvent) {

        const eventPointer = this.getPointer(event);

        const rect =  this.imageObj.getBoundingRect();

        const pt = [eventPointer.x, eventPointer.y];

        const rectPosition = [
            [rect.left, rect.top],
            [rect.left + rect.width, rect.top],
            [rect.left + rect.width, rect.top + rect.height],
            [rect.left, rect.top + rect.height]];

        const result = this.pointInRect(pt, rectPosition);
        return result === true;

    }

    /**
     * 检测矩形范围内是否包含点
     * @see http://martin-thoma.com/how-to-check-if-a-point-is-inside-a-rectangle/
     */
    private pointInRect(pt: number[], rect: number[][], precision?: number) {
         const p = precision || 6;
         const rectArea = 0.5 * Math.abs(
         (rect[0][1] - rect[2][1]) * (rect[3][0] - rect[1][0])
         + (rect[1][1] - rect[3][1]) * (rect[0][0] - rect[2][0])
         );
         const triangleArea = rect.reduce(function(prev: number, cur, i, arr) {
         const j = i === arr.length - 1 ? 0 : i + 1;
         return prev + 0.5 * Math.abs(
             pt[0] * (arr[i][1] - arr[j][1])
             + arr[i][0] * (arr[j][1] - pt[1])
             + arr[j][0] * (pt[1] - arr[i][1])
         );
         }, 0);
         return this.fix(triangleArea, p) === this.fix(rectArea, p);
     }

     // fix to the precision
    private fix(n: number, p: number) {
         // tslint:disable-next-line:radix
         return parseInt((n * Math.pow(10, p)).toString());
    }

    /**
     * 加载图片
     * @param src 图片数据源
     * @param options 图片初始化的配置项
     * @param scaleToWidth 是否适配 canvas 大小
     * @param isClear 是否先清空再添加
     */
    private loadImage(src: string, options: any, scaleToWidth: boolean = false, isClear: boolean = false) {
        this.imageObj = fabric.Image.fromURL(src, (img: any) => {
            img.set(options);
            this.imageObj = img;

            if (scaleToWidth) {
                this.imageObj.scaleToWidth(this.canvas.width);
            }
            if (isClear) {
                this.canvas.clear();
            }

            this.canvas.add(this.imageObj);
            this.canvas.setActiveObject(this.imageObj);
            this.canvas.renderAll();
            this.resetOperator();
            this.photoEditorHistory.setHistory(true);
        }, { crossOrigin: 'Anonymous' });
    }

    /**
     * 裁剪选定区域
     */
    private cropSelectedHandler(/*event: MouseEvent*/) {
        const drawingObj = this.shapeFactory.provider.get(this.drawingShape).drawingObj;

        if (!drawingObj) { return; }

        const range = {
            left: drawingObj.left,
            top: drawingObj.top,
            width: drawingObj.width,
            height: drawingObj.height,
        };

        this.canvas.remove(drawingObj);
        const cropped = new Image();
        cropped.src = this.canvas.toDataURL(range);
        this.canvas.clear();

        const options = Object.assign({}, { selectable: true }, range);
        this.loadImage(cropped.src, options);
    }

    /**
     * 重置操作
     */
    private resetOperator() {
        this.drawingShape = null;
        this.imageSelectable(true);
        this.canvas.renderAll();
    }

    /**
     * 将 canvas 所有对象组合为单个对象
     */
    private groupAll() {
        const objects = this.canvas.getObjects();
        const excludeImagesObjs = objects.filter((x: any) => x.type !== 'image');
        if (excludeImagesObjs.length) {
            const options = {
                // scaleX: 1,
                // scaleY: 1,
                // angle: 0,
                lockMovementX: true,
                lockMovementY: true,
                lockScalingX: true,
                lockScalingY: true,
                lockUniScaling: true,
                lockRotation: true
            };
            const group = new fabric.Group([...objects], options);
            group.addWithUpdate();
            this.imageObj = group;
            this.canvas.clear().renderAll();
            this.canvas.add(this.imageObj);
        }
    }

    /**
     * 设置图片可选与否
     * @param selectable 是否可选
     */
    private imageSelectable(selectable: boolean) {
        if (this.imageObj) {
            this.imageObj.selectable = selectable;
            this.imageObj.evented = selectable;
            this.imageObj.lockMovementX = !selectable;
            this.imageObj.lockMovementY = !selectable;
            this.imageObj.lockRotation = !selectable;
            this.imageObj.lockScalingX = !selectable;
            this.imageObj.lockScalingY = !selectable;
            this.imageObj.lockUniScaling = !selectable;
            this.imageObj.hasControls = selectable;
            this.imageObj.hasBorders = selectable;
        }
    }

    /**
     * 添加文本框
     * @param options 文本框设置选项
     */
    private addText(options?: any) {
        const baseOptions = {
            left: 50,
            top: 50,
            width: 100,
            fontSize: 40,
            fill: this.toolSetting.color
        };

        const text = new fabric.IText('input here', Object.assign({}, baseOptions, (options || {})));
        this.canvas.setActiveObject(text);
        text.selectAll();
        text.enterEditing();
        this.canvas.add(text);
        this.photoEditorHistory.setHistory(true);
    }

// tslint:disable-next-line:max-file-line-count
}
