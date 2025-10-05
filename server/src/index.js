const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Use routes (include '/api' to match Vercel rewrite)
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Serve the React build when running as a unified server (e.g., on Render)
const clientBuildPath = path.join(__dirname, '../../client/build');
app.use(express.static(clientBuildPath));
app.get(/^(?!\/api\/).*/, (req, res) => {
    return res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// Export Express app for Vercel Node runtime
module.exports = app;
