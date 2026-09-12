import { SocialShareService } from './social-share.service';
declare class SinamaDto {
    ag: string;
}
export declare class SocialShareController {
    private readonly socialShare;
    constructor(socialShare: SocialShareService);
    sina(tenantId: string, dto: SinamaDto): Promise<import("./social-share.service").SinamaSonucu>;
}
export {};
