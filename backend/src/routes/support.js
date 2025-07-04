// import env from '../../main.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
// import axios from 'axios';
import express from 'express';
import process from 'process';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { itemModel, orderModel } from '../models.js';
import validateAuth from '../auth.js';

dotenv.config({
    path: process.env.NODE_ENV === 'development' ? './.env-dev' : './.env'
})

const router = express.Router();
router.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINIAPIKEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

router.post('/prompt', async (req, res) => {
    const result = await model.generateContent([req.body.prompt, req.body.context]);
    res.status(200).json({output: result.response.text()});
});

router.get('/defaultcontext', async (req, res) => {
    const userDetails = validateAuth(req);
    if(!userDetails) {
        res.status(401).send();
        return;
    }
    console.dir(userDetails);
    let defaultContext = `Hi, my name is ${userDetails.firstName} ${userDetails.lastName}. You are a customer support chatbot for a buy and sell website.\nThe items currently for sale are:\n`;
    const itemsOnSale = await itemModel.find({ isOrdered: false }).limit(req.params.num);
    for(const item of itemsOnSale) {
        defaultContext += `${item.name}, price: ${item.price}, description: "${item.description}", categories: ${item.category}\n`;
    }

    defaultContext += `The items that I have ordered and are yet to arrive are:\n`;
    const pendingOrders = await orderModel.aggregate([
        {
            $match: { 
                buyer: mongoose.Types.ObjectId.createFromHexString(userDetails.id),
                status: 'pending'
            }
        },
        { $limit: 100 },
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
    for(const order of pendingOrders) {
        defaultContext += `${order.item.name}, price: ${order.item.price}, description: "${order.item.description}", categories: ${order.item.category}\n`;
    }

    defaultContext += `The items that I have yet to deliver to others are:\n`;
    const toDeliverOrders = await orderModel.aggregate([
        { $limit: 100 },
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
                'item.seller': mongoose.Types.ObjectId.createFromHexString(userDetails.id),
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
    for(const order of toDeliverOrders) {
        defaultContext += `${order.item.name}, price: ${order.item.price}, description: "${order.item.description}", categories: ${order.item.category}, buyer: ${order.buyer.firstName}\n`;
    }

    defaultContext += `The items that I have delivered to others are:\n`;
    const deliveredOrders = await orderModel.aggregate([
        { $limit: 100 },
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
                'item.seller': mongoose.Types.ObjectId.createFromHexString(userDetails.id),
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
    for(const order of deliveredOrders) {
        defaultContext += `${order.item.name}, price: ${order.item.price}, description: "${order.item.description}", categories: ${order.item.category}, buyer: ${order.buyer.firstName} ${order.buyer.lastName}\n`;
    }

    defaultContext += `The items that I have ordered and already received are:\n`;
    const receivedOrders = await orderModel.aggregate([
        { $limit: 100 },
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
                'buyer._id': mongoose.Types.ObjectId.createFromHexString(userDetails.id),
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
    for(const order of receivedOrders) {
        defaultContext += `${order.item.name}, price: ${order.item.price}, description: "${order.item.description}", categories: ${order.item.category}, seller: ${order.itemseller.firstName} ${order.itemseller.lastName}\n`;
    }

    res.status(200).json({context: defaultContext});
});

export default router;
