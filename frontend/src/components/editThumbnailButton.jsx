import React from 'react';
import axios from 'axios';

import Button from '@mui/material/Button';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
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
  justifyContent: 'center',
};

function editThumbnailButton ({ token, id }) {
  const [open, setOpen] = React.useState(false);
  const [url, setUrl] = React.useState(null);
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const changeThumbnail = async () => {
    // error checking for url
    if (!url) {
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
      const payload = response.data

      // find the specified presentation in database
      const foundPresentation = payload.store.presentations[id]
      foundPresentation.thumbnail = url // change thumbnail url

      // update the user's store  with the new changes
      await axios.put('https://coral-app-gctd3.ondigitalocean.app/store', payload, {
        headers: {
          Authorization: token,
        }
      });
      handleClose()
    } catch (err) {
      alert(err)
    }
  }

  return (
    <>
      <Button variant="contained" disableElevation onClick={handleOpen}> <InsertPhotoIcon/> &nbsp; Edit Thumbnail </Button>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}>
          <Typography variant="h5" component="h2"> Please enter an image URL </Typography>
          <TextField
            id="standard-basic"
            label="Image URL"
            variant="standard"
            sx={{ mt: 1, width: { xs: '40ch', sm: '55ch' } }}
            onChange={e => setUrl(e.target.value)} value={url}
          />
          <Button variant="contained" onClick={changeThumbnail} sx={{ mt: 3, width: { xs: '45ch', sm: '60ch' } }}> Update Thumbnail </Button>
        </Box>
      </Modal>
    </>
  )
}

export default editThumbnailButton;
