import { transformToSelectItem } from './select-item.pipe';

enum NumberDirection {
    Up = 1,
    Down = 2,
    Left = 4,
    Right = 'abc'.length,
}

enum StringDirection {
    Up = 'aUp',
    Down = 'aDown',
    Left = 'aLeft',
    Right = 'aRight',
}

describe('transform to SelectItem', () => {

    function withOptionalItem(typeofenum: any) {
        // true
        const item1 = transformToSelectItem(typeofenum, true);
        expect(item1.length).toEqual(5);
        expect(item1).toContain({ label: '请选择', value: '' });

        // false
        const item2 = transformToSelectItem(typeofenum, false);
        expect(item2.length).toEqual(4);
        expect(item2).not.toContain({ label: '请选择', value: '' });

        // ''
        const item3 = transformToSelectItem(typeofenum, '');
        expect(item3.length).toEqual(4);
        expect(item3).not.toContain({ label: '请选择', value: '' });

        // Please Choose...
        const item4 = transformToSelectItem(typeofenum, 'Please Choose...');
        expect(item4.length).toEqual(5);
        expect(item4).toContain({ label: 'Please Choose...', value: '' });
    }

    it('transform numeric enum', () => {
        const item1 = transformToSelectItem(NumberDirection);
        expect(item1.length).toEqual(4);
        expect(item1).toContain({ label: 'Up', value: NumberDirection.Up });
        expect(item1).toContain({ label: 'Down', value: NumberDirection.Down });
        expect(item1).toContain({ label: 'Left', value: NumberDirection.Left });
        expect(item1).toContain({ label: 'Right', value: NumberDirection.Right });
    });

    it('transform numeric enum with optional item', () => {
        withOptionalItem(NumberDirection);
    });

    it('transform string enum', () => {
        const item1 = transformToSelectItem(StringDirection);
        expect(item1.length).toEqual(4);
        expect(item1).toContain({ label: 'Up', value: StringDirection.Up });
        expect(item1).toContain({ label: 'Down', value: StringDirection.Down });
        expect(item1).toContain({ label: 'Left', value: StringDirection.Left });
        expect(item1).toContain({ label: 'Right', value: StringDirection.Right });
    });

    it('transform string enum with optional item', () => {
        withOptionalItem(StringDirection);
    });
});
