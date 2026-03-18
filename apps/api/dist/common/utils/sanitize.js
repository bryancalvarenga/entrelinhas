"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeText = sanitizeText;
exports.sanitizeUrl = sanitizeUrl;
function sanitizeText(input) {
    return input
        .replace(/<[^>]*>/g, '')
        .replace(/\0/g, '')
        .trim();
}
function sanitizeUrl(input) {
    if (!input)
        return null;
    const trimmed = input.trim();
    return /^https?:\/\//i.test(trimmed) ? trimmed : null;
}
//# sourceMappingURL=sanitize.js.map