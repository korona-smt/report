import { getByRole, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Drawer, { Props } from '../../../../src/components/layouts/admin/drawer';

jest.mock('next/router', () => ({
  useRouter() {
    return jest.fn();
  },
}));

describe('Drawer コンポーネントのテスト', () => {
  describe('ナビゲーションのテスト', () => {
    test('current プロパティが dashboard のとき、ダッシュボードが選択される', () => {
      render(<Drawer {...factoryDrawerProp({current: 'dashboard'})} />);

      const navigation = screen.getByRole('navigation');
      const item = getByRole(navigation, 'button', {name: 'ダッシュボード'});

      expect(item).toHaveClass('Mui-selected');
    });
    test('current プロパティが chakuken-torihikisaki-shiharai のとき、着券取引支払先が選択される', () => {
      render(<Drawer {...factoryDrawerProp({current: 'chakuken-torihikisaki-shiharai'})} />);

      const navigation = screen.getByRole('navigation');
      const item = getByRole(navigation, 'button', {name: '着券取引支払先'});

      expect(item).toHaveClass('Mui-selected');
    });
  });
});

function factoryDrawerProp(props: Partial<Props>): Props {
  return {
    width: props.width ?? 300,
    current: props.current ?? 'dashboard',
  }
}
