import express from 'express';

import { itemModel, userModel } from '../models.js';
import validateAuth from '../auth.js';

const router = express.Router();
router.use(express.json());

router.get('/', async (req, res) => {

    const aggregationPipeline = [
        { $match: { isOrdered: false } },
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
    ]

    if (req.query.limit) {
        aggregationPipeline.push({ $limit: parseInt(req.query.limit) });
    }

    const items = await itemModel.aggregate(aggregationPipeline);
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
    if (!userDetails) return res.status(401).send();
    const user = userModel.findById(userDetails.id);
    user.exec().then((user) => {
        const item = itemModel.findById(req.params.id);
        item.exec().then((item) => {
            if (!item) return res.status(404).send();
            if (!user.itemsInCart.includes(req.params.id)
                && !item.seller.equals(user.id)
                && !item.isOrdered)
                    user.itemsInCart.push(req.params.id); // same item getting pushed twice, and make sure ordered items dont get pushed onto cart
            user.save().then((user) => {
                res.status(200).json(user);
            }).catch((err) => {
                res.status(500).json(err);
            });
        }); 
    }).catch((err) => {
        res.status(500).json(err);
    });
});

export default router;
