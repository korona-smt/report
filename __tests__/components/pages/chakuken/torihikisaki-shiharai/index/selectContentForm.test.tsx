import { fireEvent, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Contents } from '@/domain/content';
import SelectContentForm, { SelectContentFormProps } from '@/components/pages/chakuken/torihikisaki-shiharai/index/selectContentForm';
import { SelectContentFormValues as Values } from '@/pages/chakuken/torihikisaki-shiharai';

const contents: Contents = new Map([
  ['C99991', {code: 'C99991', name: 'Content 1'}],
  ['C99992', {code: 'C99992', name: 'Content 2'}],
  ['C99993', {code: 'C99993', name: 'Content 3'}],
]);
const nonActionHandler = (_v: Values) => {console.log('on change')};

describe('SelectContentForm コンポーネントのテスト', () => {
  describe('レイアウトについてのテスト', () => {
    test('見出し 期間選択 が含まれる', () => {
      renderSelectContentForm();
      const heading = screen.getByRole('heading', {name: '作品選択'});

      expect(heading).toBeInTheDocument();
    });
  });
  describe('作品フィールドのテスト', () => {
    test('初期値として C99991, C99992 が選択されている', () => {
      const values = factoryValues({ contents: ['C99991', 'C99992'] });
      renderSelectContentForm({ values });

      const button = screen.getByRole('button', { expanded: false });
      fireEvent.mouseDown(button);
      const presentation = screen.getByRole('presentation');

      const options = within(presentation).getAllByRole('option', { selected: true });

      expect(options).toHaveLength(2);
      expect(options[0]).toHaveTextContent(/Content 1/);
      expect(options[1]).toHaveTextContent(/Content 2/);
    });
    test('値を変更すると onChangeValues が実行されて、変更後の値リストを受け取る', () => {
      const onChangeValues = jest.fn();
      const values = factoryValues({ contents: ['C99991'] });
      renderSelectContentForm({ values, onChangeValues });

      const button = screen.getByRole('button', { expanded: false });
      fireEvent.mouseDown(button);
      const presentation = screen.getByRole('presentation');
      const option = within(presentation).getByRole('option', { name: /Content 2/ });
      fireEvent.click(option);

      expect(onChangeValues).toHaveBeenCalledTimes(1);
      expect(onChangeValues).toHaveBeenCalledWith({contents: ['C99991', 'C99992']});
    });
    test('全選択ボタンを押すと、全ての要素が選択される', () => {
      const onChangeValues = jest.fn();
      const values = factoryValues({ contents: [] });
      renderSelectContentForm({ values, onChangeValues });

      const allSelectButton = screen.getByRole('button', { name: '全て選択' });
      fireEvent.click(allSelectButton);

      expect(onChangeValues).toHaveBeenCalledWith({contents: ['C99991', 'C99992', 'C99993']});
    });
    test('選択解除ボタンを押すと、全ての要素の選択が解除される', () => {
      const onChangeValues = jest.fn();
      const values = factoryValues({ contents: ['C99991', 'C99992', 'C99993'] });
      renderSelectContentForm({ values, onChangeValues });

      const selectClearButton = screen.getByRole('button', { name: '選択解除' });
      fireEvent.click(selectClearButton);

      expect(onChangeValues).toHaveBeenCalledWith({contents: []});
    })
  });
});

function renderSelectContentForm(props: Partial<SelectContentFormProps> = {}) {
  const p: SelectContentFormProps = (() => {
    return {
      contents: props.contents ?? contents,
      values: props.values ?? factoryValues(),
      onChangeValues: props.onChangeValues ?? nonActionHandler,
    }
  })();
  return render(<SelectContentForm {...p} />);
}

function factoryValues(values: Partial<Values> = {}): Values {
  return {
    contents: values.contents ?? [],
  }
}
