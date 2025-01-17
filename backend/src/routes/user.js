import express from 'express';
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

export default router;
