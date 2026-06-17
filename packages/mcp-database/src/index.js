"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseModule = void 0;
exports.databaseModule = {
    name: 'database',
    async handle(req) {
        return { ok: true, result: { handled: 'database', action: req.action } };
    }
};
