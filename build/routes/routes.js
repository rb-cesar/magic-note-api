"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const authenticationMiddleware_1 = require("@app/middlewares/authenticationMiddleware");
const accountController = __importStar(require("@app/controllers/accountController"));
const noteRoutes_1 = require("./noteRoutes");
const router = (0, express_1.Router)();
exports.router = router;
// ------------------------------------------- // ------------------------------------------- //
router.post('/account/sign-on', accountController.signOn);
router.post('/account/sign-in', accountController.signIn);
router.put('/account/:userId', authenticationMiddleware_1.autheticationMiddleware, accountController.updateUser);
router.get('/account/session/:sessionId', accountController.refreshToken);
router.get('/account/show/:userId', authenticationMiddleware_1.autheticationMiddleware, accountController.showUser);
// ------------------------------------------- // ------------------------------------------- //
router.use(authenticationMiddleware_1.autheticationMiddleware, noteRoutes_1.noteRouter);
