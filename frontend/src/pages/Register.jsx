import React from 'react';
import axios from 'axios';
import { useNavigate, Navigate, Link } from 'react-router-dom';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SlideshowIcon from '@mui/icons-material/Slideshow';

function Register ({ token, setTokenFunction }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const navigate = useNavigate();

  // if a valid token is in local storage already, navigate to dashboard
  if (token !== null && token !== 'null') {
    return <Navigate to="/dashboard" />
  }

  // backend call to register user
  const register = async () => {
    try {
      const response = await axios.post('https://coral-app-gctd3.ondigitalocean.app/admin/auth/register', {
        email,
        password,
        name
      })
      setTokenFunction(response.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response.data.error);
    }
  }

  return (
    <>
      <Box
        width={1}
        height="90vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Stack spacing={2} justifyContent="center" alignItems="center" >
          <Typography variant="h3" gutterBottom>
            <SlideshowIcon sx={{ fontSize: 35 }} /> Presto
          </Typography>

          <TextField
              required
              id="register-email"
              label="Email"
              onChange={e => setEmail(e.target.value)} value={email}
              sx={{ m: 1, width: { xs: '30ch', sm: '50ch' } }}
          />
          <TextField
              required
              id="register-name"
              label="Name"
              onChange={e => setName(e.target.value)} value={name}
              sx={{ m: 1, width: { xs: '30ch', sm: '40ch' } }}
          />
          <TextField
              id="register-password"
              label="Password"
              type="password"
              autoComplete="current-password"
              onChange={e => setPassword(e.target.value)} value={password}
              sx={{ m: 1, width: { xs: '30ch', sm: '40ch' } }}
          />

          <Stack direction="row" spacing={2}>
            <Button variant="contained" sx={{ m: 1, width: '20ch' }} onClick={register}>Register</Button>
            <Link to="/login">
              <Button>Or Login</Button>
            </Link>
          </Stack>
        </Stack>
      </Box>
    </>
  )
}

export default Register;
