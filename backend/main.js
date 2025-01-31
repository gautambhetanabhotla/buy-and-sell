import express from 'express';
import mongoose from 'mongoose';
import process from 'process';
import dotenv from 'dotenv';

import user_routes from './src/routes/user.js';
import order_routes from './src/routes/order.js';
import item_routes from './src/routes/item.js';
import support_routes from './src/routes/support.js';

dotenv.config({
    path: process.env.NODE_ENV === 'development' ? './.env-dev' : './.env'
});

// Connect to database
mongoose
    .connect(process.env.DB_URL, {})
    .then(() => {
        console.log('Connected to database');
    })
    .catch((err) => {
        console.error('Error connecting to database:', err);
    });

// Set up the server
const App = express();
App.use(express.static('public'));
App.use('/api/user', user_routes);
App.use('/api/item', item_routes);
App.use('/api/order', order_routes);
App.use('/api/support', support_routes);

const staticRoutes = ['/', '/dashboard', '/deliver', '/orders', '/items', '/cart', '/support'];

staticRoutes.forEach((route) => {
    App.get(route, (req, res) => {
        res.sendFile('index.html', { root: 'public' });
    });
});

App.listen(process.env.SERVERPORT, () => {
    console.log(`Server is running on port ${process.env.SERVERPORT}`);
}).on('error', (err) => {
    console.error('Error starting server:', err);
});

// export default env;