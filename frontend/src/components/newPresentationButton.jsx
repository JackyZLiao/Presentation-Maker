import React from 'react';
import axios from 'axios';
import { defaultBackground } from '../helper/helper';

import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '30ch', sm: '50ch' },
  height: 200,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 5,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
};

function NewPresentationButton ({ token, refreshStore }) {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  // create id number for presentation
  const createId = () => {
    const randomNumber = Math.floor(Math.random() * 1000000000);
    return randomNumber;
  }

  // backend call to add presentation to user's data store
  const createNewPresentation = async () => {
    // error checking for title
    if (!title) {
      alert('Please give a title to your presentation');
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
      const newPresentationId = createId().toString();
      // New presentation object
      const newPresentation = {
        title,
        description: null,
        thumbnail: null,
        bgTheme: {},
        slides: [{
          elements: {},
          background: defaultBackground
        }]
      };

      // Initialise store if it's undefined
      if (!payload.store) {
        payload.store = { presentations: {} };
      } else if (!payload.store.presentations) { // If presentations is undefined, initialize it
        payload.store.presentations = {};
      }

      // Add the new presentation to the presentations object
      payload.store.presentations[newPresentationId] = newPresentation;

      // update the user's store now with the new presentation
      await axios.put('https://coral-app-gctd3.ondigitalocean.app/store', payload, {
        headers: {
          Authorization: token,
        }
      });
      handleClose();
      refreshStore(response.data.store);
    } catch (err) {
      alert(err);
    }
  }

  return (
    <>
      <Button variant="contained" disableElevation onClick={handleOpen}> <AddCircleIcon/> &nbsp; New </Button>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}>
          <Typography variant="h5" component="h2"> New Presentation</Typography>
          <TextField
            id="standard-basic"
            label="Title"
            variant="standard"
            sx={{ mt: 1, width: { xs: '30ch', sm: '40ch' } }}
            onChange={e => setTitle(e.target.value)} value={title}
          />
          <Button variant="contained" onClick={createNewPresentation} sx={{ mt: 3, width: { xs: '30ch', sm: '50ch' } }}> Create </Button>
        </Box>
      </Modal>
    </>
  )
}

export default NewPresentationButton;
