import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WidgetsService } from './widgets.service';
export declare class WidgetFeederService implements OnModuleInit {
    private readonly prisma;
    private readonly widgets;
    private readonly logger;
    private readonly feeders;
    constructor(prisma: PrismaService, widgets: WidgetsService);
    onModuleInit(): Promise<void>;
    private ensureCoreWidgets;
    refreshFast(): Promise<void>;
    refreshPrayer(): Promise<void>;
    refreshHoroscope(): Promise<void>;
    refreshNewspapers(): Promise<void>;
    refreshPharmacy(): Promise<void>;
    refreshAll(): Promise<void>;
    refreshOne(tenantId: string, type: string): Promise<{
        ok: boolean;
        cachedAt: Date;
    }>;
    private refreshForTypes;
    private fetchWeather;
    private fetchPrayerTimes;
    private fetchMarketTicker;
    private fetchHoroscope;
    private pickHoroscopeFallback;
    private fetchNewspapers;
    private fetchPharmacy;
}
