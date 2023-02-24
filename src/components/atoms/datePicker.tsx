import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker as MuiDatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ja from 'date-fns/locale/ja';

export default function DatePicker(props: DatePickerProps<Date, Date>) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
      <MuiDatePicker
        inputFormat="yyyy年MM月dd日"
        mask="____年__月__日"
        {...props}
      />
    </LocalizationProvider>
  );
}
