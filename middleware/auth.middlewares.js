import jwt from 'jsonwebtoken';
import config from "../config/config.js";
export const auth = (req, res, next) => {
    if (!req.header('Authorization')) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    try {
        const token = req.header('Authorization').split(' ')[1];
        const decoded = jwt.verify(token, config.secret_jwt);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
}

