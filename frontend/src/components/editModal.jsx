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
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '42ch', sm: '65ch' },
  height: { xs: '400px', sm: '550px' },
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 5,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
};

const EditModal = ({ token, presId, slideNum, elementId, openModal, handleClose, data, refreshSlide }) => {
  const [content, setContent] = React.useState(data.content);
  const [textSize, setTextSize] = React.useState(data.textSize);
  const [textColour, setTextColour] = React.useState(data.textColour);
  const [Url, setUrl] = React.useState(data.imageUrl || data.videoUrl);
  const [description, setDescription] = React.useState(data.description);
  const [autoplay, setAutoplay] = React.useState(data.autoplay);
  const handleAutoplayOption = (event) => setAutoplay(event.target.checked)

  const handleEdit = async () => {
    // Fetch data from backend
    try {
      const response = await axios.get('http://localhost:5005/store', {
        headers: {
          Authorization: token,
        }
      });

      const payload = response.data;
      const foundPresentation = payload.store.presentations[presId]; // get particular presentation
      const slide = foundPresentation.slides[slideNum]; // get particular slide
      const element = slide.elements[elementId]; // get element

      // change data to reflect edits
      switch (data.type) {
        case 'text':
          element.content = content;
          element.textSize = textSize;
          element.textColour = textColour;
          break;
        case 'code':
          element.content = content;
          element.textSize = textSize;
          break;
        case 'video':
          element.videoUrl = Url;
          element.autoplay = autoplay;
          break;
        case 'image':
          element.imageUrl = Url;
          element.description = description;
          break;
        default:
          break;
      }

      // update the user's store now without deleted element
      await axios.put('http://localhost:5005/store', payload, {
        headers: {
          Authorization: token,
        }
      });
      refreshSlide(slide);
    } catch (err) {
      alert(err);
    }
    handleClose();
  }

  return (
    <Modal
      open={openModal}
      onClose={handleClose}
    >
      <Box sx={style}>
      <Typography variant="h5" component="h2"> Edit {data.type} element </Typography>

      {(data.type === 'text' || data.type === 'code') && (
        <TextField
          id="content"
          label="Content"
          variant="standard"
          multiline
          maxRows={10}
          sx={{ mt: 2, width: { xs: '35ch', sm: '50ch' } }}
          onChange={e => setContent(e.target.value)} value={content}
        />
      )}

      {(data.type === 'image' || data.type === 'video') && (
        <TextField
          id="URL"
          label="URL"
          variant="standard"
          sx={{ mt: 2, width: { xs: '35ch', sm: '50ch' } }}
          onChange={e => setUrl(e.target.value)} value={Url}
        />
      )}

      {data.type === 'image' && (
        <TextField
          id="description"
          label="Description"
          variant="standard"
          sx={{ mt: 2, width: { xs: '35ch', sm: '50ch' } }}
          onChange={e => setDescription(e.target.value)} value={description}
        />
      )}

      {(data.type === 'text' || data.type === 'code') && (
          <TextField
          id="text-size"
          label="Text size (em)"
          variant="standard"
          type="number"
          inputProps={{ step: 0.1 }}
          sx={{ mt: 2, width: { xs: '35ch', sm: '50ch' } }}
          onChange={e => setTextSize(e.target.value)} value={textSize}
        />
      )}

      {data.type === 'text' && (
        <FormControl variant="standard" sx={{ mt: 2, width: { xs: '35ch', sm: '50ch' } }}>
          <FormHelperText id="standard-weight-helper-text">Text Colour (HEX) </FormHelperText>
          <Input
          id="text-colour"
          startAdornment={<InputAdornment position="end">#</InputAdornment>}
          aria-describedby="standard-weight-helper-text"
          inputProps={{
            'aria-label': 'Hex Code',
          }}
          onChange={e => setTextColour(e.target.value)} value={textColour}
          />
        </FormControl>
      )}

      {data.type === 'video' && (
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={autoplay} onChange={handleAutoplayOption} />}
            label="Autoplay"
            sx={{ mt: 2 }}
          />
        </FormGroup>
      )}

      <Button variant="contained" onClick={handleEdit} sx={{ mt: 3, width: { xs: '40ch', sm: '50ch' } }}> Confirm Edit </Button>
      </Box>
      </Modal>
  )
}

export default EditModal;
