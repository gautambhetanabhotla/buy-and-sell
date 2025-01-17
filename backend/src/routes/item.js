import express from 'express';
// import mongoose from 'mongoose';
import { itemModel } from '../models.js';

const router = express.Router();
router.use(express.json());

router.get('/limit/:num', (req, res) => {
    const items = itemModel.find().limit(req.params.num);
    items.exec().then((items) => {
        res.status(200).json(items).send();
    }).catch((err) => {
        res.status(500).json(err).send();
    });
});

router.get('/:id', (req, res) => {
    const item = itemModel.findById(req.params.id);
    item.exec().then((item) => {
        res.status(200).json(item).send();
    }).catch((err) => {
        res.status(500).json(err).send();
    });
});

router.post('/', (req, res) => {
    const item = new itemModel(req.body);
    item.save().then((item) => {
        res.status(200).json(item).send();
    }).catch((err) => {
        res.status(500).json(err).send();
    });
});

export default router;
