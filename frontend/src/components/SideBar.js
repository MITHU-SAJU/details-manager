// src/components/Sidebar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faHome, faGlobe, faServer, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './SideBar.css'; // Ensure your CSS file is correctly named

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button className={`toggle-button-sidebar ${isOpen ? 'open' : ''}`} onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faBars} />
      </button>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="/home" onClick={toggleSidebar}>
                <FontAwesomeIcon icon={faHome} /> Home
              </Link>
            </li>
            <li>
              <Link to="/domain" onClick={toggleSidebar}>
                <FontAwesomeIcon icon={faGlobe} /> Domain
              </Link>
            </li>
            <li>
              <Link to="/servers" onClick={toggleSidebar}>
                <FontAwesomeIcon icon={faServer} /> Servers
              </Link>
            </li>
            <li>
              <Link to="/logout" onClick={toggleSidebar}>
                <FontAwesomeIcon icon={faSignOutAlt} /> Logout
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
