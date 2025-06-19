const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Mock database
let donations = [
  { id: 1, donor: 'Priya Sharma', amount: 25000, trees: 125, date: '2024-01-15', location: 'Shivapuri National Park' },
  { id: 2, donor: 'Rajesh Thapa', amount: 18500, trees: 92, date: '2024-01-14', location: 'Pashupatinath Area' },
  { id: 3, donor: 'Anita Gurung', amount: 15200, trees: 76, date: '2024-01-13', location: 'Godavari Botanical Garden' },
];

let plantingSites = [
  { id: 1, name: 'Shivapuri National Park', coordinates: [27.8167, 85.3833], trees: 2847, status: 'active' },
  { id: 2, name: 'Pashupatinath Area', coordinates: [27.7106, 85.3481], trees: 1263, status: 'active' },
  { id: 3, name: 'Godavari Botanical Garden', coordinates: [27.5833, 85.3833], trees: 2156, status: 'active' },
];

let stats = {
  totalTrees: 12847,
  totalDonors: 8492,
  totalAmount: 3245000,
  activeSites: 15
};

// Routes
app.get('/api/stats', (req, res) => {
  res.json(stats);
});

app.get('/api/donations', (req, res) => {
  res.json(donations);
});

app.post('/api/donations', (req, res) => {
  const { donor, amount, trees, location } = req.body;
  const newDonation = {
    id: donations.length + 1,
    donor,
    amount,
    trees,
    location,
    date: new Date().toISOString().split('T')[0]
  };
  
  donations.unshift(newDonation);
  
  // Update stats
  stats.totalTrees += trees;
  stats.totalAmount += amount;
  
  // Emit real-time update
  io.emit('newDonation', newDonation);
  io.emit('statsUpdate', stats);
  
  res.json(newDonation);
});

app.get('/api/sites', (req, res) => {
  res.json(plantingSites);
});

app.get('/api/leaderboard', (req, res) => {
  const leaderboard = donations
    .reduce((acc, donation) => {
      const existing = acc.find(item => item.donor === donation.donor);
      if (existing) {
        existing.amount += donation.amount;
        existing.trees += donation.trees;
      } else {
        acc.push({
          donor: donation.donor,
          amount: donation.amount,
          trees: donation.trees
        });
      }
      return acc;
    }, [])
    .sort((a, b) => b.amount - a.amount)
    .map((item, index) => ({ ...item, rank: index + 1 }));
  
  res.json(leaderboard);
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Send current stats to new connection
  socket.emit('statsUpdate', stats);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Simulate real-time tree planting updates
setInterval(() => {
  const randomIncrease = Math.floor(Math.random() * 5) + 1;
  stats.totalTrees += randomIncrease;
  io.emit('statsUpdate', stats);
}, 30000); // Every 30 seconds

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});