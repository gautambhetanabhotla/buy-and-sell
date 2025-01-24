import express from 'express';
import { orderModel } from '../models.js';

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

export default router;
