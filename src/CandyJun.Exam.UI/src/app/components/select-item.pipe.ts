import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { SelectItem } from 'primeng/primeng';

/**
 * 将枚举转换为 SelectItem
 */
export function transformToSelectItem(value: any, optionalItem: boolean | string = false): SelectItem[] {
    const keys: SelectItem[] = [];
    if (optionalItem === true) {
        keys.push({ label: '请选择', value: '' });
    } else if (optionalItem) {
        keys.push({ label: optionalItem, value: '' });
    }
    Object.keys(value).forEach((label) => {
        if (isNaN(parseInt(label, 10))) {
            keys.push({ label, value: value[label] });
        }
    });
    return keys;
}

/**
 * Keyvalue select dropdown, use with enum, or object
 * @example
 *  <select [(ngModel)]="myDirectionValue">
 *      <option value=""></option>
 *      <option *ngFor="let a of myDirection | appSelectItem" [value]="a.value">{{a.label}}</option>
 *  </select>
 *
 *
 *      public myDirection       = NumberDirection;             // type of enum
 *      public myDirectionValue =  NumberDirection.Down;        // enum value
 *
 *
 *      export enum NumberDirection {
 *           Up    = 1,
 *           Down  = 2,
 *           Left  = 4,
 *           Right = 'abc'.length
 *      }
 *
 *      export enum StringDirection {
 *          Up    = 'aUp',
 *          Down  = 'aDown',
 *          Left  = 'aLeft',
 *          Right = 'aRight'
 *      }
 */
@Pipe({ name: 'appSelectItemPipe' })
export class SelectItemPipe implements PipeTransform {
    /**
     * transform
     *
     * @param value type of enum
     * @param optionalItem 添加默认的空项
     */
    public transform(value: any, optionalItem: boolean | string = false): SelectItem[] {
        return transformToSelectItem(value, optionalItem);
    }
}

@NgModule({
    declarations: [SelectItemPipe],
    exports: [SelectItemPipe]
})
export class SelectItemPipeModule {
}
