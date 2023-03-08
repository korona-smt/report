import { fireEvent, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import SelectDateRangeForm, { SelectDateRangeFormProps } from '@/components/pages/chakuken/torihikisaki-shiharai/index/selectDateRangeForm';
import { AggregateType } from '@/domain/chakukenTorihikisakiShiharai';
import { SelectDateRangeFormValues as Values } from '@/pages/chakuken/torihikisaki-shiharai';

const reportTypes = new Map<AggregateType, string>([
  [AggregateType.DATE_RANGE, '期間'],
  [AggregateType.RAKUJITSU, '楽日'],
]);
const nonActionHandler = (_v: Values) => {};

describe('SelectDateRangeForm コンポーネントのテスト', () => {
  describe('レイアウトについてのテスト', () => {
    test('見出し 期間選択 が含まれる', () => {
      renderSelectDateRangeForm();
      const heading = screen.getByRole('heading', {name: '期間選択'});

      expect(heading).toBeInTheDocument();
    });
  });
  describe('区分フィールドのテスト', () => {
    test('区分 期間, 楽日 が含まれる', () => {
      renderSelectDateRangeForm();
      const el = screen.getByTestId('field-aggregate-type');

      expect(within(el).getByRole('radio', {name: '期間'})).toBeInTheDocument();
      expect(within(el).getByRole('radio', {name: '楽日'})).toBeInTheDocument();
    });
    test('区分の値として DATE_RANGE を渡すと 期間 が選択される', () => {
      const values = factoryValues({ type: AggregateType.DATE_RANGE });

      renderSelectDateRangeForm({ values, reportTypes });
      const el = screen.getByTestId('field-aggregate-type');

      expect(within(el).getByRole('radio', {name: '期間'})).toBeChecked();
    });
    test('区分の値として RAKUJITSU を渡すと 楽日 が選択される', () => {
      const values = factoryValues({ type: AggregateType.RAKUJITSU });

      renderSelectDateRangeForm({ values, reportTypes });
      const el = screen.getByTestId('field-aggregate-type');

      expect(within(el).getByRole('radio', {name: '楽日'})).toBeChecked();
    });
    test('区分の値を変更すると onChangeValues がトリガーされ、変更後の値が取得できる', (done) => {
      const beforeType = AggregateType.DATE_RANGE;
      const afterType = AggregateType.RAKUJITSU;
      const values = factoryValues({ type: beforeType });
      const handler = (values: Values) => {
        expect(values.type).toBe(afterType);
        done();
      };

      renderSelectDateRangeForm({ values, reportTypes, onChangeValues: handler });
      const el = screen.getByTestId('field-aggregate-type');
      const radio = within(el).getByRole('radio', { name: '楽日'});

      fireEvent.click(radio);
    });
  });

  test.todo('期間フィールドについてのテスト');
});

function renderSelectDateRangeForm(props: Partial<SelectDateRangeFormProps> = {}) {
  const p: SelectDateRangeFormProps = (() => {
    return {
      values: props.values ?? factoryValues(),
      onChangeValues: props.onChangeValues ?? nonActionHandler,
      reportTypes: props.reportTypes ?? reportTypes
    }
  })();
  return render(<SelectDateRangeForm {...p} />);
}

function factoryValues(values: Partial<Values> = {}): Values {
  return {
    type: values.type ?? AggregateType.DATE_RANGE,
    dateRangeFrom: values.dateRangeFrom ?? null,
    dateRangeTo: values.dateRangeTo ?? new Date(),
  };
}
