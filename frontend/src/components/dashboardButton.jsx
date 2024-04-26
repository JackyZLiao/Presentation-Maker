import React from 'react';
import SvgIcon from '@mui/material/SvgIcon';
import Button from '@mui/material/Button';

function HomeIcon (props) {
  return (
    <SvgIcon {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}

const DashboardButton = ({ onClick }) => {
  return (
    <Button variant="contained" disableElevation onClick={onClick}>
    <HomeIcon onClick={ onClick } sx={{ fontSize: 40, cursor: 'pointer' }} /> &nbsp;</Button>
  );
};

export default DashboardButton;
