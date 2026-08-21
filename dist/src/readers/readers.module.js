"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadersModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const prisma_module_1 = require("../prisma/prisma.module");
const readers_service_1 = require("./readers.service");
const readers_controller_1 = require("./readers.controller");
const reader_jwt_strategy_1 = require("./reader-jwt.strategy");
let ReadersModule = class ReadersModule {
};
exports.ReadersModule = ReadersModule;
exports.ReadersModule = ReadersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    secret: config.get('JWT_SECRET', 'changeme'),
                    signOptions: { expiresIn: '30d' },
                }),
            }),
        ],
        controllers: [readers_controller_1.ReadersController],
        providers: [readers_service_1.ReadersService, reader_jwt_strategy_1.ReaderJwtStrategy],
    })
], ReadersModule);
//# sourceMappingURL=readers.module.js.map