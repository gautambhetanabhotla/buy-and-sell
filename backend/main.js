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
})

// // Load environment variables
// const envName = process.env.NODE_ENV;
// if (!['production', 'development'].includes(envName)) {
//     throw new Error(`Invalid NODE_ENV: ${envName}`);
// }
// let env = null;
// try {
//     const file = fs.readFileSync('env.yaml', 'utf8');
//     try {
//         env = await yaml.load(file)[envName];
//     } catch (err) {
//         console.error('Error parsing env.yaml:', err);
//         process.exit(1);
//     }
// } catch (err) {
//     console.error('Error reading env.yaml:', err);
//     process.exit(1);
// }

// const initializeEnv = async (yamlpath) => {
//     const envName = process.env.NODE_ENV;
//     if (!['production', 'development'].includes(envName)) {
//         throw new Error(`Invalid NODE_ENV: ${envName}`);
//     }
//     try {
//         const file = fs.readFileSync(yamlpath, 'utf8');
//         try {
//             const env = yaml.load(file)[envName];
//             return env;
//         } catch (err) {
//             console.error('Error parsing env.yaml:', err);
//             process.exit(1);
//         }
//     } catch (err) {
//         console.error('Error reading env.yaml:', err);
//         process.exit(1);
//     }
// };

// const env = await Env('./env.yaml');

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