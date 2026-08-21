export declare class CreateAuthorDto {
    name: string;
    bio?: string;
    avatar?: string;
    email?: string;
    social?: Record<string, string>;
    active?: boolean;
    sortOrder?: number;
}
