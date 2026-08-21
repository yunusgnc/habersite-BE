"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetsModule = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_module_1 = require("../prisma/prisma.module");
const storage_module_1 = require("../media/storage/storage.module");
const widgets_service_1 = require("./widgets.service");
const widgets_controller_1 = require("./widgets.controller");
const widget_feeder_service_1 = require("./widget-feeder.service");
let WidgetsModule = class WidgetsModule {
};
exports.WidgetsModule = WidgetsModule;
exports.WidgetsModule = WidgetsModule = __decorate([
    (0, common_1.Module)({
        imports: [schedule_1.ScheduleModule.forRoot(), prisma_module_1.PrismaModule, storage_module_1.StorageModule],
        controllers: [widgets_controller_1.WidgetsController],
        providers: [widgets_service_1.WidgetsService, widget_feeder_service_1.WidgetFeederService],
        exports: [widgets_service_1.WidgetsService, widget_feeder_service_1.WidgetFeederService],
    })
], WidgetsModule);
//# sourceMappingURL=widgets.module.js.map