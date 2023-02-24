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
import { ContentCode, Contents } from '../../../../../domain/content';
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

function getStyles(code: ContentCode, selectedContent: ContentCode[], theme: Theme) {
  return {
    fontWeight:
      selectedContent.indexOf(code) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

type Props = {
  contents: Contents;
  values: SelectContentFormValues;
  onChangeValues: (values: SelectContentFormValues) => void;
}

export default function SelectContentForm({ contents, values, onChangeValues }: Props) {
  const theme = useTheme();

  const handleChange = (event: SelectChangeEvent<typeof values.contents>) => {
    const {
      target: { value },
    } = event;

    // On autofill we get a stringified value.
    const selected = typeof value === 'string' ? value.split(',') : value;
    onChangeValues({...values, contents: selected});
  };

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
            <InputLabel id="select-contnet-label">作品</InputLabel>
            <Select
              labelId='select-contnet-label'
              id='select-contnet'
              multiple
              value={values.contents}
              onChange={handleChange}
              input={<OutlinedInput label="作品" />}
              MenuProps={MenuProps}
            >
              {Array.from(contents).map(([code, content]) => (
                <MenuItem
                  key={code}
                  value={code}
                  style={getStyles(code, values.contents, theme)}
                >
                  {`${content.code}： ${content.name}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Fragment>
  )
}
