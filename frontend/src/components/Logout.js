import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any authentication tokens or user data here
    localStorage.removeItem('authToken'); // Example: Remove the auth token from local storage
    // Redirect to login page
    navigate('/');
  }, [navigate]);

  return <div>Logging out...</div>;
};

export default Logout;
