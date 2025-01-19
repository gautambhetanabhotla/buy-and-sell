import express from 'express';
import mongoose from 'mongoose';
import yaml from 'js-yaml';
import fs from 'fs';
import process from 'process';

import user_routes from './routes/user.js';
import order_routes from './routes/order.js';
import item_routes from './routes/item.js';

// Load environment variables
const envName = process.env.NODE_ENV;
if (!['production', 'development'].includes(envName)) {
    throw new Error(`Invalid NODE_ENV: ${envName}`);
}
let env;
try {
    const file = fs.readFileSync('env.yaml', 'utf8');
    try {
        env = yaml.load(file)[envName];
    } catch (err) {
        console.error('Error parsing env.yaml:', err);
        process.exit(1);
    }
} catch (err) {
    console.error('Error reading env.yaml:', err);
    process.exit(1);
}

// Connect to database
mongoose
    .connect(env.database.url, {})
    .then(() => {
        console.log('Connected to database');
    })
    .catch((err) => {
        console.error('Error connecting to database:', err);
    });

// Set up the server
const App = express();
App.use('static', express.static('public'));
App.use('/api/user', user_routes);
App.use('/api/item', item_routes);
App.use('/api/order', order_routes);

App.listen(env.server.port, () => {
    console.log(`Server is running on port ${env.server.port}`);
}).on('error', (err) => {
    console.error('Error starting server:', err);
});

export default env;