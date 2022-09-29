"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroup = exports.createGroup = exports.deleteNote = exports.createNote = void 0;
const uuid_1 = require("uuid");
const Note_1 = require("@app/models/Note");
const StorageService_1 = require("@app/services/StorageService");
const objectHandler_1 = require("@app/utils/objectHandler");
const globalValidator_1 = require("@app/validators/globalValidator");
const createNote = async (req, res) => {
    const { groupId, description, type, checked } = req.body || {};
    const { file } = req;
    const { error, status, message } = await (0, globalValidator_1.validate)(null, [
        () => ({
            error: !groupId,
            status: 422,
            message: 'groupId is required',
        }),
        () => ({
            error: !description,
            status: 422,
            message: 'description is required',
        }),
        () => ({
            error: !type,
            status: 422,
            message: 'type is required',
        }),
    ]);
    if (error) {
        return res.status(status).json({ error, status, message });
    }
    const image = {
        current: '',
    };
    if (file) {
        const storage = new StorageService_1.StorageService('image');
        const { validation, data } = await storage.upload('images', file);
        const { error, status, message } = validation;
        if (error) {
            return res.status(status).json({ error, status, message });
        }
        image.current = data?.Key;
    }
    const { userId } = req.cookies;
    try {
        const createdNote = await Note_1.Note.create({
            id: (0, uuid_1.v4)(),
            creatorId: userId,
            type,
            groupId,
            description,
            imageUrl: image.current || undefined,
            checked,
        });
        const dataNote = (0, objectHandler_1.shouldReturnOnly)(createdNote, [
            'id',
            'creatorId',
            'groupId',
            'imageUrl',
            'description',
            'type',
            'createdAt',
            'updatedAt',
        ]);
        return res.status(201).json(dataNote);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: true, status: 500, message: 'internal server error' });
    }
};
exports.createNote = createNote;
const deleteNote = async (req, res) => {
    const { noteId } = req.params;
    const note = (await Note_1.Note.findOne({ id: noteId }));
    const storage = new StorageService_1.StorageService('image');
    if (note?.imageUrl) {
        await storage.delete(note.imageUrl);
    }
    await note?.delete();
    return res.status(204).send();
};
exports.deleteNote = deleteNote;
const createGroup = async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(422).json({ error: true, status: 422, message: 'name is required' });
    }
    try {
        const group = await Note_1.NoteGroup.create({ name, creatorId: req.cookies.userId });
        const dataGroup = (0, objectHandler_1.shouldReturnOnly)(group, ['id', 'creatorId', 'name', 'createdAt', 'updatedAt']);
        return res.status(201).json(dataGroup);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: true, status: 500, message: 'internal server error' });
    }
};
exports.createGroup = createGroup;
const getGroup = async (req, res) => {
    const { groupId } = req.params;
    if (!groupId) {
        const { userId } = req.cookies;
        const groups = await Note_1.NoteGroup.find({ creatorId: userId });
        const notes = await Note_1.Note.find({ creatorId: userId });
        const data = groups.map(group => {
            const findedNotes = notes.filter(note => note.groupId === group.id);
            const dataGroup = (0, objectHandler_1.shouldReturnOnly)(group, ['id', 'name', 'creatorId', 'createdAt', 'updatedAt']);
            const dataNotes = findedNotes.map(n => {
                return (0, objectHandler_1.shouldReturnOnly)(n, ['id', 'groupId', 'creatorId', 'imageUrl', 'description', 'createdAt', 'updatedAt']);
            });
            return {
                ...dataGroup,
                notes: dataNotes,
            };
        });
        return res.status(200).json(data);
    }
    const group = (await Note_1.NoteGroup.findOne({ id: groupId }));
    const notes = (await Note_1.Note.find({ groupId }));
    const dataGroup = (0, objectHandler_1.shouldReturnOnly)(group, ['id', 'name', 'creatorId', 'createdAt', 'updatedAt']);
    const dataNotes = notes.map(n => {
        return (0, objectHandler_1.shouldReturnOnly)(n, ['id', 'groupId', 'creatorId', 'imageUrl', 'description', 'createdAt', 'updatedAt']);
    });
    return res.status(200).json({ ...dataGroup, notes: dataNotes });
};
exports.getGroup = getGroup;
