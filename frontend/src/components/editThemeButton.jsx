import React, { useState } from 'react';
import axios from 'axios';

import ListItem from '@mui/material/ListItem';
import PaletteIcon from '@mui/icons-material/Palette';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, RadioGroup, FormControlLabel, Radio, TextField } from '@mui/material';

function EditThemeButton ({ token, presentationId, slideNumber, drawerOpen, refreshSlide }) {
  const [open, setOpen] = useState(false);
  const [backgroundType, setBackgroundType] = useState('solid');
  const [solidColor, setSolidColor] = useState('#ffffff');
  const [gradientDirection, setGradientDirection] = useState('to bottom');
  const [gradientStartColor, setGradientStartColor] = useState('#ffffff');
  const [gradientEndColor, setGradientEndColor] = useState('#000000');
  const [theme, setTheme] = useState('single');
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleSave = () => {
    const background = {
      type: backgroundType,
      solidColor: backgroundType === 'solid' ? solidColor : null,
      gradientStartColor: backgroundType === 'gradient' ? gradientStartColor : null,
      gradientEndColor: backgroundType === 'gradient' ? gradientEndColor : null,
      gradientDirection: backgroundType === 'gradient' ? gradientDirection : null,
    };
    editTheme(background);
    handleClose();
  };

  // backend call to add presentation to user's data store
  const editTheme = async (background) => {
    // Fetch current store of user from database
    try {
      const response = await axios.get('http://localhost:5005/store', {
        headers: {
          Authorization: token,
        }
      });
      const payload = response.data;

      const pres = payload.store.presentations[presentationId]; // get particular presentation
      const slide = pres.slides[slideNumber - 1]; // get particular slide

      //  for only one silde
      if (theme === 'single') {
        slide.background = background;
      } else {
        pres.bgTheme = background;
        pres.slides.forEach((slide) => {
          slide.background = background;
        })
      }

      // update the user's store now with the new text element
      await axios.put('http://localhost:5005/store', payload, {
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
            <PaletteIcon sx={{ color: 'orange' }} />
          </ListItemIcon>
          <ListItemText primary={'Edit theme'} sx={{ opacity: drawerOpen ? 1 : 0 }} />
        </ListItemButton>
      </ListItem>
      <Dialog open={open} onClose={handleClose} sx={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
        <DialogTitle sx={{ textAlign: 'center' }}>Edit theme</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset">
            <RadioGroup
              name="background-type"
              value={backgroundType}
              onChange={(event) => setBackgroundType(event.target.value)}
            >
              <FormControlLabel value="solid" control={<Radio />} label="solid" />
              <FormControlLabel value="gradient" control={<Radio />} label="gradiant" />
            </RadioGroup>
          </FormControl>
          <FormControl fullWidth sx={{ mt: 4 }}>
            <RadioGroup
              name="single all"
              value={theme}
              onChange={(event) => setTheme(event.target.value)}
              sx={{ flexDirection: 'row' }}
            >
              <FormControlLabel value="single" control={<Radio />} label="single" />
              <FormControlLabel value="all" control={<Radio />} label="all" />
            </RadioGroup>
          </FormControl>
          {backgroundType === 'solid' && (
            <TextField
              type="color"
              value={solidColor}
              onChange={(event) => setSolidColor(event.target.value)}
              fullWidth
              sx={{ mt: 4 }}
            />
          )}
          {backgroundType === 'gradient' && (
            <Box>
              <TextField
                type="color"
                value={gradientStartColor}
                onChange={(event) => setGradientStartColor(event.target.value)}
                fullWidth
                sx={{ mt: 4 }}
              />
              <TextField
                type="color"
                value={gradientEndColor}
                onChange={(event) => setGradientEndColor(event.target.value)}
                fullWidth
                sx={{ mt: 4 }}
              />
              <FormControl fullWidth sx={{ mt: 4 }}>
                <RadioGroup
                  value={gradientDirection}
                  onChange={(event) => setGradientDirection(event.target.value)}
                  sx={{ flexDirection: 'row' }}
                >
                  <FormControlLabel value="to bottom" control={<Radio />} label="to bottom" />
                  <FormControlLabel value="to right" control={<Radio />} label="to right" />
                </RadioGroup>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave} variant="contained">Save</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default EditThemeButton;
