import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';  // Optional: If you have global styles

import App from './App';  // Make sure App.js exists in the src folder

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
