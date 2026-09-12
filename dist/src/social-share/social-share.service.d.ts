import { SettingsService } from '../settings/settings.service';
type PaylasilacakHaber = {
    id: string;
    title: string;
    slug: string;
    type?: string | null;
    featuredImage?: string | null;
    shareTargets?: unknown;
};
export type SinamaSonucu = {
    tamam: boolean;
    mesaj: string;
};
export declare class SocialShareService {
    private readonly settings;
    private readonly logger;
    constructor(settings: SettingsService);
    paylas(tenantId: string, haber: PaylasilacakHaber): Promise<void>;
    baglantiyiSina(tenantId: string, ag: string): Promise<SinamaSonucu>;
    private telegramiSina;
    private facebooguSina;
    private instagramiSina;
    private xiSina;
    private gorselAdresi;
    private gorselMi;
    private telegram;
    private facebook;
    private instagram;
    private twitter;
    private twitterToken;
}
export {};
