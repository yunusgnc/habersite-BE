import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type PageModel = runtime.Types.Result.DefaultSelection<Prisma.$PagePayload>;
export type AggregatePage = {
    _count: PageCountAggregateOutputType | null;
    _min: PageMinAggregateOutputType | null;
    _max: PageMaxAggregateOutputType | null;
};
export type PageMinAggregateOutputType = {
    id: string | null;
    tenantId: string | null;
    title: string | null;
    slug: string | null;
    seoTitle: string | null;
    seoDesc: string | null;
    published: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type PageMaxAggregateOutputType = {
    id: string | null;
    tenantId: string | null;
    title: string | null;
    slug: string | null;
    seoTitle: string | null;
    seoDesc: string | null;
    published: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type PageCountAggregateOutputType = {
    id: number;
    tenantId: number;
    title: number;
    slug: number;
    content: number;
    seoTitle: number;
    seoDesc: number;
    published: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type PageMinAggregateInputType = {
    id?: true;
    tenantId?: true;
    title?: true;
    slug?: true;
    seoTitle?: true;
    seoDesc?: true;
    published?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type PageMaxAggregateInputType = {
    id?: true;
    tenantId?: true;
    title?: true;
    slug?: true;
    seoTitle?: true;
    seoDesc?: true;
    published?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type PageCountAggregateInputType = {
    id?: true;
    tenantId?: true;
    title?: true;
    slug?: true;
    content?: true;
    seoTitle?: true;
    seoDesc?: true;
    published?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type PageAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PageWhereInput;
    orderBy?: Prisma.PageOrderByWithRelationInput | Prisma.PageOrderByWithRelationInput[];
    cursor?: Prisma.PageWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PageCountAggregateInputType;
    _min?: PageMinAggregateInputType;
    _max?: PageMaxAggregateInputType;
};
export type GetPageAggregateType<T extends PageAggregateArgs> = {
    [P in keyof T & keyof AggregatePage]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePage[P]> : Prisma.GetScalarType<T[P], AggregatePage[P]>;
};
export type PageGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PageWhereInput;
    orderBy?: Prisma.PageOrderByWithAggregationInput | Prisma.PageOrderByWithAggregationInput[];
    by: Prisma.PageScalarFieldEnum[] | Prisma.PageScalarFieldEnum;
    having?: Prisma.PageScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PageCountAggregateInputType | true;
    _min?: PageMinAggregateInputType;
    _max?: PageMaxAggregateInputType;
};
export type PageGroupByOutputType = {
    id: string;
    tenantId: string;
    title: string;
    slug: string;
    content: runtime.JsonValue;
    seoTitle: string | null;
    seoDesc: string | null;
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: PageCountAggregateOutputType | null;
    _min: PageMinAggregateOutputType | null;
    _max: PageMaxAggregateOutputType | null;
};
export type GetPageGroupByPayload<T extends PageGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PageGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PageGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PageGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PageGroupByOutputType[P]>;
}>>;
export type PageWhereInput = {
    AND?: Prisma.PageWhereInput | Prisma.PageWhereInput[];
    OR?: Prisma.PageWhereInput[];
    NOT?: Prisma.PageWhereInput | Prisma.PageWhereInput[];
    id?: Prisma.StringFilter<"Page"> | string;
    tenantId?: Prisma.StringFilter<"Page"> | string;
    title?: Prisma.StringFilter<"Page"> | string;
    slug?: Prisma.StringFilter<"Page"> | string;
    content?: Prisma.JsonFilter<"Page">;
    seoTitle?: Prisma.StringNullableFilter<"Page"> | string | null;
    seoDesc?: Prisma.StringNullableFilter<"Page"> | string | null;
    published?: Prisma.BoolFilter<"Page"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Page"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Page"> | Date | string;
    tenant?: Prisma.XOR<Prisma.TenantScalarRelationFilter, Prisma.TenantWhereInput>;
};
export type PageOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    seoTitle?: Prisma.SortOrderInput | Prisma.SortOrder;
    seoDesc?: Prisma.SortOrderInput | Prisma.SortOrder;
    published?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    tenant?: Prisma.TenantOrderByWithRelationInput;
};
export type PageWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    tenantId_slug?: Prisma.PageTenantIdSlugCompoundUniqueInput;
    AND?: Prisma.PageWhereInput | Prisma.PageWhereInput[];
    OR?: Prisma.PageWhereInput[];
    NOT?: Prisma.PageWhereInput | Prisma.PageWhereInput[];
    tenantId?: Prisma.StringFilter<"Page"> | string;
    title?: Prisma.StringFilter<"Page"> | string;
    slug?: Prisma.StringFilter<"Page"> | string;
    content?: Prisma.JsonFilter<"Page">;
    seoTitle?: Prisma.StringNullableFilter<"Page"> | string | null;
    seoDesc?: Prisma.StringNullableFilter<"Page"> | string | null;
    published?: Prisma.BoolFilter<"Page"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Page"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Page"> | Date | string;
    tenant?: Prisma.XOR<Prisma.TenantScalarRelationFilter, Prisma.TenantWhereInput>;
}, "id" | "tenantId_slug">;
export type PageOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    seoTitle?: Prisma.SortOrderInput | Prisma.SortOrder;
    seoDesc?: Prisma.SortOrderInput | Prisma.SortOrder;
    published?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.PageCountOrderByAggregateInput;
    _max?: Prisma.PageMaxOrderByAggregateInput;
    _min?: Prisma.PageMinOrderByAggregateInput;
};
export type PageScalarWhereWithAggregatesInput = {
    AND?: Prisma.PageScalarWhereWithAggregatesInput | Prisma.PageScalarWhereWithAggregatesInput[];
    OR?: Prisma.PageScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PageScalarWhereWithAggregatesInput | Prisma.PageScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Page"> | string;
    tenantId?: Prisma.StringWithAggregatesFilter<"Page"> | string;
    title?: Prisma.StringWithAggregatesFilter<"Page"> | string;
    slug?: Prisma.StringWithAggregatesFilter<"Page"> | string;
    content?: Prisma.JsonWithAggregatesFilter<"Page">;
    seoTitle?: Prisma.StringNullableWithAggregatesFilter<"Page"> | string | null;
    seoDesc?: Prisma.StringNullableWithAggregatesFilter<"Page"> | string | null;
    published?: Prisma.BoolWithAggregatesFilter<"Page"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Page"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Page"> | Date | string;
};
export type PageCreateInput = {
    id?: string;
    title: string;
    slug: string;
    content: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    seoTitle?: string | null;
    seoDesc?: string | null;
    published?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tenant: Prisma.TenantCreateNestedOneWithoutPagesInput;
};
export type PageUncheckedCreateInput = {
    id?: string;
    tenantId: string;
    title: string;
    slug: string;
    content: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    seoTitle?: string | null;
    seoDesc?: string | null;
    published?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PageUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    seoTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    seoDesc?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tenant?: Prisma.TenantUpdateOneRequiredWithoutPagesNestedInput;
};
export type PageUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    seoTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    seoDesc?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PageCreateManyInput = {
    id?: string;
    tenantId: string;
    title: string;
    slug: string;
    content: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    seoTitle?: string | null;
    seoDesc?: string | null;
    published?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PageUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    seoTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    seoDesc?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PageUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    seoTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    seoDesc?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PageListRelationFilter = {
    every?: Prisma.PageWhereInput;
    some?: Prisma.PageWhereInput;
    none?: Prisma.PageWhereInput;
};
export type PageOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type PageTenantIdSlugCompoundUniqueInput = {
    tenantId: string;
    slug: string;
};
export type PageCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    seoTitle?: Prisma.SortOrder;
    seoDesc?: Prisma.SortOrder;
    published?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PageMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    seoTitle?: Prisma.SortOrder;
    seoDesc?: Prisma.SortOrder;
    published?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PageMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    seoTitle?: Prisma.SortOrder;
    seoDesc?: Prisma.SortOrder;
    published?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PageCreateNestedManyWithoutTenantInput = {
    create?: Prisma.XOR<Prisma.PageCreateWithoutTenantInput, Prisma.PageUncheckedCreateWithoutTenantInput> | Prisma.PageCreateWithoutTenantInput[] | Prisma.PageUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.PageCreateOrConnectWithoutTenantInput | Prisma.PageCreateOrConnectWithoutTenantInput[];
    createMany?: Prisma.PageCreateManyTenantInputEnvelope;
    connect?: Prisma.PageWhereUniqueInput | Prisma.PageWhereUniqueInput[];
};
export type PageUncheckedCreateNestedManyWithoutTenantInput = {
    create?: Prisma.XOR<Prisma.PageCreateWithoutTenantInput, Prisma.PageUncheckedCreateWithoutTenantInput> | Prisma.PageCreateWithoutTenantInput[] | Prisma.PageUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.PageCreateOrConnectWithoutTenantInput | Prisma.PageCreateOrConnectWithoutTenantInput[];
    createMany?: Prisma.PageCreateManyTenantInputEnvelope;
    connect?: Prisma.PageWhereUniqueInput | Prisma.PageWhereUniqueInput[];
};
export type PageUpdateManyWithoutTenantNestedInput = {
    create?: Prisma.XOR<Prisma.PageCreateWithoutTenantInput, Prisma.PageUncheckedCreateWithoutTenantInput> | Prisma.PageCreateWithoutTenantInput[] | Prisma.PageUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.PageCreateOrConnectWithoutTenantInput | Prisma.PageCreateOrConnectWithoutTenantInput[];
    upsert?: Prisma.PageUpsertWithWhereUniqueWithoutTenantInput | Prisma.PageUpsertWithWhereUniqueWithoutTenantInput[];
    createMany?: Prisma.PageCreateManyTenantInputEnvelope;
    set?: Prisma.PageWhereUniqueInput | Prisma.PageWhereUniqueInput[];
    disconnect?: Prisma.PageWhereUniqueInput | Prisma.PageWhereUniqueInput[];
    delete?: Prisma.PageWhereUniqueInput | Prisma.PageWhereUniqueInput[];
    connect?: Prisma.PageWhereUniqueInput | Prisma.PageWhereUniqueInput[];
    update?: Prisma.PageUpdateWithWhereUniqueWithoutTenantInput | Prisma.PageUpdateWithWhereUniqueWithoutTenantInput[];
    updateMany?: Prisma.PageUpdateManyWithWhereWithoutTenantInput | Prisma.PageUpdateManyWithWhereWithoutTenantInput[];
    deleteMany?: Prisma.PageScalarWhereInput | Prisma.PageScalarWhereInput[];
};
export type PageUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: Prisma.XOR<Prisma.PageCreateWithoutTenantInput, Prisma.PageUncheckedCreateWithoutTenantInput> | Prisma.PageCreateWithoutTenantInput[] | Prisma.PageUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.PageCreateOrConnectWithoutTenantInput | Prisma.PageCreateOrConnectWithoutTenantInput[];
    upsert?: Prisma.PageUpsertWithWhereUniqueWithoutTenantInput | Prisma.PageUpsertWithWhereUniqueWithoutTenantInput[];
    createMany?: Prisma.PageCreateManyTenantInputEnvelope;
    set?: Prisma.PageWhereUniqueInput | Prisma.PageWhereUniqueInput[];
    disconnect?: Prisma.PageWhereUniqueInput | Prisma.PageWhereUniqueInput[];
    delete?: Prisma.PageWhereUniqueInput | Prisma.PageWhereUniqueInput[];
    connect?: Prisma.PageWhereUniqueInput | Prisma.PageWhereUniqueInput[];
    update?: Prisma.PageUpdateWithWhereUniqueWithoutTenantInput | Prisma.PageUpdateWithWhereUniqueWithoutTenantInput[];
    updateMany?: Prisma.PageUpdateManyWithWhereWithoutTenantInput | Prisma.PageUpdateManyWithWhereWithoutTenantInput[];
    deleteMany?: Prisma.PageScalarWhereInput | Prisma.PageScalarWhereInput[];
};
export type PageCreateWithoutTenantInput = {
    id?: string;
    title: string;
    slug: string;
    content: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    seoTitle?: string | null;
    seoDesc?: string | null;
    published?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PageUncheckedCreateWithoutTenantInput = {
    id?: string;
    title: string;
    slug: string;
    content: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    seoTitle?: string | null;
    seoDesc?: string | null;
    published?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PageCreateOrConnectWithoutTenantInput = {
    where: Prisma.PageWhereUniqueInput;
    create: Prisma.XOR<Prisma.PageCreateWithoutTenantInput, Prisma.PageUncheckedCreateWithoutTenantInput>;
};
export type PageCreateManyTenantInputEnvelope = {
    data: Prisma.PageCreateManyTenantInput | Prisma.PageCreateManyTenantInput[];
    skipDuplicates?: boolean;
};
export type PageUpsertWithWhereUniqueWithoutTenantInput = {
    where: Prisma.PageWhereUniqueInput;
    update: Prisma.XOR<Prisma.PageUpdateWithoutTenantInput, Prisma.PageUncheckedUpdateWithoutTenantInput>;
    create: Prisma.XOR<Prisma.PageCreateWithoutTenantInput, Prisma.PageUncheckedCreateWithoutTenantInput>;
};
export type PageUpdateWithWhereUniqueWithoutTenantInput = {
    where: Prisma.PageWhereUniqueInput;
    data: Prisma.XOR<Prisma.PageUpdateWithoutTenantInput, Prisma.PageUncheckedUpdateWithoutTenantInput>;
};
export type PageUpdateManyWithWhereWithoutTenantInput = {
    where: Prisma.PageScalarWhereInput;
    data: Prisma.XOR<Prisma.PageUpdateManyMutationInput, Prisma.PageUncheckedUpdateManyWithoutTenantInput>;
};
export type PageScalarWhereInput = {
    AND?: Prisma.PageScalarWhereInput | Prisma.PageScalarWhereInput[];
    OR?: Prisma.PageScalarWhereInput[];
    NOT?: Prisma.PageScalarWhereInput | Prisma.PageScalarWhereInput[];
    id?: Prisma.StringFilter<"Page"> | string;
    tenantId?: Prisma.StringFilter<"Page"> | string;
    title?: Prisma.StringFilter<"Page"> | string;
    slug?: Prisma.StringFilter<"Page"> | string;
    content?: Prisma.JsonFilter<"Page">;
    seoTitle?: Prisma.StringNullableFilter<"Page"> | string | null;
    seoDesc?: Prisma.StringNullableFilter<"Page"> | string | null;
    published?: Prisma.BoolFilter<"Page"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Page"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Page"> | Date | string;
};
export type PageCreateManyTenantInput = {
    id?: string;
    title: string;
    slug: string;
    content: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    seoTitle?: string | null;
    seoDesc?: string | null;
    published?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PageUpdateWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    seoTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    seoDesc?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PageUncheckedUpdateWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    seoTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    seoDesc?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PageUncheckedUpdateManyWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    seoTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    seoDesc?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    published?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PageSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    title?: boolean;
    slug?: boolean;
    content?: boolean;
    seoTitle?: boolean;
    seoDesc?: boolean;
    published?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["page"]>;
export type PageSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    title?: boolean;
    slug?: boolean;
    content?: boolean;
    seoTitle?: boolean;
    seoDesc?: boolean;
    published?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["page"]>;
export type PageSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    title?: boolean;
    slug?: boolean;
    content?: boolean;
    seoTitle?: boolean;
    seoDesc?: boolean;
    published?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["page"]>;
export type PageSelectScalar = {
    id?: boolean;
    tenantId?: boolean;
    title?: boolean;
    slug?: boolean;
    content?: boolean;
    seoTitle?: boolean;
    seoDesc?: boolean;
    published?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type PageOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "tenantId" | "title" | "slug" | "content" | "seoTitle" | "seoDesc" | "published" | "createdAt" | "updatedAt", ExtArgs["result"]["page"]>;
export type PageInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
};
export type PageIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
};
export type PageIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
};
export type $PagePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Page";
    objects: {
        tenant: Prisma.$TenantPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        tenantId: string;
        title: string;
        slug: string;
        content: runtime.JsonValue;
        seoTitle: string | null;
        seoDesc: string | null;
        published: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["page"]>;
    composites: {};
};
export type PageGetPayload<S extends boolean | null | undefined | PageDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PagePayload, S>;
export type PageCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PageCountAggregateInputType | true;
};
export interface PageDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Page'];
        meta: {
            name: 'Page';
        };
    };
    findUnique<T extends PageFindUniqueArgs>(args: Prisma.SelectSubset<T, PageFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PageClient<runtime.Types.Result.GetResult<Prisma.$PagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends PageFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PageFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PageClient<runtime.Types.Result.GetResult<Prisma.$PagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends PageFindFirstArgs>(args?: Prisma.SelectSubset<T, PageFindFirstArgs<ExtArgs>>): Prisma.Prisma__PageClient<runtime.Types.Result.GetResult<Prisma.$PagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends PageFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PageFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PageClient<runtime.Types.Result.GetResult<Prisma.$PagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends PageFindManyArgs>(args?: Prisma.SelectSubset<T, PageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends PageCreateArgs>(args: Prisma.SelectSubset<T, PageCreateArgs<ExtArgs>>): Prisma.Prisma__PageClient<runtime.Types.Result.GetResult<Prisma.$PagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends PageCreateManyArgs>(args?: Prisma.SelectSubset<T, PageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends PageCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends PageDeleteArgs>(args: Prisma.SelectSubset<T, PageDeleteArgs<ExtArgs>>): Prisma.Prisma__PageClient<runtime.Types.Result.GetResult<Prisma.$PagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends PageUpdateArgs>(args: Prisma.SelectSubset<T, PageUpdateArgs<ExtArgs>>): Prisma.Prisma__PageClient<runtime.Types.Result.GetResult<Prisma.$PagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends PageDeleteManyArgs>(args?: Prisma.SelectSubset<T, PageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends PageUpdateManyArgs>(args: Prisma.SelectSubset<T, PageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends PageUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends PageUpsertArgs>(args: Prisma.SelectSubset<T, PageUpsertArgs<ExtArgs>>): Prisma.Prisma__PageClient<runtime.Types.Result.GetResult<Prisma.$PagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends PageCountArgs>(args?: Prisma.Subset<T, PageCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PageCountAggregateOutputType> : number>;
    aggregate<T extends PageAggregateArgs>(args: Prisma.Subset<T, PageAggregateArgs>): Prisma.PrismaPromise<GetPageAggregateType<T>>;
    groupBy<T extends PageGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PageGroupByArgs['orderBy'];
    } : {
        orderBy?: PageGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PageFieldRefs;
}
export interface Prisma__PageClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    tenant<T extends Prisma.TenantDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TenantDefaultArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface PageFieldRefs {
    readonly id: Prisma.FieldRef<"Page", 'String'>;
    readonly tenantId: Prisma.FieldRef<"Page", 'String'>;
    readonly title: Prisma.FieldRef<"Page", 'String'>;
    readonly slug: Prisma.FieldRef<"Page", 'String'>;
    readonly content: Prisma.FieldRef<"Page", 'Json'>;
    readonly seoTitle: Prisma.FieldRef<"Page", 'String'>;
    readonly seoDesc: Prisma.FieldRef<"Page", 'String'>;
    readonly published: Prisma.FieldRef<"Page", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"Page", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Page", 'DateTime'>;
}
export type PageFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PageSelect<ExtArgs> | null;
    omit?: Prisma.PageOmit<ExtArgs> | null;
    include?: Prisma.PageInclude<ExtArgs> | null;
    where: Prisma.PageWhereUniqueInput;
};
export type PageFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PageSelect<ExtArgs> | null;
    omit?: Prisma.PageOmit<ExtArgs> | null;
    include?: Prisma.PageInclude<ExtArgs> | null;
    where: Prisma.PageWhereUniqueInput;
};
export type PageFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PageSelect<ExtArgs> | null;
    omit?: Prisma.PageOmit<ExtArgs> | null;
    include?: Prisma.PageInclude<ExtArgs> | null;
    where?: Prisma.PageWhereInput;
    orderBy?: Prisma.PageOrderByWithRelationInput | Prisma.PageOrderByWithRelationInput[];
    cursor?: Prisma.PageWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PageScalarFieldEnum | Prisma.PageScalarFieldEnum[];
};
export type PageFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PageSelect<ExtArgs> | null;
    omit?: Prisma.PageOmit<ExtArgs> | null;
    include?: Prisma.PageInclude<ExtArgs> | null;
    where?: Prisma.PageWhereInput;
    orderBy?: Prisma.PageOrderByWithRelationInput | Prisma.PageOrderByWithRelationInput[];
    cursor?: Prisma.PageWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PageScalarFieldEnum | Prisma.PageScalarFieldEnum[];
};
export type PageFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PageSelect<ExtArgs> | null;
    omit?: Prisma.PageOmit<ExtArgs> | null;
    include?: Prisma.PageInclude<ExtArgs> | null;
    where?: Prisma.PageWhereInput;
    orderBy?: Prisma.PageOrderByWithRelationInput | Prisma.PageOrderByWithRelationInput[];
    cursor?: Prisma.PageWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PageScalarFieldEnum | Prisma.PageScalarFieldEnum[];
};
export type PageCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PageSelect<ExtArgs> | null;
    omit?: Prisma.PageOmit<ExtArgs> | null;
    include?: Prisma.PageInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PageCreateInput, Prisma.PageUncheckedCreateInput>;
};
export type PageCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.PageCreateManyInput | Prisma.PageCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PageCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PageSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PageOmit<ExtArgs> | null;
    data: Prisma.PageCreateManyInput | Prisma.PageCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.PageIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type PageUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PageSelect<ExtArgs> | null;
    omit?: Prisma.PageOmit<ExtArgs> | null;
    include?: Prisma.PageInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PageUpdateInput, Prisma.PageUncheckedUpdateInput>;
    where: Prisma.PageWhereUniqueInput;
};
export type PageUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.PageUpdateManyMutationInput, Prisma.PageUncheckedUpdateManyInput>;
    where?: Prisma.PageWhereInput;
    limit?: number;
};
export type PageUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PageSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PageOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PageUpdateManyMutationInput, Prisma.PageUncheckedUpdateManyInput>;
    where?: Prisma.PageWhereInput;
    limit?: number;
    include?: Prisma.PageIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type PageUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PageSelect<ExtArgs> | null;
    omit?: Prisma.PageOmit<ExtArgs> | null;
    include?: Prisma.PageInclude<ExtArgs> | null;
    where: Prisma.PageWhereUniqueInput;
    create: Prisma.XOR<Prisma.PageCreateInput, Prisma.PageUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.PageUpdateInput, Prisma.PageUncheckedUpdateInput>;
};
export type PageDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PageSelect<ExtArgs> | null;
    omit?: Prisma.PageOmit<ExtArgs> | null;
    include?: Prisma.PageInclude<ExtArgs> | null;
    where: Prisma.PageWhereUniqueInput;
};
export type PageDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PageWhereInput;
    limit?: number;
};
export type PageDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PageSelect<ExtArgs> | null;
    omit?: Prisma.PageOmit<ExtArgs> | null;
    include?: Prisma.PageInclude<ExtArgs> | null;
};
