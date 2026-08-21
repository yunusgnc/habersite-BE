import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type CommentModel = runtime.Types.Result.DefaultSelection<Prisma.$CommentPayload>;
export type AggregateComment = {
    _count: CommentCountAggregateOutputType | null;
    _min: CommentMinAggregateOutputType | null;
    _max: CommentMaxAggregateOutputType | null;
};
export type CommentMinAggregateOutputType = {
    id: string | null;
    tenantId: string | null;
    articleId: string | null;
    parentId: string | null;
    name: string | null;
    email: string | null;
    content: string | null;
    ipAddress: string | null;
    status: $Enums.CommentStatus | null;
    createdAt: Date | null;
};
export type CommentMaxAggregateOutputType = {
    id: string | null;
    tenantId: string | null;
    articleId: string | null;
    parentId: string | null;
    name: string | null;
    email: string | null;
    content: string | null;
    ipAddress: string | null;
    status: $Enums.CommentStatus | null;
    createdAt: Date | null;
};
export type CommentCountAggregateOutputType = {
    id: number;
    tenantId: number;
    articleId: number;
    parentId: number;
    name: number;
    email: number;
    content: number;
    ipAddress: number;
    status: number;
    createdAt: number;
    _all: number;
};
export type CommentMinAggregateInputType = {
    id?: true;
    tenantId?: true;
    articleId?: true;
    parentId?: true;
    name?: true;
    email?: true;
    content?: true;
    ipAddress?: true;
    status?: true;
    createdAt?: true;
};
export type CommentMaxAggregateInputType = {
    id?: true;
    tenantId?: true;
    articleId?: true;
    parentId?: true;
    name?: true;
    email?: true;
    content?: true;
    ipAddress?: true;
    status?: true;
    createdAt?: true;
};
export type CommentCountAggregateInputType = {
    id?: true;
    tenantId?: true;
    articleId?: true;
    parentId?: true;
    name?: true;
    email?: true;
    content?: true;
    ipAddress?: true;
    status?: true;
    createdAt?: true;
    _all?: true;
};
export type CommentAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CommentWhereInput;
    orderBy?: Prisma.CommentOrderByWithRelationInput | Prisma.CommentOrderByWithRelationInput[];
    cursor?: Prisma.CommentWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | CommentCountAggregateInputType;
    _min?: CommentMinAggregateInputType;
    _max?: CommentMaxAggregateInputType;
};
export type GetCommentAggregateType<T extends CommentAggregateArgs> = {
    [P in keyof T & keyof AggregateComment]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateComment[P]> : Prisma.GetScalarType<T[P], AggregateComment[P]>;
};
export type CommentGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CommentWhereInput;
    orderBy?: Prisma.CommentOrderByWithAggregationInput | Prisma.CommentOrderByWithAggregationInput[];
    by: Prisma.CommentScalarFieldEnum[] | Prisma.CommentScalarFieldEnum;
    having?: Prisma.CommentScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CommentCountAggregateInputType | true;
    _min?: CommentMinAggregateInputType;
    _max?: CommentMaxAggregateInputType;
};
export type CommentGroupByOutputType = {
    id: string;
    tenantId: string;
    articleId: string;
    parentId: string | null;
    name: string;
    email: string;
    content: string;
    ipAddress: string | null;
    status: $Enums.CommentStatus;
    createdAt: Date;
    _count: CommentCountAggregateOutputType | null;
    _min: CommentMinAggregateOutputType | null;
    _max: CommentMaxAggregateOutputType | null;
};
export type GetCommentGroupByPayload<T extends CommentGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CommentGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof CommentGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CommentGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CommentGroupByOutputType[P]>;
}>>;
export type CommentWhereInput = {
    AND?: Prisma.CommentWhereInput | Prisma.CommentWhereInput[];
    OR?: Prisma.CommentWhereInput[];
    NOT?: Prisma.CommentWhereInput | Prisma.CommentWhereInput[];
    id?: Prisma.StringFilter<"Comment"> | string;
    tenantId?: Prisma.StringFilter<"Comment"> | string;
    articleId?: Prisma.StringFilter<"Comment"> | string;
    parentId?: Prisma.StringNullableFilter<"Comment"> | string | null;
    name?: Prisma.StringFilter<"Comment"> | string;
    email?: Prisma.StringFilter<"Comment"> | string;
    content?: Prisma.StringFilter<"Comment"> | string;
    ipAddress?: Prisma.StringNullableFilter<"Comment"> | string | null;
    status?: Prisma.EnumCommentStatusFilter<"Comment"> | $Enums.CommentStatus;
    createdAt?: Prisma.DateTimeFilter<"Comment"> | Date | string;
    tenant?: Prisma.XOR<Prisma.TenantScalarRelationFilter, Prisma.TenantWhereInput>;
    article?: Prisma.XOR<Prisma.ArticleScalarRelationFilter, Prisma.ArticleWhereInput>;
    parent?: Prisma.XOR<Prisma.CommentNullableScalarRelationFilter, Prisma.CommentWhereInput> | null;
    replies?: Prisma.CommentListRelationFilter;
};
export type CommentOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    articleId?: Prisma.SortOrder;
    parentId?: Prisma.SortOrderInput | Prisma.SortOrder;
    name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    ipAddress?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    tenant?: Prisma.TenantOrderByWithRelationInput;
    article?: Prisma.ArticleOrderByWithRelationInput;
    parent?: Prisma.CommentOrderByWithRelationInput;
    replies?: Prisma.CommentOrderByRelationAggregateInput;
};
export type CommentWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.CommentWhereInput | Prisma.CommentWhereInput[];
    OR?: Prisma.CommentWhereInput[];
    NOT?: Prisma.CommentWhereInput | Prisma.CommentWhereInput[];
    tenantId?: Prisma.StringFilter<"Comment"> | string;
    articleId?: Prisma.StringFilter<"Comment"> | string;
    parentId?: Prisma.StringNullableFilter<"Comment"> | string | null;
    name?: Prisma.StringFilter<"Comment"> | string;
    email?: Prisma.StringFilter<"Comment"> | string;
    content?: Prisma.StringFilter<"Comment"> | string;
    ipAddress?: Prisma.StringNullableFilter<"Comment"> | string | null;
    status?: Prisma.EnumCommentStatusFilter<"Comment"> | $Enums.CommentStatus;
    createdAt?: Prisma.DateTimeFilter<"Comment"> | Date | string;
    tenant?: Prisma.XOR<Prisma.TenantScalarRelationFilter, Prisma.TenantWhereInput>;
    article?: Prisma.XOR<Prisma.ArticleScalarRelationFilter, Prisma.ArticleWhereInput>;
    parent?: Prisma.XOR<Prisma.CommentNullableScalarRelationFilter, Prisma.CommentWhereInput> | null;
    replies?: Prisma.CommentListRelationFilter;
}, "id">;
export type CommentOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    articleId?: Prisma.SortOrder;
    parentId?: Prisma.SortOrderInput | Prisma.SortOrder;
    name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    ipAddress?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.CommentCountOrderByAggregateInput;
    _max?: Prisma.CommentMaxOrderByAggregateInput;
    _min?: Prisma.CommentMinOrderByAggregateInput;
};
export type CommentScalarWhereWithAggregatesInput = {
    AND?: Prisma.CommentScalarWhereWithAggregatesInput | Prisma.CommentScalarWhereWithAggregatesInput[];
    OR?: Prisma.CommentScalarWhereWithAggregatesInput[];
    NOT?: Prisma.CommentScalarWhereWithAggregatesInput | Prisma.CommentScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Comment"> | string;
    tenantId?: Prisma.StringWithAggregatesFilter<"Comment"> | string;
    articleId?: Prisma.StringWithAggregatesFilter<"Comment"> | string;
    parentId?: Prisma.StringNullableWithAggregatesFilter<"Comment"> | string | null;
    name?: Prisma.StringWithAggregatesFilter<"Comment"> | string;
    email?: Prisma.StringWithAggregatesFilter<"Comment"> | string;
    content?: Prisma.StringWithAggregatesFilter<"Comment"> | string;
    ipAddress?: Prisma.StringNullableWithAggregatesFilter<"Comment"> | string | null;
    status?: Prisma.EnumCommentStatusWithAggregatesFilter<"Comment"> | $Enums.CommentStatus;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Comment"> | Date | string;
};
export type CommentCreateInput = {
    id?: string;
    name: string;
    email: string;
    content: string;
    ipAddress?: string | null;
    status?: $Enums.CommentStatus;
    createdAt?: Date | string;
    tenant: Prisma.TenantCreateNestedOneWithoutCommentsInput;
    article: Prisma.ArticleCreateNestedOneWithoutCommentsInput;
    parent?: Prisma.CommentCreateNestedOneWithoutRepliesInput;
    replies?: Prisma.CommentCreateNestedManyWithoutParentInput;
};
export type CommentUncheckedCreateInput = {
    id?: string;
    tenantId: string;
    articleId: string;
    parentId?: string | null;
    name: string;
    email: string;
    content: string;
    ipAddress?: string | null;
    status?: $Enums.CommentStatus;
    createdAt?: Date | string;
    replies?: Prisma.CommentUncheckedCreateNestedManyWithoutParentInput;
};
export type CommentUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    ipAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumCommentStatusFieldUpdateOperationsInput | $Enums.CommentStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tenant?: Prisma.TenantUpdateOneRequiredWithoutCommentsNestedInput;
    article?: Prisma.ArticleUpdateOneRequiredWithoutCommentsNestedInput;
    parent?: Prisma.CommentUpdateOneWithoutRepliesNestedInput;
    replies?: Prisma.CommentUpdateManyWithoutParentNestedInput;
};
export type CommentUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    articleId?: Prisma.StringFieldUpdateOperationsInput | string;
    parentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    ipAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumCommentStatusFieldUpdateOperationsInput | $Enums.CommentStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    replies?: Prisma.CommentUncheckedUpdateManyWithoutParentNestedInput;
};
export type CommentCreateManyInput = {
    id?: string;
    tenantId: string;
    articleId: string;
    parentId?: string | null;
    name: string;
    email: string;
    content: string;
    ipAddress?: string | null;
    status?: $Enums.CommentStatus;
    createdAt?: Date | string;
};
export type CommentUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    ipAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumCommentStatusFieldUpdateOperationsInput | $Enums.CommentStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CommentUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    articleId?: Prisma.StringFieldUpdateOperationsInput | string;
    parentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    ipAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumCommentStatusFieldUpdateOperationsInput | $Enums.CommentStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CommentListRelationFilter = {
    every?: Prisma.CommentWhereInput;
    some?: Prisma.CommentWhereInput;
    none?: Prisma.CommentWhereInput;
};
export type CommentOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type CommentNullableScalarRelationFilter = {
    is?: Prisma.CommentWhereInput | null;
    isNot?: Prisma.CommentWhereInput | null;
};
export type CommentCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    articleId?: Prisma.SortOrder;
    parentId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    ipAddress?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type CommentMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    articleId?: Prisma.SortOrder;
    parentId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    ipAddress?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type CommentMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    articleId?: Prisma.SortOrder;
    parentId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    ipAddress?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type CommentCreateNestedManyWithoutTenantInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutTenantInput, Prisma.CommentUncheckedCreateWithoutTenantInput> | Prisma.CommentCreateWithoutTenantInput[] | Prisma.CommentUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutTenantInput | Prisma.CommentCreateOrConnectWithoutTenantInput[];
    createMany?: Prisma.CommentCreateManyTenantInputEnvelope;
    connect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
};
export type CommentUncheckedCreateNestedManyWithoutTenantInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutTenantInput, Prisma.CommentUncheckedCreateWithoutTenantInput> | Prisma.CommentCreateWithoutTenantInput[] | Prisma.CommentUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutTenantInput | Prisma.CommentCreateOrConnectWithoutTenantInput[];
    createMany?: Prisma.CommentCreateManyTenantInputEnvelope;
    connect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
};
export type CommentUpdateManyWithoutTenantNestedInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutTenantInput, Prisma.CommentUncheckedCreateWithoutTenantInput> | Prisma.CommentCreateWithoutTenantInput[] | Prisma.CommentUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutTenantInput | Prisma.CommentCreateOrConnectWithoutTenantInput[];
    upsert?: Prisma.CommentUpsertWithWhereUniqueWithoutTenantInput | Prisma.CommentUpsertWithWhereUniqueWithoutTenantInput[];
    createMany?: Prisma.CommentCreateManyTenantInputEnvelope;
    set?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    disconnect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    delete?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    connect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    update?: Prisma.CommentUpdateWithWhereUniqueWithoutTenantInput | Prisma.CommentUpdateWithWhereUniqueWithoutTenantInput[];
    updateMany?: Prisma.CommentUpdateManyWithWhereWithoutTenantInput | Prisma.CommentUpdateManyWithWhereWithoutTenantInput[];
    deleteMany?: Prisma.CommentScalarWhereInput | Prisma.CommentScalarWhereInput[];
};
export type CommentUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutTenantInput, Prisma.CommentUncheckedCreateWithoutTenantInput> | Prisma.CommentCreateWithoutTenantInput[] | Prisma.CommentUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutTenantInput | Prisma.CommentCreateOrConnectWithoutTenantInput[];
    upsert?: Prisma.CommentUpsertWithWhereUniqueWithoutTenantInput | Prisma.CommentUpsertWithWhereUniqueWithoutTenantInput[];
    createMany?: Prisma.CommentCreateManyTenantInputEnvelope;
    set?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    disconnect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    delete?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    connect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    update?: Prisma.CommentUpdateWithWhereUniqueWithoutTenantInput | Prisma.CommentUpdateWithWhereUniqueWithoutTenantInput[];
    updateMany?: Prisma.CommentUpdateManyWithWhereWithoutTenantInput | Prisma.CommentUpdateManyWithWhereWithoutTenantInput[];
    deleteMany?: Prisma.CommentScalarWhereInput | Prisma.CommentScalarWhereInput[];
};
export type CommentCreateNestedManyWithoutArticleInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutArticleInput, Prisma.CommentUncheckedCreateWithoutArticleInput> | Prisma.CommentCreateWithoutArticleInput[] | Prisma.CommentUncheckedCreateWithoutArticleInput[];
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutArticleInput | Prisma.CommentCreateOrConnectWithoutArticleInput[];
    createMany?: Prisma.CommentCreateManyArticleInputEnvelope;
    connect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
};
export type CommentUncheckedCreateNestedManyWithoutArticleInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutArticleInput, Prisma.CommentUncheckedCreateWithoutArticleInput> | Prisma.CommentCreateWithoutArticleInput[] | Prisma.CommentUncheckedCreateWithoutArticleInput[];
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutArticleInput | Prisma.CommentCreateOrConnectWithoutArticleInput[];
    createMany?: Prisma.CommentCreateManyArticleInputEnvelope;
    connect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
};
export type CommentUpdateManyWithoutArticleNestedInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutArticleInput, Prisma.CommentUncheckedCreateWithoutArticleInput> | Prisma.CommentCreateWithoutArticleInput[] | Prisma.CommentUncheckedCreateWithoutArticleInput[];
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutArticleInput | Prisma.CommentCreateOrConnectWithoutArticleInput[];
    upsert?: Prisma.CommentUpsertWithWhereUniqueWithoutArticleInput | Prisma.CommentUpsertWithWhereUniqueWithoutArticleInput[];
    createMany?: Prisma.CommentCreateManyArticleInputEnvelope;
    set?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    disconnect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    delete?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    connect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    update?: Prisma.CommentUpdateWithWhereUniqueWithoutArticleInput | Prisma.CommentUpdateWithWhereUniqueWithoutArticleInput[];
    updateMany?: Prisma.CommentUpdateManyWithWhereWithoutArticleInput | Prisma.CommentUpdateManyWithWhereWithoutArticleInput[];
    deleteMany?: Prisma.CommentScalarWhereInput | Prisma.CommentScalarWhereInput[];
};
export type CommentUncheckedUpdateManyWithoutArticleNestedInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutArticleInput, Prisma.CommentUncheckedCreateWithoutArticleInput> | Prisma.CommentCreateWithoutArticleInput[] | Prisma.CommentUncheckedCreateWithoutArticleInput[];
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutArticleInput | Prisma.CommentCreateOrConnectWithoutArticleInput[];
    upsert?: Prisma.CommentUpsertWithWhereUniqueWithoutArticleInput | Prisma.CommentUpsertWithWhereUniqueWithoutArticleInput[];
    createMany?: Prisma.CommentCreateManyArticleInputEnvelope;
    set?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    disconnect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    delete?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    connect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    update?: Prisma.CommentUpdateWithWhereUniqueWithoutArticleInput | Prisma.CommentUpdateWithWhereUniqueWithoutArticleInput[];
    updateMany?: Prisma.CommentUpdateManyWithWhereWithoutArticleInput | Prisma.CommentUpdateManyWithWhereWithoutArticleInput[];
    deleteMany?: Prisma.CommentScalarWhereInput | Prisma.CommentScalarWhereInput[];
};
export type CommentCreateNestedOneWithoutRepliesInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutRepliesInput, Prisma.CommentUncheckedCreateWithoutRepliesInput>;
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutRepliesInput;
    connect?: Prisma.CommentWhereUniqueInput;
};
export type CommentCreateNestedManyWithoutParentInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutParentInput, Prisma.CommentUncheckedCreateWithoutParentInput> | Prisma.CommentCreateWithoutParentInput[] | Prisma.CommentUncheckedCreateWithoutParentInput[];
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutParentInput | Prisma.CommentCreateOrConnectWithoutParentInput[];
    createMany?: Prisma.CommentCreateManyParentInputEnvelope;
    connect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
};
export type CommentUncheckedCreateNestedManyWithoutParentInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutParentInput, Prisma.CommentUncheckedCreateWithoutParentInput> | Prisma.CommentCreateWithoutParentInput[] | Prisma.CommentUncheckedCreateWithoutParentInput[];
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutParentInput | Prisma.CommentCreateOrConnectWithoutParentInput[];
    createMany?: Prisma.CommentCreateManyParentInputEnvelope;
    connect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
};
export type EnumCommentStatusFieldUpdateOperationsInput = {
    set?: $Enums.CommentStatus;
};
export type CommentUpdateOneWithoutRepliesNestedInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutRepliesInput, Prisma.CommentUncheckedCreateWithoutRepliesInput>;
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutRepliesInput;
    upsert?: Prisma.CommentUpsertWithoutRepliesInput;
    disconnect?: Prisma.CommentWhereInput | boolean;
    delete?: Prisma.CommentWhereInput | boolean;
    connect?: Prisma.CommentWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CommentUpdateToOneWithWhereWithoutRepliesInput, Prisma.CommentUpdateWithoutRepliesInput>, Prisma.CommentUncheckedUpdateWithoutRepliesInput>;
};
export type CommentUpdateManyWithoutParentNestedInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutParentInput, Prisma.CommentUncheckedCreateWithoutParentInput> | Prisma.CommentCreateWithoutParentInput[] | Prisma.CommentUncheckedCreateWithoutParentInput[];
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutParentInput | Prisma.CommentCreateOrConnectWithoutParentInput[];
    upsert?: Prisma.CommentUpsertWithWhereUniqueWithoutParentInput | Prisma.CommentUpsertWithWhereUniqueWithoutParentInput[];
    createMany?: Prisma.CommentCreateManyParentInputEnvelope;
    set?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    disconnect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    delete?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    connect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    update?: Prisma.CommentUpdateWithWhereUniqueWithoutParentInput | Prisma.CommentUpdateWithWhereUniqueWithoutParentInput[];
    updateMany?: Prisma.CommentUpdateManyWithWhereWithoutParentInput | Prisma.CommentUpdateManyWithWhereWithoutParentInput[];
    deleteMany?: Prisma.CommentScalarWhereInput | Prisma.CommentScalarWhereInput[];
};
export type CommentUncheckedUpdateManyWithoutParentNestedInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutParentInput, Prisma.CommentUncheckedCreateWithoutParentInput> | Prisma.CommentCreateWithoutParentInput[] | Prisma.CommentUncheckedCreateWithoutParentInput[];
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutParentInput | Prisma.CommentCreateOrConnectWithoutParentInput[];
    upsert?: Prisma.CommentUpsertWithWhereUniqueWithoutParentInput | Prisma.CommentUpsertWithWhereUniqueWithoutParentInput[];
    createMany?: Prisma.CommentCreateManyParentInputEnvelope;
    set?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    disconnect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    delete?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    connect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    update?: Prisma.CommentUpdateWithWhereUniqueWithoutParentInput | Prisma.CommentUpdateWithWhereUniqueWithoutParentInput[];
    updateMany?: Prisma.CommentUpdateManyWithWhereWithoutParentInput | Prisma.CommentUpdateManyWithWhereWithoutParentInput[];
    deleteMany?: Prisma.CommentScalarWhereInput | Prisma.CommentScalarWhereInput[];
};
export type CommentCreateWithoutTenantInput = {
    id?: string;
    name: string;
    email: string;
    content: string;
    ipAddress?: string | null;
    status?: $Enums.CommentStatus;
    createdAt?: Date | string;
    article: Prisma.ArticleCreateNestedOneWithoutCommentsInput;
    parent?: Prisma.CommentCreateNestedOneWithoutRepliesInput;
    replies?: Prisma.CommentCreateNestedManyWithoutParentInput;
};
export type CommentUncheckedCreateWithoutTenantInput = {
    id?: string;
    articleId: string;
    parentId?: string | null;
    name: string;
    email: string;
    content: string;
    ipAddress?: string | null;
    status?: $Enums.CommentStatus;
    createdAt?: Date | string;
    replies?: Prisma.CommentUncheckedCreateNestedManyWithoutParentInput;
};
export type CommentCreateOrConnectWithoutTenantInput = {
    where: Prisma.CommentWhereUniqueInput;
    create: Prisma.XOR<Prisma.CommentCreateWithoutTenantInput, Prisma.CommentUncheckedCreateWithoutTenantInput>;
};
export type CommentCreateManyTenantInputEnvelope = {
    data: Prisma.CommentCreateManyTenantInput | Prisma.CommentCreateManyTenantInput[];
    skipDuplicates?: boolean;
};
export type CommentUpsertWithWhereUniqueWithoutTenantInput = {
    where: Prisma.CommentWhereUniqueInput;
    update: Prisma.XOR<Prisma.CommentUpdateWithoutTenantInput, Prisma.CommentUncheckedUpdateWithoutTenantInput>;
    create: Prisma.XOR<Prisma.CommentCreateWithoutTenantInput, Prisma.CommentUncheckedCreateWithoutTenantInput>;
};
export type CommentUpdateWithWhereUniqueWithoutTenantInput = {
    where: Prisma.CommentWhereUniqueInput;
    data: Prisma.XOR<Prisma.CommentUpdateWithoutTenantInput, Prisma.CommentUncheckedUpdateWithoutTenantInput>;
};
export type CommentUpdateManyWithWhereWithoutTenantInput = {
    where: Prisma.CommentScalarWhereInput;
    data: Prisma.XOR<Prisma.CommentUpdateManyMutationInput, Prisma.CommentUncheckedUpdateManyWithoutTenantInput>;
};
export type CommentScalarWhereInput = {
    AND?: Prisma.CommentScalarWhereInput | Prisma.CommentScalarWhereInput[];
    OR?: Prisma.CommentScalarWhereInput[];
    NOT?: Prisma.CommentScalarWhereInput | Prisma.CommentScalarWhereInput[];
    id?: Prisma.StringFilter<"Comment"> | string;
    tenantId?: Prisma.StringFilter<"Comment"> | string;
    articleId?: Prisma.StringFilter<"Comment"> | string;
    parentId?: Prisma.StringNullableFilter<"Comment"> | string | null;
    name?: Prisma.StringFilter<"Comment"> | string;
    email?: Prisma.StringFilter<"Comment"> | string;
    content?: Prisma.StringFilter<"Comment"> | string;
    ipAddress?: Prisma.StringNullableFilter<"Comment"> | string | null;
    status?: Prisma.EnumCommentStatusFilter<"Comment"> | $Enums.CommentStatus;
    createdAt?: Prisma.DateTimeFilter<"Comment"> | Date | string;
};
export type CommentCreateWithoutArticleInput = {
    id?: string;
    name: string;
    email: string;
    content: string;
    ipAddress?: string | null;
    status?: $Enums.CommentStatus;
    createdAt?: Date | string;
    tenant: Prisma.TenantCreateNestedOneWithoutCommentsInput;
    parent?: Prisma.CommentCreateNestedOneWithoutRepliesInput;
    replies?: Prisma.CommentCreateNestedManyWithoutParentInput;
};
export type CommentUncheckedCreateWithoutArticleInput = {
    id?: string;
    tenantId: string;
    parentId?: string | null;
    name: string;
    email: string;
    content: string;
    ipAddress?: string | null;
    status?: $Enums.CommentStatus;
    createdAt?: Date | string;
    replies?: Prisma.CommentUncheckedCreateNestedManyWithoutParentInput;
};
export type CommentCreateOrConnectWithoutArticleInput = {
    where: Prisma.CommentWhereUniqueInput;
    create: Prisma.XOR<Prisma.CommentCreateWithoutArticleInput, Prisma.CommentUncheckedCreateWithoutArticleInput>;
};
export type CommentCreateManyArticleInputEnvelope = {
    data: Prisma.CommentCreateManyArticleInput | Prisma.CommentCreateManyArticleInput[];
    skipDuplicates?: boolean;
};
export type CommentUpsertWithWhereUniqueWithoutArticleInput = {
    where: Prisma.CommentWhereUniqueInput;
    update: Prisma.XOR<Prisma.CommentUpdateWithoutArticleInput, Prisma.CommentUncheckedUpdateWithoutArticleInput>;
    create: Prisma.XOR<Prisma.CommentCreateWithoutArticleInput, Prisma.CommentUncheckedCreateWithoutArticleInput>;
};
export type CommentUpdateWithWhereUniqueWithoutArticleInput = {
    where: Prisma.CommentWhereUniqueInput;
    data: Prisma.XOR<Prisma.CommentUpdateWithoutArticleInput, Prisma.CommentUncheckedUpdateWithoutArticleInput>;
};
export type CommentUpdateManyWithWhereWithoutArticleInput = {
    where: Prisma.CommentScalarWhereInput;
    data: Prisma.XOR<Prisma.CommentUpdateManyMutationInput, Prisma.CommentUncheckedUpdateManyWithoutArticleInput>;
};
export type CommentCreateWithoutRepliesInput = {
    id?: string;
    name: string;
    email: string;
    content: string;
    ipAddress?: string | null;
    status?: $Enums.CommentStatus;
    createdAt?: Date | string;
    tenant: Prisma.TenantCreateNestedOneWithoutCommentsInput;
    article: Prisma.ArticleCreateNestedOneWithoutCommentsInput;
    parent?: Prisma.CommentCreateNestedOneWithoutRepliesInput;
};
export type CommentUncheckedCreateWithoutRepliesInput = {
    id?: string;
    tenantId: string;
    articleId: string;
    parentId?: string | null;
    name: string;
    email: string;
    content: string;
    ipAddress?: string | null;
    status?: $Enums.CommentStatus;
    createdAt?: Date | string;
};
export type CommentCreateOrConnectWithoutRepliesInput = {
    where: Prisma.CommentWhereUniqueInput;
    create: Prisma.XOR<Prisma.CommentCreateWithoutRepliesInput, Prisma.CommentUncheckedCreateWithoutRepliesInput>;
};
export type CommentCreateWithoutParentInput = {
    id?: string;
    name: string;
    email: string;
    content: string;
    ipAddress?: string | null;
    status?: $Enums.CommentStatus;
    createdAt?: Date | string;
    tenant: Prisma.TenantCreateNestedOneWithoutCommentsInput;
    article: Prisma.ArticleCreateNestedOneWithoutCommentsInput;
    replies?: Prisma.CommentCreateNestedManyWithoutParentInput;
};
export type CommentUncheckedCreateWithoutParentInput = {
    id?: string;
    tenantId: string;
    articleId: string;
    name: string;
    email: string;
    content: string;
    ipAddress?: string | null;
    status?: $Enums.CommentStatus;
    createdAt?: Date | string;
    replies?: Prisma.CommentUncheckedCreateNestedManyWithoutParentInput;
};
export type CommentCreateOrConnectWithoutParentInput = {
    where: Prisma.CommentWhereUniqueInput;
    create: Prisma.XOR<Prisma.CommentCreateWithoutParentInput, Prisma.CommentUncheckedCreateWithoutParentInput>;
};
export type CommentCreateManyParentInputEnvelope = {
    data: Prisma.CommentCreateManyParentInput | Prisma.CommentCreateManyParentInput[];
    skipDuplicates?: boolean;
};
export type CommentUpsertWithoutRepliesInput = {
    update: Prisma.XOR<Prisma.CommentUpdateWithoutRepliesInput, Prisma.CommentUncheckedUpdateWithoutRepliesInput>;
    create: Prisma.XOR<Prisma.CommentCreateWithoutRepliesInput, Prisma.CommentUncheckedCreateWithoutRepliesInput>;
    where?: Prisma.CommentWhereInput;
};
export type CommentUpdateToOneWithWhereWithoutRepliesInput = {
    where?: Prisma.CommentWhereInput;
    data: Prisma.XOR<Prisma.CommentUpdateWithoutRepliesInput, Prisma.CommentUncheckedUpdateWithoutRepliesInput>;
};
export type CommentUpdateWithoutRepliesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    ipAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumCommentStatusFieldUpdateOperationsInput | $Enums.CommentStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tenant?: Prisma.TenantUpdateOneRequiredWithoutCommentsNestedInput;
    article?: Prisma.ArticleUpdateOneRequiredWithoutCommentsNestedInput;
    parent?: Prisma.CommentUpdateOneWithoutRepliesNestedInput;
};
export type CommentUncheckedUpdateWithoutRepliesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    articleId?: Prisma.StringFieldUpdateOperationsInput | string;
    parentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    ipAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumCommentStatusFieldUpdateOperationsInput | $Enums.CommentStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CommentUpsertWithWhereUniqueWithoutParentInput = {
    where: Prisma.CommentWhereUniqueInput;
    update: Prisma.XOR<Prisma.CommentUpdateWithoutParentInput, Prisma.CommentUncheckedUpdateWithoutParentInput>;
    create: Prisma.XOR<Prisma.CommentCreateWithoutParentInput, Prisma.CommentUncheckedCreateWithoutParentInput>;
};
export type CommentUpdateWithWhereUniqueWithoutParentInput = {
    where: Prisma.CommentWhereUniqueInput;
    data: Prisma.XOR<Prisma.CommentUpdateWithoutParentInput, Prisma.CommentUncheckedUpdateWithoutParentInput>;
};
export type CommentUpdateManyWithWhereWithoutParentInput = {
    where: Prisma.CommentScalarWhereInput;
    data: Prisma.XOR<Prisma.CommentUpdateManyMutationInput, Prisma.CommentUncheckedUpdateManyWithoutParentInput>;
};
export type CommentCreateManyTenantInput = {
    id?: string;
    articleId: string;
    parentId?: string | null;
    name: string;
    email: string;
    content: string;
    ipAddress?: string | null;
    status?: $Enums.CommentStatus;
    createdAt?: Date | string;
};
export type CommentUpdateWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    ipAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumCommentStatusFieldUpdateOperationsInput | $Enums.CommentStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    article?: Prisma.ArticleUpdateOneRequiredWithoutCommentsNestedInput;
    parent?: Prisma.CommentUpdateOneWithoutRepliesNestedInput;
    replies?: Prisma.CommentUpdateManyWithoutParentNestedInput;
};
export type CommentUncheckedUpdateWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    articleId?: Prisma.StringFieldUpdateOperationsInput | string;
    parentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    ipAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumCommentStatusFieldUpdateOperationsInput | $Enums.CommentStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    replies?: Prisma.CommentUncheckedUpdateManyWithoutParentNestedInput;
};
export type CommentUncheckedUpdateManyWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    articleId?: Prisma.StringFieldUpdateOperationsInput | string;
    parentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    ipAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumCommentStatusFieldUpdateOperationsInput | $Enums.CommentStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CommentCreateManyArticleInput = {
    id?: string;
    tenantId: string;
    parentId?: string | null;
    name: string;
    email: string;
    content: string;
    ipAddress?: string | null;
    status?: $Enums.CommentStatus;
    createdAt?: Date | string;
};
export type CommentUpdateWithoutArticleInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    ipAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumCommentStatusFieldUpdateOperationsInput | $Enums.CommentStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tenant?: Prisma.TenantUpdateOneRequiredWithoutCommentsNestedInput;
    parent?: Prisma.CommentUpdateOneWithoutRepliesNestedInput;
    replies?: Prisma.CommentUpdateManyWithoutParentNestedInput;
};
export type CommentUncheckedUpdateWithoutArticleInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    parentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    ipAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumCommentStatusFieldUpdateOperationsInput | $Enums.CommentStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    replies?: Prisma.CommentUncheckedUpdateManyWithoutParentNestedInput;
};
export type CommentUncheckedUpdateManyWithoutArticleInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    parentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    ipAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumCommentStatusFieldUpdateOperationsInput | $Enums.CommentStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CommentCreateManyParentInput = {
    id?: string;
    tenantId: string;
    articleId: string;
    name: string;
    email: string;
    content: string;
    ipAddress?: string | null;
    status?: $Enums.CommentStatus;
    createdAt?: Date | string;
};
export type CommentUpdateWithoutParentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    ipAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumCommentStatusFieldUpdateOperationsInput | $Enums.CommentStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tenant?: Prisma.TenantUpdateOneRequiredWithoutCommentsNestedInput;
    article?: Prisma.ArticleUpdateOneRequiredWithoutCommentsNestedInput;
    replies?: Prisma.CommentUpdateManyWithoutParentNestedInput;
};
export type CommentUncheckedUpdateWithoutParentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    articleId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    ipAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumCommentStatusFieldUpdateOperationsInput | $Enums.CommentStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    replies?: Prisma.CommentUncheckedUpdateManyWithoutParentNestedInput;
};
export type CommentUncheckedUpdateManyWithoutParentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    articleId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    ipAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumCommentStatusFieldUpdateOperationsInput | $Enums.CommentStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CommentCountOutputType = {
    replies: number;
};
export type CommentCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    replies?: boolean | CommentCountOutputTypeCountRepliesArgs;
};
export type CommentCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentCountOutputTypeSelect<ExtArgs> | null;
};
export type CommentCountOutputTypeCountRepliesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CommentWhereInput;
};
export type CommentSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    articleId?: boolean;
    parentId?: boolean;
    name?: boolean;
    email?: boolean;
    content?: boolean;
    ipAddress?: boolean;
    status?: boolean;
    createdAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
    article?: boolean | Prisma.ArticleDefaultArgs<ExtArgs>;
    parent?: boolean | Prisma.Comment$parentArgs<ExtArgs>;
    replies?: boolean | Prisma.Comment$repliesArgs<ExtArgs>;
    _count?: boolean | Prisma.CommentCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["comment"]>;
