/**
 * 第三方网址弹窗组件
 */
import { Component, Input } from '@angular/core';
import { DynamicComponentBase } from './dynamic-component-loader/dynamic-component-base';

@Component({
    selector: 'app-components-third-party-website-search-webpage-dialog',
    template: `
        <div style="min-height: 500px;width:1300px">
            <ng-container *ngIf="data">
                <iframe [src]="data" frameborder="0" style="width: 100%; min-height: 600px;"></iframe>
            </ng-container>
        </div>
    `
})
export class ThirdPartyWebsiteSearchWebpageDialogComponent implements DynamicComponentBase {
    // 网址
    @Input() public data: string;

    public constructor() {
        //
    }
}
