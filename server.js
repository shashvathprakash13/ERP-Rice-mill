const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB and store connection state on app.locals
let dbConnected = false;
connectDB().then((conn) => {
  dbConnected = !!conn;
}).catch(() => {
  dbConnected = false;
});

const app = express();

// Middleware
app.use(express.json());
js const allowedOrigins = [process.env.FRONTEND_URL ];
app.use(cors({ origin: (origin, callback) => { if (!origin) return callback(null, true); 
                                              if (allowedOrigins.includes(origin)) return callback(null, true); 
                                              return callback(new Error('CORS origin not allowed'), false); }, 
              credentials: true })); 

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/users', require('./routes/users'));
app.use('/api/farmers', require('./routes/farmers'));
app.use('/api/suppliers', require('./routes/suppliers'));
app.use('/api/buyers', require('./routes/buyers'));
app.use('/api/paddy', require('./routes/paddy'));
app.use('/api/production', require('./routes/production'));
app.use('/api/warehouse', require('./routes/warehouse'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/sales', require('./routes/sales'));
app.use('/api/finance', require('./routes/finance'));
app.use('/api/workers', require('./routes/workers'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/salary', require('./routes/salary'));
app.use('/api/infrastructure', require('./routes/infrastructure'));
app.use('/api/reports', require('./routes/reports'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    status: err.status || 500,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
