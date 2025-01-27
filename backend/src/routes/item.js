import express from 'express';
import jwt from 'jsonwebtoken';
import process from 'process';

import { itemModel, userModel } from '../models.js';
import validateAuth from '../auth.js';

const router = express.Router();
router.use(express.json());

router.get('/limit/:num', async (req, res) => {

    const authHeader = req.headers.authorization;
    if(!authHeader) {
        res.status(401).send();
        return;
    }
    try {
        console.log(authHeader.split(' ')[1]);
        jwt.verify(authHeader.split(' ')[1], process.env.JWTSECRET);
    } catch {
        res.status(401).send();
        return;
    }

    const items = await itemModel.aggregate([
        { $limit: parseInt(req.params.num) },
        {
            $lookup: {
                from: 'users', // The name of the collection to join
                localField: 'seller', // The field from the item collection
                foreignField: '_id', // The field from the user collection
                as: 'sellerDetails' // The name of the array field to add to the item documents
            }
        },
        {
            $unwind: '$sellerDetails' // Unwind the array to include the seller details as a single object
        },
        {
            $project: {
                name: 1,
                description: 1,
                price: 1,
                category: 1,
                'sellerDetails.firstName': 1,
                'sellerDetails.lastName': 1
            }
        }
    ]);
    res.status(200).json(items);
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
    const userDetails = validateAuth(req);
    const user = userModel.findById(userDetails.id);
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
