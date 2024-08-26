const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const User = require('./models/User'); // Ensure this path is correct

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Store this in an environment variable in production

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/domainsServersDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Connection error', error.message);
});

// Define Domain schema and model
const domainSchema = new mongoose.Schema({
  domainName: { type: String, required: true },
  clientName: { type: String, required: true },
  number: { type: String, required: true },
  registeredDate: { type: String, required: true },
  expiryDate: { type: String, required: true },
  reminders: { type: String, required: true },
  status: { type: String, required: true },
});
const Domain = mongoose.model('Domain', domainSchema);

// Define Server schema and model
const serverSchema = new mongoose.Schema({
  serverName: { type: String, required: true },
  clientName: { type: String, required: true },
  number: { type: String, required: true },
  registeredDate: { type: String, required: true },
  expiryDate: { type: String, required: true },
  reminders: { type: String, required: true },
  status: { type: String, required: true },
  serviceProvider: { type: String, required: true },
});
const Server = mongoose.model('Server', serverSchema);

// Authentication routes
app.post('/api/auth/register', async (req, res) => {
  const { email, password, username } = req.body;
  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, username });
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { email: user.email, username: user.username } });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'User already exists' });
    }
    res.status(400).json({ message: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

app.get('/api/auth/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// API Routes for Domains
app.get('/api/domains', async (req, res) => {
  try {
    const domains = await Domain.find();
    res.json(domains);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

app.post('/api/domains', async (req, res) => {
  const domain = new Domain(req.body);
  try {
    const newDomain = await domain.save();
    res.status(201).json(newDomain);
  } catch (error) {
    res.status(400).json({ message: 'Bad request: ' + error.message });
  }
});

app.put('/api/domains/:id', async (req, res) => {
  try {
    const updatedDomain = await Domain.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedDomain) {
      return res.status(404).json({ message: 'Domain not found' });
    }
    res.json(updatedDomain);
  } catch (error) {
    res.status(400).json({ message: 'Bad request: ' + error.message });
  }
});

app.delete('/api/domains/:id', async (req, res) => {
  try {
    const deletedDomain = await Domain.findByIdAndDelete(req.params.id);
    if (!deletedDomain) {
      return res.status(404).send('Domain not found');
    }
    res.status(200).send(deletedDomain);
  } catch (error) {
    res.status(500).send('Server error: ' + error.message);
  }
});

// API Routes for Servers
app.get('/api/servers', async (req, res) => {
  try {
    const servers = await Server.find();
    res.json(servers);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

app.post('/api/servers', async (req, res) => {
  const server = new Server(req.body);
  try {
    const newServer = await server.save();
    res.status(201).json(newServer);
  } catch (error) {
    res.status(400).json({ message: 'Bad request: ' + error.message });
  }
});

app.put('/api/servers/:id', async (req, res) => {
  try {
    const updatedServer = await Server.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedServer) {
      return res.status(404).json({ message: 'Server not found' });
    }
    res.json(updatedServer);
  } catch (error) {
    res.status(400).json({ message: 'Bad request: ' + error.message });
  }
});

app.delete('/api/servers/:id', async (req, res) => {
  try {
    const deletedServer = await Server.findByIdAndDelete(req.params.id);
    if (!deletedServer) {
      return res.status(404).send('Server not found');
    }
    res.status(200).send(deletedServer);
  } catch (error) {
    res.status(500).send('Server error: ' + error.message);
  }
});

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'build')));

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
