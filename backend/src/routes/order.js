import express from 'express';
import process from 'process';
import fs from 'fs';
import yaml from 'js-yaml';

import { orderModel } from '../models.js';

// Load environment variables
const envName = process.env.NODE_ENV;
if (!['production', 'development'].includes(envName)) {
    throw new Error(`Invalid NODE_ENV: ${envName}`);
}
let env = null;
try {
    const file = fs.readFileSync('env.yaml', 'utf8');
    try {
        env = await yaml.load(file)[envName];
    } catch (err) {
        console.error('Error parsing env.yaml:', err);
        process.exit(1);
    }
} catch (err) {
    console.error('Error reading env.yaml:', err);
    process.exit(1);
}

const router = express.Router();
router.use(express.json());

router.get('/limit/:num', (req, res) => {
    const orders = orderModel.find().limit(req.params.num);
    orders.exec().then((orders) => {
        res.status(200).json(orders);
    }).catch((err) => {
        res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
    const order = orderModel.findById(req.params.id);
    order.exec().then((order) => {
        res.status(200).json(order);
    }).catch((err) => {
        res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
    const order = new orderModel(req.body);
    order.save().then((order) => {
        res.status(200).json(order);
    }).catch((err) => {
        res.status(500).json(err);
    });
});

router.post('/place', (req, res) => {
    const order = new orderModel(req.body);
    order.save().then((order) => {
        res.status(200).json(order);
    }).catch((err) => {
        res.status(500).json(err);
    });
});

export default router;
