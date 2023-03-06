import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Stepper, { Props as StepperProps} from '../../../../../../src/components/pages/chakuken/torihikisaki-shiharai/index/stepper';

describe('Stepper コンポーネントのテスト', () => {
  describe('ステップ表示についてのテスト', () => {
    test('lables プロパティの文字列が全て表示される', () => {
      const labels = ['step1', 'step2'];

      render(<Stepper {...factoryStepperProps({ labels })} />);

      expect(screen.getByText(/step1/i)).toBeInTheDocument();
      expect(screen.getByText(/step2/i)).toBeInTheDocument();
    });
  });
});

function factoryStepperProps(props: Partial<StepperProps>): StepperProps {
  return {
    labels: props.labels ?? ['step1', 'step2'],
    activeStep: props.activeStep ?? 0,
  }
}
