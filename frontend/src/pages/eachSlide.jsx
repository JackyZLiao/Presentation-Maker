import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { saveSlidesElements } from '../helper/helper';
import '../index.css'

import Box from '@mui/material/Box';
import { Fade } from '@mui/material';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import TextElement from '../components/textElement';
import ImageElement from '../components/imageElement';
import VideoElement from '../components/videoElement';
import CodeElement from '../components/codeElement';

export default function EachSlide ({ token, mode, pres, presentationId, slideId, slide, setSlide, getElementId }) {
  const slidesArray = pres.slides;
  const length = slidesArray.length;
  slideId = parseInt(slideId);
  const navigate = useNavigate();
  const parentRef = React.useRef(null);
  const [prevSlideRef, setPrevSlideRef] = React.useState(null);
  const [showFade, setShowFade] = React.useState(true);
  React.useEffect(() => {
    setPrevSlideRef(parentRef);
  }, []);

  const slideTransition = (mode, slideNum, time = 500) => {
    setShowFade(false);
    setTimeout(() => {
      navigate(`/presentation/${presentationId}/${slideNum}/${mode}`, { state: { pres } });
      setShowFade(true);
    }, time);
  }

  const handlePrevSlide = () => {
    if (slideId !== 1) {
      // save data of current slide to backend when navigating to prev slide
      if (mode === 'edit') {
        setPrevSlideRef(parentRef);
        saveSlidesElements(token, prevSlideRef, presentationId, slideId - 1);
        slideTransition('edit', slideId - 1);
      } else {
        slideTransition('preview', slideId - 1);
      }
    }
  }

  const handleNextSlide = () => {
    if (slideId < length) {
      // save data of current slide to backend when navigating to next slide
      if (mode === 'edit') {
        setPrevSlideRef(parentRef);
        saveSlidesElements(token, prevSlideRef, presentationId, slideId - 1);
        slideTransition('edit', slideId + 1);
      } else {
        slideTransition('preview', slideId + 1);
      }
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      handlePrevSlide();
    } else if (event.key === 'ArrowRight') {
      handleNextSlide();
    }
  }

  //  Add an event listener to listen for keyboard key events when the component is loaded.
  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [slideId]);

  const buttonStyle = {
    height: '700px',
    width: '80px',
    display: 'flex',
    alignItems: 'center',
  }

  const pageNumberStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.3em',
    color: 'black',
  }

  return (
    <Grid sx={{ flexGrow: 1 }} container spacing={2} >
      <Grid container justifyContent={'center'} flexWrap="nowrap" spacing={1} >
        <Grid item sx={ buttonStyle }>
          {slideId !== 1 && (
            <Button onClick={handlePrevSlide}>
              <ArrowBackIcon />
            </Button>
          )
          }
        </Grid>
        <Fade in={showFade} timeout={1000}>
          <Paper item elevation={10} ref={parentRef} sx={{
            marginTop: 4,
            height: '700px',
            width: '1000px',
            position: 'relative',
            overflow: 'hidden',
            background: slide.background.type === 'solid' ? slide.background.solidColor : `linear-gradient(${slide.background.gradientDirection}, ${slide.background.gradientStartColor}, ${slide.background.gradientEndColor})`
          }}>
            {slide && Object.keys(slide.elements).map((id) => {
              const elementData = slide.elements[id]
              if (elementData.type === 'text') {
                return (
                  <TextElement key={id} token={token} mode={mode} id={id} presId={presentationId} slideNum={slideId - 1} elementData={elementData} refreshSlide={setSlide} getElementId={getElementId} />
                )
              } else if (elementData.type === 'image') {
                return (
                  <ImageElement key={id} token={token} mode={mode} id={id} presId={presentationId} slideNum={slideId - 1} elementData={elementData} refreshSlide={setSlide} />
                )
              } else if (elementData.type === 'video') {
                return (
                  <VideoElement key={id} token={token} mode={mode} id={id} presId={presentationId} slideNum={slideId - 1} elementData={elementData} refreshSlide={setSlide} />
                )
              } else if (elementData.type === 'code') {
                return (
                  <CodeElement key={id} token={token} mode={mode} id={id} presId={presentationId} slideNum={slideId - 1} elementData={elementData} refreshSlide={setSlide} />
                )
              }
              return (<></>)
            })}
            <Box sx={ pageNumberStyle }>
              {slideId}
            </Box>
          </Paper>
        </Fade>
        <Grid item sx={ buttonStyle }>
          {slideId < length && (
            <Button onClick={() => handleNextSlide()}>
              <ArrowForwardIcon />
            </Button>
          )
          }
        </Grid>
      </Grid>
    </Grid>
  );
}
