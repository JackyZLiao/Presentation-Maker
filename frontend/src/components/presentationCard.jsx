import React from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import greySquare from '../media/grey-square.png'

function presentationCard ({ cardId, cardTitle, cardDescription, cardNumSlides, onClick, cardThumbnail }) {
  const [selectedImage, setSelectedImage] = React.useState('');

  React.useEffect(() => {
    if (cardThumbnail === undefined || cardThumbnail === null) {
      setSelectedImage(greySquare);
    } else {
      setSelectedImage(cardThumbnail);
    }
  }, [cardThumbnail]);

  return (
    <>
      <Grid item xs={12} sm={6} md={4} lg={3} id={cardId} onClick={onClick}>
        <CardActionArea>
          <Card sx={{ maxWidth: 600, height: 300 }}>
            <CardMedia
                sx={{ height: 150 }}
                image={selectedImage}
                title="presentation thumbnail"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div"> {cardTitle} </Typography>
              <Typography variant="body1" color="text.secondary"> {cardDescription} </Typography>
              <br ></br>
              <Typography variant="subtitle" color="text.secondary"> Number of slides: {cardNumSlides} </Typography>
            </CardContent>
          </Card>
        </CardActionArea>
      </Grid>
    </>
  )
}

export default presentationCard;
