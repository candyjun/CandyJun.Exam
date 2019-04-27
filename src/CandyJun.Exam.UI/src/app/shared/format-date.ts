/**
 * yyyy-MM-dd HH:mm:ss
 */
export function formatDateTime(input: Date | string) {
    const pad  = (num: number) => num < 10 ? '0' + num : num;
    // disable check
    const date = new Date(<any>input);
    // tslint:disable:no-null-keyword prefer-template
    return date.getFullYear() +
        '-' + pad(date.getMonth() + 1) +
        '-' + pad(date.getDate()) +
        ' ' + pad(date.getHours()) +
        ':' + pad(date.getMinutes()) +
        ':' + pad(date.getSeconds())
        ;
    // tslint:enable:no-null-keyword prefer-template
}

/**
 * yyyy-MM-dd
 */
export function formatDate(input: Date | string) {
    const pad  = (num: number) => num < 10 ? '0' + num : num;
    // disable check
    const date = new Date(<any>input);
    // tslint:disable:no-null-keyword prefer-template
    return date.getFullYear() +
        '-' + pad(date.getMonth() + 1) +
        '-' + pad(date.getDate())
        ;
    // tslint:enable:no-null-keyword prefer-template
}
