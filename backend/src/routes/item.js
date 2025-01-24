import express from 'express';
// import mongoose from 'mongoose';
import { itemModel, userModel } from '../models.js';
import { jwtDecode } from 'jwt-decode';

const router = express.Router();
router.use(express.json());

router.get('/limit/:num', (req, res) => {
    const items = itemModel.find().limit(req.params.num);
    items.exec().then((items) => {
        res.status(200).json(items);
    }).catch((err) => {
        res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
    const item = itemModel.findById(req.params.id);
    item.exec().then((item) => {
        res.status(200).json(item);
    }).catch((err) => {
        res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
    const item = new itemModel(req.body);
    item.save().then((item) => {
        res.status(200).json(item);
    }).catch((err) => {
        res.status(500).json(err);
    });
});

router.post('/addtocart/:id', (req, res) => {
    const authHeader = req.headers.authorization;
    if(!authHeader) res.status(401).send();
    const token = authHeader.split(' ')[1];
    const decoded = jwtDecode(token);
    console.dir(decoded);
    const user = userModel.findById(decoded.id);
    user.exec().then((user) => {
        if(!(user.itemsInCart.includes(req.params.id))) user.itemsInCart.push(req.params.id); // same item gettin gpushed twice
        user.save().then((user) => {
            res.status(200).json(user);
        }).catch((err) => {
            res.status(500).json(err);
        });
    }).catch((err) => {
        res.status(500).json(err);
    });
});

export default router;
