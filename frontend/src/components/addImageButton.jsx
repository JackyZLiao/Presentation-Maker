import React from 'react';
import axios from 'axios';

import Button from '@mui/material/Button';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '45ch', sm: '60ch' },
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

function AddImageButton ({ token, presentationId, slideNumber, drawerOpen, refreshSlide }) {
  const [open, setOpen] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState('');
  const [width, setWidth] = React.useState();
  const [height, setHeight] = React.useState();
  const [description, setDescription] = React.useState('');
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  // create id number for image
  const createId = () => {
    const randomNumber = Math.floor(Math.random() * 1000000000);
    return randomNumber;
  }

  // backend call to retrieve presentation
  const addImage = async () => {
    // error checking for title
    if (!imageUrl || !description) {
      alert('Please fill out all necessary fields');
      return
    }

    // Fetch current store of user from database
    try {
      const response = await axios.get('http://localhost:5005/store', {
        headers: {
          Authorization: token,
        }
      });
      const payload = response.data;

      const foundPresentation = payload.store.presentations[presentationId];
      const slide = foundPresentation.slides[slideNumber];
      const layer = Object.keys(slide.elements).length;

      // Creating new image element to store in backend
      const newImageElement = {
        type: 'image',
        width,
        height,
        imageUrl,
        description,
        position_x: 0,
        position_y: 0,
        layer
      }

      slide.elements[createId()] = newImageElement; // Putting new element back into payload

      // update the user's store now with the new image element
      await axios.put('http://localhost:5005/store', payload, {
        headers: {
          Authorization: token,
        }
      });
      handleClose();
      refreshSlide(slide); // refresh so that it pops up as soon as you add it in
    } catch (err) {
      alert(err);
    }
  }

  return (
  <>
    <ListItem key='Add Text' disablePadding sx={{ display: 'block' }} onClick={handleOpen}>
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
          <AddPhotoAlternateIcon/>
        </ListItemIcon>
        <ListItemText primary={'Add Image'} sx={{ opacity: drawerOpen ? 1 : 0 }} />
      </ListItemButton>
    </ListItem>
    <Modal
      open={open}
      onClose={handleClose}
    >
      <Box sx={style}>
        <Typography variant="h5" component="h2"> Add Image to Slide </Typography>
        <TextField
          id="image-url"
          label="URL"
          variant="standard"
          sx={{ mt: 2, width: { xs: '40ch', sm: '50ch' }, }}
          onChange={e => setImageUrl(e.target.value)} value={imageUrl}
        />
        <TextField
          id="image-description"
          label="Description"
          variant="standard"
          sx={{ mt: 2, width: { xs: '40ch', sm: '50ch' }, }}
          onChange={e => setDescription(e.target.value)} value={description}
        />

        <Box sx={{ display: 'flex', gap: 4 }}>
          <TextField
            id="width"
            label="Width (%)"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ mt: 2, width: { xs: '18ch', sm: '23ch' } }}
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
            sx={{ mt: 2, width: { xs: '18ch', sm: '23ch' } }}
            onChange={e => setHeight(e.target.value)} value={height}
            variant="standard"
          />
        </Box>
        <Button variant="contained" onClick={addImage} sx={{ mt: 3, width: { xs: '45ch', sm: '55ch' } }}> Add Image </Button>
      </Box>
    </Modal>
  </>
  )
}

export default AddImageButton;
