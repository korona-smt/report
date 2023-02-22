import { Fragment } from 'react';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Link from '../../atoms/link';

type Props = {
  width: number;
  current: string;
}

export default function Drawer({ width, current }: Props) {
  const MyDrawer = styled(MuiDrawer)(
    ({ theme }) => ({
      '& .MuiDrawer-paper': {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: width,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        boxSizing: 'border-box',
      },
    }),
  );

  return (
    <MyDrawer variant="permanent">
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          px: [1],
        }}
      >
      </Toolbar>
      <Divider />
      <List component="nav">
        <MainListItems current={current} />
      </List>
    </MyDrawer>
  );
}

type MainListItemsProps = {
  current: string;
}

const MainListItems = ({ current }: MainListItemsProps) => (
  <Fragment>
    <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
      <ListItemButton selected={current == 'dashboard'}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="ダッシュボード" />
      </ListItemButton>
    </Link>
  </Fragment>
);
