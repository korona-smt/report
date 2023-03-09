import { Fragment } from 'react';
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import OutlinedInput from '@mui/material/OutlinedInput';
import MultipleSelect, { MultipleSelectChangeEvent } from '../../../../../components/atoms/multipleSelect';
import { Institutions } from '../../../../../domain/institution';
import { SelectInstitutionFormValues } from '../../../../../pages/chakuken/torihikisaki-shiharai';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 100;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export type SelectInstitutionFormProps = {
  institutions: Institutions;
  values: SelectInstitutionFormValues;
  onChangeValues: (values: SelectInstitutionFormValues) => void;
}

export default function SelectInstitutionForm({ institutions, values, onChangeValues }: SelectInstitutionFormProps) {
  const theme = useTheme();

  type InstitutionsValues = typeof values.institutions;
  const handleChange = (event: MultipleSelectChangeEvent<InstitutionsValues>) => {
    const {
      target: { value },
    } = event;

    // On autofill we get a stringified value.
    const selected = typeof value === 'string' ? value.split(',') : value;

    onChangeValues({...values, institutions: selected});
  };

  const items = Array.from(institutions).map(([_code, institution]) => ({
    value: institution.code,
    label: `${institution.code}： ${institution.name}`,
    selected: values.institutions.includes(institution.code),
  }));

  return (
    <Fragment>
      <Typography variant="h5">
        店舗選択
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack spacing={2} direction="row">
            <Button variant='contained' onClick={() => onChangeValues({...values, institutions: Array.from(institutions.keys())})}>全て選択</Button>
            <Button variant='outlined' onClick={() => onChangeValues({...values, institutions: []})}>選択解除</Button>
          </Stack>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="select-institutions-label">店舗</InputLabel>
            <MultipleSelect<InstitutionsValues>
              labelId='select-institutions-label'
              id='select-institutions'
              value={values.institutions}
              onChange={handleChange}
              input={<OutlinedInput label="店舗" />}
              MenuProps={MenuProps}
              items={items}
              theme={theme}
            />
          </FormControl>
        </Grid>
      </Grid>
    </Fragment>
  )
}
