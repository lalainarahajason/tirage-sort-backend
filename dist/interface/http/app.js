"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const errorHandler_1 = require("./middlewares/errorHandler");
// Routes
const auth_routes_1 = require("./routes/auth.routes");
const draws_routes_1 = require("./routes/draws.routes");
const participants_routes_1 = require("./routes/participants.routes");
const prizes_routes_1 = require("./routes/prizes.routes");
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
// Routes
app.use('/api/auth', auth_routes_1.authRouter);
app.use('/api', draws_routes_1.drawsRouter);
app.use('/api', participants_routes_1.participantsRouter);
app.use('/api', prizes_routes_1.prizesRouter);
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./swagger");
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
// Error Handler
app.use(errorHandler_1.errorHandler);
exports.default = app;
