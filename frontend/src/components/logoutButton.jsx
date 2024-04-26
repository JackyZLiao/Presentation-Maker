import React from 'react';
import axios from 'axios';

import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';

function Logout ({ token, setToken }) {
  // backend call to login the user
  const logout = async () => {
    try {
      await axios.post('http://localhost:5005/admin/auth/logout', {}, {
        headers: {
          Authorization: token,
        }
      })
      setToken('null');
    } catch (err) {
      alert(err.response.data.error);
    }
  }

  return (
    <Button variant="contained" disableElevation onClick={logout}> <LogoutIcon/> &nbsp; Logout  </Button>
  )
}

export default Logout;
