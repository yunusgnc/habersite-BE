export declare enum NewsletterCampaignStatus {
    DRAFT = "DRAFT",
    SCHEDULED = "SCHEDULED",
    SENDING = "SENDING",
    SENT = "SENT",
    FAILED = "FAILED"
}
export declare class CreateCampaignDto {
    subject: string;
    preheader?: string;
    htmlBody: string;
    textBody?: string;
    status?: NewsletterCampaignStatus;
    scheduledAt?: string;
}
export declare class UpdateCampaignDto {
    subject?: string;
    preheader?: string;
    htmlBody?: string;
    textBody?: string;
    status?: NewsletterCampaignStatus;
    scheduledAt?: string | null;
}
export declare class ListCampaignsQuery {
    page?: number;
    perPage?: number;
    status?: NewsletterCampaignStatus;
}
