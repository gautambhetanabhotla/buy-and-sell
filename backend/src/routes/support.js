// import env from '../../main.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
// import axios from 'axios';
import express from 'express';
import process from 'process';
import yaml from 'js-yaml';
import fs from 'fs';

import { itemModel } from '../models.js';

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

// while(!env) {}
const genAI = new GoogleGenerativeAI(env.gemini.apikey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

router.post('/prompt', async (req, res) => {

    // const genAI = new GoogleGenerativeAI(env.gemini.apikey);
    // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    // const prompt = req.body.prompt;

    const result = await model.generateContent([req.body.prompt, req.body.context]);
    // console.log(result.response.text());
    res.status(200).json({output: result.response.text()});
});

router.get('/defaultcontext', async (req, res) => {
    let defaultContext = "You are a customer support chatbot for a buy and sell website.\nThe items currently for sale are:\n";
    const items = await itemModel.find({ isOrdered: false }).limit(req.params.num);
    // console.dir(items[0].price);
    items.forEach((item) => {
        defaultContext += `${item.name}, price: ${item.price}, description: "${item.description}", categories: ${item.category}\n`;
    });
    res.status(200).json({context: defaultContext});
});

export default router;
