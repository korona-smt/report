import MuiButton, { ButtonProps } from '@mui/material/Button';

export default function Button(props: ButtonProps) {
  return <MuiButton sx={{ mt: 3, ml: 1 }} {...props}></MuiButton>;
}
