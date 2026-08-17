import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { StorageAdapter } from '../media/storage/storage.types';
import { WidgetsService } from './widgets.service';
export declare class WidgetFeederService implements OnModuleInit {
    private readonly prisma;
    private readonly widgets;
    private readonly storage;
    private readonly logger;
    private readonly feeders;
    constructor(prisma: PrismaService, widgets: WidgetsService, storage: StorageAdapter);
    onModuleInit(): Promise<void>;
    private ensureCoreWidgets;
    refreshFast(): Promise<void>;
    refreshPrayer(): Promise<void>;
    refreshHoroscope(): Promise<void>;
    refreshNewspapers(): Promise<void>;
    refreshPharmacy(): Promise<void>;
    refreshStandings(): Promise<void>;
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
    private mirrorNewspaperCovers;
    private fetchNewspapers;
    private fetchStandings;
    private wikipediaPuanDurumu;
    private tffFikstur;
    private fetchPharmacy;
}
