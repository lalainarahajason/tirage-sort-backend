"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JwtService {
    constructor() {
        this.secret = process.env.JWT_SECRET || 'default-secret-do-not-use-in-prod';
        this.expiresIn = '1d';
    }
    generateToken(user) {
        return jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, this.secret, { expiresIn: this.expiresIn });
    }
    verifyToken(token) {
        return jsonwebtoken_1.default.verify(token, this.secret);
    }
}
exports.JwtService = JwtService;
