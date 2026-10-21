"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NFeError = void 0;
const core_1 = require("@brasil-fiscal/core");
class NFeError extends core_1.DFeError {
    constructor(message, cause) {
        super(message, cause);
        this.name = 'NFeError';
    }
}
exports.NFeError = NFeError;
