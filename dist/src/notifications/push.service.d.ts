interface PushPayload {
    title: string;
    body: string;
    url?: string;
    imageUrl?: string;
}
export declare class PushService {
    private readonly logger;
    sendToAll(credentials: {
        appId: string;
        apiKey: string;
    }, payload: PushPayload): Promise<{
        ok: boolean;
        error?: string;
    }>;
}
export {};
