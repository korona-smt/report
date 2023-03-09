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
import { Contents } from '../../../../../domain/content';
import { SelectContentFormValues } from '../../../../../pages/chakuken/torihikisaki-shiharai';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 100;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 500,
    },
  },
};

export type SelectContentFormProps = {
  contents: Contents;
  values: SelectContentFormValues;
  onChangeValues: (values: SelectContentFormValues) => void;
}

export default function SelectContentForm({ contents, values, onChangeValues }: SelectContentFormProps) {
  const theme = useTheme();

  type ContentsValues = typeof values.contents;
  const handleChange = (event: MultipleSelectChangeEvent<ContentsValues>) => {
    const {
      target: { value },
    } = event;

    // On autofill we get a stringified value.
    const selected = typeof value === 'string' ? value.split(',') : value;

    onChangeValues({...values, contents: selected});
  };

  const items = Array.from(contents).map(([_code, content]) => ({
    value: content.code,
    label: `${content.code}： ${content.name}`,
    selected: values.contents.includes(content.code),
  }));

  return (
    <Fragment>
      <Typography variant="h5">
        作品選択
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack spacing={2} direction="row">
            <Button variant='contained' onClick={() => onChangeValues({...values, contents: Array.from(contents.keys())})}>全て選択</Button>
            <Button variant='outlined' onClick={() => onChangeValues({...values, contents: []})}>選択解除</Button>
          </Stack>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="select-contnets-label">作品</InputLabel>
            <MultipleSelect<ContentsValues>
              labelId='select-contnets-label'
              id='select-contnets'
              value={values.contents}
              onChange={handleChange}
              input={<OutlinedInput label="作品" />}
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
