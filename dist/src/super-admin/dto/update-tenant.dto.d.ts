export declare class UpdateTenantDto {
    name?: string;
    slug?: string;
    domain?: string | null;
    subdomain?: string | null;
    logo?: string | null;
    favicon?: string | null;
    theme?: string;
    plan?: string;
    active?: boolean;
}
export declare class ResetAdminPasswordDto {
    userId?: string;
    password: string;
}
