/**
 * @File: 日期控件本地化
 * @Author: wush
 */
import { Injectable } from '@angular/core';

@Injectable()
export class CalendarLocaleService {
    public zh = {
        firstDayOfWeek: 0,
        dayNames: [
            '星期天',
            '星期一',
            '星期二',
            '星期三',
            '星期四',
            '星期五',
            '星期六'],
        dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
        monthNames: [
            '一月',
            '二月',
            '三月',
            '四月',
            '五月',
            '六月',
            '七月',
            '八月',
            '九月',
            '十月',
            '十一月',
            '十二月'],
        monthNamesShort: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
        today: '今天',
        clear: '清空'
    };

    public get yearRange() {
        const thisYear = new Date().getFullYear();
        return `1970:${thisYear + 20}`;
    }

    /**
     * 根据开始日期和最大跨度天数获取结束日期的最大值
     * @param startDate
     * @param maxDays
     */
    public getMaxDate(startDate: string | Date, maxDays: number) {
        if (!maxDays) {
            return null;
        }
        const date = new Date(<any>startDate);
        date.setDate(date.getDate() + maxDays - 1);
        return date;
    }

    /**
     * 根据开始日期和最大跨度天数获取结束日期
     * @param startDate
     * @param endDate
     * @param maxDays
     */
    public calcEndDateByStartDate(startDate: string | Date, endDate: string | Date, maxDays: number) {
        if (!endDate) {
            return null;
        }
        const startDate1 = new Date(<any>startDate);
        const endDate1 = new Date(<any>endDate);
        if (endDate1.getTime() - startDate1.getTime() > (maxDays - 1) * 24 * 60 * 60 * 1000) {
            startDate1.setDate(startDate1.getDate() + (maxDays - 1));
            return startDate1;
        }
        return endDate1;
    }
}
