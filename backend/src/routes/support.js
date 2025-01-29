// import env from '../../main.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
// import axios from 'axios';
import express from 'express';
import process from 'process';
import dotenv from 'dotenv';

import { itemModel } from '../models.js';
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
    const items = await itemModel.find({ isOrdered: false }).limit(req.params.num);
    items.forEach((item) => {
        defaultContext += `${item.name}, price: ${item.price}, description: "${item.description}", categories: ${item.category}\n`;
    });
    res.status(200).json({context: defaultContext});
});

export default router;
