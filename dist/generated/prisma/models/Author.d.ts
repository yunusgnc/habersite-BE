import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type AuthorModel = runtime.Types.Result.DefaultSelection<Prisma.$AuthorPayload>;
export type AggregateAuthor = {
    _count: AuthorCountAggregateOutputType | null;
    _avg: AuthorAvgAggregateOutputType | null;
    _sum: AuthorSumAggregateOutputType | null;
    _min: AuthorMinAggregateOutputType | null;
    _max: AuthorMaxAggregateOutputType | null;
};
export type AuthorAvgAggregateOutputType = {
    sortOrder: number | null;
};
export type AuthorSumAggregateOutputType = {
    sortOrder: number | null;
};
export type AuthorMinAggregateOutputType = {
    id: string | null;
    tenantId: string | null;
    name: string | null;
    slug: string | null;
    bio: string | null;
    avatar: string | null;
    email: string | null;
    active: boolean | null;
    sortOrder: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type AuthorMaxAggregateOutputType = {
    id: string | null;
    tenantId: string | null;
    name: string | null;
    slug: string | null;
    bio: string | null;
    avatar: string | null;
    email: string | null;
    active: boolean | null;
    sortOrder: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type AuthorCountAggregateOutputType = {
    id: number;
    tenantId: number;
    name: number;
    slug: number;
    bio: number;
    avatar: number;
    email: number;
    social: number;
    active: number;
    sortOrder: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type AuthorAvgAggregateInputType = {
    sortOrder?: true;
};
export type AuthorSumAggregateInputType = {
    sortOrder?: true;
};
export type AuthorMinAggregateInputType = {
    id?: true;
    tenantId?: true;
    name?: true;
    slug?: true;
    bio?: true;
    avatar?: true;
    email?: true;
    active?: true;
    sortOrder?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type AuthorMaxAggregateInputType = {
    id?: true;
    tenantId?: true;
    name?: true;
    slug?: true;
    bio?: true;
    avatar?: true;
    email?: true;
    active?: true;
    sortOrder?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type AuthorCountAggregateInputType = {
    id?: true;
    tenantId?: true;
    name?: true;
    slug?: true;
    bio?: true;
    avatar?: true;
    email?: true;
    social?: true;
    active?: true;
    sortOrder?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type AuthorAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AuthorWhereInput;
    orderBy?: Prisma.AuthorOrderByWithRelationInput | Prisma.AuthorOrderByWithRelationInput[];
    cursor?: Prisma.AuthorWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | AuthorCountAggregateInputType;
    _avg?: AuthorAvgAggregateInputType;
    _sum?: AuthorSumAggregateInputType;
    _min?: AuthorMinAggregateInputType;
    _max?: AuthorMaxAggregateInputType;
};
export type GetAuthorAggregateType<T extends AuthorAggregateArgs> = {
    [P in keyof T & keyof AggregateAuthor]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateAuthor[P]> : Prisma.GetScalarType<T[P], AggregateAuthor[P]>;
};
export type AuthorGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AuthorWhereInput;
    orderBy?: Prisma.AuthorOrderByWithAggregationInput | Prisma.AuthorOrderByWithAggregationInput[];
    by: Prisma.AuthorScalarFieldEnum[] | Prisma.AuthorScalarFieldEnum;
    having?: Prisma.AuthorScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: AuthorCountAggregateInputType | true;
    _avg?: AuthorAvgAggregateInputType;
    _sum?: AuthorSumAggregateInputType;
    _min?: AuthorMinAggregateInputType;
    _max?: AuthorMaxAggregateInputType;
};
export type AuthorGroupByOutputType = {
    id: string;
    tenantId: string;
    name: string;
    slug: string;
    bio: string | null;
    avatar: string | null;
    email: string | null;
    social: runtime.JsonValue;
    active: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
    _count: AuthorCountAggregateOutputType | null;
    _avg: AuthorAvgAggregateOutputType | null;
    _sum: AuthorSumAggregateOutputType | null;
    _min: AuthorMinAggregateOutputType | null;
    _max: AuthorMaxAggregateOutputType | null;
};
export type GetAuthorGroupByPayload<T extends AuthorGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<AuthorGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof AuthorGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], AuthorGroupByOutputType[P]> : Prisma.GetScalarType<T[P], AuthorGroupByOutputType[P]>;
}>>;
export type AuthorWhereInput = {
    AND?: Prisma.AuthorWhereInput | Prisma.AuthorWhereInput[];
    OR?: Prisma.AuthorWhereInput[];
    NOT?: Prisma.AuthorWhereInput | Prisma.AuthorWhereInput[];
    id?: Prisma.StringFilter<"Author"> | string;
    tenantId?: Prisma.StringFilter<"Author"> | string;
    name?: Prisma.StringFilter<"Author"> | string;
    slug?: Prisma.StringFilter<"Author"> | string;
    bio?: Prisma.StringNullableFilter<"Author"> | string | null;
    avatar?: Prisma.StringNullableFilter<"Author"> | string | null;
    email?: Prisma.StringNullableFilter<"Author"> | string | null;
    social?: Prisma.JsonFilter<"Author">;
    active?: Prisma.BoolFilter<"Author"> | boolean;
    sortOrder?: Prisma.IntFilter<"Author"> | number;
    createdAt?: Prisma.DateTimeFilter<"Author"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Author"> | Date | string;
    tenant?: Prisma.XOR<Prisma.TenantScalarRelationFilter, Prisma.TenantWhereInput>;
    articles?: Prisma.ArticleListRelationFilter;
};
export type AuthorOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    bio?: Prisma.SortOrderInput | Prisma.SortOrder;
    avatar?: Prisma.SortOrderInput | Prisma.SortOrder;
    email?: Prisma.SortOrderInput | Prisma.SortOrder;
    social?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    tenant?: Prisma.TenantOrderByWithRelationInput;
    articles?: Prisma.ArticleOrderByRelationAggregateInput;
};
export type AuthorWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    tenantId_slug?: Prisma.AuthorTenantIdSlugCompoundUniqueInput;
    AND?: Prisma.AuthorWhereInput | Prisma.AuthorWhereInput[];
    OR?: Prisma.AuthorWhereInput[];
    NOT?: Prisma.AuthorWhereInput | Prisma.AuthorWhereInput[];
    tenantId?: Prisma.StringFilter<"Author"> | string;
    name?: Prisma.StringFilter<"Author"> | string;
    slug?: Prisma.StringFilter<"Author"> | string;
    bio?: Prisma.StringNullableFilter<"Author"> | string | null;
    avatar?: Prisma.StringNullableFilter<"Author"> | string | null;
    email?: Prisma.StringNullableFilter<"Author"> | string | null;
    social?: Prisma.JsonFilter<"Author">;
    active?: Prisma.BoolFilter<"Author"> | boolean;
    sortOrder?: Prisma.IntFilter<"Author"> | number;
    createdAt?: Prisma.DateTimeFilter<"Author"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Author"> | Date | string;
    tenant?: Prisma.XOR<Prisma.TenantScalarRelationFilter, Prisma.TenantWhereInput>;
    articles?: Prisma.ArticleListRelationFilter;
}, "id" | "tenantId_slug">;
export type AuthorOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    bio?: Prisma.SortOrderInput | Prisma.SortOrder;
    avatar?: Prisma.SortOrderInput | Prisma.SortOrder;
    email?: Prisma.SortOrderInput | Prisma.SortOrder;
    social?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.AuthorCountOrderByAggregateInput;
    _avg?: Prisma.AuthorAvgOrderByAggregateInput;
    _max?: Prisma.AuthorMaxOrderByAggregateInput;
    _min?: Prisma.AuthorMinOrderByAggregateInput;
    _sum?: Prisma.AuthorSumOrderByAggregateInput;
};
export type AuthorScalarWhereWithAggregatesInput = {
    AND?: Prisma.AuthorScalarWhereWithAggregatesInput | Prisma.AuthorScalarWhereWithAggregatesInput[];
    OR?: Prisma.AuthorScalarWhereWithAggregatesInput[];
    NOT?: Prisma.AuthorScalarWhereWithAggregatesInput | Prisma.AuthorScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Author"> | string;
    tenantId?: Prisma.StringWithAggregatesFilter<"Author"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Author"> | string;
    slug?: Prisma.StringWithAggregatesFilter<"Author"> | string;
    bio?: Prisma.StringNullableWithAggregatesFilter<"Author"> | string | null;
    avatar?: Prisma.StringNullableWithAggregatesFilter<"Author"> | string | null;
    email?: Prisma.StringNullableWithAggregatesFilter<"Author"> | string | null;
    social?: Prisma.JsonWithAggregatesFilter<"Author">;
    active?: Prisma.BoolWithAggregatesFilter<"Author"> | boolean;
    sortOrder?: Prisma.IntWithAggregatesFilter<"Author"> | number;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Author"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Author"> | Date | string;
};
export type AuthorCreateInput = {
    id?: string;
    name: string;
    slug: string;
    bio?: string | null;
    avatar?: string | null;
    email?: string | null;
    social?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    active?: boolean;
    sortOrder?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tenant: Prisma.TenantCreateNestedOneWithoutAuthorsInput;
    articles?: Prisma.ArticleCreateNestedManyWithoutAuthorInput;
};
export type AuthorUncheckedCreateInput = {
    id?: string;
    tenantId: string;
    name: string;
    slug: string;
    bio?: string | null;
    avatar?: string | null;
    email?: string | null;
    social?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    active?: boolean;
    sortOrder?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    articles?: Prisma.ArticleUncheckedCreateNestedManyWithoutAuthorInput;
};
export type AuthorUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatar?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    social?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tenant?: Prisma.TenantUpdateOneRequiredWithoutAuthorsNestedInput;
    articles?: Prisma.ArticleUpdateManyWithoutAuthorNestedInput;
};
export type AuthorUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatar?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    social?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    articles?: Prisma.ArticleUncheckedUpdateManyWithoutAuthorNestedInput;
};
export type AuthorCreateManyInput = {
    id?: string;
    tenantId: string;
    name: string;
    slug: string;
    bio?: string | null;
    avatar?: string | null;
    email?: string | null;
    social?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    active?: boolean;
    sortOrder?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type AuthorUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatar?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    social?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AuthorUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatar?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    social?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AuthorListRelationFilter = {
    every?: Prisma.AuthorWhereInput;
    some?: Prisma.AuthorWhereInput;
    none?: Prisma.AuthorWhereInput;
};
export type AuthorOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type AuthorTenantIdSlugCompoundUniqueInput = {
    tenantId: string;
    slug: string;
};
export type AuthorCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    bio?: Prisma.SortOrder;
    avatar?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    social?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type AuthorAvgOrderByAggregateInput = {
    sortOrder?: Prisma.SortOrder;
};
export type AuthorMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    bio?: Prisma.SortOrder;
    avatar?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type AuthorMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    bio?: Prisma.SortOrder;
    avatar?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type AuthorSumOrderByAggregateInput = {
    sortOrder?: Prisma.SortOrder;
};
export type AuthorNullableScalarRelationFilter = {
    is?: Prisma.AuthorWhereInput | null;
    isNot?: Prisma.AuthorWhereInput | null;
};
export type AuthorCreateNestedManyWithoutTenantInput = {
    create?: Prisma.XOR<Prisma.AuthorCreateWithoutTenantInput, Prisma.AuthorUncheckedCreateWithoutTenantInput> | Prisma.AuthorCreateWithoutTenantInput[] | Prisma.AuthorUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.AuthorCreateOrConnectWithoutTenantInput | Prisma.AuthorCreateOrConnectWithoutTenantInput[];
    createMany?: Prisma.AuthorCreateManyTenantInputEnvelope;
    connect?: Prisma.AuthorWhereUniqueInput | Prisma.AuthorWhereUniqueInput[];
};
export type AuthorUncheckedCreateNestedManyWithoutTenantInput = {
    create?: Prisma.XOR<Prisma.AuthorCreateWithoutTenantInput, Prisma.AuthorUncheckedCreateWithoutTenantInput> | Prisma.AuthorCreateWithoutTenantInput[] | Prisma.AuthorUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.AuthorCreateOrConnectWithoutTenantInput | Prisma.AuthorCreateOrConnectWithoutTenantInput[];
    createMany?: Prisma.AuthorCreateManyTenantInputEnvelope;
    connect?: Prisma.AuthorWhereUniqueInput | Prisma.AuthorWhereUniqueInput[];
};
export type AuthorUpdateManyWithoutTenantNestedInput = {
    create?: Prisma.XOR<Prisma.AuthorCreateWithoutTenantInput, Prisma.AuthorUncheckedCreateWithoutTenantInput> | Prisma.AuthorCreateWithoutTenantInput[] | Prisma.AuthorUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.AuthorCreateOrConnectWithoutTenantInput | Prisma.AuthorCreateOrConnectWithoutTenantInput[];
    upsert?: Prisma.AuthorUpsertWithWhereUniqueWithoutTenantInput | Prisma.AuthorUpsertWithWhereUniqueWithoutTenantInput[];
    createMany?: Prisma.AuthorCreateManyTenantInputEnvelope;
    set?: Prisma.AuthorWhereUniqueInput | Prisma.AuthorWhereUniqueInput[];
    disconnect?: Prisma.AuthorWhereUniqueInput | Prisma.AuthorWhereUniqueInput[];
    delete?: Prisma.AuthorWhereUniqueInput | Prisma.AuthorWhereUniqueInput[];
    connect?: Prisma.AuthorWhereUniqueInput | Prisma.AuthorWhereUniqueInput[];
    update?: Prisma.AuthorUpdateWithWhereUniqueWithoutTenantInput | Prisma.AuthorUpdateWithWhereUniqueWithoutTenantInput[];
    updateMany?: Prisma.AuthorUpdateManyWithWhereWithoutTenantInput | Prisma.AuthorUpdateManyWithWhereWithoutTenantInput[];
    deleteMany?: Prisma.AuthorScalarWhereInput | Prisma.AuthorScalarWhereInput[];
};
export type AuthorUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: Prisma.XOR<Prisma.AuthorCreateWithoutTenantInput, Prisma.AuthorUncheckedCreateWithoutTenantInput> | Prisma.AuthorCreateWithoutTenantInput[] | Prisma.AuthorUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.AuthorCreateOrConnectWithoutTenantInput | Prisma.AuthorCreateOrConnectWithoutTenantInput[];
    upsert?: Prisma.AuthorUpsertWithWhereUniqueWithoutTenantInput | Prisma.AuthorUpsertWithWhereUniqueWithoutTenantInput[];
    createMany?: Prisma.AuthorCreateManyTenantInputEnvelope;
    set?: Prisma.AuthorWhereUniqueInput | Prisma.AuthorWhereUniqueInput[];
    disconnect?: Prisma.AuthorWhereUniqueInput | Prisma.AuthorWhereUniqueInput[];
    delete?: Prisma.AuthorWhereUniqueInput | Prisma.AuthorWhereUniqueInput[];
    connect?: Prisma.AuthorWhereUniqueInput | Prisma.AuthorWhereUniqueInput[];
    update?: Prisma.AuthorUpdateWithWhereUniqueWithoutTenantInput | Prisma.AuthorUpdateWithWhereUniqueWithoutTenantInput[];
    updateMany?: Prisma.AuthorUpdateManyWithWhereWithoutTenantInput | Prisma.AuthorUpdateManyWithWhereWithoutTenantInput[];
    deleteMany?: Prisma.AuthorScalarWhereInput | Prisma.AuthorScalarWhereInput[];
};
export type AuthorCreateNestedOneWithoutArticlesInput = {
    create?: Prisma.XOR<Prisma.AuthorCreateWithoutArticlesInput, Prisma.AuthorUncheckedCreateWithoutArticlesInput>;
    connectOrCreate?: Prisma.AuthorCreateOrConnectWithoutArticlesInput;
    connect?: Prisma.AuthorWhereUniqueInput;
};
export type AuthorUpdateOneWithoutArticlesNestedInput = {
    create?: Prisma.XOR<Prisma.AuthorCreateWithoutArticlesInput, Prisma.AuthorUncheckedCreateWithoutArticlesInput>;
    connectOrCreate?: Prisma.AuthorCreateOrConnectWithoutArticlesInput;
    upsert?: Prisma.AuthorUpsertWithoutArticlesInput;
    disconnect?: Prisma.AuthorWhereInput | boolean;
    delete?: Prisma.AuthorWhereInput | boolean;
    connect?: Prisma.AuthorWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.AuthorUpdateToOneWithWhereWithoutArticlesInput, Prisma.AuthorUpdateWithoutArticlesInput>, Prisma.AuthorUncheckedUpdateWithoutArticlesInput>;
};
export type AuthorCreateWithoutTenantInput = {
    id?: string;
    name: string;
    slug: string;
    bio?: string | null;
    avatar?: string | null;
    email?: string | null;
    social?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    active?: boolean;
    sortOrder?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    articles?: Prisma.ArticleCreateNestedManyWithoutAuthorInput;
};
export type AuthorUncheckedCreateWithoutTenantInput = {
    id?: string;
    name: string;
    slug: string;
    bio?: string | null;
    avatar?: string | null;
    email?: string | null;
    social?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    active?: boolean;
    sortOrder?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    articles?: Prisma.ArticleUncheckedCreateNestedManyWithoutAuthorInput;
};
export type AuthorCreateOrConnectWithoutTenantInput = {
    where: Prisma.AuthorWhereUniqueInput;
    create: Prisma.XOR<Prisma.AuthorCreateWithoutTenantInput, Prisma.AuthorUncheckedCreateWithoutTenantInput>;
};
export type AuthorCreateManyTenantInputEnvelope = {
    data: Prisma.AuthorCreateManyTenantInput | Prisma.AuthorCreateManyTenantInput[];
    skipDuplicates?: boolean;
};
export type AuthorUpsertWithWhereUniqueWithoutTenantInput = {
    where: Prisma.AuthorWhereUniqueInput;
    update: Prisma.XOR<Prisma.AuthorUpdateWithoutTenantInput, Prisma.AuthorUncheckedUpdateWithoutTenantInput>;
    create: Prisma.XOR<Prisma.AuthorCreateWithoutTenantInput, Prisma.AuthorUncheckedCreateWithoutTenantInput>;
};
export type AuthorUpdateWithWhereUniqueWithoutTenantInput = {
    where: Prisma.AuthorWhereUniqueInput;
    data: Prisma.XOR<Prisma.AuthorUpdateWithoutTenantInput, Prisma.AuthorUncheckedUpdateWithoutTenantInput>;
};
export type AuthorUpdateManyWithWhereWithoutTenantInput = {
    where: Prisma.AuthorScalarWhereInput;
    data: Prisma.XOR<Prisma.AuthorUpdateManyMutationInput, Prisma.AuthorUncheckedUpdateManyWithoutTenantInput>;
};
export type AuthorScalarWhereInput = {
    AND?: Prisma.AuthorScalarWhereInput | Prisma.AuthorScalarWhereInput[];
    OR?: Prisma.AuthorScalarWhereInput[];
    NOT?: Prisma.AuthorScalarWhereInput | Prisma.AuthorScalarWhereInput[];
    id?: Prisma.StringFilter<"Author"> | string;
    tenantId?: Prisma.StringFilter<"Author"> | string;
    name?: Prisma.StringFilter<"Author"> | string;
    slug?: Prisma.StringFilter<"Author"> | string;
    bio?: Prisma.StringNullableFilter<"Author"> | string | null;
    avatar?: Prisma.StringNullableFilter<"Author"> | string | null;
    email?: Prisma.StringNullableFilter<"Author"> | string | null;
    social?: Prisma.JsonFilter<"Author">;
    active?: Prisma.BoolFilter<"Author"> | boolean;
    sortOrder?: Prisma.IntFilter<"Author"> | number;
    createdAt?: Prisma.DateTimeFilter<"Author"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Author"> | Date | string;
};
export type AuthorCreateWithoutArticlesInput = {
    id?: string;
    name: string;
    slug: string;
    bio?: string | null;
    avatar?: string | null;
    email?: string | null;
    social?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    active?: boolean;
    sortOrder?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tenant: Prisma.TenantCreateNestedOneWithoutAuthorsInput;
};
export type AuthorUncheckedCreateWithoutArticlesInput = {
    id?: string;
    tenantId: string;
    name: string;
    slug: string;
    bio?: string | null;
    avatar?: string | null;
    email?: string | null;
    social?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    active?: boolean;
    sortOrder?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type AuthorCreateOrConnectWithoutArticlesInput = {
    where: Prisma.AuthorWhereUniqueInput;
    create: Prisma.XOR<Prisma.AuthorCreateWithoutArticlesInput, Prisma.AuthorUncheckedCreateWithoutArticlesInput>;
};
export type AuthorUpsertWithoutArticlesInput = {
    update: Prisma.XOR<Prisma.AuthorUpdateWithoutArticlesInput, Prisma.AuthorUncheckedUpdateWithoutArticlesInput>;
    create: Prisma.XOR<Prisma.AuthorCreateWithoutArticlesInput, Prisma.AuthorUncheckedCreateWithoutArticlesInput>;
    where?: Prisma.AuthorWhereInput;
};
export type AuthorUpdateToOneWithWhereWithoutArticlesInput = {
    where?: Prisma.AuthorWhereInput;
    data: Prisma.XOR<Prisma.AuthorUpdateWithoutArticlesInput, Prisma.AuthorUncheckedUpdateWithoutArticlesInput>;
};
export type AuthorUpdateWithoutArticlesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatar?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    social?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tenant?: Prisma.TenantUpdateOneRequiredWithoutAuthorsNestedInput;
};
export type AuthorUncheckedUpdateWithoutArticlesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatar?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    social?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AuthorCreateManyTenantInput = {
    id?: string;
    name: string;
    slug: string;
    bio?: string | null;
    avatar?: string | null;
    email?: string | null;
    social?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    active?: boolean;
    sortOrder?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type AuthorUpdateWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatar?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    social?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    articles?: Prisma.ArticleUpdateManyWithoutAuthorNestedInput;
};
export type AuthorUncheckedUpdateWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatar?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    social?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    articles?: Prisma.ArticleUncheckedUpdateManyWithoutAuthorNestedInput;
};
export type AuthorUncheckedUpdateManyWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatar?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    social?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AuthorCountOutputType = {
    articles: number;
};
export type AuthorCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    articles?: boolean | AuthorCountOutputTypeCountArticlesArgs;
};
export type AuthorCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AuthorCountOutputTypeSelect<ExtArgs> | null;
};
export type AuthorCountOutputTypeCountArticlesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ArticleWhereInput;
};
export type AuthorSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    name?: boolean;
    slug?: boolean;
    bio?: boolean;
    avatar?: boolean;
    email?: boolean;
    social?: boolean;
    active?: boolean;
    sortOrder?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
    articles?: boolean | Prisma.Author$articlesArgs<ExtArgs>;
    _count?: boolean | Prisma.AuthorCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["author"]>;
