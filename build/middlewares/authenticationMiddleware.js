"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autheticationMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const access_1 = require("@app/config/access");
const autheticationMiddleware = (req, res, next) => {
    const authToken = req.headers['authorization']?.split(' ')[1];
    if (!authToken) {
        return res.status(401).json({ error: true, status: 422, message: 'Unauthenticated' });
    }
    try {
        jsonwebtoken_1.default.verify(authToken, access_1.uri.secret_access_key);
        const decodedToken = jsonwebtoken_1.default.decode(authToken);
        req.cookies['userId'] = decodedToken.userId;
        next();
    }
    catch (err) {
        return res.status(401).json({ error: true, status: 422, message: 'Unauthenticated' });
    }
};
exports.autheticationMiddleware = autheticationMiddleware;
