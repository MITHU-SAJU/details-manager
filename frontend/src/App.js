import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Domain from './components/Domain';
import Servers from './components/Servers';
import Home from './components/Home';
import Auth from './components/Auth';
import Logout from './components/Logout';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/home" element={<Home />} />
        <Route path="/domain" element={<Domain />} />
        <Route path="/servers" element={<Servers />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
};

export default App;
