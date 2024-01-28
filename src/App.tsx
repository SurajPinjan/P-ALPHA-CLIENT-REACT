import { DashboardOutlined } from '@mui/icons-material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LoginIcon from '@mui/icons-material/Login';
import MenuIcon from '@mui/icons-material/Menu';
import { CssBaseline, List, Menu, MenuItem, Toolbar, Typography, } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { CSSObject, Theme, styled, useTheme } from '@mui/material/styles';
import {
  randomCreatedDate,
  randomId
} from '@mui/x-data-grid-generator';
import * as React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import SixSigma from '../../six-sigma-web/src/assets/images/sixSigma.png';
import Problem from '../../six-sigma-web/src/assets/images/solve-the-problem.svg';
import Training from '../../six-sigma-web/src/assets/images/training.svg';
const drawerWidth = 200;

interface MenuItem {
  title: string,
  path: string
}

const menuItems: MenuItem[] = [{ title: 'Dashboard', path: 'home' },
{ title: 'Problem Bank', path: 'problem_bank' },
{ title: 'Six Sigma', path: 'project' },
{ title: 'Training', path: 'training' }];

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1),
  height: '20px !important',
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));


const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const App = () => {

  // states
  const [open, setOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [problem, setProblem] = React.useState<null | HTMLElement>(null);

  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // non state variables
  const openMenuProblem = Boolean(problem);
  const menus: React.ComponentType<any>[] = [DashboardOutlined, () => <img src={Problem} alt="bar chart" width={20} height={20} />, () => <img src={SixSigma} alt="bar chart" width={20} height={20} />, () => <img src={Training} alt="bar chart" width={20} height={20} />
  ];

  React.useEffect(() => {

    const data = [
      {
        id: randomId(),
        date: randomCreatedDate()
      },
      {
        id: randomId(),
        date: randomCreatedDate()
      },
    ];

    const stringifiedData = JSON.stringify(data);
    localStorage.setItem('data', stringifiedData);
  }, []);

  // event handlers

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenuClick = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false); navigate('/dashboard/home'); setOpen(false); setProblem(null);
    } else {
      setIsLoggedIn(true); setProblem(null);
    }
  }

  const handleCloseClick = () => {
    setProblem(null)
  }

  // design

  function listItem(Menu: React.ComponentType<any>, index: number) {

    return <ListItem key={menuItems[index].title} disablePadding sx={{ display: 'block' }}>
      <ListItemButton
        onClick={handleDrawerClose}
        component={Link}
        to={`/dashboard/${menuItems[index].path}`}
        sx={{
          minHeight: 48,
          justifyContent: open ? 'initial' : 'center',
          px: 2.5,
          color: location.pathname === `/dashboard/${menuItems[index].path}` ? '#115E6E' : '',
          borderLeft: location.pathname === `/dashboard/${menuItems[index].path}` ? '5px solid #115E6E' : '',
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 3 : 'auto',
            justifyContent: 'center',
            color: location.pathname === '/' + menuItems[1].path ? '#115E6E' : '',
          }}
        >
          {<Menu></Menu>}
        </ListItemIcon>
        <ListItemText primary={menuItems[index].title} sx={{ opacity: open ? 1 : 0 }} />
      </ListItemButton>
    </ListItem>;
  }


  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{ backgroundColor: '#ffffff' }}>
        <Toolbar>
          {
            isLoggedIn && (
              <IconButton
                color="primary"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{
                  marginRight: 5,
                  ...(open && { display: 'none' }),
                }}
              >
                <MenuIcon />
              </IconButton>)}
          <img src="https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Logo_of_Titan_Company%2C_May_2018.svg/640px-Logo_of_Titan_Company%2C_May_2018.svg.png" alt="Image 1" width={50} height={50} style={{ marginRight: '10px' }} />
          <Typography variant="h6" noWrap component="div" sx={{ color: '#115E6E' }}>
            Business Excellence Portal
          </Typography>
          <div style={{ marginLeft: 'auto' }}>
            <IconButton
              aria-label="more"
              id="basic-button"
              aria-controls={openMenuProblem ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={openMenuProblem ? 'true' : undefined}
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                setProblem(event.currentTarget);
              }}
            >
              {
                isLoggedIn && (
                  <AccountCircleIcon />)
              }
              {
                !isLoggedIn && (
                  <LoginIcon />)
              }
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={problem}
              open={openMenuProblem}
              onClose={handleCloseClick}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              {
                !isLoggedIn && (<MenuItem onClick={handleMenuClick}>Login</MenuItem>)
              }
              {
                isLoggedIn && (<MenuItem onClick={handleMenuClick}>Logout</MenuItem>)
              }
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      {
        isLoggedIn && (<Drawer variant="permanent" open={open}>
          <DrawerHeader >
            <Box display={'flex'} width={'100%'} justifyContent={'center'}>
              <Typography variant="h6" noWrap component="div" sx={{ color: '#115E6E', fontSize: 20, marginLeft: 2 }}>
                Six
              </Typography>
              <Typography variant="h6" noWrap component="div" sx={{ color: '#00b0ab', fontSize: 20, marginLeft: 0.5 }}>
                Sigma
              </Typography>

            </Box>
            <IconButton onClick={handleDrawerClose} style={{ background: '#e8e8e8', padding: 4 }}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {menus.map((menu, index) => listItem(menu, index))}
          </List>
        </Drawer>)}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <div >
          <Outlet />
        </div>
      </Box>
    </Box>
  );
}

export default App;