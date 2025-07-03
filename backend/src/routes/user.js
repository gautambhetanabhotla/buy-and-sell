import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import process from 'process';

import { userModel, itemModel } from '../models.js';
import validateAuth from '../auth.js';

const router = express.Router();
router.use(express.json());

router.get('/limit/:num', (req, res) => {
    const users = userModel.find().limit(req.params.num);
    users.exec().then((users) => {
        res.status(200).json(users);
    }).catch((err) => {
        res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
    const user = userModel.findById(req.params.id);
    user.exec().then((user) => {
        res.status(200).json(user);
    }).catch((err) => {
        res.status(500).json(err);
    });
});

router.post('/signup', (req, res) => {
    bcrypt.hash(req.body.password, parseInt(process.env.SALTROUNDS), (err, hash) => {
        if(err) {
            res.status(500).json(err);
            return;
        }
        req.body.passwordHash = hash;
        if(req.body.password) delete req.body.password;
        const user = new userModel(req.body);
        user.save().then((user) => {
            res.status(200).json(user);
        }).catch((error) => {
            console.dir(error);
            res.status(500).json(error);
        });
    });
});

router.post('/login', (req, res) => {
    console.log("RECEIVED LOGIN REQUEST");
    console.log(req.body);
    const user = userModel.findOne({ email: req.body.email });
    user.exec().then((user) => {
        bcrypt.compare(req.body.password, user.passwordHash, (err, result) => {
            if(err) {
                res.status(500).json({
                    error: err,
                    message: "Internal server error",
                });
            }
            if(result === true) {
                const token = jwt.sign({
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    age: user.age,
                    contactNumber: user.contactNumber,
                }, process.env.JWTSECRET);
                res.status(200).json({token: token});
            }
            else {
                res.status(401).json();
            }
        });
    }).catch((err) => {
        res.status(500).json(err);
    });
});

router.put('/:id', async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (req.body.password) {
            try {
                const hash = await bcrypt.hash(req.body.password, parseInt(process.env.SALTROUNDS));
                user.passwordHash = hash;
            } catch (err) {
                return res.status(500).json(err);
            }
        }

        // if (req.body.email) user.email = req.body.email;
        // if (req.body.firstName) user.firstName = req.body.firstName;
        // if (req.body.lastName) user.lastName = req.body.lastName;
        // if (req.body.age) user.age = req.body.age;
        // if (req.body.contactNumber) user.contactNumber = req.body.contactNumber;

        user.email = req.body.email;
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.age = req.body.age;
        user.contactNumber = req.body.contactNumber;

        try {
            const updatedUser = await user.save();
            const token = jwt.sign({
                id: updatedUser._id,
                email: updatedUser.email,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                age: updatedUser.age,
                contactNumber: updatedUser.contactNumber,
            }, process.env.JWTSECRET);

            return res.status(200).json({ token });
        } catch (err) {
            return res.status(500).json(err);
        }
    } catch (err) {
        return res.status(500).json(err);
    }
});

router.get('/:id/cart', async (req, res) => {
    const userDetails = validateAuth(req);
    if(!userDetails) {
        res.status(401).send();
        return;
    }
    try {
        const user = await userModel.findById(userDetails.id).exec();
        const cartItems = await Promise.all(user.itemsInCart.map(async (itemID) => {
            const item = await itemModel.findById(itemID).exec();
            return item;
        }));
        res.status(200).json(cartItems);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete('/:id/cart/:itemID', async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id).exec();
        user.itemsInCart.splice(user.itemsInCart.indexOf(req.params.itemID), 1);
        await user.save();
        res.status(204).send();
    } catch (err) {
        res.status(500).json(err);
    }
});

export default router;
