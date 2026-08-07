export declare class AuthResponseDto {
    accessToken: string;
    tenantId: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
        avatar: string | null;
    };
}
