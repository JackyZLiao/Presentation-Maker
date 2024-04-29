import React from 'react';
import axios from 'axios';

import Button from '@mui/material/Button';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '42ch', sm: '60ch' },
  height: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 5,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
};

function AddVideoButton ({ token, presentationId, slideNumber, drawerOpen, refreshSlide }) {
  const [open, setOpen] = React.useState(false);
  const [videoUrl, setVideoUrl] = React.useState('');
  const [width, setWidth] = React.useState();
  const [height, setHeight] = React.useState();
  const [autoplay, setAutoplay] = React.useState(true);
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleAutoplayOption = (event) => setAutoplay(event.target.checked)

  // create id number for video
  const createId = () => {
    const randomNumber = Math.floor(Math.random() * 1000000000);
    return randomNumber;
  }

  // backend call to retrieve presentation
  const addVideo = async () => {
    // error checking for title
    if (!videoUrl) {
      alert('Please fill out all necessary fields');
      return
    }

    // Fetch current store of user from database
    try {
      const response = await axios.get('https://coral-app-gctd3.ondigitalocean.app/store', {
        headers: {
          Authorization: token,
        }
      });
      const payload = response.data;

      const foundPresentation = payload.store.presentations[presentationId]; // get particular presentation
      const slide = foundPresentation.slides[slideNumber]; // get particular slide
      const layer = Object.keys(slide.elements).length; // get number of elements on slide in order to determine layer number

      // Creating new image element to store in backend
      const newVideoElement = {
        type: 'video',
        width,
        height,
        videoUrl,
        autoplay,
        position_x: 0,
        position_y: 0,
        layer
      }

      slide.elements[createId()] = newVideoElement; // Putting new element back into payload

      // update the user's store now with the new image element
      await axios.put('https://coral-app-gctd3.ondigitalocean.app/store', payload, {
        headers: {
          Authorization: token,
        }
      });
      handleClose();
      refreshSlide(slide);
    } catch (err) {
      alert(err);
    }
  }

  return (
  <>
    <ListItem key='Add Video' disablePadding sx={{ display: 'block' }} onClick={handleOpen}>
      <ListItemButton
        sx={{
          minHeight: 48,
          justifyContent: drawerOpen ? 'initial' : 'center',
          px: 2.5,
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: drawerOpen ? 3 : 'auto',
            justifyContent: 'center',
          }}
        >
          <VideoCameraBackIcon/>
        </ListItemIcon>
        <ListItemText primary={'Add Video'} sx={{ opacity: drawerOpen ? 1 : 0 }} />
      </ListItemButton>
    </ListItem>
    <Modal
      open={open}
      onClose={handleClose}
    >
      <Box sx={style}>
        <Typography variant="h5" component="h2"> Add Video to Slide </Typography>
        <TextField
          id="video-url"
          label="URL"
          variant="standard"
          sx={{ mt: 2, width: { xs: '38ch', sm: '50ch' } }}
          onChange={e => setVideoUrl(e.target.value)} value={videoUrl}
        />

        <Box sx={{ display: 'flex', gap: 4 }}>
          <TextField
            id="width"
            label="Width (%)"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ mt: 2, width: { xs: '17ch', sm: '23ch' } }}
            onChange={e => setWidth(e.target.value)} value={width}
            variant="standard"
          />

          <TextField
            id="height"
            label="Height (%)"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ mt: 2, width: { xs: '17ch', sm: '23ch' } }}
            onChange={e => setHeight(e.target.value)} value={height}
            variant="standard"
          />
        </Box>

        <FormGroup>
            <FormControlLabel
              control={<Checkbox checked={autoplay} onChange={handleAutoplayOption} />}
              label="Autoplay"
              sx={{ mt: 2 }}
            />
        </FormGroup>
        <Button variant="contained" onClick={addVideo} sx={{ mt: 3, width: { xs: '40ch', sm: '57ch' } }}> Add Video </Button>
      </Box>
    </Modal>
  </>
  )
}

export default AddVideoButton;
