import React from 'react';
import axios from 'axios';

import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import FormHelperText from '@mui/material/FormHelperText';
import FontDownloadIcon from '@mui/icons-material/FontDownload';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '45ch', sm: '65ch' },
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

function AddTextButton ({ token, presentationId, slideNumber, drawerOpen, refreshSlide }) {
  const [open, setOpen] = React.useState(false);
  const [content, setContent] = React.useState('');
  const [width, setWidth] = React.useState(20);
  const [height, setHeight] = React.useState(10);
  const [textSize, setTextSize] = React.useState(1);
  const [textColour, setTextColour] = React.useState('000000');
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  // create id number for presentation
  const createId = () => {
    const randomNumber = Math.floor(Math.random() * 1000000000);
    return randomNumber;
  }

  // backend call to add presentation to user's data store
  const addText = async () => {
    // error checking for title
    if (!content) {
      alert('Please give a title to your presentation');
      return
    }

    // Fetch current store of user from database
    try {
      const response = await axios.get('http://localhost:5005/store', {
        headers: {
          Authorization: token,
        }
      });
      const payload = response.data

      const foundPresentation = payload.store.presentations[presentationId]; // get particular presentation
      const slide = foundPresentation.slides[slideNumber]; // get particular slide
      const layer = Object.keys(slide.elements).length; // get number of elements on slide in order to determine layer number

      // Creating new text element to store in backend
      const newTextElement = {
        type: 'text',
        content,
        width,
        height,
        textSize,
        textColour,
        fontFamily: 'Arial',
        position_x: 0,
        position_y: 0,
        layer
      }

      slide.elements[createId()] = newTextElement; // Putting new element back into payload

      // update the user's store now with the new text element
      await axios.put('http://localhost:5005/store', payload, {
        headers: {
          Authorization: token,
        }
      });
      handleClose();
      refreshSlide(slide); // refresh slide on presentation screen so new element can load in
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
            <FontDownloadIcon/>
          </ListItemIcon>
          <ListItemText primary={'Add Text'} sx={{ opacity: drawerOpen ? 1 : 0 }} />
        </ListItemButton>
      </ListItem>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}>
          <Typography variant="h5" component="h2"> Add Text to Slide </Typography>
          <TextField
            id="text-content"
            label="Content"
            variant="standard"
            sx={{ mt: 2, width: { xs: '40ch', sm: '55ch' }, }}
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
              sx={{ mt: 2, width: { xs: '18ch', sm: '25ch' }, }}
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
              sx={{ mt: 2, width: { xs: '18ch', sm: '26ch' }, }}
              onChange={e => setHeight(e.target.value)} value={height}
              variant="standard"
            />
          </Box>

          <TextField
            id="text-size"
            label="Text size (em)"
            variant="standard"
            type="number"
            inputProps={{ step: 0.1 }}
            sx={{ mt: 2, width: { xs: '40ch', sm: '55ch' }, }}
            onChange={e => setTextSize(e.target.value)} value={textSize}
          />

          <FormControl variant="standard" sx={{ mt: 2, width: { xs: '40ch', sm: '55ch' }, }}>
            <FormHelperText id="standard-weight-helper-text">Text Colour (HEX) </FormHelperText>
            <Input
              id="standard-adornment-weight"
              startAdornment={<InputAdornment position="end">#</InputAdornment>}
              aria-describedby="standard-weight-helper-text"
              inputProps={{
                'aria-label': 'Hex Code',
              }}
              onChange={e => setTextColour(e.target.value)} value={textColour}
            />
          </FormControl>

          <Button variant="contained" onClick={addText} sx={{ mt: 3, width: { xs: '45ch', sm: '60ch' } }}> Add Text </Button>
        </Box>
      </Modal>
    </>
  )
}

export default AddTextButton;
