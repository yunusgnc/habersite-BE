import { NoticeType } from '@prisma/client';
export declare class NoticeAttachmentDto {
    url: string;
    name?: string;
}
export declare class CreateOfficialNoticeDto {
    title: string;
    slug?: string;
    noticeType?: NoticeType;
    institution: string;
    referenceNo?: string;
    summary?: string;
    content: string;
    attachments?: NoticeAttachmentDto[];
    publishedAt?: string;
    expiresAt?: string | null;
    active?: boolean;
}
