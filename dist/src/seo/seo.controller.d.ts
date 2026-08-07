import type { Response } from 'express';
import { SeoService } from './seo.service';
export declare class SeoController {
    private readonly seo;
    constructor(seo: SeoService);
    sitemap(tenantId: string, res: Response): Promise<void>;
    rss(tenantId: string, res: Response): Promise<void>;
}
