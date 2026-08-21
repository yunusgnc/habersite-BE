import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type BreakingNewsModel = runtime.Types.Result.DefaultSelection<Prisma.$BreakingNewsPayload>;
export type AggregateBreakingNews = {
    _count: BreakingNewsCountAggregateOutputType | null;
    _avg: BreakingNewsAvgAggregateOutputType | null;
    _sum: BreakingNewsSumAggregateOutputType | null;
    _min: BreakingNewsMinAggregateOutputType | null;
    _max: BreakingNewsMaxAggregateOutputType | null;
};
export type BreakingNewsAvgAggregateOutputType = {
    sortOrder: number | null;
};
export type BreakingNewsSumAggregateOutputType = {
    sortOrder: number | null;
};
export type BreakingNewsMinAggregateOutputType = {
    id: string | null;
    tenantId: string | null;
    title: string | null;
    url: string | null;
    active: boolean | null;
    sortOrder: number | null;
    expiresAt: Date | null;
    createdAt: Date | null;
};
export type BreakingNewsMaxAggregateOutputType = {
    id: string | null;
    tenantId: string | null;
    title: string | null;
    url: string | null;
    active: boolean | null;
    sortOrder: number | null;
    expiresAt: Date | null;
    createdAt: Date | null;
};
export type BreakingNewsCountAggregateOutputType = {
    id: number;
    tenantId: number;
    title: number;
    url: number;
    active: number;
    sortOrder: number;
    expiresAt: number;
    createdAt: number;
    _all: number;
};
export type BreakingNewsAvgAggregateInputType = {
    sortOrder?: true;
};
export type BreakingNewsSumAggregateInputType = {
    sortOrder?: true;
};
export type BreakingNewsMinAggregateInputType = {
    id?: true;
    tenantId?: true;
    title?: true;
    url?: true;
    active?: true;
    sortOrder?: true;
    expiresAt?: true;
    createdAt?: true;
};
export type BreakingNewsMaxAggregateInputType = {
    id?: true;
    tenantId?: true;
    title?: true;
    url?: true;
    active?: true;
    sortOrder?: true;
    expiresAt?: true;
    createdAt?: true;
};
export type BreakingNewsCountAggregateInputType = {
    id?: true;
    tenantId?: true;
    title?: true;
    url?: true;
    active?: true;
    sortOrder?: true;
    expiresAt?: true;
    createdAt?: true;
    _all?: true;
};
export type BreakingNewsAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BreakingNewsWhereInput;
    orderBy?: Prisma.BreakingNewsOrderByWithRelationInput | Prisma.BreakingNewsOrderByWithRelationInput[];
    cursor?: Prisma.BreakingNewsWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | BreakingNewsCountAggregateInputType;
    _avg?: BreakingNewsAvgAggregateInputType;
    _sum?: BreakingNewsSumAggregateInputType;
    _min?: BreakingNewsMinAggregateInputType;
    _max?: BreakingNewsMaxAggregateInputType;
};
export type GetBreakingNewsAggregateType<T extends BreakingNewsAggregateArgs> = {
    [P in keyof T & keyof AggregateBreakingNews]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateBreakingNews[P]> : Prisma.GetScalarType<T[P], AggregateBreakingNews[P]>;
};
export type BreakingNewsGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BreakingNewsWhereInput;
    orderBy?: Prisma.BreakingNewsOrderByWithAggregationInput | Prisma.BreakingNewsOrderByWithAggregationInput[];
    by: Prisma.BreakingNewsScalarFieldEnum[] | Prisma.BreakingNewsScalarFieldEnum;
    having?: Prisma.BreakingNewsScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: BreakingNewsCountAggregateInputType | true;
    _avg?: BreakingNewsAvgAggregateInputType;
    _sum?: BreakingNewsSumAggregateInputType;
    _min?: BreakingNewsMinAggregateInputType;
    _max?: BreakingNewsMaxAggregateInputType;
};
export type BreakingNewsGroupByOutputType = {
    id: string;
    tenantId: string;
    title: string;
    url: string | null;
    active: boolean;
    sortOrder: number;
    expiresAt: Date | null;
    createdAt: Date;
    _count: BreakingNewsCountAggregateOutputType | null;
    _avg: BreakingNewsAvgAggregateOutputType | null;
    _sum: BreakingNewsSumAggregateOutputType | null;
    _min: BreakingNewsMinAggregateOutputType | null;
    _max: BreakingNewsMaxAggregateOutputType | null;
};
export type GetBreakingNewsGroupByPayload<T extends BreakingNewsGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<BreakingNewsGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof BreakingNewsGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], BreakingNewsGroupByOutputType[P]> : Prisma.GetScalarType<T[P], BreakingNewsGroupByOutputType[P]>;
}>>;
export type BreakingNewsWhereInput = {
    AND?: Prisma.BreakingNewsWhereInput | Prisma.BreakingNewsWhereInput[];
    OR?: Prisma.BreakingNewsWhereInput[];
    NOT?: Prisma.BreakingNewsWhereInput | Prisma.BreakingNewsWhereInput[];
    id?: Prisma.StringFilter<"BreakingNews"> | string;
    tenantId?: Prisma.StringFilter<"BreakingNews"> | string;
    title?: Prisma.StringFilter<"BreakingNews"> | string;
    url?: Prisma.StringNullableFilter<"BreakingNews"> | string | null;
    active?: Prisma.BoolFilter<"BreakingNews"> | boolean;
    sortOrder?: Prisma.IntFilter<"BreakingNews"> | number;
    expiresAt?: Prisma.DateTimeNullableFilter<"BreakingNews"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"BreakingNews"> | Date | string;
    tenant?: Prisma.XOR<Prisma.TenantScalarRelationFilter, Prisma.TenantWhereInput>;
};
export type BreakingNewsOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    url?: Prisma.SortOrderInput | Prisma.SortOrder;
    active?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    tenant?: Prisma.TenantOrderByWithRelationInput;
};
export type BreakingNewsWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.BreakingNewsWhereInput | Prisma.BreakingNewsWhereInput[];
    OR?: Prisma.BreakingNewsWhereInput[];
    NOT?: Prisma.BreakingNewsWhereInput | Prisma.BreakingNewsWhereInput[];
    tenantId?: Prisma.StringFilter<"BreakingNews"> | string;
    title?: Prisma.StringFilter<"BreakingNews"> | string;
    url?: Prisma.StringNullableFilter<"BreakingNews"> | string | null;
    active?: Prisma.BoolFilter<"BreakingNews"> | boolean;
    sortOrder?: Prisma.IntFilter<"BreakingNews"> | number;
    expiresAt?: Prisma.DateTimeNullableFilter<"BreakingNews"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"BreakingNews"> | Date | string;
    tenant?: Prisma.XOR<Prisma.TenantScalarRelationFilter, Prisma.TenantWhereInput>;
}, "id">;
export type BreakingNewsOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    url?: Prisma.SortOrderInput | Prisma.SortOrder;
    active?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.BreakingNewsCountOrderByAggregateInput;
    _avg?: Prisma.BreakingNewsAvgOrderByAggregateInput;
    _max?: Prisma.BreakingNewsMaxOrderByAggregateInput;
    _min?: Prisma.BreakingNewsMinOrderByAggregateInput;
    _sum?: Prisma.BreakingNewsSumOrderByAggregateInput;
};
export type BreakingNewsScalarWhereWithAggregatesInput = {
    AND?: Prisma.BreakingNewsScalarWhereWithAggregatesInput | Prisma.BreakingNewsScalarWhereWithAggregatesInput[];
    OR?: Prisma.BreakingNewsScalarWhereWithAggregatesInput[];
    NOT?: Prisma.BreakingNewsScalarWhereWithAggregatesInput | Prisma.BreakingNewsScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"BreakingNews"> | string;
    tenantId?: Prisma.StringWithAggregatesFilter<"BreakingNews"> | string;
    title?: Prisma.StringWithAggregatesFilter<"BreakingNews"> | string;
    url?: Prisma.StringNullableWithAggregatesFilter<"BreakingNews"> | string | null;
    active?: Prisma.BoolWithAggregatesFilter<"BreakingNews"> | boolean;
    sortOrder?: Prisma.IntWithAggregatesFilter<"BreakingNews"> | number;
    expiresAt?: Prisma.DateTimeNullableWithAggregatesFilter<"BreakingNews"> | Date | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"BreakingNews"> | Date | string;
};
export type BreakingNewsCreateInput = {
    id?: string;
    title: string;
    url?: string | null;
    active?: boolean;
    sortOrder?: number;
    expiresAt?: Date | string | null;
    createdAt?: Date | string;
    tenant: Prisma.TenantCreateNestedOneWithoutBreakingNewsInput;
};
export type BreakingNewsUncheckedCreateInput = {
    id?: string;
    tenantId: string;
    title: string;
    url?: string | null;
    active?: boolean;
    sortOrder?: number;
    expiresAt?: Date | string | null;
    createdAt?: Date | string;
};
export type BreakingNewsUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tenant?: Prisma.TenantUpdateOneRequiredWithoutBreakingNewsNestedInput;
};
export type BreakingNewsUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BreakingNewsCreateManyInput = {
    id?: string;
    tenantId: string;
    title: string;
    url?: string | null;
    active?: boolean;
    sortOrder?: number;
    expiresAt?: Date | string | null;
    createdAt?: Date | string;
};
export type BreakingNewsUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BreakingNewsUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BreakingNewsListRelationFilter = {
    every?: Prisma.BreakingNewsWhereInput;
    some?: Prisma.BreakingNewsWhereInput;
    none?: Prisma.BreakingNewsWhereInput;
};
export type BreakingNewsOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type BreakingNewsCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type BreakingNewsAvgOrderByAggregateInput = {
    sortOrder?: Prisma.SortOrder;
};
export type BreakingNewsMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type BreakingNewsMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type BreakingNewsSumOrderByAggregateInput = {
    sortOrder?: Prisma.SortOrder;
};
export type BreakingNewsCreateNestedManyWithoutTenantInput = {
    create?: Prisma.XOR<Prisma.BreakingNewsCreateWithoutTenantInput, Prisma.BreakingNewsUncheckedCreateWithoutTenantInput> | Prisma.BreakingNewsCreateWithoutTenantInput[] | Prisma.BreakingNewsUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.BreakingNewsCreateOrConnectWithoutTenantInput | Prisma.BreakingNewsCreateOrConnectWithoutTenantInput[];
    createMany?: Prisma.BreakingNewsCreateManyTenantInputEnvelope;
    connect?: Prisma.BreakingNewsWhereUniqueInput | Prisma.BreakingNewsWhereUniqueInput[];
};
export type BreakingNewsUncheckedCreateNestedManyWithoutTenantInput = {
    create?: Prisma.XOR<Prisma.BreakingNewsCreateWithoutTenantInput, Prisma.BreakingNewsUncheckedCreateWithoutTenantInput> | Prisma.BreakingNewsCreateWithoutTenantInput[] | Prisma.BreakingNewsUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.BreakingNewsCreateOrConnectWithoutTenantInput | Prisma.BreakingNewsCreateOrConnectWithoutTenantInput[];
    createMany?: Prisma.BreakingNewsCreateManyTenantInputEnvelope;
    connect?: Prisma.BreakingNewsWhereUniqueInput | Prisma.BreakingNewsWhereUniqueInput[];
};
export type BreakingNewsUpdateManyWithoutTenantNestedInput = {
    create?: Prisma.XOR<Prisma.BreakingNewsCreateWithoutTenantInput, Prisma.BreakingNewsUncheckedCreateWithoutTenantInput> | Prisma.BreakingNewsCreateWithoutTenantInput[] | Prisma.BreakingNewsUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.BreakingNewsCreateOrConnectWithoutTenantInput | Prisma.BreakingNewsCreateOrConnectWithoutTenantInput[];
    upsert?: Prisma.BreakingNewsUpsertWithWhereUniqueWithoutTenantInput | Prisma.BreakingNewsUpsertWithWhereUniqueWithoutTenantInput[];
    createMany?: Prisma.BreakingNewsCreateManyTenantInputEnvelope;
    set?: Prisma.BreakingNewsWhereUniqueInput | Prisma.BreakingNewsWhereUniqueInput[];
    disconnect?: Prisma.BreakingNewsWhereUniqueInput | Prisma.BreakingNewsWhereUniqueInput[];
    delete?: Prisma.BreakingNewsWhereUniqueInput | Prisma.BreakingNewsWhereUniqueInput[];
    connect?: Prisma.BreakingNewsWhereUniqueInput | Prisma.BreakingNewsWhereUniqueInput[];
    update?: Prisma.BreakingNewsUpdateWithWhereUniqueWithoutTenantInput | Prisma.BreakingNewsUpdateWithWhereUniqueWithoutTenantInput[];
    updateMany?: Prisma.BreakingNewsUpdateManyWithWhereWithoutTenantInput | Prisma.BreakingNewsUpdateManyWithWhereWithoutTenantInput[];
    deleteMany?: Prisma.BreakingNewsScalarWhereInput | Prisma.BreakingNewsScalarWhereInput[];
};
export type BreakingNewsUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: Prisma.XOR<Prisma.BreakingNewsCreateWithoutTenantInput, Prisma.BreakingNewsUncheckedCreateWithoutTenantInput> | Prisma.BreakingNewsCreateWithoutTenantInput[] | Prisma.BreakingNewsUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.BreakingNewsCreateOrConnectWithoutTenantInput | Prisma.BreakingNewsCreateOrConnectWithoutTenantInput[];
    upsert?: Prisma.BreakingNewsUpsertWithWhereUniqueWithoutTenantInput | Prisma.BreakingNewsUpsertWithWhereUniqueWithoutTenantInput[];
    createMany?: Prisma.BreakingNewsCreateManyTenantInputEnvelope;
    set?: Prisma.BreakingNewsWhereUniqueInput | Prisma.BreakingNewsWhereUniqueInput[];
    disconnect?: Prisma.BreakingNewsWhereUniqueInput | Prisma.BreakingNewsWhereUniqueInput[];
    delete?: Prisma.BreakingNewsWhereUniqueInput | Prisma.BreakingNewsWhereUniqueInput[];
    connect?: Prisma.BreakingNewsWhereUniqueInput | Prisma.BreakingNewsWhereUniqueInput[];
    update?: Prisma.BreakingNewsUpdateWithWhereUniqueWithoutTenantInput | Prisma.BreakingNewsUpdateWithWhereUniqueWithoutTenantInput[];
    updateMany?: Prisma.BreakingNewsUpdateManyWithWhereWithoutTenantInput | Prisma.BreakingNewsUpdateManyWithWhereWithoutTenantInput[];
    deleteMany?: Prisma.BreakingNewsScalarWhereInput | Prisma.BreakingNewsScalarWhereInput[];
};
export type BreakingNewsCreateWithoutTenantInput = {
    id?: string;
    title: string;
    url?: string | null;
    active?: boolean;
    sortOrder?: number;
    expiresAt?: Date | string | null;
    createdAt?: Date | string;
};
export type BreakingNewsUncheckedCreateWithoutTenantInput = {
    id?: string;
    title: string;
    url?: string | null;
    active?: boolean;
    sortOrder?: number;
    expiresAt?: Date | string | null;
    createdAt?: Date | string;
};
export type BreakingNewsCreateOrConnectWithoutTenantInput = {
    where: Prisma.BreakingNewsWhereUniqueInput;
    create: Prisma.XOR<Prisma.BreakingNewsCreateWithoutTenantInput, Prisma.BreakingNewsUncheckedCreateWithoutTenantInput>;
};
export type BreakingNewsCreateManyTenantInputEnvelope = {
    data: Prisma.BreakingNewsCreateManyTenantInput | Prisma.BreakingNewsCreateManyTenantInput[];
    skipDuplicates?: boolean;
};
export type BreakingNewsUpsertWithWhereUniqueWithoutTenantInput = {
    where: Prisma.BreakingNewsWhereUniqueInput;
    update: Prisma.XOR<Prisma.BreakingNewsUpdateWithoutTenantInput, Prisma.BreakingNewsUncheckedUpdateWithoutTenantInput>;
    create: Prisma.XOR<Prisma.BreakingNewsCreateWithoutTenantInput, Prisma.BreakingNewsUncheckedCreateWithoutTenantInput>;
};
export type BreakingNewsUpdateWithWhereUniqueWithoutTenantInput = {
    where: Prisma.BreakingNewsWhereUniqueInput;
    data: Prisma.XOR<Prisma.BreakingNewsUpdateWithoutTenantInput, Prisma.BreakingNewsUncheckedUpdateWithoutTenantInput>;
};
export type BreakingNewsUpdateManyWithWhereWithoutTenantInput = {
    where: Prisma.BreakingNewsScalarWhereInput;
    data: Prisma.XOR<Prisma.BreakingNewsUpdateManyMutationInput, Prisma.BreakingNewsUncheckedUpdateManyWithoutTenantInput>;
};
export type BreakingNewsScalarWhereInput = {
    AND?: Prisma.BreakingNewsScalarWhereInput | Prisma.BreakingNewsScalarWhereInput[];
    OR?: Prisma.BreakingNewsScalarWhereInput[];
    NOT?: Prisma.BreakingNewsScalarWhereInput | Prisma.BreakingNewsScalarWhereInput[];
    id?: Prisma.StringFilter<"BreakingNews"> | string;
    tenantId?: Prisma.StringFilter<"BreakingNews"> | string;
    title?: Prisma.StringFilter<"BreakingNews"> | string;
    url?: Prisma.StringNullableFilter<"BreakingNews"> | string | null;
    active?: Prisma.BoolFilter<"BreakingNews"> | boolean;
    sortOrder?: Prisma.IntFilter<"BreakingNews"> | number;
    expiresAt?: Prisma.DateTimeNullableFilter<"BreakingNews"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"BreakingNews"> | Date | string;
};
export type BreakingNewsCreateManyTenantInput = {
    id?: string;
    title: string;
    url?: string | null;
    active?: boolean;
    sortOrder?: number;
    expiresAt?: Date | string | null;
    createdAt?: Date | string;
};
export type BreakingNewsUpdateWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BreakingNewsUncheckedUpdateWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BreakingNewsUncheckedUpdateManyWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BreakingNewsSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    title?: boolean;
    url?: boolean;
    active?: boolean;
    sortOrder?: boolean;
    expiresAt?: boolean;
    createdAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["breakingNews"]>;
