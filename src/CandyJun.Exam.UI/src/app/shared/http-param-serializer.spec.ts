import { formatDateTime } from './format-date';
import { toQueryString } from './http-param-serializer';

describe('http param serializer', () => {
    it('serialize simple object', () => {
        expect(toQueryString({ a: 2 })).toBe('a=2');
        expect(toQueryString({ a: 2, b: 'abc', c: true, d: false })).toBe('a=2&b=abc&c=true&d=false');

        const current = new Date();
        expect(toQueryString({ a: 2, b: current })).toContain(encodeURIComponent(formatDateTime(current)));
    });

    it('serialize null & undefined as empty string', () => {
        expect(toQueryString({ a: null, b: undefined, c: 1 })).toBe('a=&b=&c=1');
    });

    it('serialize array, params are not double-encoded', () => {
        const param3 = toQueryString({ a: 2, 'b[]': false, c: [1, 2, 3, 4] });
        expect(decodeURIComponent(param3)).toBe('a=2&b[]=false&c=1&c=2&c=3&c=4');

        const param4 = toQueryString({ a: 2, 'b[]': false, c: ['1a', '2', '3', '4'] });
        expect(decodeURIComponent(param4)).toBe('a=2&b[]=false&c=1a&c=2&c=3&c=4');
    });

    it('serialize null, undefined or array with errors', () => {
        expect(() => toQueryString(null)).toThrowError(TypeError);
        expect(() => toQueryString(undefined)).toThrowError(TypeError);
    });
});
