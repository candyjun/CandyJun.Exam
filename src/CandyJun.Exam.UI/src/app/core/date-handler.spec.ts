/**
 * @File: date handler tests
 * @Author: wush
 */
import { DateHandler } from 'app/core/date-handler';

describe('date handler tests - ', () => {

    it('monthsDiff(): 同年同月的日期月分相隔数', () => {
        const result = DateHandler.monthsDiff(new Date('2017/01/25 00:00:00'), new Date('2017/01/1 00:00:00'));
        expect(result).toEqual(0);
    });

    it('monthsDiff(): 同年不同月的日期月分相隔数', () => {
        const result = DateHandler.monthsDiff(new Date('2017/01/25 00:00:00'), new Date('2017/09/1 00:00:00'));
        expect(result).toEqual(8);
    });

    it('monthsDiff(): 同年不同月且结束日期的 day 大于开始日期的 day 【不足月】的月分相隔数', () => {
        const result = DateHandler.monthsDiff(new Date('2017/01/15 00:00:00'), new Date('2017/09/10 00:00:00'), false);
        expect(result).toEqual(7);
    });

    it('monthsDiff(): 同年不同月且结束日期的 day 大于开始日期的 day 【足月】的月分相隔数', () => {
        const result = DateHandler.monthsDiff(new Date('2017/01/15 00:00:00'), new Date('2017/09/16 00:00:00'), false);
        expect(result).toEqual(8);
    });

    it('monthsDiff(): 同年不同月且结束日期的 day 等于开始日期的 day 【足月】的月分相隔数', () => {
        const result = DateHandler.monthsDiff(new Date('2017/01/15 00:00:00'), new Date('2017/09/15 00:00:00'), false);
        expect(result).toEqual(8);
    });

    it('monthsDiff(): 不同年不同月的日期月分相隔数', () => {
        const result = DateHandler.monthsDiff(new Date('2016/01/25 00:00:00'), new Date('2017/01/1 00:00:00'));
        expect(result).toEqual(12);
    });

    it('monthsDiff(): 不同年不同月的日期月分相隔数, 不忽略 day 的计算', () => {
        const result = DateHandler.monthsDiff(new Date('2016/01/25 00:00:00'), new Date('2017/01/1 00:00:00'), false);
        expect(result).toEqual(11);
    });

    it('monthsList(): 同年同月的日期月分相隔列表', () => {
        const result = DateHandler.monthsList(new Date('2017/01/25 00:00:00'), new Date('2017/01/1 00:00:00'));
        expect(result.toString()).toEqual('2017-1');
    });

    it('monthsList(): 不同年的日期月分相隔列表', () => {
        const result = DateHandler.monthsList(new Date('2016/01/25 00:00:00'), new Date('2017/03/19 00:00:00'));
        expect(result.toString()).toEqual(
            '2016-1,2016-2,2016-3,2016-4,2016-5,2016-6,2016-7,2016-8,2016-9,2016-10,2016-11,2016-12,2017-1,2017-2,2017-3');
    });

    it('monthsList(): 同年的日期月分相隔列表', () => {
        const result = DateHandler.monthsList(new Date('2017/01/25 00:00:00'), new Date('2017/03/19 00:00:00'));
        expect(result.toString()).toEqual('2017-1,2017-2,2017-3');
    });

    it('monthsList(): 更换默认分隔符', () => {
        const result = DateHandler.monthsList(new Date('2017/01/25 00:00:00'), new Date('2017/03/19 00:00:00'), '/');
        expect(result.toString()).toEqual('2017/1,2017/2,2017/3');
    });
});
