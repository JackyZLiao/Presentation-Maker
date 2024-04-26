import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import Logout from '../components/logoutButton';
import NewPresentationButton from '../components/newPresentationButton';
import PresentationCard from '../components/presentationCard';
import '../index.css';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import Grid from '@mui/material/Grid';

function Dashboard ({ token, setTokenFunction }) {
  const [store, setStore] = React.useState({});
  const navigate = useNavigate();

  React.useEffect(() => {
    axios.get('http://localhost:5005/store', {
      headers: {
        Authorization: token,
      }
    }).then((response) => {
      setStore(response.data.store);
    });
  }, []);

  if (token === 'null' || token === null) {
    return <Navigate to="/login" />
  }

  return (
    <>
      <Box width="100vw" sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
            >
              <SlideshowIcon />
            </IconButton>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
              PRESTO
            </Typography>
            <NewPresentationButton token={token} refreshStore={setStore} />
            <Logout token={token} setToken={setTokenFunction} />
          </Toolbar>
        </AppBar>
      </Box>

      <Box sx={{ flexGrow: 1, m: 3 }}>
        <Grid container spacing={5} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          {store && store.presentations && Object.keys(store.presentations).map((presentationId) => {
            const pres = store.presentations[presentationId];
            return (
              <PresentationCard
                key={presentationId}
                cardId={presentationId}
                cardTitle={pres.title}
                cardDescription={pres.description}
                cardNumSlides={Object.keys(pres.slides).length}
                onClick={() => {
                  navigate(`/presentation/${presentationId}/${1}/${'edit'}`, { state: { pres } })
                }}
                cardThumbnail={pres.thumbnail}
              />
            )
          })}
        </Grid>
      </Box>
    </>
  )
}

export default Dashboard;
