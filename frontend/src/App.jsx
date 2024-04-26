import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PresentationPage from './pages/Presentation';

function App () {
  let lsToken = 'null';
  if (localStorage.getItem('token')) {
    lsToken = localStorage.getItem('token');
  }

  const [token, setToken] = React.useState(lsToken)

  // Function to update token in both state and local storage
  function setTokenInLocalStorage (token) {
    setToken(token);
    localStorage.setItem('token', token);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login token={token} setTokenFunction={setTokenInLocalStorage}/>} />
        <Route path="/register" element={<Register token={token} setTokenFunction={setTokenInLocalStorage}/>} />
        <Route path="/dashboard" element={<Dashboard token={token} setTokenFunction={setTokenInLocalStorage} />} />
        <Route path="/presentation/:presId/:slideId/:mode" element={<PresentationPage token={token} />} />
      </Routes>
    </BrowserRouter>

  )
}

export default App;
