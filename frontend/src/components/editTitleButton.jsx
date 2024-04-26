import React from 'react';
import axios from 'axios';

import Button from '@mui/material/Button';
import ModeIcon from '@mui/icons-material/Mode';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '45ch', sm: '60ch' },
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

function editTitleButton ({ token, id, handleTitleOnPage }) {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const changeTitle = async () => {
    // error checking for title
    if (!title) {
      alert('Please give a title to your presentation')
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

      // find the specified presentation in database
      const foundPresentation = payload.store.presentations[id];
      foundPresentation.title = title; // change title

      // update the user's store  with the new changes
      await axios.put('http://localhost:5005/store', payload, {
        headers: {
          Authorization: token,
        }
      });
      handleClose();
    } catch (err) {
      alert(err);
    }
  }

  return (
    <>
      <Button variant="contained" disableElevation onClick={handleOpen}> <ModeIcon/> &nbsp; Edit Title </Button>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}>
          <Typography variant="h5" component="h2"> Change Title </Typography>
          <TextField
            id="standard-basic"
            label="Title"
            variant="standard"
            sx={{ mt: 1, width: { xs: '40ch', sm: '55ch' }, }}
            onChange={e => setTitle(e.target.value)} value={title}
          />
          <Button
            variant="contained"
            onClick={() => {
              changeTitle();
              if (title) {
                handleTitleOnPage(title);
              }
            } }
            sx={{ mt: 3, width: { xs: '45ch', sm: '60ch' }, }}>
            Update Title
          </Button>
        </Box>
      </Modal>
    </>
  )
}
export default editTitleButton;
