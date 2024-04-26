import React from 'react';
import axios from 'axios';
import { defaultBackground } from '../helper/helper';

import Box from '@mui/material/Box';
import { createSvgIcon } from '@mui/material/utils';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

const PlusIcon = createSvgIcon(
    // credit: plus icon from https://heroicons.com/
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>,
    'Plus',
);

function AddSlideButton ({ token, presentationId, drawerOpen, updatePresentation, }) {
  // backend call to add presentation to user's data store
  const addSlide = async () => {
    // Fetch current store of user from database
    try {
      const response = await axios.get('http://localhost:5005/store', {
        headers: {
          Authorization: token,
        }
      });
      const payload = response.data;
      const pres = payload.store.presentations[presentationId]; //  get particular presentation
      const foundSlides = pres.slides; //  get particular slides
      const background = Object.keys(pres.bgTheme).length === 0 ? defaultBackground : pres.bgTheme;

      foundSlides.push({
        elements: {},
        background,
      }); //    Add new slide in presentation
      // update the user's store now with the new text element
      await axios.put('http://localhost:5005/store', payload, {
        headers: {
          Authorization: token,
        }
      });
      updatePresentation(pres);
    } catch (err) {
      alert(err)
    }
  }

  return (
    <>
      <ListItem key='Add Text' disablePadding sx={{ display: 'block' }}>
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: drawerOpen ? 'initial' : 'center',
            px: 2.5,
          }}
          onClick={addSlide}
          >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: drawerOpen ? 3 : 'auto',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ color: 'green' }}>
              <PlusIcon />
            </Box>
          </ListItemIcon>
          <ListItemText primary={'Add new slide'} sx={{ opacity: drawerOpen ? 1 : 0, color: 'green' }} />
        </ListItemButton>
      </ListItem>
    </>
  )
}

export default AddSlideButton;
