export declare class CreateTenantDto {
    name: string;
    slug: string;
    domain?: string;
    subdomain?: string;
    logo?: string;
    plan?: string;
    city?: string;
    primaryColor?: string;
    adminName: string;
    adminEmail: string;
    adminUsername?: string;
    adminPassword: string;
    bootstrapDefaults?: boolean;
}
