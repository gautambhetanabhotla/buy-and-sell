import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import env from '../main.js';
import { userModel } from '../models.js';

const router = express.Router();
router.use(express.json());

router.get('/limit/:num', (req, res) => {
    const users = userModel.find().limit(req.params.num);
    users.exec().then((users) => {
        res.status(200).json(users).send();
    }).catch((err) => {
        res.status(500).json(err).send();
    });
});

router.get('/:id', (req, res) => {
    const user = userModel.findById(req.params.id);
    user.exec().then((user) => {
        res.status(200).json(user).send();
    }).catch((err) => {
        res.status(500).json(err).send();
    });
});

router.post('/', (req, res) => {
    const user = new userModel(req.body);
    user.save().then((user) => {
        res.status(200).json(user).send();
    }).catch((err) => {
        res.status(500).json(err).send();
    });
});

router.post('/signup', (req, res) => {
    bcrypt.hash(req.body.password, env.server.saltrounds, (err, hash) => {
        if(err) {
            res.status(500).json(err).send();
            return;
        }
        req.body.passwordHash = hash;
        if(req.body.password) delete req.body.password;
        const user = new userModel(req.body);
        user.save().then((user) => {
            res.status(200).json(user).send();
        }).catch((err) => {
            res.status(500).json(err).send();
        });
    });
});

router.post('/login', (req, res) => {
    console.log("RECEIVED LOGIN REQUEST");
    const user = userModel.findOne({ email: req.body.email });
    user.exec().then((user) => {
        bcrypt.compare(req.body.password, user.passwordHash, (err, result) => {
            if(err) {
                res.status(500).json({
                    error: err,
                    message: "Internal server error",
                }).send();
                return;
            }
            if(result === true) {
                const token = jwt.sign({
                    id: user._id,
                    email: user.email,
                }, env.server.jwtsecret);
                res.status(200).json({
                    message: "Success",
                    token: token,
                }).send();
                return;
            }
            else {
                res.status(401).json({
                    message: "Invalid email or password",
                }).send();
                return;
            }
        });
    }).catch((err) => {
        res.status(500).json(err).send();
    });
});

export default router;
