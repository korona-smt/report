import * as date from '@/lib/date';

describe('date モジュールのテスト', () => {
  describe('日付文字列をDateオブジェクトにパースする parseDate のテスト', () => {
    test('yyyy-MM-dd形式の文字列 2023-03-10 を引数に渡すと、2023年3月10日のDateオブジェクトを返す', () => {
      const value = '2023-03-10';

      const result = date.parseDate(value);

      expect(result.getFullYear()).toBe(2023);
      expect(result.getMonth() + 1).toBe(3);
      expect(result.getDate()).toBe(10);
    });
    test('yyyy-MM-dd形式の文字列 2023-03-10 を引数に渡すと、0時0分0秒のDateオブジェクトを返す', () => {
      const value = '2023-03-10';

      const result = date.parseDate(value);

      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
    });
    test('パースできない文字列を引数に渡すと、エラーが発生する', () => {
      const value = '';

      expect(() => {
        date.parseDate(value);
      }).toThrow(/parse error/);
    });
  });
  describe('Dateオブジェクトを日付文字列にフォーマットする formatDate のテスト', () => {
    test('2023年3月10日のDateオブジェクトを引数に渡すと、yyyy-MM-dd形式の文字列 2023-03-10 を返す', () => {
      const value = new Date('2023-03-10');

      const result = date.formatDate(value);

      expect(result).toBe('2023-03-10');
    });
  });
});
