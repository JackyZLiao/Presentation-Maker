import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const Transition = React.forwardRef(function Transition (props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function DeleteSlideButton ({ token, presentationId, slideNumber, drawerOpen }) {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  slideNumber = parseInt(slideNumber);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // backend call to add presentation to user's data store
  const handleYes = async () => {
    // Fetch current store of user from database
    try {
      const response = await axios.get('http://localhost:5005/store', {
        headers: {
          Authorization: token,
        }
      });
      const payload = response.data;

      const pres = payload.store.presentations[presentationId]; // get particular presentation
      const slides = pres.slides; // get slides array
      let length = slides.length;

      if (length === 1) {
        alert('Cannot delete the presentation with only one slide !');
        handleClose();
        return
      } else {
        slides.splice(slideNumber - 1, 1);
        length = slides.length;
        // update the user's store now with the new text element
        await axios.put('http://localhost:5005/store', payload, {
          headers: {
            Authorization: token,
          }
        });
        handleClose();
        slideNumber = slideNumber <= length ? slideNumber : slideNumber - 1;
        navigate(`/presentation/${presentationId}/${slideNumber}/edit`, { state: { pres } });
      }
    } catch (err) {
      alert(err);
    }
  }

  return (
    <React.Fragment>
      <ListItem disablePadding sx={{ display: 'block' }} onClick={handleOpen} >
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
            <Box sx={{ color: 'purple' }}>
              <CloseIcon />
            </Box>
          </ListItemIcon>
          <ListItemText primary={'Delete slide'} sx={{ opacity: drawerOpen ? 1 : 0, color: 'purple' }} />
        </ListItemButton>
      </ListItem>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        sx={{ height: '100vh', width: '100vw', overflow: 'hidden' }}
      >
        <DialogTitle>{'Delete this slide'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
              Are you sure?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleYes}>Yes</Button>
          <Button onClick={handleClose}>No</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}

export default DeleteSlideButton;