export type CommentSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    articleId?: boolean;
    parentId?: boolean;
    name?: boolean;
    email?: boolean;
    content?: boolean;
    ipAddress?: boolean;
    status?: boolean;
    createdAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
    article?: boolean | Prisma.ArticleDefaultArgs<ExtArgs>;
    parent?: boolean | Prisma.Comment$parentArgs<ExtArgs>;
}, ExtArgs["result"]["comment"]>;
export type CommentSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    articleId?: boolean;
    parentId?: boolean;
    name?: boolean;
    email?: boolean;
    content?: boolean;
    ipAddress?: boolean;
    status?: boolean;
    createdAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
    article?: boolean | Prisma.ArticleDefaultArgs<ExtArgs>;
    parent?: boolean | Prisma.Comment$parentArgs<ExtArgs>;
}, ExtArgs["result"]["comment"]>;
export type CommentSelectScalar = {
    id?: boolean;
    tenantId?: boolean;
    articleId?: boolean;
    parentId?: boolean;
    name?: boolean;
    email?: boolean;
    content?: boolean;
    ipAddress?: boolean;
    status?: boolean;
    createdAt?: boolean;
};
export type CommentOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "tenantId" | "articleId" | "parentId" | "name" | "email" | "content" | "ipAddress" | "status" | "createdAt", ExtArgs["result"]["comment"]>;
export type CommentInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
    article?: boolean | Prisma.ArticleDefaultArgs<ExtArgs>;
    parent?: boolean | Prisma.Comment$parentArgs<ExtArgs>;
    replies?: boolean | Prisma.Comment$repliesArgs<ExtArgs>;
    _count?: boolean | Prisma.CommentCountOutputTypeDefaultArgs<ExtArgs>;
};
export type CommentIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
    article?: boolean | Prisma.ArticleDefaultArgs<ExtArgs>;
    parent?: boolean | Prisma.Comment$parentArgs<ExtArgs>;
};
export type CommentIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
    article?: boolean | Prisma.ArticleDefaultArgs<ExtArgs>;
    parent?: boolean | Prisma.Comment$parentArgs<ExtArgs>;
};
export type $CommentPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Comment";
    objects: {
        tenant: Prisma.$TenantPayload<ExtArgs>;
        article: Prisma.$ArticlePayload<ExtArgs>;
        parent: Prisma.$CommentPayload<ExtArgs> | null;
        replies: Prisma.$CommentPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        tenantId: string;
        articleId: string;
        parentId: string | null;
        name: string;
        email: string;
        content: string;
        ipAddress: string | null;
        status: $Enums.CommentStatus;
        createdAt: Date;
    }, ExtArgs["result"]["comment"]>;
    composites: {};
};
export type CommentGetPayload<S extends boolean | null | undefined | CommentDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$CommentPayload, S>;
export type CommentCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<CommentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CommentCountAggregateInputType | true;
};
export interface CommentDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Comment'];
        meta: {
            name: 'Comment';
        };
    };
    findUnique<T extends CommentFindUniqueArgs>(args: Prisma.SelectSubset<T, CommentFindUniqueArgs<ExtArgs>>): Prisma.Prisma__CommentClient<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends CommentFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, CommentFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__CommentClient<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends CommentFindFirstArgs>(args?: Prisma.SelectSubset<T, CommentFindFirstArgs<ExtArgs>>): Prisma.Prisma__CommentClient<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends CommentFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, CommentFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__CommentClient<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends CommentFindManyArgs>(args?: Prisma.SelectSubset<T, CommentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends CommentCreateArgs>(args: Prisma.SelectSubset<T, CommentCreateArgs<ExtArgs>>): Prisma.Prisma__CommentClient<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends CommentCreateManyArgs>(args?: Prisma.SelectSubset<T, CommentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends CommentCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, CommentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends CommentDeleteArgs>(args: Prisma.SelectSubset<T, CommentDeleteArgs<ExtArgs>>): Prisma.Prisma__CommentClient<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends CommentUpdateArgs>(args: Prisma.SelectSubset<T, CommentUpdateArgs<ExtArgs>>): Prisma.Prisma__CommentClient<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends CommentDeleteManyArgs>(args?: Prisma.SelectSubset<T, CommentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends CommentUpdateManyArgs>(args: Prisma.SelectSubset<T, CommentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends CommentUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, CommentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends CommentUpsertArgs>(args: Prisma.SelectSubset<T, CommentUpsertArgs<ExtArgs>>): Prisma.Prisma__CommentClient<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends CommentCountArgs>(args?: Prisma.Subset<T, CommentCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CommentCountAggregateOutputType> : number>;
    aggregate<T extends CommentAggregateArgs>(args: Prisma.Subset<T, CommentAggregateArgs>): Prisma.PrismaPromise<GetCommentAggregateType<T>>;
    groupBy<T extends CommentGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: CommentGroupByArgs['orderBy'];
    } : {
        orderBy?: CommentGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, CommentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCommentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: CommentFieldRefs;
}
export interface Prisma__CommentClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    tenant<T extends Prisma.TenantDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TenantDefaultArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    article<T extends Prisma.ArticleDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ArticleDefaultArgs<ExtArgs>>): Prisma.Prisma__ArticleClient<runtime.Types.Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    parent<T extends Prisma.Comment$parentArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Comment$parentArgs<ExtArgs>>): Prisma.Prisma__CommentClient<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    replies<T extends Prisma.Comment$repliesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Comment$repliesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface CommentFieldRefs {
    readonly id: Prisma.FieldRef<"Comment", 'String'>;
    readonly tenantId: Prisma.FieldRef<"Comment", 'String'>;
    readonly articleId: Prisma.FieldRef<"Comment", 'String'>;
    readonly parentId: Prisma.FieldRef<"Comment", 'String'>;
    readonly name: Prisma.FieldRef<"Comment", 'String'>;
    readonly email: Prisma.FieldRef<"Comment", 'String'>;
    readonly content: Prisma.FieldRef<"Comment", 'String'>;
    readonly ipAddress: Prisma.FieldRef<"Comment", 'String'>;
    readonly status: Prisma.FieldRef<"Comment", 'CommentStatus'>;
    readonly createdAt: Prisma.FieldRef<"Comment", 'DateTime'>;
}
export type CommentFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelect<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    include?: Prisma.CommentInclude<ExtArgs> | null;
    where: Prisma.CommentWhereUniqueInput;
};
export type CommentFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelect<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    include?: Prisma.CommentInclude<ExtArgs> | null;
    where: Prisma.CommentWhereUniqueInput;
};
export type CommentFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelect<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    include?: Prisma.CommentInclude<ExtArgs> | null;
    where?: Prisma.CommentWhereInput;
    orderBy?: Prisma.CommentOrderByWithRelationInput | Prisma.CommentOrderByWithRelationInput[];
    cursor?: Prisma.CommentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CommentScalarFieldEnum | Prisma.CommentScalarFieldEnum[];
};
export type CommentFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelect<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    include?: Prisma.CommentInclude<ExtArgs> | null;
    where?: Prisma.CommentWhereInput;
    orderBy?: Prisma.CommentOrderByWithRelationInput | Prisma.CommentOrderByWithRelationInput[];
    cursor?: Prisma.CommentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CommentScalarFieldEnum | Prisma.CommentScalarFieldEnum[];
};
export type CommentFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelect<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    include?: Prisma.CommentInclude<ExtArgs> | null;
    where?: Prisma.CommentWhereInput;
    orderBy?: Prisma.CommentOrderByWithRelationInput | Prisma.CommentOrderByWithRelationInput[];
    cursor?: Prisma.CommentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CommentScalarFieldEnum | Prisma.CommentScalarFieldEnum[];
};
export type CommentCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelect<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    include?: Prisma.CommentInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CommentCreateInput, Prisma.CommentUncheckedCreateInput>;
};
export type CommentCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.CommentCreateManyInput | Prisma.CommentCreateManyInput[];
    skipDuplicates?: boolean;
};
export type CommentCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    data: Prisma.CommentCreateManyInput | Prisma.CommentCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.CommentIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type CommentUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelect<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    include?: Prisma.CommentInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CommentUpdateInput, Prisma.CommentUncheckedUpdateInput>;
    where: Prisma.CommentWhereUniqueInput;
};
export type CommentUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.CommentUpdateManyMutationInput, Prisma.CommentUncheckedUpdateManyInput>;
    where?: Prisma.CommentWhereInput;
    limit?: number;
};
export type CommentUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CommentUpdateManyMutationInput, Prisma.CommentUncheckedUpdateManyInput>;
    where?: Prisma.CommentWhereInput;
    limit?: number;
    include?: Prisma.CommentIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type CommentUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelect<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    include?: Prisma.CommentInclude<ExtArgs> | null;
    where: Prisma.CommentWhereUniqueInput;
    create: Prisma.XOR<Prisma.CommentCreateInput, Prisma.CommentUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.CommentUpdateInput, Prisma.CommentUncheckedUpdateInput>;
};
export type CommentDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelect<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    include?: Prisma.CommentInclude<ExtArgs> | null;
    where: Prisma.CommentWhereUniqueInput;
};
export type CommentDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CommentWhereInput;
    limit?: number;
};
export type Comment$parentArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelect<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    include?: Prisma.CommentInclude<ExtArgs> | null;
    where?: Prisma.CommentWhereInput;
};
export type Comment$repliesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelect<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    include?: Prisma.CommentInclude<ExtArgs> | null;
    where?: Prisma.CommentWhereInput;
    orderBy?: Prisma.CommentOrderByWithRelationInput | Prisma.CommentOrderByWithRelationInput[];
    cursor?: Prisma.CommentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CommentScalarFieldEnum | Prisma.CommentScalarFieldEnum[];
};
export type CommentDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelect<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    include?: Prisma.CommentInclude<ExtArgs> | null;
};
