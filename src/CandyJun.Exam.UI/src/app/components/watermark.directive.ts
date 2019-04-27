import { Directive, ElementRef, NgModule, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { formatDate } from '../shared/format-date';

@Directive({
    selector: '[appComponentWatermark]'
})
export class WatermarkDirective implements OnInit {

    public text1: string;

    public text2: string;

    public constructor(private readonly el: ElementRef, private readonly authService: AuthService) {
        //
    }

    public ngOnInit(): void {
        this.text1 = `${this.authService.currentUserInfo.UserName} ${this.authService.currentUserInfo.Name}`;
        this.text2 = `中安信业 ${formatDate(new Date())}`;
        if (this.text1 && this.text2) {
            this.el.nativeElement.style.background = 'none';
            this.el.nativeElement.style.backgroundColor = 'transparent !important';
            this.el.nativeElement.style.backgroundRepeat = 'repeat';
            this.el.nativeElement.style.backgroundImage = `url(${this.createCanvasImg(this.text1, this.text2)})`;
        }
    }

    public createCanvasImg(currentText1: string, currentText2: string): string {
        // 水印
        // 两行文字
        const canvas = document.createElement('canvas');
        canvas.width = 450;
        canvas.height = 450;
        const ctx = canvas.getContext('2d');
        // ctx.fillStyle = 'white';
        // ctx.fillRect(0, 0, 300, 350);
        // 旋转30度
        ctx.rotate(30 * Math.PI / 180);
        ctx.textAlign = 'center';
        ctx.fillStyle = 'gray';
        ctx.font = '32px Consolas';
        if (currentText1) {
            ctx.fillText(currentText1, 350, 150);
        }
        if (currentText1 && currentText2) {
            ctx.fillText(currentText2, 350, 180);
        }
        return canvas.toDataURL('jpg');
    }
}

@NgModule({
    declarations: [WatermarkDirective],
    exports: [WatermarkDirective],
    providers: []
})
export class AppComponentWatermarkModule {

}
