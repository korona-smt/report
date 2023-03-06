import { FC, Fragment } from 'react';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SummarizeIcon from '@mui/icons-material/Summarize';
import Link from '../../atoms/link';

export type Props = {
  width: number;
  current: MenuItem;
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

const menuItems = ['dashboard', 'chakuken-torihikisaki-shiharai'] as const;
type MenuItem = typeof menuItems[number];
type MainListItemsProps = {
  current: MenuItem;
}
const linkStyle = { textDecoration: 'none', color: 'inherit' };

const MainListItems: FC<MainListItemsProps> = ({ current }: MainListItemsProps) => (
  <Fragment>
    <Link href="/" style={linkStyle}>
      <ListItemButton selected={current == 'dashboard'}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="ダッシュボード" />
      </ListItemButton>
    </Link>
    <Link href="/chakuken/torihikisaki-shiharai" style={linkStyle}>
      <ListItemButton selected={current == 'chakuken-torihikisaki-shiharai'}>
        <ListItemIcon>
          <SummarizeIcon />
        </ListItemIcon>
        <ListItemText primary="着券取引支払先" />
      </ListItemButton>
    </Link>
  </Fragment>
);