export type BreakingNewsSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    title?: boolean;
    url?: boolean;
    active?: boolean;
    sortOrder?: boolean;
    expiresAt?: boolean;
    createdAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["breakingNews"]>;
export type BreakingNewsSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    title?: boolean;
    url?: boolean;
    active?: boolean;
    sortOrder?: boolean;
    expiresAt?: boolean;
    createdAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["breakingNews"]>;
export type BreakingNewsSelectScalar = {
    id?: boolean;
    tenantId?: boolean;
    title?: boolean;
    url?: boolean;
    active?: boolean;
    sortOrder?: boolean;
    expiresAt?: boolean;
    createdAt?: boolean;
};
export type BreakingNewsOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "tenantId" | "title" | "url" | "active" | "sortOrder" | "expiresAt" | "createdAt", ExtArgs["result"]["breakingNews"]>;
export type BreakingNewsInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
};
export type BreakingNewsIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
};
export type BreakingNewsIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
};
export type $BreakingNewsPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "BreakingNews";
    objects: {
        tenant: Prisma.$TenantPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        tenantId: string;
        title: string;
        url: string | null;
        active: boolean;
        sortOrder: number;
        expiresAt: Date | null;
        createdAt: Date;
    }, ExtArgs["result"]["breakingNews"]>;
    composites: {};
};
export type BreakingNewsGetPayload<S extends boolean | null | undefined | BreakingNewsDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$BreakingNewsPayload, S>;
export type BreakingNewsCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<BreakingNewsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: BreakingNewsCountAggregateInputType | true;
};
export interface BreakingNewsDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['BreakingNews'];
        meta: {
            name: 'BreakingNews';
        };
    };
    findUnique<T extends BreakingNewsFindUniqueArgs>(args: Prisma.SelectSubset<T, BreakingNewsFindUniqueArgs<ExtArgs>>): Prisma.Prisma__BreakingNewsClient<runtime.Types.Result.GetResult<Prisma.$BreakingNewsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends BreakingNewsFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, BreakingNewsFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__BreakingNewsClient<runtime.Types.Result.GetResult<Prisma.$BreakingNewsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends BreakingNewsFindFirstArgs>(args?: Prisma.SelectSubset<T, BreakingNewsFindFirstArgs<ExtArgs>>): Prisma.Prisma__BreakingNewsClient<runtime.Types.Result.GetResult<Prisma.$BreakingNewsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends BreakingNewsFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, BreakingNewsFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__BreakingNewsClient<runtime.Types.Result.GetResult<Prisma.$BreakingNewsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends BreakingNewsFindManyArgs>(args?: Prisma.SelectSubset<T, BreakingNewsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BreakingNewsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends BreakingNewsCreateArgs>(args: Prisma.SelectSubset<T, BreakingNewsCreateArgs<ExtArgs>>): Prisma.Prisma__BreakingNewsClient<runtime.Types.Result.GetResult<Prisma.$BreakingNewsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends BreakingNewsCreateManyArgs>(args?: Prisma.SelectSubset<T, BreakingNewsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends BreakingNewsCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, BreakingNewsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BreakingNewsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends BreakingNewsDeleteArgs>(args: Prisma.SelectSubset<T, BreakingNewsDeleteArgs<ExtArgs>>): Prisma.Prisma__BreakingNewsClient<runtime.Types.Result.GetResult<Prisma.$BreakingNewsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends BreakingNewsUpdateArgs>(args: Prisma.SelectSubset<T, BreakingNewsUpdateArgs<ExtArgs>>): Prisma.Prisma__BreakingNewsClient<runtime.Types.Result.GetResult<Prisma.$BreakingNewsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends BreakingNewsDeleteManyArgs>(args?: Prisma.SelectSubset<T, BreakingNewsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends BreakingNewsUpdateManyArgs>(args: Prisma.SelectSubset<T, BreakingNewsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends BreakingNewsUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, BreakingNewsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BreakingNewsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends BreakingNewsUpsertArgs>(args: Prisma.SelectSubset<T, BreakingNewsUpsertArgs<ExtArgs>>): Prisma.Prisma__BreakingNewsClient<runtime.Types.Result.GetResult<Prisma.$BreakingNewsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends BreakingNewsCountArgs>(args?: Prisma.Subset<T, BreakingNewsCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], BreakingNewsCountAggregateOutputType> : number>;
    aggregate<T extends BreakingNewsAggregateArgs>(args: Prisma.Subset<T, BreakingNewsAggregateArgs>): Prisma.PrismaPromise<GetBreakingNewsAggregateType<T>>;
    groupBy<T extends BreakingNewsGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: BreakingNewsGroupByArgs['orderBy'];
    } : {
        orderBy?: BreakingNewsGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, BreakingNewsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBreakingNewsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: BreakingNewsFieldRefs;
}
export interface Prisma__BreakingNewsClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    tenant<T extends Prisma.TenantDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TenantDefaultArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface BreakingNewsFieldRefs {
    readonly id: Prisma.FieldRef<"BreakingNews", 'String'>;
    readonly tenantId: Prisma.FieldRef<"BreakingNews", 'String'>;
    readonly title: Prisma.FieldRef<"BreakingNews", 'String'>;
    readonly url: Prisma.FieldRef<"BreakingNews", 'String'>;
    readonly active: Prisma.FieldRef<"BreakingNews", 'Boolean'>;
    readonly sortOrder: Prisma.FieldRef<"BreakingNews", 'Int'>;
    readonly expiresAt: Prisma.FieldRef<"BreakingNews", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"BreakingNews", 'DateTime'>;
}
export type BreakingNewsFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BreakingNewsSelect<ExtArgs> | null;
    omit?: Prisma.BreakingNewsOmit<ExtArgs> | null;
    include?: Prisma.BreakingNewsInclude<ExtArgs> | null;
    where: Prisma.BreakingNewsWhereUniqueInput;
};
export type BreakingNewsFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BreakingNewsSelect<ExtArgs> | null;
    omit?: Prisma.BreakingNewsOmit<ExtArgs> | null;
    include?: Prisma.BreakingNewsInclude<ExtArgs> | null;
    where: Prisma.BreakingNewsWhereUniqueInput;
};
export type BreakingNewsFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BreakingNewsSelect<ExtArgs> | null;
    omit?: Prisma.BreakingNewsOmit<ExtArgs> | null;
    include?: Prisma.BreakingNewsInclude<ExtArgs> | null;
    where?: Prisma.BreakingNewsWhereInput;
    orderBy?: Prisma.BreakingNewsOrderByWithRelationInput | Prisma.BreakingNewsOrderByWithRelationInput[];
    cursor?: Prisma.BreakingNewsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BreakingNewsScalarFieldEnum | Prisma.BreakingNewsScalarFieldEnum[];
};
export type BreakingNewsFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BreakingNewsSelect<ExtArgs> | null;
    omit?: Prisma.BreakingNewsOmit<ExtArgs> | null;
    include?: Prisma.BreakingNewsInclude<ExtArgs> | null;
    where?: Prisma.BreakingNewsWhereInput;
    orderBy?: Prisma.BreakingNewsOrderByWithRelationInput | Prisma.BreakingNewsOrderByWithRelationInput[];
    cursor?: Prisma.BreakingNewsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BreakingNewsScalarFieldEnum | Prisma.BreakingNewsScalarFieldEnum[];
};
export type BreakingNewsFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BreakingNewsSelect<ExtArgs> | null;
    omit?: Prisma.BreakingNewsOmit<ExtArgs> | null;
    include?: Prisma.BreakingNewsInclude<ExtArgs> | null;
    where?: Prisma.BreakingNewsWhereInput;
    orderBy?: Prisma.BreakingNewsOrderByWithRelationInput | Prisma.BreakingNewsOrderByWithRelationInput[];
    cursor?: Prisma.BreakingNewsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BreakingNewsScalarFieldEnum | Prisma.BreakingNewsScalarFieldEnum[];
};
export type BreakingNewsCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BreakingNewsSelect<ExtArgs> | null;
    omit?: Prisma.BreakingNewsOmit<ExtArgs> | null;
    include?: Prisma.BreakingNewsInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BreakingNewsCreateInput, Prisma.BreakingNewsUncheckedCreateInput>;
};
export type BreakingNewsCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.BreakingNewsCreateManyInput | Prisma.BreakingNewsCreateManyInput[];
    skipDuplicates?: boolean;
};
export type BreakingNewsCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BreakingNewsSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BreakingNewsOmit<ExtArgs> | null;
    data: Prisma.BreakingNewsCreateManyInput | Prisma.BreakingNewsCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.BreakingNewsIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type BreakingNewsUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BreakingNewsSelect<ExtArgs> | null;
    omit?: Prisma.BreakingNewsOmit<ExtArgs> | null;
    include?: Prisma.BreakingNewsInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BreakingNewsUpdateInput, Prisma.BreakingNewsUncheckedUpdateInput>;
    where: Prisma.BreakingNewsWhereUniqueInput;
};
export type BreakingNewsUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.BreakingNewsUpdateManyMutationInput, Prisma.BreakingNewsUncheckedUpdateManyInput>;
    where?: Prisma.BreakingNewsWhereInput;
    limit?: number;
};
export type BreakingNewsUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BreakingNewsSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BreakingNewsOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BreakingNewsUpdateManyMutationInput, Prisma.BreakingNewsUncheckedUpdateManyInput>;
    where?: Prisma.BreakingNewsWhereInput;
    limit?: number;
    include?: Prisma.BreakingNewsIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type BreakingNewsUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BreakingNewsSelect<ExtArgs> | null;
    omit?: Prisma.BreakingNewsOmit<ExtArgs> | null;
    include?: Prisma.BreakingNewsInclude<ExtArgs> | null;
    where: Prisma.BreakingNewsWhereUniqueInput;
    create: Prisma.XOR<Prisma.BreakingNewsCreateInput, Prisma.BreakingNewsUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.BreakingNewsUpdateInput, Prisma.BreakingNewsUncheckedUpdateInput>;
};
export type BreakingNewsDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BreakingNewsSelect<ExtArgs> | null;
    omit?: Prisma.BreakingNewsOmit<ExtArgs> | null;
    include?: Prisma.BreakingNewsInclude<ExtArgs> | null;
    where: Prisma.BreakingNewsWhereUniqueInput;
};
export type BreakingNewsDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BreakingNewsWhereInput;
    limit?: number;
};
export type BreakingNewsDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BreakingNewsSelect<ExtArgs> | null;
    omit?: Prisma.BreakingNewsOmit<ExtArgs> | null;
    include?: Prisma.BreakingNewsInclude<ExtArgs> | null;
};
