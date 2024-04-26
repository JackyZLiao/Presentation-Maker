import * as React from 'react';
import axios from 'axios';
import { useNavigate, useLocation, useParams, Outlet } from 'react-router-dom';
import DashboardButton from '../components/dashboardButton';
import DeleteSlideButton from '../components/deleteSlideButton';
import EditThumbnailButton from '../components/editThumbnailButton';
import EditTitleButton from '../components/editTitleButton';
import EditFontButton from '../components/editFontButton';
import AddTextButton from '../components/addTextButton';
import AddImageButton from '../components/addImageButton';
import AddVideoButton from '../components/addVideoButton';
import AddCodeButton from '../components/addCodeButton';
import AddSlideButton from '../components/addSlideButton';
import DeleteTopicButton from '../components/deleteTopicButton';
import EditThemeButton from '../components/editThemeButton';
import PreviewButton from '../components/previewButton';
import EachSlide from './eachSlide';

import Box from '@mui/material/Box';
import { styled, useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
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
  justifypres: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for pres to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
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

const PresentationPage = ({ token }) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const { state } = useLocation();
  const { presId, slideId, mode } = useParams();
  const [Mode, setMode] = React.useState(mode);
  const [title, setTitle] = React.useState(state.pres.title);
  const [slide, setSlide] = React.useState(state.pres.slides[slideId - 1]);
  const [elementId, setElementId] = React.useState('');
  const [presentation, setPresentation] = React.useState(state.pres);

  React.useEffect(() => {
    getSlideData();
    document.addEventListener('click', handleClickItem);
    return () => {
      document.removeEventListener('click', handleClickItem);
    };
  }, [slideId, state.pres]);

  const handleClickItem = () => {
    setElementId('');
  }

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const navigate = useNavigate();

  const getSlideData = async () => {
    // Fetch current store of user from database
    try {
      const response = await axios.get('http://localhost:5005/store', {
        headers: {
          Authorization: token,
        }
      });
      const payload = response.data;
      const foundPresentation = payload.store.presentations[presId]; // get particular presentation
      const slide = foundPresentation.slides[slideId - 1]; // get particular slide
      setSlide(slide);
      setTitle(presentation.title);
    } catch (err) {
      alert(err);
    }
  }

  return (
    <>
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          {mode === 'edit' && (
            <>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{
                  marginRight: 5,
                  ...(open && { display: 'none' }),
                }}
              >
              <MenuIcon />
              </IconButton>
            </>
          )}
          <Box sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: mode === 'preview' ? 'center' : 'flex-start',
          }}>
            <Typography variant="h6" noWrap component="div"
            sx={{ marginRight: 2, textAlign: 'left' }}>
              {title}
            </Typography>
            <PreviewButton mode={Mode} setMode={setMode} pres={presentation} presentationId={presId} slideId={slideId} />
          </Box>
          {mode === 'edit' && (
            <>
              <DeleteTopicButton token={token} id={presId} />
              <EditThumbnailButton token={token} id={presId} />
              <EditTitleButton token={token} id={presId} handleTitleOnPage={setTitle} />
              <DashboardButton onClick={() => navigate('/dashboard')}/>
            </>
          )}
        </Toolbar>
      </AppBar>
      { mode === 'edit' && (
      <>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <DeleteSlideButton token={token} presentationId={presId} slideNumber={slideId} drawerOpen={open} />
        </List>
        <Divider />
        <List>
          <AddTextButton token={token} presentationId={presId} slideNumber={slideId - 1} drawerOpen={open} refreshSlide={setSlide} />
          <EditFontButton token={token} presentationId={presId} slideNumber={slideId - 1} drawerOpen={open} refreshSlide={setSlide} elementId={elementId}/>
          <AddImageButton token={token} presentationId={presId} slideNumber={slideId - 1} drawerOpen={open} refreshSlide={setSlide}/>
          <AddVideoButton token={token} presentationId={presId} slideNumber={slideId - 1} drawerOpen={open} refreshSlide={setSlide}/>
          <AddCodeButton token={token} presentationId={presId} slideNumber={slideId - 1} drawerOpen={open} refreshSlide={setSlide}/>
          <EditThemeButton token={token} presentationId={presId} slideNumber={slideId} drawerOpen={open} refreshSlide={setSlide}/>
          <AddSlideButton token={token} presentationId={presId} drawerOpen={open} updatePresentation={setPresentation} />
        </List>
      </Drawer>
      </>)}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <DrawerHeader />
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="lg" sx={{ height: '700px' }}>
              <EachSlide token={token} mode={Mode} pres={presentation} presentationId={presId} slideId={slideId} slide={slide} setSlide={setSlide} getElementId={setElementId} />
            </Container>
        </React.Fragment>
        <Outlet />
      </Box>
    </Box>
  </>
  );
}

export default PresentationPage;
