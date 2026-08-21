import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type CategoryModel = runtime.Types.Result.DefaultSelection<Prisma.$CategoryPayload>;
export type AggregateCategory = {
    _count: CategoryCountAggregateOutputType | null;
    _avg: CategoryAvgAggregateOutputType | null;
    _sum: CategorySumAggregateOutputType | null;
    _min: CategoryMinAggregateOutputType | null;
    _max: CategoryMaxAggregateOutputType | null;
};
export type CategoryAvgAggregateOutputType = {
    sortOrder: number | null;
};
export type CategorySumAggregateOutputType = {
    sortOrder: number | null;
};
export type CategoryMinAggregateOutputType = {
    id: string | null;
    tenantId: string | null;
    parentId: string | null;
    name: string | null;
    slug: string | null;
    description: string | null;
    image: string | null;
    color: string | null;
    sortOrder: number | null;
    active: boolean | null;
    seoTitle: string | null;
    seoDesc: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type CategoryMaxAggregateOutputType = {
    id: string | null;
    tenantId: string | null;
    parentId: string | null;
    name: string | null;
    slug: string | null;
    description: string | null;
    image: string | null;
    color: string | null;
    sortOrder: number | null;
    active: boolean | null;
    seoTitle: string | null;
    seoDesc: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type CategoryCountAggregateOutputType = {
    id: number;
    tenantId: number;
    parentId: number;
    name: number;
    slug: number;
    description: number;
    image: number;
    color: number;
    sortOrder: number;
    active: number;
    seoTitle: number;
    seoDesc: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type CategoryAvgAggregateInputType = {
    sortOrder?: true;
};
export type CategorySumAggregateInputType = {
    sortOrder?: true;
};
export type CategoryMinAggregateInputType = {
    id?: true;
    tenantId?: true;
    parentId?: true;
    name?: true;
    slug?: true;
    description?: true;
    image?: true;
    color?: true;
    sortOrder?: true;
    active?: true;
    seoTitle?: true;
    seoDesc?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type CategoryMaxAggregateInputType = {
    id?: true;
    tenantId?: true;
    parentId?: true;
    name?: true;
    slug?: true;
    description?: true;
    image?: true;
    color?: true;
    sortOrder?: true;
    active?: true;
    seoTitle?: true;
    seoDesc?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type CategoryCountAggregateInputType = {
    id?: true;
    tenantId?: true;
    parentId?: true;
    name?: true;
    slug?: true;
    description?: true;
    image?: true;
    color?: true;
    sortOrder?: true;
    active?: true;
    seoTitle?: true;
    seoDesc?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type CategoryAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CategoryWhereInput;
    orderBy?: Prisma.CategoryOrderByWithRelationInput | Prisma.CategoryOrderByWithRelationInput[];
    cursor?: Prisma.CategoryWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | CategoryCountAggregateInputType;
    _avg?: CategoryAvgAggregateInputType;
    _sum?: CategorySumAggregateInputType;
    _min?: CategoryMinAggregateInputType;
    _max?: CategoryMaxAggregateInputType;
};
export type GetCategoryAggregateType<T extends CategoryAggregateArgs> = {
    [P in keyof T & keyof AggregateCategory]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateCategory[P]> : Prisma.GetScalarType<T[P], AggregateCategory[P]>;
};
export type CategoryGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CategoryWhereInput;
    orderBy?: Prisma.CategoryOrderByWithAggregationInput | Prisma.CategoryOrderByWithAggregationInput[];
    by: Prisma.CategoryScalarFieldEnum[] | Prisma.CategoryScalarFieldEnum;
    having?: Prisma.CategoryScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CategoryCountAggregateInputType | true;
    _avg?: CategoryAvgAggregateInputType;
    _sum?: CategorySumAggregateInputType;
    _min?: CategoryMinAggregateInputType;
    _max?: CategoryMaxAggregateInputType;
};
export type CategoryGroupByOutputType = {
    id: string;
    tenantId: string;
    parentId: string | null;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    color: string | null;
    sortOrder: number;
    active: boolean;
    seoTitle: string | null;
    seoDesc: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: CategoryCountAggregateOutputType | null;
    _avg: CategoryAvgAggregateOutputType | null;
    _sum: CategorySumAggregateOutputType | null;
    _min: CategoryMinAggregateOutputType | null;
    _max: CategoryMaxAggregateOutputType | null;
};
export type GetCategoryGroupByPayload<T extends CategoryGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CategoryGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof CategoryGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CategoryGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CategoryGroupByOutputType[P]>;
}>>;
export type CategoryWhereInput = {
    AND?: Prisma.CategoryWhereInput | Prisma.CategoryWhereInput[];
    OR?: Prisma.CategoryWhereInput[];
    NOT?: Prisma.CategoryWhereInput | Prisma.CategoryWhereInput[];
    id?: Prisma.StringFilter<"Category"> | string;
    tenantId?: Prisma.StringFilter<"Category"> | string;
    parentId?: Prisma.StringNullableFilter<"Category"> | string | null;
    name?: Prisma.StringFilter<"Category"> | string;
    slug?: Prisma.StringFilter<"Category"> | string;
    description?: Prisma.StringNullableFilter<"Category"> | string | null;
    image?: Prisma.StringNullableFilter<"Category"> | string | null;
    color?: Prisma.StringNullableFilter<"Category"> | string | null;
    sortOrder?: Prisma.IntFilter<"Category"> | number;
    active?: Prisma.BoolFilter<"Category"> | boolean;
    seoTitle?: Prisma.StringNullableFilter<"Category"> | string | null;
    seoDesc?: Prisma.StringNullableFilter<"Category"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Category"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Category"> | Date | string;
    tenant?: Prisma.XOR<Prisma.TenantScalarRelationFilter, Prisma.TenantWhereInput>;
    parent?: Prisma.XOR<Prisma.CategoryNullableScalarRelationFilter, Prisma.CategoryWhereInput> | null;
    children?: Prisma.CategoryListRelationFilter;
    articles?: Prisma.ArticleCategoryListRelationFilter;
};
export type CategoryOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    parentId?: Prisma.SortOrderInput | Prisma.SortOrder;
    name?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    image?: Prisma.SortOrderInput | Prisma.SortOrder;
    color?: Prisma.SortOrderInput | Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    seoTitle?: Prisma.SortOrderInput | Prisma.SortOrder;
    seoDesc?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    tenant?: Prisma.TenantOrderByWithRelationInput;
    parent?: Prisma.CategoryOrderByWithRelationInput;
    children?: Prisma.CategoryOrderByRelationAggregateInput;
    articles?: Prisma.ArticleCategoryOrderByRelationAggregateInput;
};
export type CategoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    tenantId_slug?: Prisma.CategoryTenantIdSlugCompoundUniqueInput;
    AND?: Prisma.CategoryWhereInput | Prisma.CategoryWhereInput[];
    OR?: Prisma.CategoryWhereInput[];
    NOT?: Prisma.CategoryWhereInput | Prisma.CategoryWhereInput[];
    tenantId?: Prisma.StringFilter<"Category"> | string;
    parentId?: Prisma.StringNullableFilter<"Category"> | string | null;
    name?: Prisma.StringFilter<"Category"> | string;
    slug?: Prisma.StringFilter<"Category"> | string;
    description?: Prisma.StringNullableFilter<"Category"> | string | null;
    image?: Prisma.StringNullableFilter<"Category"> | string | null;
    color?: Prisma.StringNullableFilter<"Category"> | string | null;
    sortOrder?: Prisma.IntFilter<"Category"> | number;
    active?: Prisma.BoolFilter<"Category"> | boolean;
    seoTitle?: Prisma.StringNullableFilter<"Category"> | string | null;
    seoDesc?: Prisma.StringNullableFilter<"Category"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Category"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Category"> | Date | string;
    tenant?: Prisma.XOR<Prisma.TenantScalarRelationFilter, Prisma.TenantWhereInput>;
    parent?: Prisma.XOR<Prisma.CategoryNullableScalarRelationFilter, Prisma.CategoryWhereInput> | null;
    children?: Prisma.CategoryListRelationFilter;
    articles?: Prisma.ArticleCategoryListRelationFilter;
}, "id" | "tenantId_slug">;
export type CategoryOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    parentId?: Prisma.SortOrderInput | Prisma.SortOrder;
    name?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    image?: Prisma.SortOrderInput | Prisma.SortOrder;
    color?: Prisma.SortOrderInput | Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    seoTitle?: Prisma.SortOrderInput | Prisma.SortOrder;
    seoDesc?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.CategoryCountOrderByAggregateInput;
    _avg?: Prisma.CategoryAvgOrderByAggregateInput;
    _max?: Prisma.CategoryMaxOrderByAggregateInput;
    _min?: Prisma.CategoryMinOrderByAggregateInput;
    _sum?: Prisma.CategorySumOrderByAggregateInput;
};
export type CategoryScalarWhereWithAggregatesInput = {
    AND?: Prisma.CategoryScalarWhereWithAggregatesInput | Prisma.CategoryScalarWhereWithAggregatesInput[];
    OR?: Prisma.CategoryScalarWhereWithAggregatesInput[];
    NOT?: Prisma.CategoryScalarWhereWithAggregatesInput | Prisma.CategoryScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Category"> | string;
    tenantId?: Prisma.StringWithAggregatesFilter<"Category"> | string;
    parentId?: Prisma.StringNullableWithAggregatesFilter<"Category"> | string | null;
    name?: Prisma.StringWithAggregatesFilter<"Category"> | string;
    slug?: Prisma.StringWithAggregatesFilter<"Category"> | string;
    description?: Prisma.StringNullableWithAggregatesFilter<"Category"> | string | null;
    image?: Prisma.StringNullableWithAggregatesFilter<"Category"> | string | null;
    color?: Prisma.StringNullableWithAggregatesFilter<"Category"> | string | null;
    sortOrder?: Prisma.IntWithAggregatesFilter<"Category"> | number;
    active?: Prisma.BoolWithAggregatesFilter<"Category"> | boolean;
    seoTitle?: Prisma.StringNullableWithAggregatesFilter<"Category"> | string | null;
    seoDesc?: Prisma.StringNullableWithAggregatesFilter<"Category"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Category"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Category"> | Date | string;
};
export type CategoryCreateInput = {
    id?: string;
    name: string;
    slug: string;
    description?: string | null;
    image?: string | null;
    color?: string | null;
    sortOrder?: number;
    active?: boolean;
    seoTitle?: string | null;
    seoDesc?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tenant: Prisma.TenantCreateNestedOneWithoutCategoriesInput;
    parent?: Prisma.CategoryCreateNestedOneWithoutChildrenInput;
    children?: Prisma.CategoryCreateNestedManyWithoutParentInput;
    articles?: Prisma.ArticleCategoryCreateNestedManyWithoutCategoryInput;
};
export type CategoryUncheckedCreateInput = {
    id?: string;
    tenantId: string;
    parentId?: string | null;
    name: string;
    slug: string;
    description?: string | null;
    image?: string | null;
    color?: string | null;
    sortOrder?: number;
    active?: boolean;
    seoTitle?: string | null;
    seoDesc?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    children?: Prisma.CategoryUncheckedCreateNestedManyWithoutParentInput;
    articles?: Prisma.ArticleCategoryUncheckedCreateNestedManyWithoutCategoryInput;
};
export type CategoryUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    seoTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    seoDesc?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tenant?: Prisma.TenantUpdateOneRequiredWithoutCategoriesNestedInput;
    parent?: Prisma.CategoryUpdateOneWithoutChildrenNestedInput;
    children?: Prisma.CategoryUpdateManyWithoutParentNestedInput;
    articles?: Prisma.ArticleCategoryUpdateManyWithoutCategoryNestedInput;
};
export type CategoryUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    parentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    seoTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    seoDesc?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    children?: Prisma.CategoryUncheckedUpdateManyWithoutParentNestedInput;
    articles?: Prisma.ArticleCategoryUncheckedUpdateManyWithoutCategoryNestedInput;
};
export type CategoryCreateManyInput = {
    id?: string;
    tenantId: string;
    parentId?: string | null;
    name: string;
    slug: string;
    description?: string | null;
    image?: string | null;
    color?: string | null;
    sortOrder?: number;
    active?: boolean;
    seoTitle?: string | null;
    seoDesc?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CategoryUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    seoTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    seoDesc?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CategoryUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    parentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    seoTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    seoDesc?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CategoryListRelationFilter = {
    every?: Prisma.CategoryWhereInput;
    some?: Prisma.CategoryWhereInput;
    none?: Prisma.CategoryWhereInput;
};
export type CategoryOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type CategoryNullableScalarRelationFilter = {
    is?: Prisma.CategoryWhereInput | null;
    isNot?: Prisma.CategoryWhereInput | null;
};
export type CategoryTenantIdSlugCompoundUniqueInput = {
    tenantId: string;
    slug: string;
};
export type CategoryCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    parentId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    image?: Prisma.SortOrder;
    color?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    seoTitle?: Prisma.SortOrder;
    seoDesc?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type CategoryAvgOrderByAggregateInput = {
    sortOrder?: Prisma.SortOrder;
};
export type CategoryMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    parentId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    image?: Prisma.SortOrder;
    color?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    seoTitle?: Prisma.SortOrder;
    seoDesc?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type CategoryMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    parentId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    image?: Prisma.SortOrder;
    color?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    seoTitle?: Prisma.SortOrder;
    seoDesc?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type CategorySumOrderByAggregateInput = {
    sortOrder?: Prisma.SortOrder;
};
export type CategoryScalarRelationFilter = {
    is?: Prisma.CategoryWhereInput;
    isNot?: Prisma.CategoryWhereInput;
};
export type CategoryCreateNestedManyWithoutTenantInput = {
    create?: Prisma.XOR<Prisma.CategoryCreateWithoutTenantInput, Prisma.CategoryUncheckedCreateWithoutTenantInput> | Prisma.CategoryCreateWithoutTenantInput[] | Prisma.CategoryUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.CategoryCreateOrConnectWithoutTenantInput | Prisma.CategoryCreateOrConnectWithoutTenantInput[];
    createMany?: Prisma.CategoryCreateManyTenantInputEnvelope;
    connect?: Prisma.CategoryWhereUniqueInput | Prisma.CategoryWhereUniqueInput[];
};
export type CategoryUncheckedCreateNestedManyWithoutTenantInput = {
    create?: Prisma.XOR<Prisma.CategoryCreateWithoutTenantInput, Prisma.CategoryUncheckedCreateWithoutTenantInput> | Prisma.CategoryCreateWithoutTenantInput[] | Prisma.CategoryUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.CategoryCreateOrConnectWithoutTenantInput | Prisma.CategoryCreateOrConnectWithoutTenantInput[];
    createMany?: Prisma.CategoryCreateManyTenantInputEnvelope;
    connect?: Prisma.CategoryWhereUniqueInput | Prisma.CategoryWhereUniqueInput[];
};
export type CategoryUpdateManyWithoutTenantNestedInput = {
    create?: Prisma.XOR<Prisma.CategoryCreateWithoutTenantInput, Prisma.CategoryUncheckedCreateWithoutTenantInput> | Prisma.CategoryCreateWithoutTenantInput[] | Prisma.CategoryUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.CategoryCreateOrConnectWithoutTenantInput | Prisma.CategoryCreateOrConnectWithoutTenantInput[];
    upsert?: Prisma.CategoryUpsertWithWhereUniqueWithoutTenantInput | Prisma.CategoryUpsertWithWhereUniqueWithoutTenantInput[];
    createMany?: Prisma.CategoryCreateManyTenantInputEnvelope;
    set?: Prisma.CategoryWhereUniqueInput | Prisma.CategoryWhereUniqueInput[];
    disconnect?: Prisma.CategoryWhereUniqueInput | Prisma.CategoryWhereUniqueInput[];
    delete?: Prisma.CategoryWhereUniqueInput | Prisma.CategoryWhereUniqueInput[];
    connect?: Prisma.CategoryWhereUniqueInput | Prisma.CategoryWhereUniqueInput[];
    update?: Prisma.CategoryUpdateWithWhereUniqueWithoutTenantInput | Prisma.CategoryUpdateWithWhereUniqueWithoutTenantInput[];
    updateMany?: Prisma.CategoryUpdateManyWithWhereWithoutTenantInput | Prisma.CategoryUpdateManyWithWhereWithoutTenantInput[];
    deleteMany?: Prisma.CategoryScalarWhereInput | Prisma.CategoryScalarWhereInput[];
};
export type CategoryUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: Prisma.XOR<Prisma.CategoryCreateWithoutTenantInput, Prisma.CategoryUncheckedCreateWithoutTenantInput> | Prisma.CategoryCreateWithoutTenantInput[] | Prisma.CategoryUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.CategoryCreateOrConnectWithoutTenantInput | Prisma.CategoryCreateOrConnectWithoutTenantInput[];
    upsert?: Prisma.CategoryUpsertWithWhereUniqueWithoutTenantInput | Prisma.CategoryUpsertWithWhereUniqueWithoutTenantInput[];
    createMany?: Prisma.CategoryCreateManyTenantInputEnvelope;
    set?: Prisma.CategoryWhereUniqueInput | Prisma.CategoryWhereUniqueInput[];
    disconnect?: Prisma.CategoryWhereUniqueInput | Prisma.CategoryWhereUniqueInput[];
    delete?: Prisma.CategoryWhereUniqueInput | Prisma.CategoryWhereUniqueInput[];
    connect?: Prisma.CategoryWhereUniqueInput | Prisma.CategoryWhereUniqueInput[];
    update?: Prisma.CategoryUpdateWithWhereUniqueWithoutTenantInput | Prisma.CategoryUpdateWithWhereUniqueWithoutTenantInput[];
    updateMany?: Prisma.CategoryUpdateManyWithWhereWithoutTenantInput | Prisma.CategoryUpdateManyWithWhereWithoutTenantInput[];
    deleteMany?: Prisma.CategoryScalarWhereInput | Prisma.CategoryScalarWhereInput[];
};
export type CategoryCreateNestedOneWithoutChildrenInput = {
    create?: Prisma.XOR<Prisma.CategoryCreateWithoutChildrenInput, Prisma.CategoryUncheckedCreateWithoutChildrenInput>;
    connectOrCreate?: Prisma.CategoryCreateOrConnectWithoutChildrenInput;
    connect?: Prisma.CategoryWhereUniqueInput;
};
export type CategoryCreateNestedManyWithoutParentInput = {
    create?: Prisma.XOR<Prisma.CategoryCreateWithoutParentInput, Prisma.CategoryUncheckedCreateWithoutParentInput> | Prisma.CategoryCreateWithoutParentInput[] | Prisma.CategoryUncheckedCreateWithoutParentInput[];
    connectOrCreate?: Prisma.CategoryCreateOrConnectWithoutParentInput | Prisma.CategoryCreateOrConnectWithoutParentInput[];
    createMany?: Prisma.CategoryCreateManyParentInputEnvelope;
    connect?: Prisma.CategoryWhereUniqueInput | Prisma.CategoryWhereUniqueInput[];
};
export type CategoryUncheckedCreateNestedManyWithoutParentInput = {
    create?: Prisma.XOR<Prisma.CategoryCreateWithoutParentInput, Prisma.CategoryUncheckedCreateWithoutParentInput> | Prisma.CategoryCreateWithoutParentInput[] | Prisma.CategoryUncheckedCreateWithoutParentInput[];
    connectOrCreate?: Prisma.CategoryCreateOrConnectWithoutParentInput | Prisma.CategoryCreateOrConnectWithoutParentInput[];
    createMany?: Prisma.CategoryCreateManyParentInputEnvelope;
    connect?: Prisma.CategoryWhereUniqueInput | Prisma.CategoryWhereUniqueInput[];
};
export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type CategoryUpdateOneWithoutChildrenNestedInput = {
    create?: Prisma.XOR<Prisma.CategoryCreateWithoutChildrenInput, Prisma.CategoryUncheckedCreateWithoutChildrenInput>;
    connectOrCreate?: Prisma.CategoryCreateOrConnectWithoutChildrenInput;
    upsert?: Prisma.CategoryUpsertWithoutChildrenInput;
    disconnect?: Prisma.CategoryWhereInput | boolean;
    delete?: Prisma.CategoryWhereInput | boolean;
    connect?: Prisma.CategoryWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CategoryUpdateToOneWithWhereWithoutChildrenInput, Prisma.CategoryUpdateWithoutChildrenInput>, Prisma.CategoryUncheckedUpdateWithoutChildrenInput>;
};
export type CategoryUpdateManyWithoutParentNestedInput = {
    create?: Prisma.XOR<Prisma.CategoryCreateWithoutParentInput, Prisma.CategoryUncheckedCreateWithoutParentInput> | Prisma.CategoryCreateWithoutParentInput[] | Prisma.CategoryUncheckedCreateWithoutParentInput[];
    connectOrCreate?: Prisma.CategoryCreateOrConnectWithoutParentInput | Prisma.CategoryCreateOrConnectWithoutParentInput[];
    upsert?: Prisma.CategoryUpsertWithWhereUniqueWithoutParentInput | Prisma.CategoryUpsertWithWhereUniqueWithoutParentInput[];
    createMany?: Prisma.CategoryCreateManyParentInputEnvelope;
    set?: Prisma.CategoryWhereUniqueInput | Prisma.CategoryWhereUniqueInput[];
    disconnect?: Prisma.CategoryWhereUniqueInput | Prisma.CategoryWhereUniqueInput[];
    delete?: Prisma.CategoryWhereUniqueInput | Prisma.CategoryWhereUniqueInput[];
    connect?: Prisma.CategoryWhereUniqueInput | Prisma.CategoryWhereUniqueInput[];
    update?: Prisma.CategoryUpdateWithWhereUniqueWithoutParentInput | Prisma.CategoryUpdateWithWhereUniqueWithoutParentInput[];
    updateMany?: Prisma.CategoryUpdateManyWithWhereWithoutParentInput | Prisma.CategoryUpdateManyWithWhereWithoutParentInput[];
    deleteMany?: Prisma.CategoryScalarWhereInput | Prisma.CategoryScalarWhereInput[];
};
export type CategoryUncheckedUpdateManyWithoutParentNestedInput = {
    create?: Prisma.XOR<Prisma.CategoryCreateWithoutParentInput, Prisma.CategoryUncheckedCreateWithoutParentInput> | Prisma.CategoryCreateWithoutParentInput[] | Prisma.CategoryUncheckedCreateWithoutParentInput[];
    connectOrCreate?: Prisma.CategoryCreateOrConnectWithoutParentInput | Prisma.CategoryCreateOrConnectWithoutParentInput[];
    upsert?: Prisma.CategoryUpsertWithWhereUniqueWithoutParentInput | Prisma.CategoryUpsertWithWhereUniqueWithoutParentInput[];
    createMany?: Prisma.CategoryCreateManyParentInputEnvelope;
    set?: Prisma.CategoryWhereUniqueInput | Prisma.CategoryWhereUniqueInput[];
    disconnect?: Prisma.CategoryWhereUniqueInput | Prisma.CategoryWhereUniqueInput[];
    delete?: Prisma.CategoryWhereUniqueInput | Prisma.CategoryWhereUniqueInput[];
    connect?: Prisma.CategoryWhereUniqueInput | Prisma.CategoryWhereUniqueInput[];
    update?: Prisma.CategoryUpdateWithWhereUniqueWithoutParentInput | Prisma.CategoryUpdateWithWhereUniqueWithoutParentInput[];
    updateMany?: Prisma.CategoryUpdateManyWithWhereWithoutParentInput | Prisma.CategoryUpdateManyWithWhereWithoutParentInput[];
    deleteMany?: Prisma.CategoryScalarWhereInput | Prisma.CategoryScalarWhereInput[];
};
export type CategoryCreateNestedOneWithoutArticlesInput = {
    create?: Prisma.XOR<Prisma.CategoryCreateWithoutArticlesInput, Prisma.CategoryUncheckedCreateWithoutArticlesInput>;
    connectOrCreate?: Prisma.CategoryCreateOrConnectWithoutArticlesInput;
    connect?: Prisma.CategoryWhereUniqueInput;
};
export type CategoryUpdateOneRequiredWithoutArticlesNestedInput = {
    create?: Prisma.XOR<Prisma.CategoryCreateWithoutArticlesInput, Prisma.CategoryUncheckedCreateWithoutArticlesInput>;
    connectOrCreate?: Prisma.CategoryCreateOrConnectWithoutArticlesInput;
    upsert?: Prisma.CategoryUpsertWithoutArticlesInput;
    connect?: Prisma.CategoryWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CategoryUpdateToOneWithWhereWithoutArticlesInput, Prisma.CategoryUpdateWithoutArticlesInput>, Prisma.CategoryUncheckedUpdateWithoutArticlesInput>;
};
export type CategoryCreateWithoutTenantInput = {
    id?: string;
    name: string;
    slug: string;
    description?: string | null;
    image?: string | null;
    color?: string | null;
    sortOrder?: number;
    active?: boolean;
    seoTitle?: string | null;
    seoDesc?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    parent?: Prisma.CategoryCreateNestedOneWithoutChildrenInput;
    children?: Prisma.CategoryCreateNestedManyWithoutParentInput;
    articles?: Prisma.ArticleCategoryCreateNestedManyWithoutCategoryInput;
};
export type CategoryUncheckedCreateWithoutTenantInput = {
    id?: string;
    parentId?: string | null;
    name: string;
    slug: string;
    description?: string | null;
    image?: string | null;
    color?: string | null;
    sortOrder?: number;
    active?: boolean;
    seoTitle?: string | null;
    seoDesc?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    children?: Prisma.CategoryUncheckedCreateNestedManyWithoutParentInput;
    articles?: Prisma.ArticleCategoryUncheckedCreateNestedManyWithoutCategoryInput;
};
export type CategoryCreateOrConnectWithoutTenantInput = {
    where: Prisma.CategoryWhereUniqueInput;
    create: Prisma.XOR<Prisma.CategoryCreateWithoutTenantInput, Prisma.CategoryUncheckedCreateWithoutTenantInput>;
};
export type CategoryCreateManyTenantInputEnvelope = {
    data: Prisma.CategoryCreateManyTenantInput | Prisma.CategoryCreateManyTenantInput[];
    skipDuplicates?: boolean;
};
export type CategoryUpsertWithWhereUniqueWithoutTenantInput = {
    where: Prisma.CategoryWhereUniqueInput;
    update: Prisma.XOR<Prisma.CategoryUpdateWithoutTenantInput, Prisma.CategoryUncheckedUpdateWithoutTenantInput>;
    create: Prisma.XOR<Prisma.CategoryCreateWithoutTenantInput, Prisma.CategoryUncheckedCreateWithoutTenantInput>;
};
export type CategoryUpdateWithWhereUniqueWithoutTenantInput = {
    where: Prisma.CategoryWhereUniqueInput;
    data: Prisma.XOR<Prisma.CategoryUpdateWithoutTenantInput, Prisma.CategoryUncheckedUpdateWithoutTenantInput>;
};
export type CategoryUpdateManyWithWhereWithoutTenantInput = {
    where: Prisma.CategoryScalarWhereInput;
    data: Prisma.XOR<Prisma.CategoryUpdateManyMutationInput, Prisma.CategoryUncheckedUpdateManyWithoutTenantInput>;
};
export type CategoryScalarWhereInput = {
    AND?: Prisma.CategoryScalarWhereInput | Prisma.CategoryScalarWhereInput[];
    OR?: Prisma.CategoryScalarWhereInput[];
    NOT?: Prisma.CategoryScalarWhereInput | Prisma.CategoryScalarWhereInput[];
    id?: Prisma.StringFilter<"Category"> | string;
    tenantId?: Prisma.StringFilter<"Category"> | string;
    parentId?: Prisma.StringNullableFilter<"Category"> | string | null;
    name?: Prisma.StringFilter<"Category"> | string;
    slug?: Prisma.StringFilter<"Category"> | string;
    description?: Prisma.StringNullableFilter<"Category"> | string | null;
    image?: Prisma.StringNullableFilter<"Category"> | string | null;
    color?: Prisma.StringNullableFilter<"Category"> | string | null;
    sortOrder?: Prisma.IntFilter<"Category"> | number;
    active?: Prisma.BoolFilter<"Category"> | boolean;
    seoTitle?: Prisma.StringNullableFilter<"Category"> | string | null;
    seoDesc?: Prisma.StringNullableFilter<"Category"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Category"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Category"> | Date | string;
};
export type CategoryCreateWithoutChildrenInput = {
    id?: string;
    name: string;
    slug: string;
    description?: string | null;
    image?: string | null;
    color?: string | null;
    sortOrder?: number;
    active?: boolean;
    seoTitle?: string | null;
    seoDesc?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tenant: Prisma.TenantCreateNestedOneWithoutCategoriesInput;
    parent?: Prisma.CategoryCreateNestedOneWithoutChildrenInput;
    articles?: Prisma.ArticleCategoryCreateNestedManyWithoutCategoryInput;
};
export type CategoryUncheckedCreateWithoutChildrenInput = {
    id?: string;
    tenantId: string;
    parentId?: string | null;
    name: string;
    slug: string;
    description?: string | null;
    image?: string | null;
    color?: string | null;
    sortOrder?: number;
    active?: boolean;
    seoTitle?: string | null;
    seoDesc?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    articles?: Prisma.ArticleCategoryUncheckedCreateNestedManyWithoutCategoryInput;
};
export type CategoryCreateOrConnectWithoutChildrenInput = {
    where: Prisma.CategoryWhereUniqueInput;
    create: Prisma.XOR<Prisma.CategoryCreateWithoutChildrenInput, Prisma.CategoryUncheckedCreateWithoutChildrenInput>;
};
export type CategoryCreateWithoutParentInput = {
    id?: string;
    name: string;
    slug: string;
    description?: string | null;
    image?: string | null;
    color?: string | null;
    sortOrder?: number;
    active?: boolean;
    seoTitle?: string | null;
    seoDesc?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tenant: Prisma.TenantCreateNestedOneWithoutCategoriesInput;
    children?: Prisma.CategoryCreateNestedManyWithoutParentInput;
    articles?: Prisma.ArticleCategoryCreateNestedManyWithoutCategoryInput;
};
export type CategoryUncheckedCreateWithoutParentInput = {
    id?: string;
    tenantId: string;
    name: string;
    slug: string;
    description?: string | null;
    image?: string | null;
    color?: string | null;
    sortOrder?: number;
    active?: boolean;
    seoTitle?: string | null;
    seoDesc?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    children?: Prisma.CategoryUncheckedCreateNestedManyWithoutParentInput;
    articles?: Prisma.ArticleCategoryUncheckedCreateNestedManyWithoutCategoryInput;
};
export type CategoryCreateOrConnectWithoutParentInput = {
    where: Prisma.CategoryWhereUniqueInput;
    create: Prisma.XOR<Prisma.CategoryCreateWithoutParentInput, Prisma.CategoryUncheckedCreateWithoutParentInput>;
};
export type CategoryCreateManyParentInputEnvelope = {
    data: Prisma.CategoryCreateManyParentInput | Prisma.CategoryCreateManyParentInput[];
    skipDuplicates?: boolean;
};
export type CategoryUpsertWithoutChildrenInput = {
    update: Prisma.XOR<Prisma.CategoryUpdateWithoutChildrenInput, Prisma.CategoryUncheckedUpdateWithoutChildrenInput>;
    create: Prisma.XOR<Prisma.CategoryCreateWithoutChildrenInput, Prisma.CategoryUncheckedCreateWithoutChildrenInput>;
    where?: Prisma.CategoryWhereInput;
};
export type CategoryUpdateToOneWithWhereWithoutChildrenInput = {
    where?: Prisma.CategoryWhereInput;
    data: Prisma.XOR<Prisma.CategoryUpdateWithoutChildrenInput, Prisma.CategoryUncheckedUpdateWithoutChildrenInput>;
};
export type CategoryUpdateWithoutChildrenInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    seoTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    seoDesc?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tenant?: Prisma.TenantUpdateOneRequiredWithoutCategoriesNestedInput;
    parent?: Prisma.CategoryUpdateOneWithoutChildrenNestedInput;
    articles?: Prisma.ArticleCategoryUpdateManyWithoutCategoryNestedInput;
};
export type CategoryUncheckedUpdateWithoutChildrenInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    parentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    seoTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    seoDesc?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    articles?: Prisma.ArticleCategoryUncheckedUpdateManyWithoutCategoryNestedInput;
};
export type CategoryUpsertWithWhereUniqueWithoutParentInput = {
    where: Prisma.CategoryWhereUniqueInput;
    update: Prisma.XOR<Prisma.CategoryUpdateWithoutParentInput, Prisma.CategoryUncheckedUpdateWithoutParentInput>;
    create: Prisma.XOR<Prisma.CategoryCreateWithoutParentInput, Prisma.CategoryUncheckedCreateWithoutParentInput>;
};
export type CategoryUpdateWithWhereUniqueWithoutParentInput = {
    where: Prisma.CategoryWhereUniqueInput;
    data: Prisma.XOR<Prisma.CategoryUpdateWithoutParentInput, Prisma.CategoryUncheckedUpdateWithoutParentInput>;
};
export type CategoryUpdateManyWithWhereWithoutParentInput = {
    where: Prisma.CategoryScalarWhereInput;
    data: Prisma.XOR<Prisma.CategoryUpdateManyMutationInput, Prisma.CategoryUncheckedUpdateManyWithoutParentInput>;
};
export type CategoryCreateWithoutArticlesInput = {
    id?: string;
    name: string;
    slug: string;
    description?: string | null;
    image?: string | null;
    color?: string | null;
    sortOrder?: number;
    active?: boolean;
    seoTitle?: string | null;
    seoDesc?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tenant: Prisma.TenantCreateNestedOneWithoutCategoriesInput;
    parent?: Prisma.CategoryCreateNestedOneWithoutChildrenInput;
    children?: Prisma.CategoryCreateNestedManyWithoutParentInput;
};
export type CategoryUncheckedCreateWithoutArticlesInput = {
    id?: string;
    tenantId: string;
    parentId?: string | null;
    name: string;
    slug: string;
    description?: string | null;
    image?: string | null;
    color?: string | null;
    sortOrder?: number;
    active?: boolean;
    seoTitle?: string | null;
    seoDesc?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    children?: Prisma.CategoryUncheckedCreateNestedManyWithoutParentInput;
};
export type CategoryCreateOrConnectWithoutArticlesInput = {
    where: Prisma.CategoryWhereUniqueInput;
    create: Prisma.XOR<Prisma.CategoryCreateWithoutArticlesInput, Prisma.CategoryUncheckedCreateWithoutArticlesInput>;
};
export type CategoryUpsertWithoutArticlesInput = {
    update: Prisma.XOR<Prisma.CategoryUpdateWithoutArticlesInput, Prisma.CategoryUncheckedUpdateWithoutArticlesInput>;
    create: Prisma.XOR<Prisma.CategoryCreateWithoutArticlesInput, Prisma.CategoryUncheckedCreateWithoutArticlesInput>;
    where?: Prisma.CategoryWhereInput;
};
export type CategoryUpdateToOneWithWhereWithoutArticlesInput = {
    where?: Prisma.CategoryWhereInput;
    data: Prisma.XOR<Prisma.CategoryUpdateWithoutArticlesInput, Prisma.CategoryUncheckedUpdateWithoutArticlesInput>;
};
export type CategoryUpdateWithoutArticlesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    seoTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    seoDesc?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tenant?: Prisma.TenantUpdateOneRequiredWithoutCategoriesNestedInput;
    parent?: Prisma.CategoryUpdateOneWithoutChildrenNestedInput;
    children?: Prisma.CategoryUpdateManyWithoutParentNestedInput;
};
export type CategoryUncheckedUpdateWithoutArticlesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    parentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    seoTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    seoDesc?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    children?: Prisma.CategoryUncheckedUpdateManyWithoutParentNestedInput;
};
export type CategoryCreateManyTenantInput = {
    id?: string;
    parentId?: string | null;
    name: string;
    slug: string;
    description?: string | null;
    image?: string | null;
    color?: string | null;
    sortOrder?: number;
    active?: boolean;
    seoTitle?: string | null;
    seoDesc?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CategoryUpdateWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    seoTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    seoDesc?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    parent?: Prisma.CategoryUpdateOneWithoutChildrenNestedInput;
    children?: Prisma.CategoryUpdateManyWithoutParentNestedInput;
    articles?: Prisma.ArticleCategoryUpdateManyWithoutCategoryNestedInput;
};
export type CategoryUncheckedUpdateWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    parentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    seoTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    seoDesc?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    children?: Prisma.CategoryUncheckedUpdateManyWithoutParentNestedInput;
    articles?: Prisma.ArticleCategoryUncheckedUpdateManyWithoutCategoryNestedInput;
};
export type CategoryUncheckedUpdateManyWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    parentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    seoTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    seoDesc?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CategoryCreateManyParentInput = {
    id?: string;
    tenantId: string;
    name: string;
    slug: string;
    description?: string | null;
    image?: string | null;
    color?: string | null;
    sortOrder?: number;
    active?: boolean;
    seoTitle?: string | null;
    seoDesc?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CategoryUpdateWithoutParentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    seoTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    seoDesc?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tenant?: Prisma.TenantUpdateOneRequiredWithoutCategoriesNestedInput;
    children?: Prisma.CategoryUpdateManyWithoutParentNestedInput;
    articles?: Prisma.ArticleCategoryUpdateManyWithoutCategoryNestedInput;
};
export type CategoryUncheckedUpdateWithoutParentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    seoTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    seoDesc?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    children?: Prisma.CategoryUncheckedUpdateManyWithoutParentNestedInput;
    articles?: Prisma.ArticleCategoryUncheckedUpdateManyWithoutCategoryNestedInput;
};
export type CategoryUncheckedUpdateManyWithoutParentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    seoTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    seoDesc?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CategoryCountOutputType = {
    children: number;
    articles: number;
};
export type CategoryCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    children?: boolean | CategoryCountOutputTypeCountChildrenArgs;
    articles?: boolean | CategoryCountOutputTypeCountArticlesArgs;
};
export type CategoryCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CategoryCountOutputTypeSelect<ExtArgs> | null;
};
export type CategoryCountOutputTypeCountChildrenArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CategoryWhereInput;
};
export type CategoryCountOutputTypeCountArticlesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ArticleCategoryWhereInput;
};
export type CategorySelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    parentId?: boolean;
    name?: boolean;
    slug?: boolean;
    description?: boolean;
    image?: boolean;
    color?: boolean;
    sortOrder?: boolean;
    active?: boolean;
    seoTitle?: boolean;
    seoDesc?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
    parent?: boolean | Prisma.Category$parentArgs<ExtArgs>;
    children?: boolean | Prisma.Category$childrenArgs<ExtArgs>;
    articles?: boolean | Prisma.Category$articlesArgs<ExtArgs>;
    _count?: boolean | Prisma.CategoryCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["category"]>;
