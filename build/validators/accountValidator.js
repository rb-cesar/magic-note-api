"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccountValidator = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = require("bcrypt");
const User_1 = require("@app/models/User");
const globalValidator_1 = require("@app/validators/globalValidator");
const access_1 = require("@app/config/access");
const Session_1 = require("@app/models/Session");
async function ableToCreate({ username, email, password }) {
    const { error, message, status } = await (0, globalValidator_1.validate)({ username, email, password }, [
        () => ({
            error: !username,
            status: 400,
            message: 'Username is required',
        }),
        () => ({
            error: !email,
            status: 400,
            message: 'Email is required',
        }),
        () => ({
            error: !password,
            status: 400,
            message: 'Password is required',
        }),
        async () => {
            const user = await User_1.User.findOne({ username });
            return {
                error: Boolean(user),
                status: 422,
                message: 'Username already exists',
            };
        },
        async () => {
            const user = await User_1.User.findOne({ email });
            return {
                error: Boolean(user),
                status: 422,
                message: 'Email already exists',
            };
        },
    ]);
    return { error, status, message };
}
async function ableToSignInProcess({ username, password }) {
    const { error, status, message } = await (0, globalValidator_1.validate)(null, [
        () => ({
            error: !username,
            status: 400,
            message: 'Username is required',
        }),
        () => ({
            error: !password,
            status: 400,
            message: 'Passoword is required',
        }),
    ]);
    return { error, status, message };
}
async function ableToSignIn({ username, password, user }) {
    const { error, status, message } = await (0, globalValidator_1.validate)({ username, password }, [
        () => ({
            error: !user,
            status: 422,
            message: 'Invalid data',
        }),
        async () => {
            const passwordMatch = await (0, bcrypt_1.compare)(password, user?.password);
            return {
                error: !passwordMatch,
                status: 422,
                message: 'Invalid data',
            };
        },
    ]);
    return { error, status, message };
}
async function ableToRefreshAuthorization({ authRefreshToken, session }) {
    const { error, status, message } = await (0, globalValidator_1.validate)(authRefreshToken, [
        () => ({
            error: !session,
            status: 401,
            message: 'Unauthenticated',
        }),
        () => ({
            error: !authRefreshToken,
            status: 401,
            message: 'Unauthenticated',
        }),
        async () => {
            try {
                jsonwebtoken_1.default.verify(authRefreshToken, access_1.uri.secret_access_key);
                return {
                    error: false,
                    status: 200,
                    message: 'Ok',
                };
            }
            catch {
                const { userId } = jsonwebtoken_1.default.decode(authRefreshToken);
                await Session_1.Session.deleteMany({ userId });
                return {
                    error: true,
                    status: 403,
                    message: 'Invalid access token',
                };
            }
        },
    ]);
    return { error, status, message };
}
function ableToShow(userId) {
    return {
        error: !userId,
        status: 400,
        message: 'userId is required',
    };
}
function createAccountValidator() {
    return {
        ableToCreate,
        ableToSignIn,
        ableToSignInProcess,
        ableToShow,
        ableToRefreshAuthorization,
    };
}
exports.createAccountValidator = createAccountValidator;
