import MuiStepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

export type Props = {
  labels: string[];
  activeStep: number;
}

export default function Stepper({ labels, activeStep }: Props) {
  return (
    <MuiStepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
      {labels.map((label) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </MuiStepper>
  )
}
