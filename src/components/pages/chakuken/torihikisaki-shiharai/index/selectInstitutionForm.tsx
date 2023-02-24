import { Fragment } from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import OutlinedInput from '@mui/material/OutlinedInput';
import { Institutions, InstitutionCode } from '../../../../../domain/institution';
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

function getStyles(item: InstitutionCode, selected: InstitutionCode[], theme: Theme) {
  return {
    fontWeight:
      selected.indexOf(item) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

type Props = {
  institutions: Institutions;
  values: SelectInstitutionFormValues;
  onChangeValues: (values: SelectInstitutionFormValues) => void;
}

export default function SelectInstitutionForm({ institutions, values, onChangeValues }: Props) {
  const theme = useTheme();

  const handleChange = (event: SelectChangeEvent<typeof values.institutions>) => {
    const {
      target: { value },
    } = event;
    const selected = typeof value === 'string' ? value.split(',') : value;
    onChangeValues({...values, institutions: selected});
  };

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
            <InputLabel id="select-institution-label">店舗</InputLabel>
            <Select
              labelId='select-institution-label'
              id='select-institution'
              multiple
              value={values.institutions}
              onChange={handleChange}
              input={<OutlinedInput label="店舗" />}
              MenuProps={MenuProps}
            >
              {Array.from(institutions).map(([_code, institution]) => (
                <MenuItem
                  key={institution.code}
                  value={institution.code}
                  style={getStyles(institution.code, values.institutions, theme)}
                >
                  {`${institution.code}： ${institution.name}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Fragment>
  )
}
