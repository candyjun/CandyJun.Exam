/**
 * @File: date handler
 * @Author: wush
 */
export class DateHandler {

    /**
     * 返回两个日期相隔的月分数
     *
     * @static
     * @param {Date} date1 日期1
     * @param {Date} date2 日期2
     * @param {boolean} ignoreDay 是否忽略 day 计算，默认为 true
     */
    public static monthsDiff(date1: Date, date2: Date, ignoreDay = true) {
        const startDate = this.getStartDate(date1, date2);
        const endDate = this.getEndDate(date1, date2);

        let m = (endDate.getFullYear() - startDate.getFullYear()) * 12 + endDate.getMonth() - startDate.getMonth();

        if (ignoreDay) {
            return m;
        }

        if (endDate.getDate() < startDate.getDate()) { --m; }
        return m;
    }

    /**
     * 列出两个日期时的月分
     * @param date1 日期1
     * @param date2 日期2
     * @param splitBy 年份与月分的分隔符
     * @example
     *  DateHandler.monthsList(new Date('2017/01/25'), new Date('2017/03/19'));
     * 返回
     *  ['2017-1', '2017-2', '2017-3']
     */
    public static monthsList(date1: Date, date2: Date, splitBy: string = '-') {
        const startDate = this.getStartDate(date1, date2);
        let startYear = startDate.getFullYear();
        let startMonth = startDate.getMonth() + 1;

        const result: string[] = [];
        let monthsDiff = this.monthsDiff(date1, date2);
        do {
            result.push(`${startYear}${splitBy}${startMonth}`);

            if (startMonth === 12) {
                startMonth = 0;
                startYear += 1;
            }
            startMonth++;
            monthsDiff--;
        } while (monthsDiff >= 0);

        return result;
    }

    private static getStartDate(date1: Date, date2: Date) {
        return date1 <= date2 ? date1 : date2;
    }

    private static getEndDate(date1: Date, date2: Date) {
        return date1 >= date2 ? date1 : date2;
    }

}
