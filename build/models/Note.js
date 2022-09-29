"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteGroup = exports.Note = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const uuid_1 = require("uuid");
const noteSchema = new mongoose_1.default.Schema({
    id: { type: String, unique: true, default: (0, uuid_1.v4)() },
    groupId: { type: String, required: true },
    creatorId: { type: String, required: true },
    type: { type: String },
    imageUrl: { type: String },
    description: { type: String, required: true },
    checked: { type: Boolean },
}, { timestamps: true });
const noteGroupSchema = new mongoose_1.default.Schema({
    id: { type: String, unique: true, default: (0, uuid_1.v4)() },
    creatorId: { type: String, required: true },
    name: { type: String, required: true, maxlength: 90 },
}, { timestamps: true });
exports.Note = mongoose_1.default.model('Note', noteSchema);
exports.NoteGroup = mongoose_1.default.model('NoteGroup', noteGroupSchema);
