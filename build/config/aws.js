"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AWS = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
exports.AWS = aws_sdk_1.default;
const access_1 = require("./access");
aws_sdk_1.default.config.update({
    accessKeyId: access_1.uri.aws.access_key_id,
    secretAccessKey: access_1.uri.aws.secret_access_key,
    region: access_1.uri.aws.default_region,
});
