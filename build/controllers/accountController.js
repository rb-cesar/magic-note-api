"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showUser = exports.refreshToken = exports.updateUser = exports.signIn = exports.signOn = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = require("bcrypt");
const User_1 = require("@app/models/User");
const tokenProvider_1 = require("@app/providers/tokenProvider");
const objectHandler_1 = require("@app/utils/objectHandler");
const accountValidator_1 = require("@app/validators/accountValidator");
const Session_1 = require("@app/models/Session");
const Note_1 = require("@app/models/Note");
const accountValidator = (0, accountValidator_1.createAccountValidator)();
const tokenProvider = (0, tokenProvider_1.createTokenProvider)();
// ------------------------------------------- // ------------------------------------------- //
const signOn = async (req, res) => {
    const { username, email, password } = req.body || {};
    const { ableToCreate } = accountValidator;
    const { error, status, message } = await ableToCreate({ username, email, password });
    if (error) {
        return res.status(status).json({ error, status, message });
    }
    const hashedPassword = await (0, bcrypt_1.hash)(password, 10);
    const user = await User_1.User.create({ username, email, password: hashedPassword });
    const userResponse = (0, objectHandler_1.shouldReturnOnly)(user, ['id', 'username', 'email', 'createdAt', 'updatedAt']);
    const { generateToken, generateRefreshTokenSession } = tokenProvider;
    const token = generateToken(userResponse.id);
    const refreshTokenSession = await generateRefreshTokenSession(userResponse.id);
    await Note_1.NoteGroup.create({ creatorId: user.id, name: 'Notes' });
    return res.status(201).json({
        user: userResponse,
        token,
        session: refreshTokenSession,
    });
};
exports.signOn = signOn;
// ------------------------------------------- // ------------------------------------------- //
const signIn = async (req, res) => {
    const { username, password } = req.body;
    const { ableToSignIn, ableToSignInProcess } = accountValidator;
    const initialValidation = await ableToSignInProcess({ username, password });
    if (initialValidation.error) {
        const { error, status, message } = initialValidation;
        return res.status(status).json({ error, status, message });
    }
    const user = (await User_1.User.findOne({ username }));
    const { error, status, message } = await ableToSignIn({ username, password, user });
    if (error) {
        return res.status(status).json({ error, status, message });
    }
    await Session_1.Session.deleteMany({ userId: user.id });
    const { generateToken, generateRefreshTokenSession } = tokenProvider;
    const token = generateToken(user?.id);
    const refreshTokenSession = await generateRefreshTokenSession(user?.id);
    const userResponse = (0, objectHandler_1.shouldReturnOnly)(user, ['id', 'avatar', 'username', 'email', 'createdAt', 'updatedAt']);
    return res.status(200).json({
        user: userResponse,
        token,
        session: refreshTokenSession,
    });
};
exports.signIn = signIn;
// ------------------------------------------- // ------------------------------------------- //
const updateUser = async (req, res) => {
    const avatar = req.file['key'];
    const { username } = req.body;
    const { userId } = req.cookies;
    const newUserData = (await User_1.User.findOneAndUpdate({ id: userId }, { avatar, username }, { returnOriginal: false }));
    const dataUser = (0, objectHandler_1.shouldReturnOnly)(newUserData, ['id', 'avatar', 'username', 'email']);
    return res.status(200).json(dataUser);
};
exports.updateUser = updateUser;
// ------------------------------------------- // ------------------------------------------- //
const refreshToken = async (req, res) => {
    const { sessionId } = req.params;
    const { ableToRefreshAuthorization } = accountValidator;
    const authRefreshToken = req.headers['authorization']?.split(' ')[1];
    const session = (await Session_1.Session.findOne({ id: sessionId }));
    const { error, status, message } = await ableToRefreshAuthorization({ authRefreshToken, session });
    if (error) {
        return res.status(status).json({ error, status, message });
    }
    const decodedAuthorizationRefreshToken = jsonwebtoken_1.default.decode(authRefreshToken);
    const { userId } = decodedAuthorizationRefreshToken;
    await Session_1.Session.deleteMany({ userId });
    const { generateToken, generateRefreshTokenSession } = tokenProvider;
    const token = generateToken(userId);
    const refreshTokenSession = await generateRefreshTokenSession(userId);
    return res.status(200).json({ token, session: refreshTokenSession });
};
exports.refreshToken = refreshToken;
// ------------------------------------------- // ------------------------------------------- //
const showUser = async (req, res) => {
    const { userId } = req.params;
    const { ableToShow } = accountValidator;
    const { error, status, message } = ableToShow(userId);
    if (error) {
        return res.status(status).json({ error, status, message });
    }
    const user = await User_1.User.findOne({ id: userId });
    if (!user) {
        return res.status(404).json({ error: true, status: 404, message: 'User not found' });
    }
    const userResponse = (0, objectHandler_1.shouldReturnOnly)(user, ['id', 'avatar', 'username', 'email', 'createdAt', 'updatedAt']);
    return res.status(200).json(userResponse);
};
exports.showUser = showUser;
// ------------------------------------------- // ------------------------------------------- //
