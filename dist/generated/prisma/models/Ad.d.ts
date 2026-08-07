import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type AdModel = runtime.Types.Result.DefaultSelection<Prisma.$AdPayload>;
export type AggregateAd = {
    _count: AdCountAggregateOutputType | null;
    _avg: AdAvgAggregateOutputType | null;
    _sum: AdSumAggregateOutputType | null;
    _min: AdMinAggregateOutputType | null;
    _max: AdMaxAggregateOutputType | null;
};
export type AdAvgAggregateOutputType = {
    impressions: number | null;
    clicks: number | null;
    sortOrder: number | null;
};
export type AdSumAggregateOutputType = {
    impressions: number | null;
    clicks: number | null;
    sortOrder: number | null;
};
export type AdMinAggregateOutputType = {
    id: string | null;
    tenantId: string | null;
    name: string | null;
    position: $Enums.AdPosition | null;
    code: string | null;
    imageUrl: string | null;
    targetUrl: string | null;
    active: boolean | null;
    startsAt: Date | null;
    endsAt: Date | null;
    impressions: number | null;
    clicks: number | null;
    sortOrder: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type AdMaxAggregateOutputType = {
    id: string | null;
    tenantId: string | null;
    name: string | null;
    position: $Enums.AdPosition | null;
    code: string | null;
    imageUrl: string | null;
    targetUrl: string | null;
    active: boolean | null;
    startsAt: Date | null;
    endsAt: Date | null;
    impressions: number | null;
    clicks: number | null;
    sortOrder: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type AdCountAggregateOutputType = {
    id: number;
    tenantId: number;
    name: number;
    position: number;
    code: number;
    imageUrl: number;
    targetUrl: number;
    active: number;
    startsAt: number;
    endsAt: number;
    impressions: number;
    clicks: number;
    sortOrder: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type AdAvgAggregateInputType = {
    impressions?: true;
    clicks?: true;
    sortOrder?: true;
};
export type AdSumAggregateInputType = {
    impressions?: true;
    clicks?: true;
    sortOrder?: true;
};
export type AdMinAggregateInputType = {
    id?: true;
    tenantId?: true;
    name?: true;
    position?: true;
    code?: true;
    imageUrl?: true;
    targetUrl?: true;
    active?: true;
    startsAt?: true;
    endsAt?: true;
    impressions?: true;
    clicks?: true;
    sortOrder?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type AdMaxAggregateInputType = {
    id?: true;
    tenantId?: true;
    name?: true;
    position?: true;
    code?: true;
    imageUrl?: true;
    targetUrl?: true;
    active?: true;
    startsAt?: true;
    endsAt?: true;
    impressions?: true;
    clicks?: true;
    sortOrder?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type AdCountAggregateInputType = {
    id?: true;
    tenantId?: true;
    name?: true;
    position?: true;
    code?: true;
    imageUrl?: true;
    targetUrl?: true;
    active?: true;
    startsAt?: true;
    endsAt?: true;
    impressions?: true;
    clicks?: true;
    sortOrder?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type AdAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AdWhereInput;
    orderBy?: Prisma.AdOrderByWithRelationInput | Prisma.AdOrderByWithRelationInput[];
    cursor?: Prisma.AdWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | AdCountAggregateInputType;
    _avg?: AdAvgAggregateInputType;
    _sum?: AdSumAggregateInputType;
    _min?: AdMinAggregateInputType;
    _max?: AdMaxAggregateInputType;
};
export type GetAdAggregateType<T extends AdAggregateArgs> = {
    [P in keyof T & keyof AggregateAd]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateAd[P]> : Prisma.GetScalarType<T[P], AggregateAd[P]>;
};
export type AdGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AdWhereInput;
    orderBy?: Prisma.AdOrderByWithAggregationInput | Prisma.AdOrderByWithAggregationInput[];
    by: Prisma.AdScalarFieldEnum[] | Prisma.AdScalarFieldEnum;
    having?: Prisma.AdScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: AdCountAggregateInputType | true;
    _avg?: AdAvgAggregateInputType;
    _sum?: AdSumAggregateInputType;
    _min?: AdMinAggregateInputType;
    _max?: AdMaxAggregateInputType;
};
export type AdGroupByOutputType = {
    id: string;
    tenantId: string;
    name: string;
    position: $Enums.AdPosition;
    code: string | null;
    imageUrl: string | null;
    targetUrl: string | null;
    active: boolean;
    startsAt: Date | null;
    endsAt: Date | null;
    impressions: number;
    clicks: number;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
    _count: AdCountAggregateOutputType | null;
    _avg: AdAvgAggregateOutputType | null;
    _sum: AdSumAggregateOutputType | null;
    _min: AdMinAggregateOutputType | null;
    _max: AdMaxAggregateOutputType | null;
};
export type GetAdGroupByPayload<T extends AdGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<AdGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof AdGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], AdGroupByOutputType[P]> : Prisma.GetScalarType<T[P], AdGroupByOutputType[P]>;
}>>;
export type AdWhereInput = {
    AND?: Prisma.AdWhereInput | Prisma.AdWhereInput[];
    OR?: Prisma.AdWhereInput[];
    NOT?: Prisma.AdWhereInput | Prisma.AdWhereInput[];
    id?: Prisma.StringFilter<"Ad"> | string;
    tenantId?: Prisma.StringFilter<"Ad"> | string;
    name?: Prisma.StringFilter<"Ad"> | string;
    position?: Prisma.EnumAdPositionFilter<"Ad"> | $Enums.AdPosition;
    code?: Prisma.StringNullableFilter<"Ad"> | string | null;
    imageUrl?: Prisma.StringNullableFilter<"Ad"> | string | null;
    targetUrl?: Prisma.StringNullableFilter<"Ad"> | string | null;
    active?: Prisma.BoolFilter<"Ad"> | boolean;
    startsAt?: Prisma.DateTimeNullableFilter<"Ad"> | Date | string | null;
    endsAt?: Prisma.DateTimeNullableFilter<"Ad"> | Date | string | null;
    impressions?: Prisma.IntFilter<"Ad"> | number;
    clicks?: Prisma.IntFilter<"Ad"> | number;
    sortOrder?: Prisma.IntFilter<"Ad"> | number;
    createdAt?: Prisma.DateTimeFilter<"Ad"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Ad"> | Date | string;
    tenant?: Prisma.XOR<Prisma.TenantScalarRelationFilter, Prisma.TenantWhereInput>;
};
export type AdOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    code?: Prisma.SortOrderInput | Prisma.SortOrder;
    imageUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    targetUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    active?: Prisma.SortOrder;
    startsAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    endsAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    impressions?: Prisma.SortOrder;
    clicks?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    tenant?: Prisma.TenantOrderByWithRelationInput;
};
export type AdWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.AdWhereInput | Prisma.AdWhereInput[];
    OR?: Prisma.AdWhereInput[];
    NOT?: Prisma.AdWhereInput | Prisma.AdWhereInput[];
    tenantId?: Prisma.StringFilter<"Ad"> | string;
    name?: Prisma.StringFilter<"Ad"> | string;
    position?: Prisma.EnumAdPositionFilter<"Ad"> | $Enums.AdPosition;
    code?: Prisma.StringNullableFilter<"Ad"> | string | null;
    imageUrl?: Prisma.StringNullableFilter<"Ad"> | string | null;
    targetUrl?: Prisma.StringNullableFilter<"Ad"> | string | null;
    active?: Prisma.BoolFilter<"Ad"> | boolean;
    startsAt?: Prisma.DateTimeNullableFilter<"Ad"> | Date | string | null;
    endsAt?: Prisma.DateTimeNullableFilter<"Ad"> | Date | string | null;
    impressions?: Prisma.IntFilter<"Ad"> | number;
    clicks?: Prisma.IntFilter<"Ad"> | number;
    sortOrder?: Prisma.IntFilter<"Ad"> | number;
    createdAt?: Prisma.DateTimeFilter<"Ad"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Ad"> | Date | string;
    tenant?: Prisma.XOR<Prisma.TenantScalarRelationFilter, Prisma.TenantWhereInput>;
}, "id">;
export type AdOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    code?: Prisma.SortOrderInput | Prisma.SortOrder;
    imageUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    targetUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    active?: Prisma.SortOrder;
    startsAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    endsAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    impressions?: Prisma.SortOrder;
    clicks?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.AdCountOrderByAggregateInput;
    _avg?: Prisma.AdAvgOrderByAggregateInput;
    _max?: Prisma.AdMaxOrderByAggregateInput;
    _min?: Prisma.AdMinOrderByAggregateInput;
    _sum?: Prisma.AdSumOrderByAggregateInput;
};
export type AdScalarWhereWithAggregatesInput = {
    AND?: Prisma.AdScalarWhereWithAggregatesInput | Prisma.AdScalarWhereWithAggregatesInput[];
    OR?: Prisma.AdScalarWhereWithAggregatesInput[];
    NOT?: Prisma.AdScalarWhereWithAggregatesInput | Prisma.AdScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Ad"> | string;
    tenantId?: Prisma.StringWithAggregatesFilter<"Ad"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Ad"> | string;
    position?: Prisma.EnumAdPositionWithAggregatesFilter<"Ad"> | $Enums.AdPosition;
    code?: Prisma.StringNullableWithAggregatesFilter<"Ad"> | string | null;
    imageUrl?: Prisma.StringNullableWithAggregatesFilter<"Ad"> | string | null;
    targetUrl?: Prisma.StringNullableWithAggregatesFilter<"Ad"> | string | null;
    active?: Prisma.BoolWithAggregatesFilter<"Ad"> | boolean;
    startsAt?: Prisma.DateTimeNullableWithAggregatesFilter<"Ad"> | Date | string | null;
    endsAt?: Prisma.DateTimeNullableWithAggregatesFilter<"Ad"> | Date | string | null;
    impressions?: Prisma.IntWithAggregatesFilter<"Ad"> | number;
    clicks?: Prisma.IntWithAggregatesFilter<"Ad"> | number;
    sortOrder?: Prisma.IntWithAggregatesFilter<"Ad"> | number;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Ad"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Ad"> | Date | string;
};
export type AdCreateInput = {
    id?: string;
    name: string;
    position: $Enums.AdPosition;
    code?: string | null;
    imageUrl?: string | null;
    targetUrl?: string | null;
    active?: boolean;
    startsAt?: Date | string | null;
    endsAt?: Date | string | null;
    impressions?: number;
    clicks?: number;
    sortOrder?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tenant: Prisma.TenantCreateNestedOneWithoutAdsInput;
};
export type AdUncheckedCreateInput = {
    id?: string;
    tenantId: string;
    name: string;
    position: $Enums.AdPosition;
    code?: string | null;
    imageUrl?: string | null;
    targetUrl?: string | null;
    active?: boolean;
    startsAt?: Date | string | null;
    endsAt?: Date | string | null;
    impressions?: number;
    clicks?: number;
    sortOrder?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type AdUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.EnumAdPositionFieldUpdateOperationsInput | $Enums.AdPosition;
    code?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    imageUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    targetUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    startsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    endsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    impressions?: Prisma.IntFieldUpdateOperationsInput | number;
    clicks?: Prisma.IntFieldUpdateOperationsInput | number;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tenant?: Prisma.TenantUpdateOneRequiredWithoutAdsNestedInput;
};
export type AdUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.EnumAdPositionFieldUpdateOperationsInput | $Enums.AdPosition;
    code?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    imageUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    targetUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    startsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    endsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    impressions?: Prisma.IntFieldUpdateOperationsInput | number;
    clicks?: Prisma.IntFieldUpdateOperationsInput | number;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AdCreateManyInput = {
    id?: string;
    tenantId: string;
    name: string;
    position: $Enums.AdPosition;
    code?: string | null;
    imageUrl?: string | null;
    targetUrl?: string | null;
    active?: boolean;
    startsAt?: Date | string | null;
    endsAt?: Date | string | null;
    impressions?: number;
    clicks?: number;
    sortOrder?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type AdUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.EnumAdPositionFieldUpdateOperationsInput | $Enums.AdPosition;
    code?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    imageUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    targetUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    startsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    endsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    impressions?: Prisma.IntFieldUpdateOperationsInput | number;
    clicks?: Prisma.IntFieldUpdateOperationsInput | number;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AdUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.EnumAdPositionFieldUpdateOperationsInput | $Enums.AdPosition;
    code?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    imageUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    targetUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    startsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    endsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    impressions?: Prisma.IntFieldUpdateOperationsInput | number;
    clicks?: Prisma.IntFieldUpdateOperationsInput | number;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AdListRelationFilter = {
    every?: Prisma.AdWhereInput;
    some?: Prisma.AdWhereInput;
    none?: Prisma.AdWhereInput;
};
export type AdOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type AdCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    imageUrl?: Prisma.SortOrder;
    targetUrl?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    startsAt?: Prisma.SortOrder;
    endsAt?: Prisma.SortOrder;
    impressions?: Prisma.SortOrder;
    clicks?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type AdAvgOrderByAggregateInput = {
    impressions?: Prisma.SortOrder;
    clicks?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
};
export type AdMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    imageUrl?: Prisma.SortOrder;
    targetUrl?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    startsAt?: Prisma.SortOrder;
    endsAt?: Prisma.SortOrder;
    impressions?: Prisma.SortOrder;
    clicks?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type AdMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    imageUrl?: Prisma.SortOrder;
    targetUrl?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    startsAt?: Prisma.SortOrder;
    endsAt?: Prisma.SortOrder;
    impressions?: Prisma.SortOrder;
    clicks?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type AdSumOrderByAggregateInput = {
    impressions?: Prisma.SortOrder;
    clicks?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
};
export type AdCreateNestedManyWithoutTenantInput = {
    create?: Prisma.XOR<Prisma.AdCreateWithoutTenantInput, Prisma.AdUncheckedCreateWithoutTenantInput> | Prisma.AdCreateWithoutTenantInput[] | Prisma.AdUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.AdCreateOrConnectWithoutTenantInput | Prisma.AdCreateOrConnectWithoutTenantInput[];
    createMany?: Prisma.AdCreateManyTenantInputEnvelope;
    connect?: Prisma.AdWhereUniqueInput | Prisma.AdWhereUniqueInput[];
};
export type AdUncheckedCreateNestedManyWithoutTenantInput = {
    create?: Prisma.XOR<Prisma.AdCreateWithoutTenantInput, Prisma.AdUncheckedCreateWithoutTenantInput> | Prisma.AdCreateWithoutTenantInput[] | Prisma.AdUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.AdCreateOrConnectWithoutTenantInput | Prisma.AdCreateOrConnectWithoutTenantInput[];
    createMany?: Prisma.AdCreateManyTenantInputEnvelope;
    connect?: Prisma.AdWhereUniqueInput | Prisma.AdWhereUniqueInput[];
};
export type AdUpdateManyWithoutTenantNestedInput = {
    create?: Prisma.XOR<Prisma.AdCreateWithoutTenantInput, Prisma.AdUncheckedCreateWithoutTenantInput> | Prisma.AdCreateWithoutTenantInput[] | Prisma.AdUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.AdCreateOrConnectWithoutTenantInput | Prisma.AdCreateOrConnectWithoutTenantInput[];
    upsert?: Prisma.AdUpsertWithWhereUniqueWithoutTenantInput | Prisma.AdUpsertWithWhereUniqueWithoutTenantInput[];
    createMany?: Prisma.AdCreateManyTenantInputEnvelope;
    set?: Prisma.AdWhereUniqueInput | Prisma.AdWhereUniqueInput[];
    disconnect?: Prisma.AdWhereUniqueInput | Prisma.AdWhereUniqueInput[];
    delete?: Prisma.AdWhereUniqueInput | Prisma.AdWhereUniqueInput[];
    connect?: Prisma.AdWhereUniqueInput | Prisma.AdWhereUniqueInput[];
    update?: Prisma.AdUpdateWithWhereUniqueWithoutTenantInput | Prisma.AdUpdateWithWhereUniqueWithoutTenantInput[];
    updateMany?: Prisma.AdUpdateManyWithWhereWithoutTenantInput | Prisma.AdUpdateManyWithWhereWithoutTenantInput[];
    deleteMany?: Prisma.AdScalarWhereInput | Prisma.AdScalarWhereInput[];
};
export type AdUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: Prisma.XOR<Prisma.AdCreateWithoutTenantInput, Prisma.AdUncheckedCreateWithoutTenantInput> | Prisma.AdCreateWithoutTenantInput[] | Prisma.AdUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.AdCreateOrConnectWithoutTenantInput | Prisma.AdCreateOrConnectWithoutTenantInput[];
    upsert?: Prisma.AdUpsertWithWhereUniqueWithoutTenantInput | Prisma.AdUpsertWithWhereUniqueWithoutTenantInput[];
    createMany?: Prisma.AdCreateManyTenantInputEnvelope;
    set?: Prisma.AdWhereUniqueInput | Prisma.AdWhereUniqueInput[];
    disconnect?: Prisma.AdWhereUniqueInput | Prisma.AdWhereUniqueInput[];
    delete?: Prisma.AdWhereUniqueInput | Prisma.AdWhereUniqueInput[];
    connect?: Prisma.AdWhereUniqueInput | Prisma.AdWhereUniqueInput[];
    update?: Prisma.AdUpdateWithWhereUniqueWithoutTenantInput | Prisma.AdUpdateWithWhereUniqueWithoutTenantInput[];
    updateMany?: Prisma.AdUpdateManyWithWhereWithoutTenantInput | Prisma.AdUpdateManyWithWhereWithoutTenantInput[];
    deleteMany?: Prisma.AdScalarWhereInput | Prisma.AdScalarWhereInput[];
};
export type EnumAdPositionFieldUpdateOperationsInput = {
    set?: $Enums.AdPosition;
};
export type AdCreateWithoutTenantInput = {
    id?: string;
    name: string;
    position: $Enums.AdPosition;
    code?: string | null;
    imageUrl?: string | null;
    targetUrl?: string | null;
    active?: boolean;
    startsAt?: Date | string | null;
    endsAt?: Date | string | null;
    impressions?: number;
    clicks?: number;
    sortOrder?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type AdUncheckedCreateWithoutTenantInput = {
    id?: string;
    name: string;
    position: $Enums.AdPosition;
    code?: string | null;
    imageUrl?: string | null;
    targetUrl?: string | null;
    active?: boolean;
    startsAt?: Date | string | null;
    endsAt?: Date | string | null;
    impressions?: number;
    clicks?: number;
    sortOrder?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type AdCreateOrConnectWithoutTenantInput = {
    where: Prisma.AdWhereUniqueInput;
    create: Prisma.XOR<Prisma.AdCreateWithoutTenantInput, Prisma.AdUncheckedCreateWithoutTenantInput>;
};
export type AdCreateManyTenantInputEnvelope = {
    data: Prisma.AdCreateManyTenantInput | Prisma.AdCreateManyTenantInput[];
    skipDuplicates?: boolean;
};
export type AdUpsertWithWhereUniqueWithoutTenantInput = {
    where: Prisma.AdWhereUniqueInput;
    update: Prisma.XOR<Prisma.AdUpdateWithoutTenantInput, Prisma.AdUncheckedUpdateWithoutTenantInput>;
    create: Prisma.XOR<Prisma.AdCreateWithoutTenantInput, Prisma.AdUncheckedCreateWithoutTenantInput>;
};
export type AdUpdateWithWhereUniqueWithoutTenantInput = {
    where: Prisma.AdWhereUniqueInput;
    data: Prisma.XOR<Prisma.AdUpdateWithoutTenantInput, Prisma.AdUncheckedUpdateWithoutTenantInput>;
};
export type AdUpdateManyWithWhereWithoutTenantInput = {
    where: Prisma.AdScalarWhereInput;
    data: Prisma.XOR<Prisma.AdUpdateManyMutationInput, Prisma.AdUncheckedUpdateManyWithoutTenantInput>;
};
export type AdScalarWhereInput = {
    AND?: Prisma.AdScalarWhereInput | Prisma.AdScalarWhereInput[];
    OR?: Prisma.AdScalarWhereInput[];
    NOT?: Prisma.AdScalarWhereInput | Prisma.AdScalarWhereInput[];
    id?: Prisma.StringFilter<"Ad"> | string;
    tenantId?: Prisma.StringFilter<"Ad"> | string;
    name?: Prisma.StringFilter<"Ad"> | string;
    position?: Prisma.EnumAdPositionFilter<"Ad"> | $Enums.AdPosition;
    code?: Prisma.StringNullableFilter<"Ad"> | string | null;
    imageUrl?: Prisma.StringNullableFilter<"Ad"> | string | null;
    targetUrl?: Prisma.StringNullableFilter<"Ad"> | string | null;
    active?: Prisma.BoolFilter<"Ad"> | boolean;
    startsAt?: Prisma.DateTimeNullableFilter<"Ad"> | Date | string | null;
    endsAt?: Prisma.DateTimeNullableFilter<"Ad"> | Date | string | null;
    impressions?: Prisma.IntFilter<"Ad"> | number;
    clicks?: Prisma.IntFilter<"Ad"> | number;
    sortOrder?: Prisma.IntFilter<"Ad"> | number;
    createdAt?: Prisma.DateTimeFilter<"Ad"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Ad"> | Date | string;
};
export type AdCreateManyTenantInput = {
    id?: string;
    name: string;
    position: $Enums.AdPosition;
    code?: string | null;
    imageUrl?: string | null;
    targetUrl?: string | null;
    active?: boolean;
    startsAt?: Date | string | null;
    endsAt?: Date | string | null;
    impressions?: number;
    clicks?: number;
    sortOrder?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type AdUpdateWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.EnumAdPositionFieldUpdateOperationsInput | $Enums.AdPosition;
    code?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    imageUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    targetUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    startsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    endsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    impressions?: Prisma.IntFieldUpdateOperationsInput | number;
    clicks?: Prisma.IntFieldUpdateOperationsInput | number;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AdUncheckedUpdateWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.EnumAdPositionFieldUpdateOperationsInput | $Enums.AdPosition;
    code?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    imageUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    targetUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    startsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    endsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    impressions?: Prisma.IntFieldUpdateOperationsInput | number;
    clicks?: Prisma.IntFieldUpdateOperationsInput | number;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AdUncheckedUpdateManyWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.EnumAdPositionFieldUpdateOperationsInput | $Enums.AdPosition;
    code?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    imageUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    targetUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    startsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    endsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    impressions?: Prisma.IntFieldUpdateOperationsInput | number;
    clicks?: Prisma.IntFieldUpdateOperationsInput | number;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AdSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    name?: boolean;
    position?: boolean;
    code?: boolean;
    imageUrl?: boolean;
    targetUrl?: boolean;
    active?: boolean;
    startsAt?: boolean;
    endsAt?: boolean;
    impressions?: boolean;
    clicks?: boolean;
    sortOrder?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["ad"]>;
export type AdSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    name?: boolean;
    position?: boolean;
    code?: boolean;
    imageUrl?: boolean;
    targetUrl?: boolean;
    active?: boolean;
    startsAt?: boolean;
    endsAt?: boolean;
    impressions?: boolean;
    clicks?: boolean;
    sortOrder?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["ad"]>;
export type AdSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    name?: boolean;
    position?: boolean;
    code?: boolean;
    imageUrl?: boolean;
    targetUrl?: boolean;
    active?: boolean;
    startsAt?: boolean;
    endsAt?: boolean;
    impressions?: boolean;
    clicks?: boolean;
    sortOrder?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["ad"]>;
export type AdSelectScalar = {
    id?: boolean;
    tenantId?: boolean;
    name?: boolean;
    position?: boolean;
    code?: boolean;
    imageUrl?: boolean;
    targetUrl?: boolean;
    active?: boolean;
    startsAt?: boolean;
    endsAt?: boolean;
    impressions?: boolean;
    clicks?: boolean;
    sortOrder?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type AdOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "tenantId" | "name" | "position" | "code" | "imageUrl" | "targetUrl" | "active" | "startsAt" | "endsAt" | "impressions" | "clicks" | "sortOrder" | "createdAt" | "updatedAt", ExtArgs["result"]["ad"]>;
export type AdInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
};
export type AdIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
};
export type AdIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
};
export type $AdPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Ad";
    objects: {
        tenant: Prisma.$TenantPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        tenantId: string;
        name: string;
        position: $Enums.AdPosition;
        code: string | null;
        imageUrl: string | null;
        targetUrl: string | null;
        active: boolean;
        startsAt: Date | null;
        endsAt: Date | null;
        impressions: number;
        clicks: number;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["ad"]>;
    composites: {};
};
export type AdGetPayload<S extends boolean | null | undefined | AdDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$AdPayload, S>;
export type AdCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<AdFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: AdCountAggregateInputType | true;
};
export interface AdDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Ad'];
        meta: {
            name: 'Ad';
        };
    };
    findUnique<T extends AdFindUniqueArgs>(args: Prisma.SelectSubset<T, AdFindUniqueArgs<ExtArgs>>): Prisma.Prisma__AdClient<runtime.Types.Result.GetResult<Prisma.$AdPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends AdFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, AdFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__AdClient<runtime.Types.Result.GetResult<Prisma.$AdPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends AdFindFirstArgs>(args?: Prisma.SelectSubset<T, AdFindFirstArgs<ExtArgs>>): Prisma.Prisma__AdClient<runtime.Types.Result.GetResult<Prisma.$AdPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends AdFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, AdFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__AdClient<runtime.Types.Result.GetResult<Prisma.$AdPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends AdFindManyArgs>(args?: Prisma.SelectSubset<T, AdFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AdPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends AdCreateArgs>(args: Prisma.SelectSubset<T, AdCreateArgs<ExtArgs>>): Prisma.Prisma__AdClient<runtime.Types.Result.GetResult<Prisma.$AdPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends AdCreateManyArgs>(args?: Prisma.SelectSubset<T, AdCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends AdCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, AdCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AdPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends AdDeleteArgs>(args: Prisma.SelectSubset<T, AdDeleteArgs<ExtArgs>>): Prisma.Prisma__AdClient<runtime.Types.Result.GetResult<Prisma.$AdPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends AdUpdateArgs>(args: Prisma.SelectSubset<T, AdUpdateArgs<ExtArgs>>): Prisma.Prisma__AdClient<runtime.Types.Result.GetResult<Prisma.$AdPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends AdDeleteManyArgs>(args?: Prisma.SelectSubset<T, AdDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends AdUpdateManyArgs>(args: Prisma.SelectSubset<T, AdUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends AdUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, AdUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AdPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends AdUpsertArgs>(args: Prisma.SelectSubset<T, AdUpsertArgs<ExtArgs>>): Prisma.Prisma__AdClient<runtime.Types.Result.GetResult<Prisma.$AdPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends AdCountArgs>(args?: Prisma.Subset<T, AdCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], AdCountAggregateOutputType> : number>;
    aggregate<T extends AdAggregateArgs>(args: Prisma.Subset<T, AdAggregateArgs>): Prisma.PrismaPromise<GetAdAggregateType<T>>;
    groupBy<T extends AdGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: AdGroupByArgs['orderBy'];
    } : {
        orderBy?: AdGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, AdGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAdGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: AdFieldRefs;
}
export interface Prisma__AdClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    tenant<T extends Prisma.TenantDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TenantDefaultArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface AdFieldRefs {
    readonly id: Prisma.FieldRef<"Ad", 'String'>;
    readonly tenantId: Prisma.FieldRef<"Ad", 'String'>;
    readonly name: Prisma.FieldRef<"Ad", 'String'>;
    readonly position: Prisma.FieldRef<"Ad", 'AdPosition'>;
    readonly code: Prisma.FieldRef<"Ad", 'String'>;
    readonly imageUrl: Prisma.FieldRef<"Ad", 'String'>;
    readonly targetUrl: Prisma.FieldRef<"Ad", 'String'>;
    readonly active: Prisma.FieldRef<"Ad", 'Boolean'>;
    readonly startsAt: Prisma.FieldRef<"Ad", 'DateTime'>;
    readonly endsAt: Prisma.FieldRef<"Ad", 'DateTime'>;
    readonly impressions: Prisma.FieldRef<"Ad", 'Int'>;
    readonly clicks: Prisma.FieldRef<"Ad", 'Int'>;
    readonly sortOrder: Prisma.FieldRef<"Ad", 'Int'>;
    readonly createdAt: Prisma.FieldRef<"Ad", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Ad", 'DateTime'>;
}
export type AdFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AdSelect<ExtArgs> | null;
    omit?: Prisma.AdOmit<ExtArgs> | null;
    include?: Prisma.AdInclude<ExtArgs> | null;
    where: Prisma.AdWhereUniqueInput;
};
export type AdFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AdSelect<ExtArgs> | null;
    omit?: Prisma.AdOmit<ExtArgs> | null;
    include?: Prisma.AdInclude<ExtArgs> | null;
    where: Prisma.AdWhereUniqueInput;
};
export type AdFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AdSelect<ExtArgs> | null;
    omit?: Prisma.AdOmit<ExtArgs> | null;
    include?: Prisma.AdInclude<ExtArgs> | null;
    where?: Prisma.AdWhereInput;
    orderBy?: Prisma.AdOrderByWithRelationInput | Prisma.AdOrderByWithRelationInput[];
    cursor?: Prisma.AdWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AdScalarFieldEnum | Prisma.AdScalarFieldEnum[];
};
export type AdFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AdSelect<ExtArgs> | null;
    omit?: Prisma.AdOmit<ExtArgs> | null;
    include?: Prisma.AdInclude<ExtArgs> | null;
    where?: Prisma.AdWhereInput;
    orderBy?: Prisma.AdOrderByWithRelationInput | Prisma.AdOrderByWithRelationInput[];
    cursor?: Prisma.AdWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AdScalarFieldEnum | Prisma.AdScalarFieldEnum[];
};
export type AdFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AdSelect<ExtArgs> | null;
    omit?: Prisma.AdOmit<ExtArgs> | null;
    include?: Prisma.AdInclude<ExtArgs> | null;
    where?: Prisma.AdWhereInput;
    orderBy?: Prisma.AdOrderByWithRelationInput | Prisma.AdOrderByWithRelationInput[];
    cursor?: Prisma.AdWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AdScalarFieldEnum | Prisma.AdScalarFieldEnum[];
};
export type AdCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AdSelect<ExtArgs> | null;
    omit?: Prisma.AdOmit<ExtArgs> | null;
    include?: Prisma.AdInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AdCreateInput, Prisma.AdUncheckedCreateInput>;
};
export type AdCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.AdCreateManyInput | Prisma.AdCreateManyInput[];
    skipDuplicates?: boolean;
};
export type AdCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AdSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.AdOmit<ExtArgs> | null;
    data: Prisma.AdCreateManyInput | Prisma.AdCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.AdIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type AdUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AdSelect<ExtArgs> | null;
    omit?: Prisma.AdOmit<ExtArgs> | null;
    include?: Prisma.AdInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AdUpdateInput, Prisma.AdUncheckedUpdateInput>;
    where: Prisma.AdWhereUniqueInput;
};
export type AdUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.AdUpdateManyMutationInput, Prisma.AdUncheckedUpdateManyInput>;
    where?: Prisma.AdWhereInput;
    limit?: number;
};
export type AdUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AdSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.AdOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AdUpdateManyMutationInput, Prisma.AdUncheckedUpdateManyInput>;
    where?: Prisma.AdWhereInput;
    limit?: number;
    include?: Prisma.AdIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type AdUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AdSelect<ExtArgs> | null;
    omit?: Prisma.AdOmit<ExtArgs> | null;
    include?: Prisma.AdInclude<ExtArgs> | null;
    where: Prisma.AdWhereUniqueInput;
    create: Prisma.XOR<Prisma.AdCreateInput, Prisma.AdUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.AdUpdateInput, Prisma.AdUncheckedUpdateInput>;
};
export type AdDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AdSelect<ExtArgs> | null;
    omit?: Prisma.AdOmit<ExtArgs> | null;
    include?: Prisma.AdInclude<ExtArgs> | null;
    where: Prisma.AdWhereUniqueInput;
};
export type AdDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AdWhereInput;
    limit?: number;
};
export type AdDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AdSelect<ExtArgs> | null;
    omit?: Prisma.AdOmit<ExtArgs> | null;
    include?: Prisma.AdInclude<ExtArgs> | null;
};
