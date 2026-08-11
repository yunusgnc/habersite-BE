import { MessageStatus } from '@prisma/client';
export declare class UpdateMessageStatusDto {
    status: MessageStatus;
    adminNote?: string;
}
