import { Fragment } from 'react';
import { format } from 'date-fns'
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { AggregateType } from '../../../../../domain/chakukenTorihikisakiShiharai';
import { Contents } from '../../../../../domain/content';
import { Institutions } from '../../../../../domain/institution';
import { Values } from '../../../../../pages/chakuken/torihikisaki-shiharai';

type Props = {
  reportTypes: Map<AggregateType, string>;
  contents: Contents;
  institutions: Institutions;
  values: Values;
}

export default function Confirm({ reportTypes, contents, institutions, values }: Props) {
  return (
    <Fragment>
      <Typography variant="h5">
        確認
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6">
            期間
          </Typography>
          <Typography data-testid={'values-type'}>{reportTypes.get(values.type)}</Typography>
          <Typography data-testid={'values-date-range'}>
            {format(values.dateRangeFrom, 'yyyy/MM/dd')} ～{' '}
            {format(values.dateRangeTo, 'yyyy/MM/dd')}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6">
            作品
          </Typography>
          <List dense data-testid={'values-contents'}>
            {values.contents.map((code) => (
              <ListItem key={code}>
                <ListItemText primary={contents.get(code)?.name} secondary={code}></ListItemText>
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6">
            店舗
          </Typography>
          <List dense data-testid={'values-institutions'}>
            {values.institutions.map((code) => (
              <ListItem key={code}>
                <ListItemText primary={institutions.get(code)?.name} secondary={code}></ListItemText>
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </Fragment>
  );
}
