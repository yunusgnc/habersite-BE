export declare class CreateTenantDto {
    name: string;
    domain?: string;
    subdomain?: string;
    logo?: string;
    favicon?: string;
    theme?: string;
    plan?: string;
}
export declare class UpdateTenantDto {
    name?: string;
    domain?: string;
    subdomain?: string;
    logo?: string;
    favicon?: string;
    theme?: string;
    plan?: string;
    settings?: Record<string, any>;
    active?: boolean;
}
