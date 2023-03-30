import jwt from 'jsonwebtoken';
import config from "../config/config.js";
export const auth = (req, res, next) => {
    const token = req.header('Bearer');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, config.secret_jwt);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
}

