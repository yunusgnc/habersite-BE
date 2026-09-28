import { NoticeType } from '@prisma/client';
export type KaynakHaber = {
    id: string;
    title: string;
    slug: string;
    spot?: string | null;
    seoDesc?: string | null;
    content?: unknown;
    featuredImage?: string | null;
    publishedAt?: Date | string | null;
    createdAt?: Date | string | null;
};
export type IlanKaydi = {
    title: string;
    slug: string;
    noticeType: NoticeType;
    institution: string;
    summary: string | null;
    content: string;
    attachments: {
        url: string;
        name: string;
    }[];
    publishedAt: Date;
    expiresAt: Date | null;
};
export declare const KURUM_BILINMIYOR = "Di\u011Fer Kurumlar";
export declare function kurumBul(baslik: string): string;
export declare function ilanTuruBul(baslik: string): NoticeType;
export declare function ilanSlugu(haber: KaynakHaber): string;
export declare function habereGoreIlan(haber: KaynakHaber, gecerlilikGun?: number): IlanKaydi;
