import React from 'react';
import axios from 'axios';

import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { Dialog, DialogTitle, List } from '@mui/material';
import Box from '@mui/material/Box';

function EditFontButton ({ token, presentationId, slideNumber, drawerOpen, refreshSlide, elementId }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = (e) => {
    stopParentClick(e);
    if (elementId) {
      setOpen(true);
    } else {
      alert('Select an element !');
    }
  }
  const handleClose = () => setOpen(false)

  const stopParentClick = (e) => {
    e.stopPropagation();
  };

  // backend call to add presentation to user's data store
  const handleFontChange = async (fontFamily) => {
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
      const element = slide.elements[elementId]; // get element
      element.fontFamily = fontFamily //  change text font family
      // update the user's store now with the new text element
      await axios.put('https://coral-app-gctd3.ondigitalocean.app/store', payload, {
        headers: {
          Authorization: token,
        }
      });
      handleClose(); // close dialog
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
            <TextFieldsIcon />
          </ListItemIcon>
          <ListItemText primary={'Font family'} sx={{ opacity: drawerOpen ? 1 : 0 }} />
        </ListItemButton>
      </ListItem>
      <Dialog open={open} onClose={handleClose} sx={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
        <Box onClick={(e) => stopParentClick(e)}>
          <DialogTitle>Choose Font</DialogTitle>
          <List>
            <ListItem button onClick={() => handleFontChange('Arial')}>
              <ListItemText primary="Arial" />
            </ListItem>
            <ListItem button onClick={() => handleFontChange('Times New Roman')}>
              <ListItemText primary="Times New Roman" />
            </ListItem>
            <ListItem button onClick={() => handleFontChange('Verdana')}>
              <ListItemText primary="Verdana" />
            </ListItem>
          </List>
        </Box>
      </Dialog>
    </>
  )
}

export default EditFontButton;
