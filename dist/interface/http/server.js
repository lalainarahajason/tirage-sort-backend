"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const logger_1 = require("../../shared/utils/logger");
const PORT = process.env.PORT || 3000;
// For local development
if (process.env.NODE_ENV !== 'production') {
    app_1.default.listen(PORT, () => {
        logger_1.logger.info(`Server is running on port ${PORT}`);
    });
}
// Export for Vercel
exports.default = app_1.default;
