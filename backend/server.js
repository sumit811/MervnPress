const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./db/config');
const blogRoutes = require('./routes/blogRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Local MongoDB
connectDB();

// API Routes
app.use('/api', blogRoutes);
app.use('/api/categories', categoryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});