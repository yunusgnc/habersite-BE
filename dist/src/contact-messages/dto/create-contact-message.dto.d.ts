import { MessageType } from '@prisma/client';
export declare class CreateContactMessageDto {
    type?: MessageType;
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
    targetUrl?: string;
    district?: string;
    attachments?: string[];
}
