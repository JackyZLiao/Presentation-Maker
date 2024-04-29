import axios from 'axios'

export const defaultBackground = {
  type: 'solid',
  solidColor: '#ffffff',
  gradientStartColor: '#ffffff',
  gradientEndColor: '#000000',
  gradientDirection: 'to bottom',
}

export const saveSlidesElements = async (token, slideData, presId, slideNum) => {
  if (!slideData) {
    return
  }

  try {
    const response = await axios.get('https://coral-app-gctd3.ondigitalocean.app/store', {
      headers: {
        Authorization: token,
      }
    });

    const payload = response.data;
    const foundPresentation = payload.store.presentations[presId];
    const elements = foundPresentation.slides[slideNum].elements;

    slideData.current.childNodes.forEach(child => {
      const id = child.getAttribute('id');
      const width = parseFloat(child.style.width.replace('%', ''));
      const height = parseFloat(child.style.height.replace('%', ''));
      const position = child.style.transform;
      const match = position.match(/translate\(([\d.]+)px, ([\d.]+)px\)/);
      let left = 0;
      let top = 0;

      if (match && match.length === 3) {
        left = parseFloat(match[1]);
        top = parseFloat(match[2]);
      }

      if (id in elements) {
        elements[id].width = width;
        elements[id].height = height;
        elements[id].position_x = left;
        elements[id].position_y = top;
      }
    })

    // update the user's store now without deleted element
    await axios.put('https://coral-app-gctd3.ondigitalocean.app/store', payload, {
      headers: {
        Authorization: token,
      }
    });
  } catch (err) {
    alert(err);
  }
}

export const saveElementStyle = async (token, elementData, presId, slideNum, navigate) => {
  if (!elementData) {
    return;
  }

  try {
    const response = await axios.get('https://coral-app-gctd3.ondigitalocean.app/store', {
      headers: {
        Authorization: token,
      },
    });

    const payload = response.data;
    const pres = payload.store.presentations[presId];
    const elements = pres.slides[slideNum].elements;

    const id = elementData.id;
    const width = parseFloat(elementData.style.width.replace('%', ''));
    const height = parseFloat(elementData.style.height.replace('%', ''));
    const position = elementData.style.transform;
    const match = position.match(/translate\(([\d.]+)px, ([\d.]+)px\)/);
    let left = 0;
    let top = 0;

    if (match && match.length === 3) {
      left = parseFloat(match[1]);
      top = parseFloat(match[2]);
    }

    elements[id].width = width;
    elements[id].height = height;
    elements[id].position_x = left;
    elements[id].position_y = top;

    await axios.put('https://coral-app-gctd3.ondigitalocean.app/store', payload, {
      headers: {
        Authorization: token,
      },
    });

    navigate(`/presentation/${presId}/${slideNum + 1}/edit`, { state: { pres } });
  } catch (err) {
    alert(err);
  }
};
