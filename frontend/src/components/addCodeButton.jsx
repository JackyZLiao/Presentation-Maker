import React from 'react';
import axios from 'axios';

import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import CodeIcon from '@mui/icons-material/Code';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '43ch', sm: '65ch' },
  height: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 5,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
};

function AddCodeButton ({ token, presentationId, slideNumber, drawerOpen, refreshSlide }) {
  const [open, setOpen] = React.useState(false);
  const [content, setContent] = React.useState('');
  const [width, setWidth] = React.useState(20);
  const [height, setHeight] = React.useState(10);
  const [textSize, setTextSize] = React.useState(1);
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  // create id number for code element
  const createId = () => {
    const randomNumber = Math.floor(Math.random() * 1000000000);
    return randomNumber;
  }

  // backend call to add code element to user's data store
  const addCode = async () => {
    // error checking for content
    if (!content) {
      alert('Please fill out all required fields');
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

      // Creating new text element to store in backend
      const newCodeElement = {
        type: 'code',
        content,
        width,
        height,
        textSize,
        position_x: 0,
        position_y: 0,
        layer
      }

      slide.elements[createId()] = newCodeElement; // Putting new element back into payload

      // update the user's store now with the new text element
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
      <ListItem key='Add Code' disablePadding sx={{ display: 'block' }} onClick={handleOpen}>
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
            <CodeIcon/>
          </ListItemIcon>
          <ListItemText primary={'Add Code'} sx={{ opacity: drawerOpen ? 1 : 0 }} />
        </ListItemButton>
      </ListItem>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}>
          <Typography variant="h5" component="h2"> Add Code to Slide </Typography>
          <TextField
            id="code-content"
            label="Code"
            multiline
            minRows={3}
            maxRows={10}
            sx={{ mt: 2, width: { xs: '40ch', sm: '57ch' } }}
            onChange={e => setContent(e.target.value)} value={content}
          />

          <Box sx={{ display: 'flex', gap: 4 }}>
            <TextField
              id="width"
              label="Width (%)"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ mt: 2, width: { xs: '11ch', sm: '16ch' } }}
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
              sx={{ mt: 2, width: { xs: '11ch', sm: '17ch' } }}
              onChange={e => setHeight(e.target.value)} value={height}
              variant="standard"
            />

            <TextField
              id="text-size"
              label="Text size (em)"
              variant="standard"
              type="number"
              inputProps={{ step: 0.1 }}
              sx={{ mt: 2, width: { xs: '11ch', sm: '17ch' } }}
              onChange={e => setTextSize(e.target.value)} value={textSize}
            />
          </Box>

          <Button variant="contained" onClick={addCode} sx={{ mt: 3, width: { xs: '40ch', sm: '50ch' } }}> Add Code </Button>
        </Box>
      </Modal>
    </>
  )
}

export default AddCodeButton;
