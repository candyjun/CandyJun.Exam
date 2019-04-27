import { Component, Input, NgModule, OnInit, EventEmitter, Output } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CalendarLocaleService } from '../shared/calendar-locale.service';
import { CalendarModule, DropdownModule } from 'primeng/primeng';

/**
 * 日历选择组件
 */
@Component({
    selector: 'app-components-calendar-select',
    template: `
        <p-dropdown [options]="CalendarSelectType | appSelectItemPipe" [(ngModel)]="value.selectType"
                    (onChange)="handleTypeChange()"></p-dropdown>
        <span *ngIf="alwaysShowCalendar" style="display: inline-block;vertical-align: middle;">
            <p-calendar [inputStyleClass]="inputStyleClass" [(ngModel)]="value.beginDate" selectOtherMonths="true"
                        [readonlyInput]="readonlyInput" [locale]="calendarLocaleService.zh" dateFormat="yy-mm-dd"
                        monthNavigator="true" yearNavigator="true" [yearRange]="calendarLocaleService.yearRange"
                        (onSelect)="handleDateSelect($event,'begin')"></p-calendar>
            至
            <p-calendar [inputStyleClass]="inputStyleClass" [(ngModel)]="value.endDate" selectOtherMonths="true"
                        [readonlyInput]="readonlyInput" [locale]="calendarLocaleService.zh" dateFormat="yy-mm-dd"
                        monthNavigator="true" yearNavigator="true" [yearRange]="calendarLocaleService.yearRange"
                        (onSelect)="handleDateSelect($event,'end')" [maxDate]="maxDate"></p-calendar>
        </span>
    `,
})
export class CalendarSelectComponent implements OnInit {
    @Input() public inputStyleClass?: string = 'w-10';
    @Input() public readonlyInput?: boolean = false;
    @Input() public alwaysShowCalendar?: boolean = false;
    @Input() public selectedType?: CalendarSelectType = CalendarSelectType.不限;
    @Input() public maxDays?: number;
    @Output() public onValueChange = new EventEmitter<CalendarSelectedValue>();
    public CalendarSelectType = CalendarSelectType;
    public value: CalendarSelectedValue;
    public constructor(public calendarLocaleService: CalendarLocaleService) {

    }

    /**
     * 初始化
     */
    public ngOnInit() {
        this.value = { selectType: this.selectedType };
        this.calcDate();
    }

    /**
     * 结束日期最大值
     */
    public get maxDate() {
        if (this.value.selectType !== CalendarSelectType.选择日期 || this.maxDays <= 0) {
            return null;
        }
        const date = new Date(this.value.beginDate);
        date.setDate(date.getDate() + this.maxDays - 1);
        return date;
    }

    /**
     * 日期类型切换事件处理
     */
    public handleTypeChange() {
        if (this.value.selectType === CalendarSelectType.选择日期 && this.maxDays) {
            if (!this.value.endDate) {
                const today = new Date();
                this.value.endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            }
            const beginDate = new Date(this.value.endDate);
            beginDate.setDate(beginDate.getDate() - this.maxDays + 1);
            this.value.beginDate = beginDate;
        }
        this.calcDate();
    }

    /**
     * 日期选择事件处理
     */
    public handleDateSelect(beginDate: Date, type: 'begin' | 'end') {
        if (this.alwaysShowCalendar) {
            this.value.selectType = CalendarSelectType.选择日期;
        }

        if (type === 'begin') {
            this.setEndDate();
        }

        if (this.onValueChange) {
            this.onValueChange.emit(this.value);
        }
    }

    /**
     * 自动设置结束日期
     */
    private setEndDate() {
        if (this.value.beginDate && this.value.endDate && this.maxDays) {
            const beginDate = this.value.beginDate;
            const endDate = this.value.endDate;
            if (endDate.getTime() - beginDate.getTime() > (this.maxDays - 1) * 24 * 60 * 60 * 1000) {
                const newDate = new Date(beginDate);
                newDate.setDate(newDate.getDate() + this.maxDays - 1);
                this.value.endDate = newDate;
            }
        }
    }

    /**
     * 根据不同的类型计算开始日期和结束日期
     */
    private calcDate() {
        const getDate = (date: Date) => {
            return new Date(date.getFullYear(), date.getMonth(), date.getDate());
        };
        const today = new Date();
        switch (this.value.selectType) {
            case CalendarSelectType.不限:
                this.value.beginDate = null;
                this.value.endDate = null;
                break;
            case CalendarSelectType.今天:
                this.value.beginDate = getDate(today);
                this.value.endDate = getDate(today);
                break;
            case CalendarSelectType.三天内:
                today.setDate(today.getDate() - 2);
                this.value.beginDate = getDate(today);
                this.value.endDate = getDate(new Date());
                break;
            case CalendarSelectType.一周内:
                today.setDate(today.getDate() - 6);
                this.value.beginDate = getDate(today);
                this.value.endDate = getDate(new Date());
                break;
            case CalendarSelectType.两周内:
                today.setDate(today.getDate() - 13);
                this.value.beginDate = getDate(today);
                this.value.endDate = getDate(new Date());
                break;
            case CalendarSelectType.一个月内:
                today.setMonth(today.getMonth() - 1);
                this.value.beginDate = getDate(today);
                this.value.endDate = getDate(new Date());
                break;
            default:
                break;
        }
        if (this.onValueChange) {
            this.onValueChange.emit(this.value);
        }
    }
}

export enum CalendarSelectType {
    '不限' = 'None',
    '今天' = 'Today',
    '三天内' = 'Within3Days',
    '一周内' = 'Within1Week',
    '两周内' = 'Within2Weeks',
    '一个月内' = 'Within1Month',
    '选择日期' = 'Custom'
}

export interface CalendarSelectedValue {
    /**
     * 选择的日期类型
     */
    selectType: CalendarSelectType;
    /**
     * 开始日期
     */
    beginDate?: Date;
    /**
     * 结束日期
     */
    endDate?: Date;
}

@NgModule({
    imports: [
        SharedModule,
        DropdownModule,
        CalendarModule
    ],
    declarations: [CalendarSelectComponent],
    exports: [CalendarSelectComponent]
})
export class CalendarSelectModule {
}
