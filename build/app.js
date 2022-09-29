"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApplication = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const access_1 = require("@app/config/access");
const routes_1 = require("@app/routes/routes");
const app = (0, express_1.default)();
function createDatabaseInitializer() {
    return {
        async initializeDatabase() {
            const connection = await mongoose_1.default.connect(access_1.uri.db_access);
            return connection;
        },
    };
}
function createGlobalInitializer() {
    return {
        initializeMiddlawares() {
            app.use(express_1.default.json());
            app.use(express_1.default.urlencoded({ extended: true }));
            app.use((0, cookie_parser_1.default)());
            app.use(routes_1.router);
        },
    };
}
function createApplication() {
    const { initializeDatabase } = createDatabaseInitializer();
    const { initializeMiddlawares } = createGlobalInitializer();
    const application = {
        async start() {
            try {
                await initializeDatabase();
                initializeMiddlawares();
                app.listen(access_1.uri.port);
            }
            catch (err) {
                console.error(err);
            }
        },
    };
    return application;
}
exports.createApplication = createApplication;
