import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { SelectItem } from 'primeng/primeng';

/**
 * 将传入的value值与dataList循环匹配，看dataList中的valueKey属性值是否等于value，如果等于，就返回对应的labelKey的值
 * @param {string} value       服务返回的id数据
 * @param {any[]} dataList     下拉框列表数据
 */
export function filterLabelByValue(value: string, dataList: SelectItem[]): string {
    if (value && dataList && dataList.length > 0) {
        let resultVal = value;
        for (const item of dataList) {
            if (value === item.value) {
                resultVal = item.label;
                break;
            }
        }
        return resultVal;
    } else {
        return value;
    }
}

/**
 *  由于下拉框在保存的时候存入的是value值，value可能是id值，
 *  此管道可通过id与传入的数据对象，过滤出对应的label值
 */
@Pipe({ name: 'appFilterLabelByValuePipe' })
export class FilterLabelByValuePipe implements PipeTransform {
    public transform(value: string, dataList: SelectItem[]): string {
        return filterLabelByValue(value, dataList);
    }
}

@NgModule({
    declarations: [FilterLabelByValuePipe],
    exports: [FilterLabelByValuePipe]
})
export class FilterLabelByValuePipeModule {
}
