"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTokenProvider = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const access_1 = require("@app/config/access");
const Session_1 = require("@app/models/Session");
function getTime(value) {
    const date = new Date();
    date.setHours(Number(value.replace(/\D/, '')));
    return date.getTime();
}
function createTokenProvider() {
    const tokenExpiresIn = '24h'; // 1d
    const refreshTokenExpiresIn = '120h'; // 5d
    let timeToExpiresToken = getTime(tokenExpiresIn);
    return {
        generateToken(userId) {
            const token = jsonwebtoken_1.default.sign({ userId }, access_1.uri.secret_access_key, {
                expiresIn: tokenExpiresIn,
                subject: userId,
            });
            timeToExpiresToken = getTime(tokenExpiresIn);
            return token;
        },
        async generateRefreshTokenSession(userId) {
            const refreshToken = jsonwebtoken_1.default.sign({ userId, expiresIn: timeToExpiresToken }, access_1.uri.secret_access_key, {
                expiresIn: refreshTokenExpiresIn,
                subject: userId,
            });
            const session = await Session_1.Session.create({
                id: (0, uuid_1.v4)(),
                userId,
                refreshToken,
            });
            return {
                id: session.id,
                userId,
                refreshToken: session.refreshToken,
            };
        },
    };
}
exports.createTokenProvider = createTokenProvider;
