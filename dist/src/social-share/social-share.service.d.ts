import { SettingsService } from '../settings/settings.service';
type PaylasilacakHaber = {
    id: string;
    title: string;
    slug: string;
    type?: string | null;
    featuredImage?: string | null;
};
export declare class SocialShareService {
    private readonly settings;
    private readonly logger;
    constructor(settings: SettingsService);
    paylas(tenantId: string, haber: PaylasilacakHaber): Promise<void>;
    private telegram;
    private facebook;
    private instagram;
}
export {};