export type AuthorSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    name?: boolean;
    slug?: boolean;
    bio?: boolean;
    avatar?: boolean;
    email?: boolean;
    social?: boolean;
    active?: boolean;
    sortOrder?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["author"]>;
export type AuthorSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    name?: boolean;
    slug?: boolean;
    bio?: boolean;
    avatar?: boolean;
    email?: boolean;
    social?: boolean;
    active?: boolean;
    sortOrder?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["author"]>;
export type AuthorSelectScalar = {
    id?: boolean;
    tenantId?: boolean;
    name?: boolean;
    slug?: boolean;
    bio?: boolean;
    avatar?: boolean;
    email?: boolean;
    social?: boolean;
    active?: boolean;
    sortOrder?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type AuthorOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "tenantId" | "name" | "slug" | "bio" | "avatar" | "email" | "social" | "active" | "sortOrder" | "createdAt" | "updatedAt", ExtArgs["result"]["author"]>;
export type AuthorInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
    articles?: boolean | Prisma.Author$articlesArgs<ExtArgs>;
    _count?: boolean | Prisma.AuthorCountOutputTypeDefaultArgs<ExtArgs>;
};
export type AuthorIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
};
export type AuthorIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
};
export type $AuthorPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Author";
    objects: {
        tenant: Prisma.$TenantPayload<ExtArgs>;
        articles: Prisma.$ArticlePayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        tenantId: string;
        name: string;
        slug: string;
        bio: string | null;
        avatar: string | null;
        email: string | null;
        social: runtime.JsonValue;
        active: boolean;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["author"]>;
    composites: {};
};
export type AuthorGetPayload<S extends boolean | null | undefined | AuthorDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$AuthorPayload, S>;
export type AuthorCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<AuthorFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: AuthorCountAggregateInputType | true;
};
export interface AuthorDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Author'];
        meta: {
            name: 'Author';
        };
    };
    findUnique<T extends AuthorFindUniqueArgs>(args: Prisma.SelectSubset<T, AuthorFindUniqueArgs<ExtArgs>>): Prisma.Prisma__AuthorClient<runtime.Types.Result.GetResult<Prisma.$AuthorPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends AuthorFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, AuthorFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__AuthorClient<runtime.Types.Result.GetResult<Prisma.$AuthorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends AuthorFindFirstArgs>(args?: Prisma.SelectSubset<T, AuthorFindFirstArgs<ExtArgs>>): Prisma.Prisma__AuthorClient<runtime.Types.Result.GetResult<Prisma.$AuthorPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends AuthorFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, AuthorFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__AuthorClient<runtime.Types.Result.GetResult<Prisma.$AuthorPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends AuthorFindManyArgs>(args?: Prisma.SelectSubset<T, AuthorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AuthorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends AuthorCreateArgs>(args: Prisma.SelectSubset<T, AuthorCreateArgs<ExtArgs>>): Prisma.Prisma__AuthorClient<runtime.Types.Result.GetResult<Prisma.$AuthorPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends AuthorCreateManyArgs>(args?: Prisma.SelectSubset<T, AuthorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends AuthorCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, AuthorCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AuthorPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends AuthorDeleteArgs>(args: Prisma.SelectSubset<T, AuthorDeleteArgs<ExtArgs>>): Prisma.Prisma__AuthorClient<runtime.Types.Result.GetResult<Prisma.$AuthorPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends AuthorUpdateArgs>(args: Prisma.SelectSubset<T, AuthorUpdateArgs<ExtArgs>>): Prisma.Prisma__AuthorClient<runtime.Types.Result.GetResult<Prisma.$AuthorPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends AuthorDeleteManyArgs>(args?: Prisma.SelectSubset<T, AuthorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends AuthorUpdateManyArgs>(args: Prisma.SelectSubset<T, AuthorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends AuthorUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, AuthorUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AuthorPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends AuthorUpsertArgs>(args: Prisma.SelectSubset<T, AuthorUpsertArgs<ExtArgs>>): Prisma.Prisma__AuthorClient<runtime.Types.Result.GetResult<Prisma.$AuthorPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends AuthorCountArgs>(args?: Prisma.Subset<T, AuthorCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], AuthorCountAggregateOutputType> : number>;
    aggregate<T extends AuthorAggregateArgs>(args: Prisma.Subset<T, AuthorAggregateArgs>): Prisma.PrismaPromise<GetAuthorAggregateType<T>>;
    groupBy<T extends AuthorGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: AuthorGroupByArgs['orderBy'];
    } : {
        orderBy?: AuthorGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, AuthorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuthorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: AuthorFieldRefs;
}
export interface Prisma__AuthorClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    tenant<T extends Prisma.TenantDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TenantDefaultArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    articles<T extends Prisma.Author$articlesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Author$articlesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface AuthorFieldRefs {
    readonly id: Prisma.FieldRef<"Author", 'String'>;
    readonly tenantId: Prisma.FieldRef<"Author", 'String'>;
    readonly name: Prisma.FieldRef<"Author", 'String'>;
    readonly slug: Prisma.FieldRef<"Author", 'String'>;
    readonly bio: Prisma.FieldRef<"Author", 'String'>;
    readonly avatar: Prisma.FieldRef<"Author", 'String'>;
    readonly email: Prisma.FieldRef<"Author", 'String'>;
    readonly social: Prisma.FieldRef<"Author", 'Json'>;
    readonly active: Prisma.FieldRef<"Author", 'Boolean'>;
    readonly sortOrder: Prisma.FieldRef<"Author", 'Int'>;
    readonly createdAt: Prisma.FieldRef<"Author", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Author", 'DateTime'>;
}
export type AuthorFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AuthorSelect<ExtArgs> | null;
    omit?: Prisma.AuthorOmit<ExtArgs> | null;
    include?: Prisma.AuthorInclude<ExtArgs> | null;
    where: Prisma.AuthorWhereUniqueInput;
};
export type AuthorFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AuthorSelect<ExtArgs> | null;
    omit?: Prisma.AuthorOmit<ExtArgs> | null;
    include?: Prisma.AuthorInclude<ExtArgs> | null;
    where: Prisma.AuthorWhereUniqueInput;
};
export type AuthorFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AuthorSelect<ExtArgs> | null;
    omit?: Prisma.AuthorOmit<ExtArgs> | null;
    include?: Prisma.AuthorInclude<ExtArgs> | null;
    where?: Prisma.AuthorWhereInput;
    orderBy?: Prisma.AuthorOrderByWithRelationInput | Prisma.AuthorOrderByWithRelationInput[];
    cursor?: Prisma.AuthorWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AuthorScalarFieldEnum | Prisma.AuthorScalarFieldEnum[];
};
export type AuthorFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AuthorSelect<ExtArgs> | null;
    omit?: Prisma.AuthorOmit<ExtArgs> | null;
    include?: Prisma.AuthorInclude<ExtArgs> | null;
    where?: Prisma.AuthorWhereInput;
    orderBy?: Prisma.AuthorOrderByWithRelationInput | Prisma.AuthorOrderByWithRelationInput[];
    cursor?: Prisma.AuthorWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AuthorScalarFieldEnum | Prisma.AuthorScalarFieldEnum[];
};
export type AuthorFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AuthorSelect<ExtArgs> | null;
    omit?: Prisma.AuthorOmit<ExtArgs> | null;
    include?: Prisma.AuthorInclude<ExtArgs> | null;
    where?: Prisma.AuthorWhereInput;
    orderBy?: Prisma.AuthorOrderByWithRelationInput | Prisma.AuthorOrderByWithRelationInput[];
    cursor?: Prisma.AuthorWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AuthorScalarFieldEnum | Prisma.AuthorScalarFieldEnum[];
};
export type AuthorCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AuthorSelect<ExtArgs> | null;
    omit?: Prisma.AuthorOmit<ExtArgs> | null;
    include?: Prisma.AuthorInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AuthorCreateInput, Prisma.AuthorUncheckedCreateInput>;
};
export type AuthorCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.AuthorCreateManyInput | Prisma.AuthorCreateManyInput[];
    skipDuplicates?: boolean;
};
export type AuthorCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AuthorSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.AuthorOmit<ExtArgs> | null;
    data: Prisma.AuthorCreateManyInput | Prisma.AuthorCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.AuthorIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type AuthorUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AuthorSelect<ExtArgs> | null;
    omit?: Prisma.AuthorOmit<ExtArgs> | null;
    include?: Prisma.AuthorInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AuthorUpdateInput, Prisma.AuthorUncheckedUpdateInput>;
    where: Prisma.AuthorWhereUniqueInput;
};
export type AuthorUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.AuthorUpdateManyMutationInput, Prisma.AuthorUncheckedUpdateManyInput>;
    where?: Prisma.AuthorWhereInput;
    limit?: number;
};
export type AuthorUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AuthorSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.AuthorOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AuthorUpdateManyMutationInput, Prisma.AuthorUncheckedUpdateManyInput>;
    where?: Prisma.AuthorWhereInput;
    limit?: number;
    include?: Prisma.AuthorIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type AuthorUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AuthorSelect<ExtArgs> | null;
    omit?: Prisma.AuthorOmit<ExtArgs> | null;
    include?: Prisma.AuthorInclude<ExtArgs> | null;
    where: Prisma.AuthorWhereUniqueInput;
    create: Prisma.XOR<Prisma.AuthorCreateInput, Prisma.AuthorUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.AuthorUpdateInput, Prisma.AuthorUncheckedUpdateInput>;
};
export type AuthorDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AuthorSelect<ExtArgs> | null;
    omit?: Prisma.AuthorOmit<ExtArgs> | null;
    include?: Prisma.AuthorInclude<ExtArgs> | null;
    where: Prisma.AuthorWhereUniqueInput;
};
export type AuthorDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AuthorWhereInput;
    limit?: number;
};
export type Author$articlesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticleSelect<ExtArgs> | null;
    omit?: Prisma.ArticleOmit<ExtArgs> | null;
    include?: Prisma.ArticleInclude<ExtArgs> | null;
    where?: Prisma.ArticleWhereInput;
    orderBy?: Prisma.ArticleOrderByWithRelationInput | Prisma.ArticleOrderByWithRelationInput[];
    cursor?: Prisma.ArticleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ArticleScalarFieldEnum | Prisma.ArticleScalarFieldEnum[];
};
export type AuthorDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AuthorSelect<ExtArgs> | null;
    omit?: Prisma.AuthorOmit<ExtArgs> | null;
    include?: Prisma.AuthorInclude<ExtArgs> | null;
};
