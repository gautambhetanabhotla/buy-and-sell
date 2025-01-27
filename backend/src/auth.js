import jwt from 'jsonwebtoken';
import process from 'process';
import dotenv from 'dotenv';

dotenv.config({
    path: process.env.NODE_ENV === 'development' ? './.env-dev' : './.env'
})

const validateAuth = (request) => {
    const authHeader = request.headers.authorization;
    if(!authHeader) return null;
    const token = authHeader.split(' ')[1];
    try {
        return jwt.verify(token, process.env.JWTSECRET);
    }
    catch {
        return null;
    }
}

export default validateAuth;