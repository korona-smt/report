import { fireEvent, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import SelectInstitutionForm, { SelectInstitutionFormProps } from '@/components/pages/chakuken/torihikisaki-shiharai/index/selectInstitutionForm';
import { Institutions } from '@/domain/institution';
import { SelectInstitutionFormValues as Values } from '@/pages/chakuken/torihikisaki-shiharai';

const institutions: Institutions = new Map([
  ['I99991', {code: 'I99991', name: 'Institution 1'}],
  ['I99992', {code: 'I99992', name: 'Institution 2'}],
  ['I99993', {code: 'I99993', name: 'Institution 3'}],
]);

describe('SelectInstitutionForm コンポーネントのテスト', () => {
  describe('レイアウトについてのテスト', () => {
    test('見出し 店舗選択 が含まれる', () => {
      renderSelectInstitutionForm();
      const heading = screen.getByRole('heading', {name: '店舗選択'});

      expect(heading).toBeInTheDocument();
    });
  });
  describe('店舗フィールドのテスト', () => {
    test('初期値として I99991, I99993 が選択されている', () => {
      const values = factoryValues({ institutions: ['I99991', 'I99993'] });
      renderSelectInstitutionForm({ values });

      const button = screen.getByRole('button', { expanded: false });
      fireEvent.mouseDown(button);
      const presentation = screen.getByRole('presentation');

      const options = within(presentation).getAllByRole('option', { selected: true });

      expect(options).toHaveLength(2);
      expect(options[0]).toHaveTextContent(/Institution 1/);
      expect(options[1]).toHaveTextContent(/Institution 3/);
    });
    test('値を変更すると onChangeValues が実行されて、変更後の値リストを受け取る', () => {
      const onChangeValues = jest.fn();
      const values = factoryValues({ institutions: ['I99991'] });
      renderSelectInstitutionForm({ values, onChangeValues });

      const button = screen.getByRole('button', { expanded: false });
      fireEvent.mouseDown(button);
      const presentation = screen.getByRole('presentation');
      const option = within(presentation).getByRole('option', { name: /Institution 2/ });
      fireEvent.click(option);

      expect(onChangeValues).toHaveBeenCalledTimes(1);
      expect(onChangeValues).toHaveBeenCalledWith({ institutions: ['I99991', 'I99992'] });
    });
    test('全選択ボタンを押すと、全ての要素が選択される', () => {
      const onChangeValues = jest.fn();
      const values = factoryValues({ institutions: [] });
      renderSelectInstitutionForm({ values, onChangeValues });

      const allSelectButton = screen.getByRole('button', { name: '全て選択' });
      fireEvent.click(allSelectButton);

      expect(onChangeValues).toHaveBeenCalledWith({ institutions: ['I99991', 'I99992', 'I99993'] });
    });
    test('選択解除ボタンを押すと、全ての要素の選択が解除される', () => {
      const onChangeValues = jest.fn();
      const values = factoryValues({ institutions: ['I99991', 'I99992', 'I99993'] });
      renderSelectInstitutionForm({ values, onChangeValues });

      const selectClearButton = screen.getByRole('button', { name: '選択解除' });
      fireEvent.click(selectClearButton);

      expect(onChangeValues).toHaveBeenCalledWith({ institutions: [] });
    });
  });
});

function renderSelectInstitutionForm(props: Partial<SelectInstitutionFormProps> = {}) {
  const p: SelectInstitutionFormProps = (() => {
    return {
      institutions: props.institutions ?? institutions,
      values: props.values ?? factoryValues(),
      onChangeValues: props.onChangeValues ?? jest.fn(),
    }
  })();
  return render(<SelectInstitutionForm {...p} />);
}

function factoryValues(values: Partial<Values> = {}): Values {
  return {
    institutions: values.institutions ?? [],
  }
}
