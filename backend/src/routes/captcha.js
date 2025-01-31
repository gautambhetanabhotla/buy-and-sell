import axios from 'axios';
import express from 'express';

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const response = await axios.get("https://librecaptcha.org/api/get");
        res.json(response.data);
    } catch {
        res.status(500).json({ error: "Failed to fetch CAPTCHA" });
    }
});

router.post("/verify", async (req, res) => {
    const { id, answer } = req.body;
    try {
        const response = await axios.post("https://librecaptcha.org/api/verify", { id, answer });
        res.json(response.data);
    } catch {
        res.status(500).json({ error: "CAPTCHA verification failed" });
    }
});

export default router;