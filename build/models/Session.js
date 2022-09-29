"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const uuid_1 = require("uuid");
const schema = new mongoose_1.default.Schema({
    id: { type: String, unique: true, default: (0, uuid_1.v4)() },
    userId: { type: String, required: true },
    refreshToken: { type: String, required: true },
});
exports.Session = mongoose_1.default.model('Session', schema);
