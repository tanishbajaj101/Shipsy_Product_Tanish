const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB database connection established successfully'))
    .catch(err => console.log(err));

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});