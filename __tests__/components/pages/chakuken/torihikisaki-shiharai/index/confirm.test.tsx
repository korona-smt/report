import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import Confirm from '@/components/pages/chakuken/torihikisaki-shiharai/index/confirm';
import { AggregateType } from '@/domain/chakukenTorihikisakiShiharai';
import { Contents } from '@/domain/content';
import { Institutions } from '@/domain/institution';
import { Values } from '@/pages/chakuken/torihikisaki-shiharai';

const reportTypes = new Map<AggregateType, string>([
  [AggregateType.DATE_RANGE, '期間'],
  [AggregateType.RAKUJITSU, '楽日'],
]);
const contents: Contents = new Map([
  ['C99991', {code: 'C99991', name: 'Content 1'}],
  ['C99992', {code: 'C99992', name: 'Content 2'}],
  ['C99993', {code: 'C99993', name: 'Content 3'}],
]);
const institutions: Institutions = new Map([
  ['I99991', {code: 'I99991', name: 'Institution 1'}],
  ['I99992', {code: 'I99992', name: 'Institution 2'}],
  ['I99993', {code: 'I99993', name: 'Institution 3'}],
]);
const defaultProps = {reportTypes, contents, institutions};

describe('Confirm コンポーネントのテスト', () => {
  describe('コンポーネントの描画テスト', () => {
    test('見出し 確認 が含まれる', () => {
      const values = factoryValues();

      render(<Confirm values={values} {...defaultProps} />);
      const heading = screen.getByRole('heading', {name: '確認'});

      expect(heading).toBeInTheDocument();
    });
    test('選択した区分 楽日 が含まれる', () => {
      const values = factoryValues({ type: AggregateType.RAKUJITSU });

      render(<Confirm values={values} {...defaultProps} />);
      const el = screen.getByTestId('values-type');

      expect(el).toHaveTextContent('楽日');
    });
    test('選択した期間 2023/02/01 ～ 2023/03/04 が含まれる', () => {
      const values = factoryValues({
        dateRangeFrom: new Date('2023/02/01'),
        dateRangeTo: new Date('2023/03/04'),
      });

      render(<Confirm values={values} {...defaultProps} />);
      const el = screen.getByTestId('values-date-range');

      expect(el).toHaveTextContent('2023/02/01 ～ 2023/03/04');
    });
    test('選択した作品 Content 1, Content 3 が含まれる', () => {
      const values = factoryValues({ contents: ['C99991', 'C99993'] });

      render(<Confirm values={values} {...defaultProps} />);
      const el = screen.getByTestId('values-contents');

      expect(within(el).getByText('Content 1')).toBeInTheDocument();
      expect(within(el).getByText('Content 3')).toBeInTheDocument();
    });
    test('選択した施設 Institution 2, Institution 3 が含まれる', () => {
      const values = factoryValues({ institutions: ['I99992', 'I99993'] });

      render(<Confirm values={values} {...defaultProps} />);
      const el = screen.getByTestId('values-institutions');

      expect(within(el).getByText('Institution 2')).toBeInTheDocument();
      expect(within(el).getByText('Institution 3')).toBeInTheDocument();
    });
  });
});

function factoryValues(values: Partial<Values> = {}): Values {
  return {
    type: values.type ?? AggregateType.DATE_RANGE,
    dateRangeFrom: values.dateRangeFrom ?? new Date(),
    dateRangeTo: values.dateRangeTo ?? new Date(),
    contents: values.contents ?? ['C99991'],
    institutions: values.institutions ?? ['I99991'],
  };
}
