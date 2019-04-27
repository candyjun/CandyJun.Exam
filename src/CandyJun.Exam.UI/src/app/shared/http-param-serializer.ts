import { HttpParams } from '@angular/common/http';
import { formatDateTime } from './format-date';

/**
 * create HttpParams from key value object
 *
 */
export const httpParamSerializer = (request: { [param: string]: simpleType }): HttpParams => {
    return new HttpParams({ fromString: toQueryString(request) });
};

type simpleType = string | string[] | number | number[] | Date | null | undefined | boolean;

/**
 * 复杂类型请使用json, 改用post
 * @example
 *      toQueryString({ a: 2, b: 'abc', c: true, d: false })        -> a=2&b=abc&c=true&d=false
 *      toQueryString({ a: 2, b: new Date() })                      -> yyyy-MM-dd HH:mm:ss
 *      toQueryString({ a: null, b: undefined, c: 1 })              -> a=&b=&c=1
 */
export function toQueryString(fromObject: { [param: string]: simpleType }) {
    const resultMap = new Map<string, string[]>();
    Object.keys(fromObject).forEach(key => {
        const value = (fromObject as any)[key];
        if (value === null || value === undefined) {
            resultMap.set(key, ['']);
        } else if (Array.isArray(value)) {
            resultMap.set(key, value);
        } else if (value instanceof Date) {
            resultMap.set(key, [formatDateTime(value)]);
        } else {
            resultMap.set(key, [value]);
        }
    });
    return Array.from(resultMap.keys())
        .map(key => {
            const eKey = encodeURIComponent(key);
            return resultMap.get(key)
                .map(value => `${eKey}=${encodeURIComponent(value)}`)
                .join('&');
        })
        .join('&');
}
