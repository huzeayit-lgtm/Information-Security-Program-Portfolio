"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jiraModule = void 0;
exports.jiraModule = {
    name: 'jira',
    async handle(req) {
        return { ok: true, result: { handled: 'jira', action: req.action } };
    }
};
