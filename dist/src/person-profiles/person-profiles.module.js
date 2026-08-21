"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonProfilesModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const person_profiles_controller_1 = require("./person-profiles.controller");
const person_profiles_service_1 = require("./person-profiles.service");
let PersonProfilesModule = class PersonProfilesModule {
};
exports.PersonProfilesModule = PersonProfilesModule;
exports.PersonProfilesModule = PersonProfilesModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [person_profiles_controller_1.PersonProfilesController],
        providers: [person_profiles_service_1.PersonProfilesService],
        exports: [person_profiles_service_1.PersonProfilesService],
    })
], PersonProfilesModule);
//# sourceMappingURL=person-profiles.module.js.map