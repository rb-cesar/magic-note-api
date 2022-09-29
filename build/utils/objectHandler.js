"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldReturnOnly = void 0;
function shouldReturnOnly(data, keys) {
    const ref = {
        original: data,
        current: {},
    };
    keys.forEach(key => {
        const value = ref.original[key] || null;
        ref.current[key] = value;
    });
    return ref.current;
}
exports.shouldReturnOnly = shouldReturnOnly;
