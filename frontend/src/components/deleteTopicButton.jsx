import * as React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { pink } from '@mui/material/colors';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition (props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DeleteTopicButton ({ token, id }) {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleYes = async () => {
    try {
      const response = await axios.get('https://coral-app-gctd3.ondigitalocean.app/store', {
        headers: {
          Authorization: token,
        }
      });
      const data = response.data;
      delete data.store.presentations[id];
      // update the user's store now with the new presentation
      await axios.put('https://coral-app-gctd3.ondigitalocean.app/store', data, {
        headers: {
          Authorization: token,
        }
      });
      setOpen(false);
      navigate('/dashboard');
    } catch (err) {
      alert(err)
    }
  }

  return (
    <React.Fragment>
      <Button
      variant="contained"
      disableElevation
      onClick={handleClickOpen}
      sx={{ color: 'red' }}
      >
      <DeleteIcon sx={{ color: pink[500] }}/>
      &nbsp; Delete topic
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        sx={{ height: '100vh', width: '100vw', overflow: 'hidden' }}
      >
        <DialogTitle>{'Delete presentation'}</DialogTitle>
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
  );
}