export type CategorySelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    parentId?: boolean;
    name?: boolean;
    slug?: boolean;
    description?: boolean;
    image?: boolean;
    color?: boolean;
    sortOrder?: boolean;
    active?: boolean;
    seoTitle?: boolean;
    seoDesc?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
    parent?: boolean | Prisma.Category$parentArgs<ExtArgs>;
}, ExtArgs["result"]["category"]>;
export type CategorySelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    parentId?: boolean;
    name?: boolean;
    slug?: boolean;
    description?: boolean;
    image?: boolean;
    color?: boolean;
    sortOrder?: boolean;
    active?: boolean;
    seoTitle?: boolean;
    seoDesc?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
    parent?: boolean | Prisma.Category$parentArgs<ExtArgs>;
}, ExtArgs["result"]["category"]>;
export type CategorySelectScalar = {
    id?: boolean;
    tenantId?: boolean;
    parentId?: boolean;
    name?: boolean;
    slug?: boolean;
    description?: boolean;
    image?: boolean;
    color?: boolean;
    sortOrder?: boolean;
    active?: boolean;
    seoTitle?: boolean;
    seoDesc?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type CategoryOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "tenantId" | "parentId" | "name" | "slug" | "description" | "image" | "color" | "sortOrder" | "active" | "seoTitle" | "seoDesc" | "createdAt" | "updatedAt", ExtArgs["result"]["category"]>;
export type CategoryInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
    parent?: boolean | Prisma.Category$parentArgs<ExtArgs>;
    children?: boolean | Prisma.Category$childrenArgs<ExtArgs>;
    articles?: boolean | Prisma.Category$articlesArgs<ExtArgs>;
    _count?: boolean | Prisma.CategoryCountOutputTypeDefaultArgs<ExtArgs>;
};
export type CategoryIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
    parent?: boolean | Prisma.Category$parentArgs<ExtArgs>;
};
export type CategoryIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
    parent?: boolean | Prisma.Category$parentArgs<ExtArgs>;
};
export type $CategoryPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Category";
    objects: {
        tenant: Prisma.$TenantPayload<ExtArgs>;
        parent: Prisma.$CategoryPayload<ExtArgs> | null;
        children: Prisma.$CategoryPayload<ExtArgs>[];
        articles: Prisma.$ArticleCategoryPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        tenantId: string;
        parentId: string | null;
        name: string;
        slug: string;
        description: string | null;
        image: string | null;
        color: string | null;
        sortOrder: number;
        active: boolean;
        seoTitle: string | null;
        seoDesc: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["category"]>;
    composites: {};
};
export type CategoryGetPayload<S extends boolean | null | undefined | CategoryDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$CategoryPayload, S>;
export type CategoryCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<CategoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CategoryCountAggregateInputType | true;
};
export interface CategoryDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Category'];
        meta: {
            name: 'Category';
        };
    };
    findUnique<T extends CategoryFindUniqueArgs>(args: Prisma.SelectSubset<T, CategoryFindUniqueArgs<ExtArgs>>): Prisma.Prisma__CategoryClient<runtime.Types.Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends CategoryFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, CategoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__CategoryClient<runtime.Types.Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends CategoryFindFirstArgs>(args?: Prisma.SelectSubset<T, CategoryFindFirstArgs<ExtArgs>>): Prisma.Prisma__CategoryClient<runtime.Types.Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends CategoryFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, CategoryFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__CategoryClient<runtime.Types.Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends CategoryFindManyArgs>(args?: Prisma.SelectSubset<T, CategoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends CategoryCreateArgs>(args: Prisma.SelectSubset<T, CategoryCreateArgs<ExtArgs>>): Prisma.Prisma__CategoryClient<runtime.Types.Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends CategoryCreateManyArgs>(args?: Prisma.SelectSubset<T, CategoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends CategoryCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, CategoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends CategoryDeleteArgs>(args: Prisma.SelectSubset<T, CategoryDeleteArgs<ExtArgs>>): Prisma.Prisma__CategoryClient<runtime.Types.Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends CategoryUpdateArgs>(args: Prisma.SelectSubset<T, CategoryUpdateArgs<ExtArgs>>): Prisma.Prisma__CategoryClient<runtime.Types.Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends CategoryDeleteManyArgs>(args?: Prisma.SelectSubset<T, CategoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends CategoryUpdateManyArgs>(args: Prisma.SelectSubset<T, CategoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends CategoryUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, CategoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends CategoryUpsertArgs>(args: Prisma.SelectSubset<T, CategoryUpsertArgs<ExtArgs>>): Prisma.Prisma__CategoryClient<runtime.Types.Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends CategoryCountArgs>(args?: Prisma.Subset<T, CategoryCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CategoryCountAggregateOutputType> : number>;
    aggregate<T extends CategoryAggregateArgs>(args: Prisma.Subset<T, CategoryAggregateArgs>): Prisma.PrismaPromise<GetCategoryAggregateType<T>>;
    groupBy<T extends CategoryGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: CategoryGroupByArgs['orderBy'];
    } : {
        orderBy?: CategoryGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, CategoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCategoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: CategoryFieldRefs;
}
export interface Prisma__CategoryClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    tenant<T extends Prisma.TenantDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TenantDefaultArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    parent<T extends Prisma.Category$parentArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Category$parentArgs<ExtArgs>>): Prisma.Prisma__CategoryClient<runtime.Types.Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    children<T extends Prisma.Category$childrenArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Category$childrenArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    articles<T extends Prisma.Category$articlesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Category$articlesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ArticleCategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface CategoryFieldRefs {
    readonly id: Prisma.FieldRef<"Category", 'String'>;
    readonly tenantId: Prisma.FieldRef<"Category", 'String'>;
    readonly parentId: Prisma.FieldRef<"Category", 'String'>;
    readonly name: Prisma.FieldRef<"Category", 'String'>;
    readonly slug: Prisma.FieldRef<"Category", 'String'>;
    readonly description: Prisma.FieldRef<"Category", 'String'>;
    readonly image: Prisma.FieldRef<"Category", 'String'>;
    readonly color: Prisma.FieldRef<"Category", 'String'>;
    readonly sortOrder: Prisma.FieldRef<"Category", 'Int'>;
    readonly active: Prisma.FieldRef<"Category", 'Boolean'>;
    readonly seoTitle: Prisma.FieldRef<"Category", 'String'>;
    readonly seoDesc: Prisma.FieldRef<"Category", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Category", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Category", 'DateTime'>;
}
export type CategoryFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CategorySelect<ExtArgs> | null;
    omit?: Prisma.CategoryOmit<ExtArgs> | null;
    include?: Prisma.CategoryInclude<ExtArgs> | null;
    where: Prisma.CategoryWhereUniqueInput;
};
export type CategoryFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CategorySelect<ExtArgs> | null;
    omit?: Prisma.CategoryOmit<ExtArgs> | null;
    include?: Prisma.CategoryInclude<ExtArgs> | null;
    where: Prisma.CategoryWhereUniqueInput;
};
export type CategoryFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CategorySelect<ExtArgs> | null;
    omit?: Prisma.CategoryOmit<ExtArgs> | null;
    include?: Prisma.CategoryInclude<ExtArgs> | null;
    where?: Prisma.CategoryWhereInput;
    orderBy?: Prisma.CategoryOrderByWithRelationInput | Prisma.CategoryOrderByWithRelationInput[];
    cursor?: Prisma.CategoryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CategoryScalarFieldEnum | Prisma.CategoryScalarFieldEnum[];
};
export type CategoryFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CategorySelect<ExtArgs> | null;
    omit?: Prisma.CategoryOmit<ExtArgs> | null;
    include?: Prisma.CategoryInclude<ExtArgs> | null;
    where?: Prisma.CategoryWhereInput;
    orderBy?: Prisma.CategoryOrderByWithRelationInput | Prisma.CategoryOrderByWithRelationInput[];
    cursor?: Prisma.CategoryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CategoryScalarFieldEnum | Prisma.CategoryScalarFieldEnum[];
};
export type CategoryFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CategorySelect<ExtArgs> | null;
    omit?: Prisma.CategoryOmit<ExtArgs> | null;
    include?: Prisma.CategoryInclude<ExtArgs> | null;
    where?: Prisma.CategoryWhereInput;
    orderBy?: Prisma.CategoryOrderByWithRelationInput | Prisma.CategoryOrderByWithRelationInput[];
    cursor?: Prisma.CategoryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CategoryScalarFieldEnum | Prisma.CategoryScalarFieldEnum[];
};
export type CategoryCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CategorySelect<ExtArgs> | null;
    omit?: Prisma.CategoryOmit<ExtArgs> | null;
    include?: Prisma.CategoryInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CategoryCreateInput, Prisma.CategoryUncheckedCreateInput>;
};
export type CategoryCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.CategoryCreateManyInput | Prisma.CategoryCreateManyInput[];
    skipDuplicates?: boolean;
};
export type CategoryCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CategorySelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CategoryOmit<ExtArgs> | null;
    data: Prisma.CategoryCreateManyInput | Prisma.CategoryCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.CategoryIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type CategoryUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CategorySelect<ExtArgs> | null;
    omit?: Prisma.CategoryOmit<ExtArgs> | null;
    include?: Prisma.CategoryInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CategoryUpdateInput, Prisma.CategoryUncheckedUpdateInput>;
    where: Prisma.CategoryWhereUniqueInput;
};
export type CategoryUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.CategoryUpdateManyMutationInput, Prisma.CategoryUncheckedUpdateManyInput>;
    where?: Prisma.CategoryWhereInput;
    limit?: number;
};
export type CategoryUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CategorySelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CategoryOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CategoryUpdateManyMutationInput, Prisma.CategoryUncheckedUpdateManyInput>;
    where?: Prisma.CategoryWhereInput;
    limit?: number;
    include?: Prisma.CategoryIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type CategoryUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CategorySelect<ExtArgs> | null;
    omit?: Prisma.CategoryOmit<ExtArgs> | null;
    include?: Prisma.CategoryInclude<ExtArgs> | null;
    where: Prisma.CategoryWhereUniqueInput;
    create: Prisma.XOR<Prisma.CategoryCreateInput, Prisma.CategoryUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.CategoryUpdateInput, Prisma.CategoryUncheckedUpdateInput>;
};
export type CategoryDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CategorySelect<ExtArgs> | null;
    omit?: Prisma.CategoryOmit<ExtArgs> | null;
    include?: Prisma.CategoryInclude<ExtArgs> | null;
    where: Prisma.CategoryWhereUniqueInput;
};
export type CategoryDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CategoryWhereInput;
    limit?: number;
};
export type Category$parentArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CategorySelect<ExtArgs> | null;
    omit?: Prisma.CategoryOmit<ExtArgs> | null;
    include?: Prisma.CategoryInclude<ExtArgs> | null;
    where?: Prisma.CategoryWhereInput;
};
export type Category$childrenArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CategorySelect<ExtArgs> | null;
    omit?: Prisma.CategoryOmit<ExtArgs> | null;
    include?: Prisma.CategoryInclude<ExtArgs> | null;
    where?: Prisma.CategoryWhereInput;
    orderBy?: Prisma.CategoryOrderByWithRelationInput | Prisma.CategoryOrderByWithRelationInput[];
    cursor?: Prisma.CategoryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CategoryScalarFieldEnum | Prisma.CategoryScalarFieldEnum[];
};
export type Category$articlesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticleCategorySelect<ExtArgs> | null;
    omit?: Prisma.ArticleCategoryOmit<ExtArgs> | null;
    include?: Prisma.ArticleCategoryInclude<ExtArgs> | null;
    where?: Prisma.ArticleCategoryWhereInput;
    orderBy?: Prisma.ArticleCategoryOrderByWithRelationInput | Prisma.ArticleCategoryOrderByWithRelationInput[];
    cursor?: Prisma.ArticleCategoryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ArticleCategoryScalarFieldEnum | Prisma.ArticleCategoryScalarFieldEnum[];
};
export type CategoryDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CategorySelect<ExtArgs> | null;
    omit?: Prisma.CategoryOmit<ExtArgs> | null;
    include?: Prisma.CategoryInclude<ExtArgs> | null;
};
