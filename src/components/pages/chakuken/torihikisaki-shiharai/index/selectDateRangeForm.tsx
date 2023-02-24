
import { Fragment, ChangeEvent } from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DatePicker from '../../../../atoms/datePicker';
import { AggregateType, isAggregateType } from '../../../../../domain/chakukenTorihikisakiShiharai';
import { SelectDateRangeFormValues } from '../../../../../pages/chakuken/torihikisaki-shiharai';

type Types = Map<AggregateType, string>;
type Props = {
  reportTypes: Types;
  values: SelectDateRangeFormValues;
  onChangeValues: (values: SelectDateRangeFormValues) => void;
}

export default function SelectDateRangeForm({ reportTypes, values, onChangeValues }: Props) {
  const handleTypeChange = (_e: ChangeEvent<HTMLInputElement>, newValue: string) => {
    if (isAggregateType(newValue)) {
      onChangeValues({ ...values, type: newValue });
      return;
    }
    throw new Error('Invalid ReportType.');
  };

  const handleFromChange = (newValue: Date | null) => {
    onChangeValues({ ...values, dateRangeFrom: newValue });
  };

  const handleToChange = (newValue: Date | null) => {
    // @todo 入力必須なのでブランクにできないようにしたい
    onChangeValues({ ...values, dateRangeTo: newValue ?? values.dateRangeTo });
  };

  return (
    <Fragment>
      <Typography variant="h5">
        期間選択
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <FormControl>
            <FormLabel id="date-range-type">区分</FormLabel>
            <RadioGroup
              aria-labelledby="date-range-type"
              name="date-range-type"
              value={values.type}
              onChange={handleTypeChange}
            >
              {Array.from(reportTypes).map(([value, label]) => (
                <FormControlLabel key={value} value={value} control={<Radio />} label={label} />
              ))}
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl>
            <FormLabel>期間</FormLabel>
            <FormGroup row sx={{ alignItems: "center" }}>
              <DatePicker
                label="From"
                value={values.dateRangeFrom}
                onChange={handleFromChange}
                renderInput={(params) => <TextField {...params} />}
              />
              <Box sx={{ mx: 2 }}> ～ </Box>
              <DatePicker
                label="To"
                value={values.dateRangeTo}
                onChange={handleToChange}
                renderInput={(params) => <TextField {...params} required />}
              />
            </FormGroup>
          </FormControl>
        </Grid>
      </Grid>
    </Fragment>
  )
};
