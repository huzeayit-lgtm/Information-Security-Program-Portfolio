"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.githubModule = void 0;
exports.githubModule = {
    name: 'github',
    async handle(req) {
        return { ok: true, result: { handled: 'github', action: req.action } };
    }
};
