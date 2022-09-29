"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const buffer_1 = require("buffer");
const uuid_1 = require("uuid");
const access_1 = require("@app/config/access");
const aws_1 = require("@app/config/aws");
const globalValidator_1 = require("@app/validators/globalValidator");
class StorageService {
    constructor(fileType) {
        this.s3 = {};
        this.path = '';
        this.fileType = 'image';
        this.image = {
            maxMB: 5 * 1024 ** 2,
            allowedMimes: ['image/jpeg', 'image/jpg', 'image/png', 'image/svg', 'image/gif'],
        };
        this.video = {
            maxMB: 35 * 1024 ** 2,
            allowedMimes: ['video/mp4', 'video/mkv'],
        };
        this.s3 = new aws_1.AWS.S3();
        this.fileType = fileType;
    }
    getParams(path, filename, buffer) {
        const blob = new buffer_1.Blob([buffer]);
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${path}/${(0, uuid_1.v4)()}-magic-note-${filename}`,
            Body: buffer,
            ContentType: blob.type,
            ACL: 'private',
        };
        return { params, blob };
    }
    async validation(file) {
        switch (this.fileType) {
            case 'image':
                return await (0, globalValidator_1.validate)(file, [
                    ({ size }) => ({
                        error: size > this.image.maxMB,
                        status: 422,
                        message: 'Image is large',
                    }),
                    ({ mimetype }) => ({
                        error: !this.image.allowedMimes.includes(mimetype),
                        status: 422,
                        message: 'Invalid file format',
                    }),
                ]);
            case 'video':
                return await (0, globalValidator_1.validate)(file, [
                    ({ size }) => ({
                        error: size > this.video.maxMB,
                        status: 422,
                        message: 'Video is large',
                    }),
                    ({ mimetype }) => ({
                        error: !this.video.allowedMimes.includes(mimetype),
                        status: 422,
                        message: 'Invalid file format',
                    }),
                ]);
            default:
                return {
                    error: false,
                    status: 200,
                    message: 'saved',
                };
        }
    }
    async upload(path, file) {
        const { params } = this.getParams(path, file.originalname, file.buffer);
        const { error, status, message } = await this.validation(file);
        if (error) {
            return {
                data: null,
                validation: { error, status, message },
            };
        }
        const uploadPromise = new Promise((resolve, reject) => {
            this.s3.upload(params, (err, data) => (err ? reject(err) : resolve(data)));
        });
        return {
            data: await uploadPromise,
            validation: { error, status, message },
        };
    }
    delete(src) {
        return new Promise((resolve, reject) => {
            this.s3.deleteObject({
                Bucket: access_1.uri.aws.bucket_name,
                Key: src,
            }, (err, data) => (err ? reject(err) : resolve(data)));
        });
    }
    fetchFile(src) {
        return new Promise((resolve, reject) => {
            this.s3.getObject({
                Bucket: access_1.uri.aws.bucket_name,
                Key: src,
            }, (err, data) => (err ? reject(err) : resolve(data)));
        });
    }
}
exports.StorageService = StorageService;
