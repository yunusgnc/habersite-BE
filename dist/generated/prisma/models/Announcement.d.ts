import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type AnnouncementModel = runtime.Types.Result.DefaultSelection<Prisma.$AnnouncementPayload>;
export type AggregateAnnouncement = {
    _count: AnnouncementCountAggregateOutputType | null;
    _min: AnnouncementMinAggregateOutputType | null;
    _max: AnnouncementMaxAggregateOutputType | null;
};
export type AnnouncementMinAggregateOutputType = {
    id: string | null;
    tenantId: string | null;
    title: string | null;
    content: string | null;
    type: string | null;
    active: boolean | null;
    pinned: boolean | null;
    expiresAt: Date | null;
    createdAt: Date | null;
};
export type AnnouncementMaxAggregateOutputType = {
    id: string | null;
    tenantId: string | null;
    title: string | null;
    content: string | null;
    type: string | null;
    active: boolean | null;
    pinned: boolean | null;
    expiresAt: Date | null;
    createdAt: Date | null;
};
export type AnnouncementCountAggregateOutputType = {
    id: number;
    tenantId: number;
    title: number;
    content: number;
    type: number;
    active: number;
    pinned: number;
    expiresAt: number;
    createdAt: number;
    _all: number;
};
export type AnnouncementMinAggregateInputType = {
    id?: true;
    tenantId?: true;
    title?: true;
    content?: true;
    type?: true;
    active?: true;
    pinned?: true;
    expiresAt?: true;
    createdAt?: true;
};
export type AnnouncementMaxAggregateInputType = {
    id?: true;
    tenantId?: true;
    title?: true;
    content?: true;
    type?: true;
    active?: true;
    pinned?: true;
    expiresAt?: true;
    createdAt?: true;
};
export type AnnouncementCountAggregateInputType = {
    id?: true;
    tenantId?: true;
    title?: true;
    content?: true;
    type?: true;
    active?: true;
    pinned?: true;
    expiresAt?: true;
    createdAt?: true;
    _all?: true;
};
export type AnnouncementAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AnnouncementWhereInput;
    orderBy?: Prisma.AnnouncementOrderByWithRelationInput | Prisma.AnnouncementOrderByWithRelationInput[];
    cursor?: Prisma.AnnouncementWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | AnnouncementCountAggregateInputType;
    _min?: AnnouncementMinAggregateInputType;
    _max?: AnnouncementMaxAggregateInputType;
};
export type GetAnnouncementAggregateType<T extends AnnouncementAggregateArgs> = {
    [P in keyof T & keyof AggregateAnnouncement]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateAnnouncement[P]> : Prisma.GetScalarType<T[P], AggregateAnnouncement[P]>;
};
export type AnnouncementGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AnnouncementWhereInput;
    orderBy?: Prisma.AnnouncementOrderByWithAggregationInput | Prisma.AnnouncementOrderByWithAggregationInput[];
    by: Prisma.AnnouncementScalarFieldEnum[] | Prisma.AnnouncementScalarFieldEnum;
    having?: Prisma.AnnouncementScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: AnnouncementCountAggregateInputType | true;
    _min?: AnnouncementMinAggregateInputType;
    _max?: AnnouncementMaxAggregateInputType;
};
export type AnnouncementGroupByOutputType = {
    id: string;
    tenantId: string;
    title: string;
    content: string | null;
    type: string;
    active: boolean;
    pinned: boolean;
    expiresAt: Date | null;
    createdAt: Date;
    _count: AnnouncementCountAggregateOutputType | null;
    _min: AnnouncementMinAggregateOutputType | null;
    _max: AnnouncementMaxAggregateOutputType | null;
};
export type GetAnnouncementGroupByPayload<T extends AnnouncementGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<AnnouncementGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof AnnouncementGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], AnnouncementGroupByOutputType[P]> : Prisma.GetScalarType<T[P], AnnouncementGroupByOutputType[P]>;
}>>;
export type AnnouncementWhereInput = {
    AND?: Prisma.AnnouncementWhereInput | Prisma.AnnouncementWhereInput[];
    OR?: Prisma.AnnouncementWhereInput[];
    NOT?: Prisma.AnnouncementWhereInput | Prisma.AnnouncementWhereInput[];
    id?: Prisma.StringFilter<"Announcement"> | string;
    tenantId?: Prisma.StringFilter<"Announcement"> | string;
    title?: Prisma.StringFilter<"Announcement"> | string;
    content?: Prisma.StringNullableFilter<"Announcement"> | string | null;
    type?: Prisma.StringFilter<"Announcement"> | string;
    active?: Prisma.BoolFilter<"Announcement"> | boolean;
    pinned?: Prisma.BoolFilter<"Announcement"> | boolean;
    expiresAt?: Prisma.DateTimeNullableFilter<"Announcement"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"Announcement"> | Date | string;
    tenant?: Prisma.XOR<Prisma.TenantScalarRelationFilter, Prisma.TenantWhereInput>;
};
export type AnnouncementOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    content?: Prisma.SortOrderInput | Prisma.SortOrder;
    type?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    pinned?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    tenant?: Prisma.TenantOrderByWithRelationInput;
};
export type AnnouncementWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.AnnouncementWhereInput | Prisma.AnnouncementWhereInput[];
    OR?: Prisma.AnnouncementWhereInput[];
    NOT?: Prisma.AnnouncementWhereInput | Prisma.AnnouncementWhereInput[];
    tenantId?: Prisma.StringFilter<"Announcement"> | string;
    title?: Prisma.StringFilter<"Announcement"> | string;
    content?: Prisma.StringNullableFilter<"Announcement"> | string | null;
    type?: Prisma.StringFilter<"Announcement"> | string;
    active?: Prisma.BoolFilter<"Announcement"> | boolean;
    pinned?: Prisma.BoolFilter<"Announcement"> | boolean;
    expiresAt?: Prisma.DateTimeNullableFilter<"Announcement"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"Announcement"> | Date | string;
    tenant?: Prisma.XOR<Prisma.TenantScalarRelationFilter, Prisma.TenantWhereInput>;
}, "id">;
export type AnnouncementOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    content?: Prisma.SortOrderInput | Prisma.SortOrder;
    type?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    pinned?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.AnnouncementCountOrderByAggregateInput;
    _max?: Prisma.AnnouncementMaxOrderByAggregateInput;
    _min?: Prisma.AnnouncementMinOrderByAggregateInput;
};
export type AnnouncementScalarWhereWithAggregatesInput = {
    AND?: Prisma.AnnouncementScalarWhereWithAggregatesInput | Prisma.AnnouncementScalarWhereWithAggregatesInput[];
    OR?: Prisma.AnnouncementScalarWhereWithAggregatesInput[];
    NOT?: Prisma.AnnouncementScalarWhereWithAggregatesInput | Prisma.AnnouncementScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Announcement"> | string;
    tenantId?: Prisma.StringWithAggregatesFilter<"Announcement"> | string;
    title?: Prisma.StringWithAggregatesFilter<"Announcement"> | string;
    content?: Prisma.StringNullableWithAggregatesFilter<"Announcement"> | string | null;
    type?: Prisma.StringWithAggregatesFilter<"Announcement"> | string;
    active?: Prisma.BoolWithAggregatesFilter<"Announcement"> | boolean;
    pinned?: Prisma.BoolWithAggregatesFilter<"Announcement"> | boolean;
    expiresAt?: Prisma.DateTimeNullableWithAggregatesFilter<"Announcement"> | Date | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Announcement"> | Date | string;
};
export type AnnouncementCreateInput = {
    id?: string;
    title: string;
    content?: string | null;
    type?: string;
    active?: boolean;
    pinned?: boolean;
    expiresAt?: Date | string | null;
    createdAt?: Date | string;
    tenant: Prisma.TenantCreateNestedOneWithoutAnnouncementsInput;
};
export type AnnouncementUncheckedCreateInput = {
    id?: string;
    tenantId: string;
    title: string;
    content?: string | null;
    type?: string;
    active?: boolean;
    pinned?: boolean;
    expiresAt?: Date | string | null;
    createdAt?: Date | string;
};
export type AnnouncementUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    pinned?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tenant?: Prisma.TenantUpdateOneRequiredWithoutAnnouncementsNestedInput;
};
export type AnnouncementUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    pinned?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AnnouncementCreateManyInput = {
    id?: string;
    tenantId: string;
    title: string;
    content?: string | null;
    type?: string;
    active?: boolean;
    pinned?: boolean;
    expiresAt?: Date | string | null;
    createdAt?: Date | string;
};
export type AnnouncementUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    pinned?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AnnouncementUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    pinned?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AnnouncementListRelationFilter = {
    every?: Prisma.AnnouncementWhereInput;
    some?: Prisma.AnnouncementWhereInput;
    none?: Prisma.AnnouncementWhereInput;
};
export type AnnouncementOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type AnnouncementCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    pinned?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type AnnouncementMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    pinned?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type AnnouncementMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    pinned?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type AnnouncementCreateNestedManyWithoutTenantInput = {
    create?: Prisma.XOR<Prisma.AnnouncementCreateWithoutTenantInput, Prisma.AnnouncementUncheckedCreateWithoutTenantInput> | Prisma.AnnouncementCreateWithoutTenantInput[] | Prisma.AnnouncementUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.AnnouncementCreateOrConnectWithoutTenantInput | Prisma.AnnouncementCreateOrConnectWithoutTenantInput[];
    createMany?: Prisma.AnnouncementCreateManyTenantInputEnvelope;
    connect?: Prisma.AnnouncementWhereUniqueInput | Prisma.AnnouncementWhereUniqueInput[];
};
export type AnnouncementUncheckedCreateNestedManyWithoutTenantInput = {
    create?: Prisma.XOR<Prisma.AnnouncementCreateWithoutTenantInput, Prisma.AnnouncementUncheckedCreateWithoutTenantInput> | Prisma.AnnouncementCreateWithoutTenantInput[] | Prisma.AnnouncementUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.AnnouncementCreateOrConnectWithoutTenantInput | Prisma.AnnouncementCreateOrConnectWithoutTenantInput[];
    createMany?: Prisma.AnnouncementCreateManyTenantInputEnvelope;
    connect?: Prisma.AnnouncementWhereUniqueInput | Prisma.AnnouncementWhereUniqueInput[];
};
export type AnnouncementUpdateManyWithoutTenantNestedInput = {
    create?: Prisma.XOR<Prisma.AnnouncementCreateWithoutTenantInput, Prisma.AnnouncementUncheckedCreateWithoutTenantInput> | Prisma.AnnouncementCreateWithoutTenantInput[] | Prisma.AnnouncementUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.AnnouncementCreateOrConnectWithoutTenantInput | Prisma.AnnouncementCreateOrConnectWithoutTenantInput[];
    upsert?: Prisma.AnnouncementUpsertWithWhereUniqueWithoutTenantInput | Prisma.AnnouncementUpsertWithWhereUniqueWithoutTenantInput[];
    createMany?: Prisma.AnnouncementCreateManyTenantInputEnvelope;
    set?: Prisma.AnnouncementWhereUniqueInput | Prisma.AnnouncementWhereUniqueInput[];
    disconnect?: Prisma.AnnouncementWhereUniqueInput | Prisma.AnnouncementWhereUniqueInput[];
    delete?: Prisma.AnnouncementWhereUniqueInput | Prisma.AnnouncementWhereUniqueInput[];
    connect?: Prisma.AnnouncementWhereUniqueInput | Prisma.AnnouncementWhereUniqueInput[];
    update?: Prisma.AnnouncementUpdateWithWhereUniqueWithoutTenantInput | Prisma.AnnouncementUpdateWithWhereUniqueWithoutTenantInput[];
    updateMany?: Prisma.AnnouncementUpdateManyWithWhereWithoutTenantInput | Prisma.AnnouncementUpdateManyWithWhereWithoutTenantInput[];
    deleteMany?: Prisma.AnnouncementScalarWhereInput | Prisma.AnnouncementScalarWhereInput[];
};
export type AnnouncementUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: Prisma.XOR<Prisma.AnnouncementCreateWithoutTenantInput, Prisma.AnnouncementUncheckedCreateWithoutTenantInput> | Prisma.AnnouncementCreateWithoutTenantInput[] | Prisma.AnnouncementUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.AnnouncementCreateOrConnectWithoutTenantInput | Prisma.AnnouncementCreateOrConnectWithoutTenantInput[];
    upsert?: Prisma.AnnouncementUpsertWithWhereUniqueWithoutTenantInput | Prisma.AnnouncementUpsertWithWhereUniqueWithoutTenantInput[];
    createMany?: Prisma.AnnouncementCreateManyTenantInputEnvelope;
    set?: Prisma.AnnouncementWhereUniqueInput | Prisma.AnnouncementWhereUniqueInput[];
    disconnect?: Prisma.AnnouncementWhereUniqueInput | Prisma.AnnouncementWhereUniqueInput[];
    delete?: Prisma.AnnouncementWhereUniqueInput | Prisma.AnnouncementWhereUniqueInput[];
    connect?: Prisma.AnnouncementWhereUniqueInput | Prisma.AnnouncementWhereUniqueInput[];
    update?: Prisma.AnnouncementUpdateWithWhereUniqueWithoutTenantInput | Prisma.AnnouncementUpdateWithWhereUniqueWithoutTenantInput[];
    updateMany?: Prisma.AnnouncementUpdateManyWithWhereWithoutTenantInput | Prisma.AnnouncementUpdateManyWithWhereWithoutTenantInput[];
    deleteMany?: Prisma.AnnouncementScalarWhereInput | Prisma.AnnouncementScalarWhereInput[];
};
export type AnnouncementCreateWithoutTenantInput = {
    id?: string;
    title: string;
    content?: string | null;
    type?: string;
    active?: boolean;
    pinned?: boolean;
    expiresAt?: Date | string | null;
    createdAt?: Date | string;
};
export type AnnouncementUncheckedCreateWithoutTenantInput = {
    id?: string;
    title: string;
    content?: string | null;
    type?: string;
    active?: boolean;
    pinned?: boolean;
    expiresAt?: Date | string | null;
    createdAt?: Date | string;
};
export type AnnouncementCreateOrConnectWithoutTenantInput = {
    where: Prisma.AnnouncementWhereUniqueInput;
    create: Prisma.XOR<Prisma.AnnouncementCreateWithoutTenantInput, Prisma.AnnouncementUncheckedCreateWithoutTenantInput>;
};
export type AnnouncementCreateManyTenantInputEnvelope = {
    data: Prisma.AnnouncementCreateManyTenantInput | Prisma.AnnouncementCreateManyTenantInput[];
    skipDuplicates?: boolean;
};
export type AnnouncementUpsertWithWhereUniqueWithoutTenantInput = {
    where: Prisma.AnnouncementWhereUniqueInput;
    update: Prisma.XOR<Prisma.AnnouncementUpdateWithoutTenantInput, Prisma.AnnouncementUncheckedUpdateWithoutTenantInput>;
    create: Prisma.XOR<Prisma.AnnouncementCreateWithoutTenantInput, Prisma.AnnouncementUncheckedCreateWithoutTenantInput>;
};
export type AnnouncementUpdateWithWhereUniqueWithoutTenantInput = {
    where: Prisma.AnnouncementWhereUniqueInput;
    data: Prisma.XOR<Prisma.AnnouncementUpdateWithoutTenantInput, Prisma.AnnouncementUncheckedUpdateWithoutTenantInput>;
};
export type AnnouncementUpdateManyWithWhereWithoutTenantInput = {
    where: Prisma.AnnouncementScalarWhereInput;
    data: Prisma.XOR<Prisma.AnnouncementUpdateManyMutationInput, Prisma.AnnouncementUncheckedUpdateManyWithoutTenantInput>;
};
export type AnnouncementScalarWhereInput = {
    AND?: Prisma.AnnouncementScalarWhereInput | Prisma.AnnouncementScalarWhereInput[];
    OR?: Prisma.AnnouncementScalarWhereInput[];
    NOT?: Prisma.AnnouncementScalarWhereInput | Prisma.AnnouncementScalarWhereInput[];
    id?: Prisma.StringFilter<"Announcement"> | string;
    tenantId?: Prisma.StringFilter<"Announcement"> | string;
    title?: Prisma.StringFilter<"Announcement"> | string;
    content?: Prisma.StringNullableFilter<"Announcement"> | string | null;
    type?: Prisma.StringFilter<"Announcement"> | string;
    active?: Prisma.BoolFilter<"Announcement"> | boolean;
    pinned?: Prisma.BoolFilter<"Announcement"> | boolean;
    expiresAt?: Prisma.DateTimeNullableFilter<"Announcement"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"Announcement"> | Date | string;
};
export type AnnouncementCreateManyTenantInput = {
    id?: string;
    title: string;
    content?: string | null;
    type?: string;
    active?: boolean;
    pinned?: boolean;
    expiresAt?: Date | string | null;
    createdAt?: Date | string;
};
export type AnnouncementUpdateWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    pinned?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AnnouncementUncheckedUpdateWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    pinned?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AnnouncementUncheckedUpdateManyWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    pinned?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AnnouncementSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    title?: boolean;
    content?: boolean;
    type?: boolean;
    active?: boolean;
    pinned?: boolean;
    expiresAt?: boolean;
    createdAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["announcement"]>;
