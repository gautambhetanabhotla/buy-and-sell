import express from 'express';
import process from 'process';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import { itemModel, orderModel, userModel } from '../models.js';
import validateAuth from '../auth.js';

const router = express.Router();
router.use(express.json());

router.get('/to-deliver/:num', async (req, res) => {
    const userDetails = validateAuth(req);
    if(!userDetails) {
        res.status(401).send();
        return;
    }
    const orders = orderModel.aggregate([
        { $limit: parseInt(req.params.num) },
        {
            $lookup: {
                from: 'items',
                localField: 'item',
                foreignField: '_id',
                as: 'item'
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'buyer',
                foreignField: '_id',
                as: 'buyer'
            }
        },
        { $unwind: '$item' },
        { $unwind: '$buyer' },
        {
            $match: {
                status: 'pending',
                'item.seller': new mongoose.Types.ObjectId(userDetails.id),
            }
        },
        {
            $project: {
                item: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    price: 1,
                    category: 1
                },
                buyer: {
                    _id: 1,
                    firstName: 1,
                },
                status: 1
            }
        }
    ]);
    orders.exec().then((orders) => {
        res.status(200).json(orders);
    }).catch((err) => {
        res.status(500).json(err);
    });
});

router.get('/pending/:num', (req, res) => {
    const userDetails = validateAuth(req);
    if(!userDetails) {
        res.status(401).send();
        return;
    }
    const orders = orderModel.aggregate([
        {
            $match: { 
                buyer: new mongoose.Types.ObjectId(userDetails.id),
                status: 'pending'
            }
        },
        { $limit: parseInt(req.params.num) },
        {
            $lookup: {
                from: 'items',
                localField: 'item',
                foreignField: '_id',
                as: 'item'
            }
        },
        { $unwind: '$item' },
        {
            $project: {
                item: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    price: 1,
                    category: 1
                },
                status: 1
            }
        }
    ]);
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

router.post('/cancel/:id', async (req, res) => {
    // TO DO: Doesn't work
    const userDetails = validateAuth(req);
    if(!userDetails) {
        res.status(401).send();
        return;
    }
    const order = await orderModel.findById(req.params.id);
    if(order.buyer.equals(userDetails.id)) {
        order.status = 'cancelled';
        const item = await itemModel.findById(order.item);
        item.isOrdered = false;
        await item.save();
        await order.save();
        res.status(200).send();
    } else {
        res.status(403).send();
    }
});

router.get('/:id/regenerate', (req, res) => {
    const userDetails = validateAuth(req);
    if(!userDetails) {
        res.status(401).send();
        return;
    }
    // TO DO: Make this more secure. Not checking buyer validity.
    const order = orderModel.findById(req.params.id);
    order.exec().then(async (order) => {
        const OTP = Math.floor(100000 + Math.random() * 899999);
        order.otpHash = await bcrypt.hash(OTP.toString(), parseInt(process.env.SALTROUNDS));
        await order.save();
        res.status(200).json({ otp: OTP });
    }).catch((err) => {
        res.status(500).json(err);
    });
});

router.post('/:id/complete', async (req, res) => {
    console.log('RECEIVED COMPLETE REQUEST');
    const userDetails = validateAuth(req);
    if(!userDetails) {
        res.status(401).send();
        return;
    }
    const order = await orderModel.findById(req.params.id);
    const result = await bcrypt.compare(req.body.otp, order.otpHash);
    if(result) {
        order.status = 'delivered';
        await order.save();
        res.status(200).send();
    } else {
        res.status(403).send();
    }
});

router.get('/delivered/:num', (req, res) => {
    const userDetails = validateAuth(req);
    if(!userDetails) {
        res.status(401).send();
        return;
    }
    const orders = orderModel.aggregate([
        { $limit: parseInt(req.params.num) },
        {
            $lookup: {
                from: 'items',
                localField: 'item',
                foreignField: '_id',
                as: 'item'
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'buyer',
                foreignField: '_id',
                as: 'buyer'
            }
        },
        { $unwind: '$item' },
        { $unwind: '$buyer' },
        {
            $match: {
                status: 'delivered',
                'item.seller': new mongoose.Types.ObjectId(userDetails.id),
            }
        },
        {
            $project: {
                item: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    price: 1,
                    category: 1
                },
                buyer: {
                    _id: 1,
                    firstName: 1,
                    lastName: 1,
                },
                status: 1
            }
        }
    ]);
    orders.exec().then((orders) => {
        res.status(200).json(orders);
    }).catch((err) => {
        res.status(500).json(err);
    });
});

router.get('/received/:num', (req, res) => {
    const userDetails = validateAuth(req);
    if(!userDetails) {
        res.status(401).send();
        return;
    }
    const orders = orderModel.aggregate([
        { $limit: parseInt(req.params.num) },
        {
            $lookup: {
                from: 'items',
                localField: 'item',
                foreignField: '_id',
                as: 'item'
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'buyer',
                foreignField: '_id',
                as: 'buyer'
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'item.seller',
                foreignField: '_id',
                as: 'itemseller'
            }
        },
        { $unwind: '$item' },
        { $unwind: '$buyer' },
        { $unwind: '$itemseller' },
        {
            $match: {
                status: 'delivered',
                'buyer._id': new mongoose.Types.ObjectId(userDetails.id),
            }
        },
        {
            $project: {
                item: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    price: 1,
                    category: 1
                },
                buyer: {
                    _id: 1,
                    firstName: 1,
                    lastName: 1,
                },
                itemseller: {
                    _id: 1,
                    firstName: 1,
                    lastName: 1,
                },
                status: 1,
            }
        }
    ]);
    orders.exec().then((orders) => {
        res.status(200).json(orders);
    }).catch((err) => {
        res.status(500).json(err);
    });
});

export default router;
