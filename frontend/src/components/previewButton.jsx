import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import VisibilityIcon from '@mui/icons-material/Visibility';
import Button from '@mui/material/Button';
import { grey } from '@mui/material/colors';

export default function PreviewButton ({ mode, pres, presentationId, slideId, setMode }) {
  const navigate = useNavigate();

  const handlePreview = () => {
    if (mode === 'edit') {
      setMode('preview');
      navigate(`/presentation/${presentationId}/${slideId}/preview`, { state: { pres } });
    } else {
      setMode('edit');
      navigate(`/presentation/${presentationId}/${slideId}/edit`, { state: { pres } });
    }
  };

  return (
    <React.Fragment>
      <Button
      variant="contained"
      disableElevation
      onClick={handlePreview}
      >
      <VisibilityIcon sx={{ color: mode === 'preview' ? '#00e676' : grey[400] }} />
      </Button>
    </React.Fragment>
  );
}