export type AnnouncementSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    title?: boolean;
    content?: boolean;
    type?: boolean;
    active?: boolean;
    pinned?: boolean;
    expiresAt?: boolean;
    createdAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["announcement"]>;
export type AnnouncementSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    title?: boolean;
    content?: boolean;
    type?: boolean;
    active?: boolean;
    pinned?: boolean;
    expiresAt?: boolean;
    createdAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["announcement"]>;
export type AnnouncementSelectScalar = {
    id?: boolean;
    tenantId?: boolean;
    title?: boolean;
    content?: boolean;
    type?: boolean;
    active?: boolean;
    pinned?: boolean;
    expiresAt?: boolean;
    createdAt?: boolean;
};
export type AnnouncementOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "tenantId" | "title" | "content" | "type" | "active" | "pinned" | "expiresAt" | "createdAt", ExtArgs["result"]["announcement"]>;
export type AnnouncementInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
};
export type AnnouncementIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
};
export type AnnouncementIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
};
export type $AnnouncementPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Announcement";
    objects: {
        tenant: Prisma.$TenantPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        tenantId: string;
        title: string;
        content: string | null;
        type: string;
        active: boolean;
        pinned: boolean;
        expiresAt: Date | null;
        createdAt: Date;
    }, ExtArgs["result"]["announcement"]>;
    composites: {};
};
export type AnnouncementGetPayload<S extends boolean | null | undefined | AnnouncementDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$AnnouncementPayload, S>;
export type AnnouncementCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<AnnouncementFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: AnnouncementCountAggregateInputType | true;
};
export interface AnnouncementDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Announcement'];
        meta: {
            name: 'Announcement';
        };
    };
    findUnique<T extends AnnouncementFindUniqueArgs>(args: Prisma.SelectSubset<T, AnnouncementFindUniqueArgs<ExtArgs>>): Prisma.Prisma__AnnouncementClient<runtime.Types.Result.GetResult<Prisma.$AnnouncementPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends AnnouncementFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, AnnouncementFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__AnnouncementClient<runtime.Types.Result.GetResult<Prisma.$AnnouncementPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends AnnouncementFindFirstArgs>(args?: Prisma.SelectSubset<T, AnnouncementFindFirstArgs<ExtArgs>>): Prisma.Prisma__AnnouncementClient<runtime.Types.Result.GetResult<Prisma.$AnnouncementPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends AnnouncementFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, AnnouncementFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__AnnouncementClient<runtime.Types.Result.GetResult<Prisma.$AnnouncementPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends AnnouncementFindManyArgs>(args?: Prisma.SelectSubset<T, AnnouncementFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AnnouncementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends AnnouncementCreateArgs>(args: Prisma.SelectSubset<T, AnnouncementCreateArgs<ExtArgs>>): Prisma.Prisma__AnnouncementClient<runtime.Types.Result.GetResult<Prisma.$AnnouncementPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends AnnouncementCreateManyArgs>(args?: Prisma.SelectSubset<T, AnnouncementCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends AnnouncementCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, AnnouncementCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AnnouncementPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends AnnouncementDeleteArgs>(args: Prisma.SelectSubset<T, AnnouncementDeleteArgs<ExtArgs>>): Prisma.Prisma__AnnouncementClient<runtime.Types.Result.GetResult<Prisma.$AnnouncementPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends AnnouncementUpdateArgs>(args: Prisma.SelectSubset<T, AnnouncementUpdateArgs<ExtArgs>>): Prisma.Prisma__AnnouncementClient<runtime.Types.Result.GetResult<Prisma.$AnnouncementPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends AnnouncementDeleteManyArgs>(args?: Prisma.SelectSubset<T, AnnouncementDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends AnnouncementUpdateManyArgs>(args: Prisma.SelectSubset<T, AnnouncementUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends AnnouncementUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, AnnouncementUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AnnouncementPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends AnnouncementUpsertArgs>(args: Prisma.SelectSubset<T, AnnouncementUpsertArgs<ExtArgs>>): Prisma.Prisma__AnnouncementClient<runtime.Types.Result.GetResult<Prisma.$AnnouncementPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends AnnouncementCountArgs>(args?: Prisma.Subset<T, AnnouncementCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], AnnouncementCountAggregateOutputType> : number>;
    aggregate<T extends AnnouncementAggregateArgs>(args: Prisma.Subset<T, AnnouncementAggregateArgs>): Prisma.PrismaPromise<GetAnnouncementAggregateType<T>>;
    groupBy<T extends AnnouncementGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: AnnouncementGroupByArgs['orderBy'];
    } : {
        orderBy?: AnnouncementGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, AnnouncementGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAnnouncementGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: AnnouncementFieldRefs;
}
export interface Prisma__AnnouncementClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    tenant<T extends Prisma.TenantDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TenantDefaultArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface AnnouncementFieldRefs {
    readonly id: Prisma.FieldRef<"Announcement", 'String'>;
    readonly tenantId: Prisma.FieldRef<"Announcement", 'String'>;
    readonly title: Prisma.FieldRef<"Announcement", 'String'>;
    readonly content: Prisma.FieldRef<"Announcement", 'String'>;
    readonly type: Prisma.FieldRef<"Announcement", 'String'>;
    readonly active: Prisma.FieldRef<"Announcement", 'Boolean'>;
    readonly pinned: Prisma.FieldRef<"Announcement", 'Boolean'>;
    readonly expiresAt: Prisma.FieldRef<"Announcement", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"Announcement", 'DateTime'>;
}
export type AnnouncementFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AnnouncementSelect<ExtArgs> | null;
    omit?: Prisma.AnnouncementOmit<ExtArgs> | null;
    include?: Prisma.AnnouncementInclude<ExtArgs> | null;
    where: Prisma.AnnouncementWhereUniqueInput;
};
export type AnnouncementFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AnnouncementSelect<ExtArgs> | null;
    omit?: Prisma.AnnouncementOmit<ExtArgs> | null;
    include?: Prisma.AnnouncementInclude<ExtArgs> | null;
    where: Prisma.AnnouncementWhereUniqueInput;
};
export type AnnouncementFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AnnouncementSelect<ExtArgs> | null;
    omit?: Prisma.AnnouncementOmit<ExtArgs> | null;
    include?: Prisma.AnnouncementInclude<ExtArgs> | null;
    where?: Prisma.AnnouncementWhereInput;
    orderBy?: Prisma.AnnouncementOrderByWithRelationInput | Prisma.AnnouncementOrderByWithRelationInput[];
    cursor?: Prisma.AnnouncementWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AnnouncementScalarFieldEnum | Prisma.AnnouncementScalarFieldEnum[];
};
export type AnnouncementFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AnnouncementSelect<ExtArgs> | null;
    omit?: Prisma.AnnouncementOmit<ExtArgs> | null;
    include?: Prisma.AnnouncementInclude<ExtArgs> | null;
    where?: Prisma.AnnouncementWhereInput;
    orderBy?: Prisma.AnnouncementOrderByWithRelationInput | Prisma.AnnouncementOrderByWithRelationInput[];
    cursor?: Prisma.AnnouncementWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AnnouncementScalarFieldEnum | Prisma.AnnouncementScalarFieldEnum[];
};
export type AnnouncementFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AnnouncementSelect<ExtArgs> | null;
    omit?: Prisma.AnnouncementOmit<ExtArgs> | null;
    include?: Prisma.AnnouncementInclude<ExtArgs> | null;
    where?: Prisma.AnnouncementWhereInput;
    orderBy?: Prisma.AnnouncementOrderByWithRelationInput | Prisma.AnnouncementOrderByWithRelationInput[];
    cursor?: Prisma.AnnouncementWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AnnouncementScalarFieldEnum | Prisma.AnnouncementScalarFieldEnum[];
};
export type AnnouncementCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AnnouncementSelect<ExtArgs> | null;
    omit?: Prisma.AnnouncementOmit<ExtArgs> | null;
    include?: Prisma.AnnouncementInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AnnouncementCreateInput, Prisma.AnnouncementUncheckedCreateInput>;
};
export type AnnouncementCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.AnnouncementCreateManyInput | Prisma.AnnouncementCreateManyInput[];
    skipDuplicates?: boolean;
};
export type AnnouncementCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AnnouncementSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.AnnouncementOmit<ExtArgs> | null;
    data: Prisma.AnnouncementCreateManyInput | Prisma.AnnouncementCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.AnnouncementIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type AnnouncementUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AnnouncementSelect<ExtArgs> | null;
    omit?: Prisma.AnnouncementOmit<ExtArgs> | null;
    include?: Prisma.AnnouncementInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AnnouncementUpdateInput, Prisma.AnnouncementUncheckedUpdateInput>;
    where: Prisma.AnnouncementWhereUniqueInput;
};
export type AnnouncementUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.AnnouncementUpdateManyMutationInput, Prisma.AnnouncementUncheckedUpdateManyInput>;
    where?: Prisma.AnnouncementWhereInput;
    limit?: number;
};
export type AnnouncementUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AnnouncementSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.AnnouncementOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AnnouncementUpdateManyMutationInput, Prisma.AnnouncementUncheckedUpdateManyInput>;
    where?: Prisma.AnnouncementWhereInput;
    limit?: number;
    include?: Prisma.AnnouncementIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type AnnouncementUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AnnouncementSelect<ExtArgs> | null;
    omit?: Prisma.AnnouncementOmit<ExtArgs> | null;
    include?: Prisma.AnnouncementInclude<ExtArgs> | null;
    where: Prisma.AnnouncementWhereUniqueInput;
    create: Prisma.XOR<Prisma.AnnouncementCreateInput, Prisma.AnnouncementUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.AnnouncementUpdateInput, Prisma.AnnouncementUncheckedUpdateInput>;
};
export type AnnouncementDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AnnouncementSelect<ExtArgs> | null;
    omit?: Prisma.AnnouncementOmit<ExtArgs> | null;
    include?: Prisma.AnnouncementInclude<ExtArgs> | null;
    where: Prisma.AnnouncementWhereUniqueInput;
};
export type AnnouncementDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AnnouncementWhereInput;
    limit?: number;
};
export type AnnouncementDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AnnouncementSelect<ExtArgs> | null;
    omit?: Prisma.AnnouncementOmit<ExtArgs> | null;
    include?: Prisma.AnnouncementInclude<ExtArgs> | null;
};
