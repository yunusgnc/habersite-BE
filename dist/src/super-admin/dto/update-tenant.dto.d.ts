export declare class UpdateTenantDto {
    name?: string;
    slug?: string;
    domain?: string | null;
    subdomain?: string | null;
    logo?: string | null;
    favicon?: string | null;
    mediaBaseUrl?: string | null;
    theme?: string;
    plan?: string;
    locale?: string;
    timezone?: string;
    active?: boolean;
}
export declare class ResetAdminPasswordDto {
    userId?: string;
    password: string;
}
