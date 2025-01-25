import express from 'express';
import jwt from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';
import bcrypt from 'bcrypt';

import env from '../../main.js';
import { userModel, itemModel } from '../models.js';

// const env = await Env('../../env.yaml');

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
    bcrypt.hash(req.body.password, env.server.saltrounds, (err, hash) => {
        if(err) {
            res.status(500).json(err);
            return;
        }
        req.body.passwordHash = hash;
        if(req.body.password) delete req.body.password;
        const user = new userModel(req.body);
        user.save().then((user) => {
            console.log("USER CREATED");
            console.dir(user);
            res.status(200).json(user);
        }).catch((err) => {
            console.log("ERROR CREATING USER");
            console.log(typeof(err));
            console.dir(err);
            res.status(500).json(err);
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
                }, env.server.jwtsecret);
                res.status(200).json({token: token});
            }
            else {
                // console.log("sending 401 response");
                res.status(401).json();
            }
        });
    }).catch((err) => {
        res.status(500).json(err);
    });
});

router.put('/:id', (req, res) => {
    const user = userModel.findById(req.params.id);
    user.exec().then((user) => {
        if(req.body.password) {
            bcrypt.hash(req.body.password, env.server.saltrounds, (err, hash) => {
                if(err) {
                    res.status(500).json(err);
                    return;
                }
                user.passwordHash = hash;
                // if(req.body.password) delete req.body.password;
            });
        }
        if(req.body.email) user.email = req.body.email;
        if(req.body.firstName) user.firstName = req.body.firstName;
        if(req.body.lastName) user.lastName = req.body.lastName;
        if(req.body.age) user.age = req.body.age;
        if(req.body.contactNumber) user.contactNumber = req.body.contactNumber;
        user.save().then((user) => {
            res.status(200).json(user);
        }).catch((err) => {
            res.status(500).json(err);
        });
    }).catch((err) => {
        res.status(500).json(err);
    });
});

router.get('/:id/cart', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader) {
            res.status(401).send();
            return;
        }
        try {
            jwtDecode(authHeader.split(' ')[1]);
        } catch (err) {
            res.status(500).json(err);
        }
        const user = await userModel.findById(req.params.id).exec();
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
