"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slackModule = void 0;
exports.slackModule = {
    name: 'slack',
    async handle(req) {
        return { ok: true, result: { handled: 'slack', action: req.action } };
    }
};
