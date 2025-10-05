const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const YAML = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB (skip during Jest tests; tests manage their own connection)
if (typeof process.env.JEST_WORKER_ID === 'undefined') {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.log(err));
}

// Use routes (include '/api' to match Vercel rewrite)
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Swagger UI and raw spec
try {
    const openapiPath = path.join(__dirname, '../openapi.yaml');
    const openapiContent = fs.readFileSync(openapiPath, 'utf8');
    const openapiDoc = YAML.load(openapiContent);

    app.get('/api/openapi.yaml', (req, res) => {
        res.type('text/yaml').send(openapiContent);
    });
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapiDoc));
    console.log('Swagger UI available at /api/docs');
} catch (e) {
    console.warn('OpenAPI spec not found or invalid; Swagger UI disabled');
}

// Serve the React build only if it exists (server-only deployments won't have it)
const clientBuildPath = path.join(__dirname, '../../client/build');
if (fs.existsSync(clientBuildPath)) {
    app.use(express.static(clientBuildPath));
    app.get(/^(?!\/api\/).*/, (req, res) => {
        return res.sendFile(path.join(clientBuildPath, 'index.html'));
    });
} else {
    // Basic root route so health checks don't 404 on server-only deployments
    app.get('/', (req, res) => res.status(200).send('API OK'));
}

// Export Express app for Vercel Node runtime
module.exports = app;
