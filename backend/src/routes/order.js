import express from 'express';
import process from 'process';
import bcrypt from 'bcrypt';

import { itemModel, orderModel, userModel } from '../models.js';
import validateAuth from '../auth.js';

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

const orderAnItem = async (itemID, userID) => {
    // Order an item for a user.
    const OTP = Math.floor(100000 + Math.random() * 899999);
    const OTPhash = await bcrypt.hash(OTP.toString(), parseInt(process.env.SALTROUNDS));
    const order = new orderModel({
        item: itemID,
        buyer: userID,
        otpHash: OTPhash,
        status: 'pending'
    });
    await order.save();

    const item = await itemModel.findById(itemID);
    if(item) {
        item.isOrdered = true;
        await item.save();
    }
    else {
        throw new Error('Item not found');
    }

    const user = await userModel.findById(userID);
    if(user) {
        // console.dir(user.itemsInCart);
        // console.dir(user.itemsInCart[0].buffer.toString());
        user.itemsInCart.splice(user.itemsInCart.findIndex((id) => id.equals(itemID)), 1);
        await user.save();
    }
    else {
        throw new Error('User not found');
    }
};

router.post('/place', async (req, res) => {
    // Place an order for an array of items.
    const userDetails = validateAuth(req);
    if(!userDetails) {
        res.status(401).send();
        return;
    }

    const order = req.body;
    
    const results = await Promise.all(
        order.map(async (item) => {
            try {
                await orderAnItem(item._id, userDetails.id);
                return null; // No error for this item
            } catch (error) {
                return {
                    item: item,
                    error: error.message || error,
                };
            }
        })
    );

    const invalidOrderItems = results.filter((result) => result !== null);

    if(invalidOrderItems.length > 0) {
        res.status(400).send(invalidOrderItems);
    } else {
        res.status(200).send();
    }
});

export default router;
