import { Component, ComponentFactoryResolver, Input, NgModule, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MessageService } from 'app/core/message.service';
import { SharedModule } from 'app/shared/shared.module';
import { SelectItem } from 'primeng/primeng';
import { ThirdPartyWebsiteSearchWebpageDialogComponent } from './website-search.component.webpage.dialog';

/**
 * 第三方网址嵌入公用组件
 */
@Component({
    selector: 'app-components-third-party-website-search',
    template: `
        <div style="min-height: 500px;">
            <div class="p-2">
                <p-dropdown name="website" [autoWidth]="false" styleClass="w-12"
                            [options]="websiteOptions" [(ngModel)]="selectedWebsite"
                            (onChange)="handleSelectedWebsiteChange($event)"></p-dropdown>
                <span> {{selectedWebsite?.url}}</span>

                <button pButton label="弹出" (click)="openWindowDialog()" [disabled]="!currentIframeUrl || isDisabledOpenWindowBtn"></button>

            </div>
            <ng-container *ngIf="currentIframeUrl">
                <iframe [src]="currentIframeUrl" frameborder="0" style="width: 100%; min-height: 480px;"></iframe>
            </ng-container>
        </div>
    `,
})
export class ThirdPartyWebsiteSearchComponent implements OnChanges {
    /**
     *  @see WebsiteSearchConfig.searchKey
     */
    @Input()
    public searchValue: string;

    /**
     * 不能用Array.push
     */
    @Input()
    public websiteConfigs: WebsiteSearchConfig[] = [];

    public websiteOptions: SelectItem[] = [];

    public selectedWebsite: WebsiteSearchConfig;

    public currentIframeUrl: SafeResourceUrl = undefined;
    // 是否禁用弹窗按钮
    public isDisabledOpenWindowBtn: boolean = true;

    private notSupported: string[] = [
        '//www.alipay.com',
        '//www.qixin.com/',
        '//qzone.qq.com/'
    ];

    public constructor(private domSanitizer: DomSanitizer,
                       private messageService: MessageService,
                       private componentFactoryResolver: ComponentFactoryResolver) {
        //
    }

    public handleSelectedWebsiteChange(event: { value: WebsiteSearchConfig }): void {
        const changeSelectedWebsite = event.value;
        if (changeSelectedWebsite) {
            this.setCurrentIframeUrl(changeSelectedWebsite.url);
        } else {
            this.setCurrentIframeUrl(undefined);
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {

        /////////////////////////
        const changeWebsiteConfigs = changes.websiteConfigs;
        if (changeWebsiteConfigs && changeWebsiteConfigs.currentValue) {
            const a = <WebsiteSearchConfig[]>changeWebsiteConfigs.currentValue;
            const o = a.map(x => <SelectItem>{ label: x.name, value: x });
            // 默认添加空选项
            const empty = <WebsiteSearchConfig>{};
            this.websiteOptions = [{ label: '请选择', value: empty }].concat(o);
            // 默认选择第一个
            this.selectedWebsite = empty;
            this.handleSelectedWebsiteChange({ value: empty });
        }

        /////////////////////////
        const changeSearchValue = changes.searchValue;
        if (changeSearchValue && changeSearchValue.currentValue) {
            const a = <string>changeSearchValue.currentValue;
            if (this.selectedWebsite) {
                const url = this.selectedWebsite.url;
                const searchKey = this.selectedWebsite.searchKey;
                if (searchKey && a && a.trim() !== '') {
                    const s = `${url}?${searchKey}=${encodeURIComponent(a)}`;
                    this.setCurrentIframeUrl(s);
                }
            }
        }
    }

    /**
     * 弹出当前网页
     */
    public openWindowDialog() {
        this.messageService.showDialog(this.componentFactoryResolver, {
            title: this.selectedWebsite.name,
            data: this.currentIframeUrl,
            component: ThirdPartyWebsiteSearchWebpageDialogComponent
        });
    }

    // 不支持嵌入, 则window.open
    private setCurrentIframeUrl(url: string): void {
        if (url) {
            const find = this.notSupported.find(v => url.indexOf(v) !== -1);
            if (find) {
                setTimeout(() => {
                    window.top.open(url, find);
                }, 1500);
                this.isDisabledOpenWindowBtn = true;
            } else {
                this.isDisabledOpenWindowBtn = false;
            }
            this.currentIframeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(url);
        } else {
            this.currentIframeUrl = undefined;
            this.isDisabledOpenWindowBtn = true;
        }
    }
}

export interface WebsiteSearchConfig {
    /**
     * 显示名
     */
    name: string;
    /**
     * 第三方页面,
     */
    url: string;

    /**
     * 可选, 如果有值, 则该站点支持查询, 会自动拼接querystring,
     * 例如url为https://www.baidu.com/s?wd=查询, 其中searchKey为wd,
     */
    searchKey?: string;
    // searchValue?: string;
}

@NgModule({
    imports: [
        SharedModule,
    ],
    declarations: [ThirdPartyWebsiteSearchComponent, ThirdPartyWebsiteSearchWebpageDialogComponent],
    exports: [ThirdPartyWebsiteSearchComponent],
    entryComponents: [ThirdPartyWebsiteSearchWebpageDialogComponent]
})
export class ThirdPartyWebsiteSearchModule {
}
