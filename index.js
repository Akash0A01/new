const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 3010;

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.use(express.static('static'));
app.use(express.json());

// Store the latest height reading
let currentHeight = 0;

// Route to render the main page
app.get('/', (req, res) => {
  res.render('index', { height: currentHeight });
});

// API endpoint for ESP32 to send height data
app.post('/api/height', (req, res) => {
  const { height } = req.body;
  currentHeight = height;
  io.emit('heightUpdate', { height });
  res.json({ success: true });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected');
  socket.emit('heightUpdate', { height: currentHeight });
});

http.listen(port, () => {
  console.log(`Height measurement system running at http://localhost:${port}`);
});