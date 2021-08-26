"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function messageParser(message) {
    const data = JSON.parse(message);
    return data;
}
exports.default = messageParser;
