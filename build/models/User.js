"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const uuid_1 = require("uuid");
const schema = new mongoose_1.default.Schema({
    id: { type: String, unique: true, default: (0, uuid_1.v4)() },
    avatar: { type: String },
    username: { type: String, unique: true, required: true, maxlength: 90 },
    email: { type: String, unique: true, required: true, maxlength: 90 },
    password: { type: String, unique: true, required: true, maxlength: 255 },
}, { timestamps: true });
exports.User = mongoose_1.default.model('User', schema);
