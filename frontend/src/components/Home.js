import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css'; // Ensure the CSS file is imported
import logo from '../assets/ctrl logo.webp'; // Update the path accordingly
import '@fortawesome/fontawesome-free/css/all.min.css';
import SideBar from './SideBar';
import './SideBar.css';
import { API_URL } from '../apiconfig';

// Function to fetch data from the API
function fetchData() {
  fetch(`${API_URL}/data`)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error fetching data:', error));
}

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/logout');
  };

  // Call fetchData when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="home-container">
      <SideBar />
      <header className="home-header">
        <img src={logo} alt="Logo" className="logo" />
        <button className="logout-button-one" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </header>
      <div className="card-container">
        <div className="card slide-in-left">
          <h2>Domain</h2>
          <Link to="/domain">
            <button className='viewdomain'>
              view domains
              <i className="fas fa-arrow-right icon"></i>
            </button>
          </Link>
        </div>
        <div className="card slide-in-right">
          <h2>Servers</h2>
          <Link to="/servers">
            <button className='viewservers'>
              view servers
              <i className="fas fa-arrow-right icon"></i>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
