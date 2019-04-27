import { Component, NgModule, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { DropdownModule, SelectItem } from 'primeng/primeng';
import { BaseDataApiService } from '../api/business/base-data.api';
import { ProductName, ProductVersion } from '../api/business/models/product-name.model';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { of } from 'rxjs/observable/of';
import { tap } from 'rxjs/operators';
import { MessageService } from '../core/message.service';

/* tslint:disable */
const optionalSelectItem = <SelectItem>{ label: '-请选择-', value: null };
const PRODUCTSELECT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ProductSelectComponent),
    multi: true
};

/**
 * 产品选择组件
 */
@Component({
    selector: 'app-components-product-select',
    template: `
        <p-dropdown [autoWidth]="false" styleClass="w-10" [options]="topProductItems" [disabled]="disabled||isLoading"
                                    [(ngModel)]="topProductGuid" [appendTo]="appendTo"
                                    (onChange)="onTopProductChange($event)"></p-dropdown>
        <p-dropdown [autoWidth]="false" styleClass="w-10" [options]="subProductItems" [disabled]="disabled||isLoading"
                                    [(ngModel)]="subProductGuid" [appendTo]="appendTo"
                                    (onChange)="onSubProductChange()"></p-dropdown>
    `,
    providers: [PRODUCTSELECT_VALUE_ACCESSOR]
})
export class ProductSelectComponent implements ControlValueAccessor {
    public products: ProductName[] = [];
    public topProductItems: SelectItem[] = [optionalSelectItem];
    public subProductItems: SelectItem[] = [optionalSelectItem];
    public topProductGuid: string;
    public subProductGuid: string;
    public isLoading = false;
    @Input() public disabledOnLoad = true;
    @Input() public disabled = false;
    @Input() public appendTo = '';
    @Output() public onChange = new EventEmitter<ProductVersion>();
    private inputValue: any;
    private isLoadData = false;
    private isLoadedProducts = false;
    public constructor(private baseDataApiService: BaseDataApiService,
        private messageService: MessageService) {

    }

    public writeValue(value: any) {
        this.inputValue = value;
        if (this.isLoadData) {
            if (this.isLoadedProducts) {
                this.setView();
            }
            return;
        }
        this.isLoadData = true;
        this.getProducts().subscribe(v => {
            this.topProductItems = [optionalSelectItem, ...this.products.map(p => ({
                label: p.productName,
                value: p.productGuid
            }))];
            this.setView();
        });
    }

    public registerOnChange(fn: any) {
        this.onModelChange = fn;
    }

    public registerOnTouched(fn: any) {
        this.onModelTouched = fn;
    }

    public setDisabledState?(isDisabled: boolean) {
        this.disabled = isDisabled;
    }

    /**
     * 大类产品切换事件处理
     */
    public onTopProductChange(arg: { originalEvent: Event, value: string }) {
        if (!arg.value) {
            this.reset();
            return;
        }
        const subProducts = this.products.find(p => p.productGuid === arg.value).productVersionList;
        this.subProductItems = [optionalSelectItem, ...subProducts.map(p => ({
            label: p.productVersionName,
            value: p.productVersionGuid
        }))];
        const subProductGuid = this.defaultProductMapping.get(arg.value);
        if (subProductGuid && subProducts.find(p => p.productVersionGuid === subProductGuid)) {
            this.subProductGuid = subProductGuid;
        } else {
            this.subProductGuid = subProducts.length ? subProducts[0].productVersionGuid : null;
        }
        this.emitValue();
    }

    /**
     * 小类产品切换事件处理
     */
    public onSubProductChange() {
        this.emitValue();
    }

    private onModelChange = (_: any) => {
        //
    }

    private onModelTouched = () => {
        //
    }

    /**
     * 获取所有产品
     */
    private getProducts() {
        if (this.isLoadedProducts) {
            return of(this.products);
        }
        if (this.disabledOnLoad) {
            this.isLoading = true;
        }
        return this.baseDataApiService.getEsdProduct().pipe(tap(v => {
            this.products = v;
            this.isLoadedProducts = true;
        }, e => {
            this.messageService.error('加载产品信息失败！');
            throw e;
        }, () => this.isLoading = false));
    }

    private setView() {
        if (typeof this.inputValue !== 'string' || !this.inputValue) {
            this.reset();
            return;
        }
        const product = this.products.find(p => !!p.productVersionList.find(x => x.productVersionGuid === this.inputValue));
        if (!product) {
            this.reset();
            return;
        }
        this.topProductGuid = product.productGuid;
        this.subProductItems = [optionalSelectItem, ...product.productVersionList.map(p => ({
            label: p.productVersionName,
            value: p.productVersionGuid
        }))];
        this.subProductGuid = this.inputValue;
        this.emitChange();
    }

    /**
     * 清除选中
     */
    private reset() {
        this.topProductGuid = null;
        this.subProductGuid = null;
        this.subProductItems = [optionalSelectItem];
        this.emitValue();
    }

    /**
     * 将值写入Model
     */
    private emitValue() {
        this.onModelChange(this.subProductGuid);
        this.onModelTouched();
        this.emitChange();
    }

    private emitChange() {
        const value = <ProductVersion>{
            subProductGuid: this.topProductGuid,
            subProductName: '',
            productVersionGuid: this.subProductGuid,
            productVersionName: ''
        };
        if (this.isLoadedProducts && !!this.topProductGuid) {
            const product = this.products.find(p => p.productGuid === this.topProductGuid);
            value.subProductName = product.productName;
            if (this.subProductGuid) {
                value.productVersionName = product.productVersionList.find(p => p.productVersionGuid === this.subProductGuid).productVersionName;
            }
        }
        this.onChange.emit(value);
    }

    // 需要默认值，老板贷默认选择“E时贷老板贷”“业主贷”默认选择“E时贷房贷贷”“中安薪贷”默认“ESD薪贷”“场景消费贷”默认“企税贷”
    private get defaultProductMapping() {
        const map = new Map<string, string>();
        map.set('{4418B027-864A-4450-97D5-50906C91C2C8}', '{ETimes-00000-00000-00000000-BossLoan}');
        map.set('{OWNER000-0000-0000-0000-111OWNERLOAN}', '{ETimes-0000-00000-00000000-HouseLoan}');
        map.set('{C4511E7D-96A7-44B5-BD37-9D7CDF231AC3}', '{ETimes00-0000-0000-0000-00000000Loan}');
        map.set('{ConSume0-0000-0000-0000-ConsumeLoan0}', '{QiShuiDai-000-0000-0000-00000Version}');
        return map;
    }
}

@NgModule({
    imports: [DropdownModule, FormsModule],
    declarations: [ProductSelectComponent],
    exports: [ProductSelectComponent]
})
export class ProductSelectModule {
}
