import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Servers.css';
import logo from '../assets/ctrl logo.webp'; // Update the path accordingly
import '@fortawesome/fontawesome-free/css/all.min.css';
import SideBar from './SideBar';
import './SideBar.css';

const Servers = ({ onCardClick }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [form, setForm] = useState({
    serverName: '',
    clientName: '',
    number: '',
    registeredDate: '',
    expiryDate: '',
    reminders: '',
    status: '',
    serviceProvider: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/servers')
      .then(response => {
        setData(response.data);
        setFilteredData(response.data); // Initialize filteredData
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredData(data);
    } else {
      setFilteredData(
        data.filter(item =>
          item.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.number.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(form).every(field => field !== '')) {
      if (isEditMode) {
        axios.put(`http://localhost:5000/api/servers/${currentEditId}`, form)
          .then(response => {
            setData(prevData => prevData.map(item => item._id === currentEditId ? response.data : item));
            resetForm();
          })
          .catch(error => console.error('Error updating data:', error));
      } else {
        axios.post('http://localhost:5000/api/servers', form)
          .then(response => {
            setData(prevData => [...prevData, response.data]);
            resetForm();
          })
          .catch(error => console.error('Error saving data:', error));
      }
    }
  };

  const resetForm = () => {
    setForm({
      serverName: '',
      clientName: '',
      number: '',
      registeredDate: '',
      expiryDate: '',
      reminders: '',
      status: '',
      serviceProvider: ''
    });
    setFormVisible(false);
    setIsEditMode(false);
    setCurrentEditId(null);
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/servers/${id}`)
      .then(() => {
        setData(prevData => prevData.filter(item => item._id !== id));
      })
      .catch(error => console.error('Error deleting data:', error));
  };

  const handleEdit = (item) => {
    setForm(item);
    setCurrentEditId(item._id);
    setIsEditMode(true);
    setFormVisible(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className='dom'>
         <SideBar />
      <header className="server-header">
        <img src={logo} alt="Logo" className="logo-server" />
      </header>
   
      <button className="back-button-server" onClick={() => navigate('/home')}>
        <i className="fas fa-home"></i>
      </button>
      <button className="form-toggle-button-server" onClick={() => setFormVisible(!formVisible)}>
        <i className="fas fa-plus"></i> 
        {formVisible ? 'Close Form' : 'Add New Server'}
      </button>
       
      <div className="search-bar-container">
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Search by client name,number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />
          <button type="button" className="search-button">
            <i className="fas fa-search"></i> Search
          </button>
        </form>
      </div>

      {formVisible && (
        <div className="form-container-server">
          <div className="form-popup-server">
            <h3>{isEditMode ? 'Edit Server Details' : 'Add Server Details'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                {['serverName', 'clientName', 'number'].map(field => (
                  <label key={field}>
                    {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    <input
                      type="text"
                      name={field}
                      value={form[field]}
                      onChange={handleChange}
                      required
                    />
                  </label>
                ))}
                <label>
                  Registered Date
                  <input
                    type="date"
                    name="registeredDate"
                    value={form.registeredDate}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Expiry Date
                  <input
                    type="date"
                    name="expiryDate"
                    value={form.expiryDate}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Reminders
                  <select
                    name="reminders"
                    value={form.reminders}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Reminders</option>
                    {[...Array(50).keys()].map(day => (
                      <option key={day + 1} value={day + 1}>
                        {day + 1} day{day > 0 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Status
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </label>
                <label>
                  Service Provider
                  <select
                    name="serviceProvider"
                    value={form.serviceProvider}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select Service Provider</option>
                    <option value="GoDaddy">GoDaddy</option>
                    <option value="Squarebrothers">Squarebrothers</option>
                    <option value="HostGator">HostGator</option>
                    <option value="Bluehost">Bluehost</option>
                  </select>
                </label>
              </div>
              <div className="form-buttons-server">
                <button className="form-submit-button-server" type="submit">
                  {isEditMode ? 'Save Changes' : 'Add'}
                </button>
                <button className="form-cancel-button-server" type="button" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Server Name</th>
              <th>Client Name</th>
              <th>Number</th>
              <th>Registered Date</th>
              <th>Expiry Date</th>
              <th>Reminders</th>
              <th>Status</th>
              <th>Service Provider</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={item._id} onClick={() => onCardClick(item)}>
                <td>{index + 1}</td>
                <td>{item.serverName}</td>
                <td>{item.clientName}</td>
                <td>{item.number}</td>
                <td>{formatDate(item.registeredDate)}</td>
                <td>{formatDate(item.expiryDate)}</td>
                <td>{`${item.reminders} days`}</td>
                <td>{item.status}</td>
                <td>{item.serviceProvider}</td>
                <td>
                  <button
                    className="edit-button"
                    onClick={(e) => { e.stopPropagation(); handleEdit(item); }}
                  >
                    <i className="fas fa-edit"></i> Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }}
                  >
                    <i className="fas fa-trash-alt"></i> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Servers;