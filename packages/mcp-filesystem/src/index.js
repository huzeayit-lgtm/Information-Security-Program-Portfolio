"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filesystemModule = void 0;
exports.filesystemModule = {
    name: 'filesystem',
    async handle(req) {
        return { ok: true, result: { handled: 'filesystem', action: req.action } };
    }
};
