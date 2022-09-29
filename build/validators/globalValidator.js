"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
async function validate(data, cbs) {
    const results = [];
    for (let cb of cbs) {
        const result = await cb(data);
        results.push(result);
    }
    return results.find(item => item.error) || {};
}
exports.validate = validate;
