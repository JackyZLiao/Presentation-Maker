import * as React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Rnd } from 'react-rnd';
import EditModal from './editModal';
import { saveElementStyle } from '../helper/helper';

const TextElement = ({ token, mode, id, presId, slideNum, elementData, refreshSlide, getElementId }) => {
  const elementRef = React.useRef(null);
  const [showBoxes, setShowBoxes] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const navigate = useNavigate();
  // Handle editing on double click
  const handleDoubleClick = async (e) => {
    e.preventDefault();
    if (mode === 'preview') {
      return
    }
    setModalOpen(true);
  }

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Handles clicks outside of element
  React.useEffect(() => {
    // Function to handle click outside
    const handleClickOutside = (event) => {
      if (elementRef.current && !elementRef.current.contains(event.target)) {
        setShowBoxes(false);
      }
    };
    // Add event listener to document
    document.addEventListener('mousedown', handleClickOutside);
    // Cleanup: Remove event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [elementRef]);

  // handle click event to enable boxes
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (mode === 'preview') {
      return
    }
    getElementId(id);
    setShowBoxes(!showBoxes);
  }

  const handleDragElement = (token, elementData, presId, slideNum, navigate) => {
    saveElementStyle(token, elementData, presId, slideNum, navigate);
  }

  const handleResizeElement = (token, refToElement, presId, slideNum, navigate) => {
    const parentElement = refToElement.parentElement;
    const childStyle = window.getComputedStyle(refToElement);
    const parentStyle = window.getComputedStyle(parentElement);

    const childWidth = parseFloat(childStyle.width);
    const childHeight = parseFloat(childStyle.height);
    const childTransform = childStyle.transform.match(/matrix\(.*?,\s*(\d+),\s*(\d+)\)/);

    if (childTransform && childTransform.length === 3) {
      const parentWidth = parseFloat(parentStyle.width);
      const parentHeight = parseFloat(parentStyle.height);

      const width = (childWidth / parentWidth) * 100;
      const height = (childHeight / parentHeight) * 100;
      const left = parseFloat(childTransform[1]);
      const top = parseFloat(childTransform[2]);
      const transform = `translate(${left}px, ${top}px)`;

      const elementData = {
        id,
        style: {
          width: `${width}%`,
          height: `${height}%`,
          transform
        }
      };
      saveElementStyle(token, elementData, presId, slideNum, navigate);
    } else {
      alert('No match found or invalid format');
    }
  }

  // delete text element
  const deleteText = async (e) => {
    e.preventDefault();
    if (mode === 'preview') {
      return
    }
    // Fetch data from backend
    try {
      const response = await axios.get('https://coral-app-gctd3.ondigitalocean.app/store', {
        headers: {
          Authorization: token,
        }
      });

      const payload = response.data;
      const foundPresentation = payload.store.presentations[presId]; // get particular presentation
      const slide = foundPresentation.slides[slideNum]; // get particular slide
      delete slide.elements[id]; // delete element from store

      // update the user's store now without deleted element
      await axios.put('https://coral-app-gctd3.ondigitalocean.app/store', payload, {
        headers: {
          Authorization: token,
        }
      });
      refreshSlide(slide);
      const pres = foundPresentation;
      navigate(`/presentation/${presId}/${slideNum + 1}/edit`, { state: { pres } });
    } catch (err) {
      alert(err);
    }
  }

  return (
    <>
      <EditModal
        token={token}
        presId={presId}
        slideNum={slideNum}
        elementId={id}
        openModal={modalOpen}
        handleClose={handleCloseModal}
        data={elementData}
        refreshSlide={refreshSlide}
      >
      </EditModal>
      <Rnd
        id={id}
        default={{
          x: elementData.position_x,
          y: elementData.position_y,
          width: `${elementData.width}%`,
          height: `${elementData.height}%`
        }}
        style={{ position: 'absolute', zIndex: elementData.layer }}
        bounds="parent"
        disableDragging={(mode === 'preview')} // Disables drag functionality when isDisabled is true
        enableResizing={(mode === 'edit')} // Disables resizing when isDisabled is true
        onDragStop={(e, d) => handleDragElement(token, d.node, presId, slideNum, navigate)}
        onResizeStop={ (event, direction, refToElement, delta) => handleResizeElement(token, refToElement, presId, slideNum, navigate)}
      >
        <Box
          ref={elementRef}
          onContextMenu={deleteText}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          sx={{
            width: '100%',
            height: '100%',
            color: `#${elementData.textColour}`,
            fontSize: `${elementData.textSize}em`,
            fontFamily: `${elementData.fontFamily}`,
            border: mode === 'edit' ? '1px solid grey' : 'none',
            overflow: 'hidden',
          }}
        >
          {elementData.content}
          {showBoxes && (
            <div style={{ overflow: 'visible' }}>
              <div style={{ top: 0, left: 0, width: 5, height: 5, backgroundColor: 'black', position: 'absolute' }} />
              <div style={{ top: 0, right: 0, width: 5, height: 5, backgroundColor: 'black', position: 'absolute' }} />
              <div style={{ bottom: 0, left: 0, width: 5, height: 5, backgroundColor: 'black', position: 'absolute' }} />
              <div style={{ bottom: 0, right: 0, width: 5, height: 5, backgroundColor: 'black', position: 'absolute' }} />
            </div>
          )}
        </Box>
      </Rnd>
    </>
  )
}

export default TextElement;
