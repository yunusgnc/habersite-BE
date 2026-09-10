export declare function normalizeTenantHost(value: string | null | undefined): string;
export declare function canonicalTenantDomain(value: string | null | undefined): string;
export declare function tenantDomainCandidates(value: string | null | undefined): string[];
export declare function tenantHostMatches(storedDomain: string | null | undefined, requestHost: string | null | undefined): boolean;
