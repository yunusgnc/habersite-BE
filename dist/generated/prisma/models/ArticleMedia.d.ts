import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ArticleMediaModel = runtime.Types.Result.DefaultSelection<Prisma.$ArticleMediaPayload>;
export type AggregateArticleMedia = {
    _count: ArticleMediaCountAggregateOutputType | null;
    _avg: ArticleMediaAvgAggregateOutputType | null;
    _sum: ArticleMediaSumAggregateOutputType | null;
    _min: ArticleMediaMinAggregateOutputType | null;
    _max: ArticleMediaMaxAggregateOutputType | null;
};
export type ArticleMediaAvgAggregateOutputType = {
    sortOrder: number | null;
};
export type ArticleMediaSumAggregateOutputType = {
    sortOrder: number | null;
};
export type ArticleMediaMinAggregateOutputType = {
    articleId: string | null;
    mediaId: string | null;
    sortOrder: number | null;
    caption: string | null;
};
export type ArticleMediaMaxAggregateOutputType = {
    articleId: string | null;
    mediaId: string | null;
    sortOrder: number | null;
    caption: string | null;
};
export type ArticleMediaCountAggregateOutputType = {
    articleId: number;
    mediaId: number;
    sortOrder: number;
    caption: number;
    _all: number;
};
export type ArticleMediaAvgAggregateInputType = {
    sortOrder?: true;
};
export type ArticleMediaSumAggregateInputType = {
    sortOrder?: true;
};
export type ArticleMediaMinAggregateInputType = {
    articleId?: true;
    mediaId?: true;
    sortOrder?: true;
    caption?: true;
};
export type ArticleMediaMaxAggregateInputType = {
    articleId?: true;
    mediaId?: true;
    sortOrder?: true;
    caption?: true;
};
export type ArticleMediaCountAggregateInputType = {
    articleId?: true;
    mediaId?: true;
    sortOrder?: true;
    caption?: true;
    _all?: true;
};
export type ArticleMediaAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ArticleMediaWhereInput;
    orderBy?: Prisma.ArticleMediaOrderByWithRelationInput | Prisma.ArticleMediaOrderByWithRelationInput[];
    cursor?: Prisma.ArticleMediaWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ArticleMediaCountAggregateInputType;
    _avg?: ArticleMediaAvgAggregateInputType;
    _sum?: ArticleMediaSumAggregateInputType;
    _min?: ArticleMediaMinAggregateInputType;
    _max?: ArticleMediaMaxAggregateInputType;
};
export type GetArticleMediaAggregateType<T extends ArticleMediaAggregateArgs> = {
    [P in keyof T & keyof AggregateArticleMedia]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateArticleMedia[P]> : Prisma.GetScalarType<T[P], AggregateArticleMedia[P]>;
};
export type ArticleMediaGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ArticleMediaWhereInput;
    orderBy?: Prisma.ArticleMediaOrderByWithAggregationInput | Prisma.ArticleMediaOrderByWithAggregationInput[];
    by: Prisma.ArticleMediaScalarFieldEnum[] | Prisma.ArticleMediaScalarFieldEnum;
    having?: Prisma.ArticleMediaScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ArticleMediaCountAggregateInputType | true;
    _avg?: ArticleMediaAvgAggregateInputType;
    _sum?: ArticleMediaSumAggregateInputType;
    _min?: ArticleMediaMinAggregateInputType;
    _max?: ArticleMediaMaxAggregateInputType;
};
export type ArticleMediaGroupByOutputType = {
    articleId: string;
    mediaId: string;
    sortOrder: number;
    caption: string | null;
    _count: ArticleMediaCountAggregateOutputType | null;
    _avg: ArticleMediaAvgAggregateOutputType | null;
    _sum: ArticleMediaSumAggregateOutputType | null;
    _min: ArticleMediaMinAggregateOutputType | null;
    _max: ArticleMediaMaxAggregateOutputType | null;
};
export type GetArticleMediaGroupByPayload<T extends ArticleMediaGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ArticleMediaGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ArticleMediaGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ArticleMediaGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ArticleMediaGroupByOutputType[P]>;
}>>;
export type ArticleMediaWhereInput = {
    AND?: Prisma.ArticleMediaWhereInput | Prisma.ArticleMediaWhereInput[];
    OR?: Prisma.ArticleMediaWhereInput[];
    NOT?: Prisma.ArticleMediaWhereInput | Prisma.ArticleMediaWhereInput[];
    articleId?: Prisma.StringFilter<"ArticleMedia"> | string;
    mediaId?: Prisma.StringFilter<"ArticleMedia"> | string;
    sortOrder?: Prisma.IntFilter<"ArticleMedia"> | number;
    caption?: Prisma.StringNullableFilter<"ArticleMedia"> | string | null;
    article?: Prisma.XOR<Prisma.ArticleScalarRelationFilter, Prisma.ArticleWhereInput>;
    media?: Prisma.XOR<Prisma.MediaScalarRelationFilter, Prisma.MediaWhereInput>;
};
export type ArticleMediaOrderByWithRelationInput = {
    articleId?: Prisma.SortOrder;
    mediaId?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    caption?: Prisma.SortOrderInput | Prisma.SortOrder;
    article?: Prisma.ArticleOrderByWithRelationInput;
    media?: Prisma.MediaOrderByWithRelationInput;
};
export type ArticleMediaWhereUniqueInput = Prisma.AtLeast<{
    articleId_mediaId?: Prisma.ArticleMediaArticleIdMediaIdCompoundUniqueInput;
    AND?: Prisma.ArticleMediaWhereInput | Prisma.ArticleMediaWhereInput[];
    OR?: Prisma.ArticleMediaWhereInput[];
    NOT?: Prisma.ArticleMediaWhereInput | Prisma.ArticleMediaWhereInput[];
    articleId?: Prisma.StringFilter<"ArticleMedia"> | string;
    mediaId?: Prisma.StringFilter<"ArticleMedia"> | string;
    sortOrder?: Prisma.IntFilter<"ArticleMedia"> | number;
    caption?: Prisma.StringNullableFilter<"ArticleMedia"> | string | null;
    article?: Prisma.XOR<Prisma.ArticleScalarRelationFilter, Prisma.ArticleWhereInput>;
    media?: Prisma.XOR<Prisma.MediaScalarRelationFilter, Prisma.MediaWhereInput>;
}, "articleId_mediaId">;
export type ArticleMediaOrderByWithAggregationInput = {
    articleId?: Prisma.SortOrder;
    mediaId?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    caption?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.ArticleMediaCountOrderByAggregateInput;
    _avg?: Prisma.ArticleMediaAvgOrderByAggregateInput;
    _max?: Prisma.ArticleMediaMaxOrderByAggregateInput;
    _min?: Prisma.ArticleMediaMinOrderByAggregateInput;
    _sum?: Prisma.ArticleMediaSumOrderByAggregateInput;
};
export type ArticleMediaScalarWhereWithAggregatesInput = {
    AND?: Prisma.ArticleMediaScalarWhereWithAggregatesInput | Prisma.ArticleMediaScalarWhereWithAggregatesInput[];
    OR?: Prisma.ArticleMediaScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ArticleMediaScalarWhereWithAggregatesInput | Prisma.ArticleMediaScalarWhereWithAggregatesInput[];
    articleId?: Prisma.StringWithAggregatesFilter<"ArticleMedia"> | string;
    mediaId?: Prisma.StringWithAggregatesFilter<"ArticleMedia"> | string;
    sortOrder?: Prisma.IntWithAggregatesFilter<"ArticleMedia"> | number;
    caption?: Prisma.StringNullableWithAggregatesFilter<"ArticleMedia"> | string | null;
};
export type ArticleMediaCreateInput = {
    sortOrder?: number;
    caption?: string | null;
    article: Prisma.ArticleCreateNestedOneWithoutGalleryInput;
    media: Prisma.MediaCreateNestedOneWithoutArticlesInput;
};
export type ArticleMediaUncheckedCreateInput = {
    articleId: string;
    mediaId: string;
    sortOrder?: number;
    caption?: string | null;
};
export type ArticleMediaUpdateInput = {
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    caption?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    article?: Prisma.ArticleUpdateOneRequiredWithoutGalleryNestedInput;
    media?: Prisma.MediaUpdateOneRequiredWithoutArticlesNestedInput;
};
export type ArticleMediaUncheckedUpdateInput = {
    articleId?: Prisma.StringFieldUpdateOperationsInput | string;
    mediaId?: Prisma.StringFieldUpdateOperationsInput | string;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    caption?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type ArticleMediaCreateManyInput = {
    articleId: string;
    mediaId: string;
    sortOrder?: number;
    caption?: string | null;
};
export type ArticleMediaUpdateManyMutationInput = {
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    caption?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type ArticleMediaUncheckedUpdateManyInput = {
    articleId?: Prisma.StringFieldUpdateOperationsInput | string;
    mediaId?: Prisma.StringFieldUpdateOperationsInput | string;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    caption?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type ArticleMediaListRelationFilter = {
    every?: Prisma.ArticleMediaWhereInput;
    some?: Prisma.ArticleMediaWhereInput;
    none?: Prisma.ArticleMediaWhereInput;
};
export type ArticleMediaOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ArticleMediaArticleIdMediaIdCompoundUniqueInput = {
    articleId: string;
    mediaId: string;
};
export type ArticleMediaCountOrderByAggregateInput = {
    articleId?: Prisma.SortOrder;
    mediaId?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    caption?: Prisma.SortOrder;
};
export type ArticleMediaAvgOrderByAggregateInput = {
    sortOrder?: Prisma.SortOrder;
};
export type ArticleMediaMaxOrderByAggregateInput = {
    articleId?: Prisma.SortOrder;
    mediaId?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    caption?: Prisma.SortOrder;
};
export type ArticleMediaMinOrderByAggregateInput = {
    articleId?: Prisma.SortOrder;
    mediaId?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    caption?: Prisma.SortOrder;
};
export type ArticleMediaSumOrderByAggregateInput = {
    sortOrder?: Prisma.SortOrder;
};
export type ArticleMediaCreateNestedManyWithoutArticleInput = {
    create?: Prisma.XOR<Prisma.ArticleMediaCreateWithoutArticleInput, Prisma.ArticleMediaUncheckedCreateWithoutArticleInput> | Prisma.ArticleMediaCreateWithoutArticleInput[] | Prisma.ArticleMediaUncheckedCreateWithoutArticleInput[];
    connectOrCreate?: Prisma.ArticleMediaCreateOrConnectWithoutArticleInput | Prisma.ArticleMediaCreateOrConnectWithoutArticleInput[];
    createMany?: Prisma.ArticleMediaCreateManyArticleInputEnvelope;
    connect?: Prisma.ArticleMediaWhereUniqueInput | Prisma.ArticleMediaWhereUniqueInput[];
};
export type ArticleMediaUncheckedCreateNestedManyWithoutArticleInput = {
    create?: Prisma.XOR<Prisma.ArticleMediaCreateWithoutArticleInput, Prisma.ArticleMediaUncheckedCreateWithoutArticleInput> | Prisma.ArticleMediaCreateWithoutArticleInput[] | Prisma.ArticleMediaUncheckedCreateWithoutArticleInput[];
    connectOrCreate?: Prisma.ArticleMediaCreateOrConnectWithoutArticleInput | Prisma.ArticleMediaCreateOrConnectWithoutArticleInput[];
    createMany?: Prisma.ArticleMediaCreateManyArticleInputEnvelope;
    connect?: Prisma.ArticleMediaWhereUniqueInput | Prisma.ArticleMediaWhereUniqueInput[];
};
export type ArticleMediaUpdateManyWithoutArticleNestedInput = {
    create?: Prisma.XOR<Prisma.ArticleMediaCreateWithoutArticleInput, Prisma.ArticleMediaUncheckedCreateWithoutArticleInput> | Prisma.ArticleMediaCreateWithoutArticleInput[] | Prisma.ArticleMediaUncheckedCreateWithoutArticleInput[];
    connectOrCreate?: Prisma.ArticleMediaCreateOrConnectWithoutArticleInput | Prisma.ArticleMediaCreateOrConnectWithoutArticleInput[];
    upsert?: Prisma.ArticleMediaUpsertWithWhereUniqueWithoutArticleInput | Prisma.ArticleMediaUpsertWithWhereUniqueWithoutArticleInput[];
    createMany?: Prisma.ArticleMediaCreateManyArticleInputEnvelope;
    set?: Prisma.ArticleMediaWhereUniqueInput | Prisma.ArticleMediaWhereUniqueInput[];
    disconnect?: Prisma.ArticleMediaWhereUniqueInput | Prisma.ArticleMediaWhereUniqueInput[];
    delete?: Prisma.ArticleMediaWhereUniqueInput | Prisma.ArticleMediaWhereUniqueInput[];
    connect?: Prisma.ArticleMediaWhereUniqueInput | Prisma.ArticleMediaWhereUniqueInput[];
    update?: Prisma.ArticleMediaUpdateWithWhereUniqueWithoutArticleInput | Prisma.ArticleMediaUpdateWithWhereUniqueWithoutArticleInput[];
    updateMany?: Prisma.ArticleMediaUpdateManyWithWhereWithoutArticleInput | Prisma.ArticleMediaUpdateManyWithWhereWithoutArticleInput[];
    deleteMany?: Prisma.ArticleMediaScalarWhereInput | Prisma.ArticleMediaScalarWhereInput[];
};
export type ArticleMediaUncheckedUpdateManyWithoutArticleNestedInput = {
    create?: Prisma.XOR<Prisma.ArticleMediaCreateWithoutArticleInput, Prisma.ArticleMediaUncheckedCreateWithoutArticleInput> | Prisma.ArticleMediaCreateWithoutArticleInput[] | Prisma.ArticleMediaUncheckedCreateWithoutArticleInput[];
    connectOrCreate?: Prisma.ArticleMediaCreateOrConnectWithoutArticleInput | Prisma.ArticleMediaCreateOrConnectWithoutArticleInput[];
    upsert?: Prisma.ArticleMediaUpsertWithWhereUniqueWithoutArticleInput | Prisma.ArticleMediaUpsertWithWhereUniqueWithoutArticleInput[];
    createMany?: Prisma.ArticleMediaCreateManyArticleInputEnvelope;
    set?: Prisma.ArticleMediaWhereUniqueInput | Prisma.ArticleMediaWhereUniqueInput[];
    disconnect?: Prisma.ArticleMediaWhereUniqueInput | Prisma.ArticleMediaWhereUniqueInput[];
    delete?: Prisma.ArticleMediaWhereUniqueInput | Prisma.ArticleMediaWhereUniqueInput[];
    connect?: Prisma.ArticleMediaWhereUniqueInput | Prisma.ArticleMediaWhereUniqueInput[];
    update?: Prisma.ArticleMediaUpdateWithWhereUniqueWithoutArticleInput | Prisma.ArticleMediaUpdateWithWhereUniqueWithoutArticleInput[];
    updateMany?: Prisma.ArticleMediaUpdateManyWithWhereWithoutArticleInput | Prisma.ArticleMediaUpdateManyWithWhereWithoutArticleInput[];
    deleteMany?: Prisma.ArticleMediaScalarWhereInput | Prisma.ArticleMediaScalarWhereInput[];
};
export type ArticleMediaCreateNestedManyWithoutMediaInput = {
    create?: Prisma.XOR<Prisma.ArticleMediaCreateWithoutMediaInput, Prisma.ArticleMediaUncheckedCreateWithoutMediaInput> | Prisma.ArticleMediaCreateWithoutMediaInput[] | Prisma.ArticleMediaUncheckedCreateWithoutMediaInput[];
    connectOrCreate?: Prisma.ArticleMediaCreateOrConnectWithoutMediaInput | Prisma.ArticleMediaCreateOrConnectWithoutMediaInput[];
    createMany?: Prisma.ArticleMediaCreateManyMediaInputEnvelope;
    connect?: Prisma.ArticleMediaWhereUniqueInput | Prisma.ArticleMediaWhereUniqueInput[];
};
export type ArticleMediaUncheckedCreateNestedManyWithoutMediaInput = {
    create?: Prisma.XOR<Prisma.ArticleMediaCreateWithoutMediaInput, Prisma.ArticleMediaUncheckedCreateWithoutMediaInput> | Prisma.ArticleMediaCreateWithoutMediaInput[] | Prisma.ArticleMediaUncheckedCreateWithoutMediaInput[];
    connectOrCreate?: Prisma.ArticleMediaCreateOrConnectWithoutMediaInput | Prisma.ArticleMediaCreateOrConnectWithoutMediaInput[];
    createMany?: Prisma.ArticleMediaCreateManyMediaInputEnvelope;
    connect?: Prisma.ArticleMediaWhereUniqueInput | Prisma.ArticleMediaWhereUniqueInput[];
};
export type ArticleMediaUpdateManyWithoutMediaNestedInput = {
    create?: Prisma.XOR<Prisma.ArticleMediaCreateWithoutMediaInput, Prisma.ArticleMediaUncheckedCreateWithoutMediaInput> | Prisma.ArticleMediaCreateWithoutMediaInput[] | Prisma.ArticleMediaUncheckedCreateWithoutMediaInput[];
    connectOrCreate?: Prisma.ArticleMediaCreateOrConnectWithoutMediaInput | Prisma.ArticleMediaCreateOrConnectWithoutMediaInput[];
    upsert?: Prisma.ArticleMediaUpsertWithWhereUniqueWithoutMediaInput | Prisma.ArticleMediaUpsertWithWhereUniqueWithoutMediaInput[];
    createMany?: Prisma.ArticleMediaCreateManyMediaInputEnvelope;
    set?: Prisma.ArticleMediaWhereUniqueInput | Prisma.ArticleMediaWhereUniqueInput[];
    disconnect?: Prisma.ArticleMediaWhereUniqueInput | Prisma.ArticleMediaWhereUniqueInput[];
    delete?: Prisma.ArticleMediaWhereUniqueInput | Prisma.ArticleMediaWhereUniqueInput[];
    connect?: Prisma.ArticleMediaWhereUniqueInput | Prisma.ArticleMediaWhereUniqueInput[];
    update?: Prisma.ArticleMediaUpdateWithWhereUniqueWithoutMediaInput | Prisma.ArticleMediaUpdateWithWhereUniqueWithoutMediaInput[];
    updateMany?: Prisma.ArticleMediaUpdateManyWithWhereWithoutMediaInput | Prisma.ArticleMediaUpdateManyWithWhereWithoutMediaInput[];
    deleteMany?: Prisma.ArticleMediaScalarWhereInput | Prisma.ArticleMediaScalarWhereInput[];
};
export type ArticleMediaUncheckedUpdateManyWithoutMediaNestedInput = {
    create?: Prisma.XOR<Prisma.ArticleMediaCreateWithoutMediaInput, Prisma.ArticleMediaUncheckedCreateWithoutMediaInput> | Prisma.ArticleMediaCreateWithoutMediaInput[] | Prisma.ArticleMediaUncheckedCreateWithoutMediaInput[];
    connectOrCreate?: Prisma.ArticleMediaCreateOrConnectWithoutMediaInput | Prisma.ArticleMediaCreateOrConnectWithoutMediaInput[];
    upsert?: Prisma.ArticleMediaUpsertWithWhereUniqueWithoutMediaInput | Prisma.ArticleMediaUpsertWithWhereUniqueWithoutMediaInput[];
    createMany?: Prisma.ArticleMediaCreateManyMediaInputEnvelope;
    set?: Prisma.ArticleMediaWhereUniqueInput | Prisma.ArticleMediaWhereUniqueInput[];
    disconnect?: Prisma.ArticleMediaWhereUniqueInput | Prisma.ArticleMediaWhereUniqueInput[];
    delete?: Prisma.ArticleMediaWhereUniqueInput | Prisma.ArticleMediaWhereUniqueInput[];
    connect?: Prisma.ArticleMediaWhereUniqueInput | Prisma.ArticleMediaWhereUniqueInput[];
    update?: Prisma.ArticleMediaUpdateWithWhereUniqueWithoutMediaInput | Prisma.ArticleMediaUpdateWithWhereUniqueWithoutMediaInput[];
    updateMany?: Prisma.ArticleMediaUpdateManyWithWhereWithoutMediaInput | Prisma.ArticleMediaUpdateManyWithWhereWithoutMediaInput[];
    deleteMany?: Prisma.ArticleMediaScalarWhereInput | Prisma.ArticleMediaScalarWhereInput[];
};
export type ArticleMediaCreateWithoutArticleInput = {
    sortOrder?: number;
    caption?: string | null;
    media: Prisma.MediaCreateNestedOneWithoutArticlesInput;
};
export type ArticleMediaUncheckedCreateWithoutArticleInput = {
    mediaId: string;
    sortOrder?: number;
    caption?: string | null;
};
export type ArticleMediaCreateOrConnectWithoutArticleInput = {
    where: Prisma.ArticleMediaWhereUniqueInput;
    create: Prisma.XOR<Prisma.ArticleMediaCreateWithoutArticleInput, Prisma.ArticleMediaUncheckedCreateWithoutArticleInput>;
};
export type ArticleMediaCreateManyArticleInputEnvelope = {
    data: Prisma.ArticleMediaCreateManyArticleInput | Prisma.ArticleMediaCreateManyArticleInput[];
    skipDuplicates?: boolean;
};
export type ArticleMediaUpsertWithWhereUniqueWithoutArticleInput = {
    where: Prisma.ArticleMediaWhereUniqueInput;
    update: Prisma.XOR<Prisma.ArticleMediaUpdateWithoutArticleInput, Prisma.ArticleMediaUncheckedUpdateWithoutArticleInput>;
    create: Prisma.XOR<Prisma.ArticleMediaCreateWithoutArticleInput, Prisma.ArticleMediaUncheckedCreateWithoutArticleInput>;
};
export type ArticleMediaUpdateWithWhereUniqueWithoutArticleInput = {
    where: Prisma.ArticleMediaWhereUniqueInput;
    data: Prisma.XOR<Prisma.ArticleMediaUpdateWithoutArticleInput, Prisma.ArticleMediaUncheckedUpdateWithoutArticleInput>;
};
export type ArticleMediaUpdateManyWithWhereWithoutArticleInput = {
    where: Prisma.ArticleMediaScalarWhereInput;
    data: Prisma.XOR<Prisma.ArticleMediaUpdateManyMutationInput, Prisma.ArticleMediaUncheckedUpdateManyWithoutArticleInput>;
};
export type ArticleMediaScalarWhereInput = {
    AND?: Prisma.ArticleMediaScalarWhereInput | Prisma.ArticleMediaScalarWhereInput[];
    OR?: Prisma.ArticleMediaScalarWhereInput[];
    NOT?: Prisma.ArticleMediaScalarWhereInput | Prisma.ArticleMediaScalarWhereInput[];
    articleId?: Prisma.StringFilter<"ArticleMedia"> | string;
    mediaId?: Prisma.StringFilter<"ArticleMedia"> | string;
    sortOrder?: Prisma.IntFilter<"ArticleMedia"> | number;
    caption?: Prisma.StringNullableFilter<"ArticleMedia"> | string | null;
};
export type ArticleMediaCreateWithoutMediaInput = {
    sortOrder?: number;
    caption?: string | null;
    article: Prisma.ArticleCreateNestedOneWithoutGalleryInput;
};
export type ArticleMediaUncheckedCreateWithoutMediaInput = {
    articleId: string;
    sortOrder?: number;
    caption?: string | null;
};
export type ArticleMediaCreateOrConnectWithoutMediaInput = {
    where: Prisma.ArticleMediaWhereUniqueInput;
    create: Prisma.XOR<Prisma.ArticleMediaCreateWithoutMediaInput, Prisma.ArticleMediaUncheckedCreateWithoutMediaInput>;
};
export type ArticleMediaCreateManyMediaInputEnvelope = {
    data: Prisma.ArticleMediaCreateManyMediaInput | Prisma.ArticleMediaCreateManyMediaInput[];
    skipDuplicates?: boolean;
};
export type ArticleMediaUpsertWithWhereUniqueWithoutMediaInput = {
    where: Prisma.ArticleMediaWhereUniqueInput;
    update: Prisma.XOR<Prisma.ArticleMediaUpdateWithoutMediaInput, Prisma.ArticleMediaUncheckedUpdateWithoutMediaInput>;
    create: Prisma.XOR<Prisma.ArticleMediaCreateWithoutMediaInput, Prisma.ArticleMediaUncheckedCreateWithoutMediaInput>;
};
export type ArticleMediaUpdateWithWhereUniqueWithoutMediaInput = {
    where: Prisma.ArticleMediaWhereUniqueInput;
    data: Prisma.XOR<Prisma.ArticleMediaUpdateWithoutMediaInput, Prisma.ArticleMediaUncheckedUpdateWithoutMediaInput>;
};
export type ArticleMediaUpdateManyWithWhereWithoutMediaInput = {
    where: Prisma.ArticleMediaScalarWhereInput;
    data: Prisma.XOR<Prisma.ArticleMediaUpdateManyMutationInput, Prisma.ArticleMediaUncheckedUpdateManyWithoutMediaInput>;
};
export type ArticleMediaCreateManyArticleInput = {
    mediaId: string;
    sortOrder?: number;
    caption?: string | null;
};
export type ArticleMediaUpdateWithoutArticleInput = {
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    caption?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    media?: Prisma.MediaUpdateOneRequiredWithoutArticlesNestedInput;
};
export type ArticleMediaUncheckedUpdateWithoutArticleInput = {
    mediaId?: Prisma.StringFieldUpdateOperationsInput | string;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    caption?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type ArticleMediaUncheckedUpdateManyWithoutArticleInput = {
    mediaId?: Prisma.StringFieldUpdateOperationsInput | string;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    caption?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type ArticleMediaCreateManyMediaInput = {
    articleId: string;
    sortOrder?: number;
    caption?: string | null;
};
export type ArticleMediaUpdateWithoutMediaInput = {
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    caption?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    article?: Prisma.ArticleUpdateOneRequiredWithoutGalleryNestedInput;
};
export type ArticleMediaUncheckedUpdateWithoutMediaInput = {
    articleId?: Prisma.StringFieldUpdateOperationsInput | string;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    caption?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type ArticleMediaUncheckedUpdateManyWithoutMediaInput = {
    articleId?: Prisma.StringFieldUpdateOperationsInput | string;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    caption?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type ArticleMediaSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    articleId?: boolean;
    mediaId?: boolean;
    sortOrder?: boolean;
    caption?: boolean;
    article?: boolean | Prisma.ArticleDefaultArgs<ExtArgs>;
    media?: boolean | Prisma.MediaDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["articleMedia"]>;
export type ArticleMediaSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    articleId?: boolean;
    mediaId?: boolean;
    sortOrder?: boolean;
    caption?: boolean;
    article?: boolean | Prisma.ArticleDefaultArgs<ExtArgs>;
    media?: boolean | Prisma.MediaDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["articleMedia"]>;
export type ArticleMediaSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    articleId?: boolean;
    mediaId?: boolean;
    sortOrder?: boolean;
    caption?: boolean;
    article?: boolean | Prisma.ArticleDefaultArgs<ExtArgs>;
    media?: boolean | Prisma.MediaDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["articleMedia"]>;
export type ArticleMediaSelectScalar = {
    articleId?: boolean;
    mediaId?: boolean;
    sortOrder?: boolean;
    caption?: boolean;
};
export type ArticleMediaOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"articleId" | "mediaId" | "sortOrder" | "caption", ExtArgs["result"]["articleMedia"]>;
export type ArticleMediaInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    article?: boolean | Prisma.ArticleDefaultArgs<ExtArgs>;
    media?: boolean | Prisma.MediaDefaultArgs<ExtArgs>;
};
export type ArticleMediaIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    article?: boolean | Prisma.ArticleDefaultArgs<ExtArgs>;
    media?: boolean | Prisma.MediaDefaultArgs<ExtArgs>;
};
export type ArticleMediaIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    article?: boolean | Prisma.ArticleDefaultArgs<ExtArgs>;
    media?: boolean | Prisma.MediaDefaultArgs<ExtArgs>;
};
export type $ArticleMediaPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ArticleMedia";
    objects: {
        article: Prisma.$ArticlePayload<ExtArgs>;
        media: Prisma.$MediaPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        articleId: string;
        mediaId: string;
        sortOrder: number;
        caption: string | null;
    }, ExtArgs["result"]["articleMedia"]>;
    composites: {};
};
export type ArticleMediaGetPayload<S extends boolean | null | undefined | ArticleMediaDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ArticleMediaPayload, S>;
export type ArticleMediaCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ArticleMediaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ArticleMediaCountAggregateInputType | true;
};
export interface ArticleMediaDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ArticleMedia'];
        meta: {
            name: 'ArticleMedia';
        };
    };
    findUnique<T extends ArticleMediaFindUniqueArgs>(args: Prisma.SelectSubset<T, ArticleMediaFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ArticleMediaClient<runtime.Types.Result.GetResult<Prisma.$ArticleMediaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ArticleMediaFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ArticleMediaFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ArticleMediaClient<runtime.Types.Result.GetResult<Prisma.$ArticleMediaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ArticleMediaFindFirstArgs>(args?: Prisma.SelectSubset<T, ArticleMediaFindFirstArgs<ExtArgs>>): Prisma.Prisma__ArticleMediaClient<runtime.Types.Result.GetResult<Prisma.$ArticleMediaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ArticleMediaFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ArticleMediaFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ArticleMediaClient<runtime.Types.Result.GetResult<Prisma.$ArticleMediaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ArticleMediaFindManyArgs>(args?: Prisma.SelectSubset<T, ArticleMediaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ArticleMediaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ArticleMediaCreateArgs>(args: Prisma.SelectSubset<T, ArticleMediaCreateArgs<ExtArgs>>): Prisma.Prisma__ArticleMediaClient<runtime.Types.Result.GetResult<Prisma.$ArticleMediaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ArticleMediaCreateManyArgs>(args?: Prisma.SelectSubset<T, ArticleMediaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ArticleMediaCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ArticleMediaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ArticleMediaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ArticleMediaDeleteArgs>(args: Prisma.SelectSubset<T, ArticleMediaDeleteArgs<ExtArgs>>): Prisma.Prisma__ArticleMediaClient<runtime.Types.Result.GetResult<Prisma.$ArticleMediaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ArticleMediaUpdateArgs>(args: Prisma.SelectSubset<T, ArticleMediaUpdateArgs<ExtArgs>>): Prisma.Prisma__ArticleMediaClient<runtime.Types.Result.GetResult<Prisma.$ArticleMediaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ArticleMediaDeleteManyArgs>(args?: Prisma.SelectSubset<T, ArticleMediaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ArticleMediaUpdateManyArgs>(args: Prisma.SelectSubset<T, ArticleMediaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ArticleMediaUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ArticleMediaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ArticleMediaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ArticleMediaUpsertArgs>(args: Prisma.SelectSubset<T, ArticleMediaUpsertArgs<ExtArgs>>): Prisma.Prisma__ArticleMediaClient<runtime.Types.Result.GetResult<Prisma.$ArticleMediaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ArticleMediaCountArgs>(args?: Prisma.Subset<T, ArticleMediaCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ArticleMediaCountAggregateOutputType> : number>;
    aggregate<T extends ArticleMediaAggregateArgs>(args: Prisma.Subset<T, ArticleMediaAggregateArgs>): Prisma.PrismaPromise<GetArticleMediaAggregateType<T>>;
    groupBy<T extends ArticleMediaGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ArticleMediaGroupByArgs['orderBy'];
    } : {
        orderBy?: ArticleMediaGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ArticleMediaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetArticleMediaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ArticleMediaFieldRefs;
}
export interface Prisma__ArticleMediaClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    article<T extends Prisma.ArticleDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ArticleDefaultArgs<ExtArgs>>): Prisma.Prisma__ArticleClient<runtime.Types.Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    media<T extends Prisma.MediaDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MediaDefaultArgs<ExtArgs>>): Prisma.Prisma__MediaClient<runtime.Types.Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ArticleMediaFieldRefs {
    readonly articleId: Prisma.FieldRef<"ArticleMedia", 'String'>;
    readonly mediaId: Prisma.FieldRef<"ArticleMedia", 'String'>;
    readonly sortOrder: Prisma.FieldRef<"ArticleMedia", 'Int'>;
    readonly caption: Prisma.FieldRef<"ArticleMedia", 'String'>;
}
export type ArticleMediaFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticleMediaSelect<ExtArgs> | null;
    omit?: Prisma.ArticleMediaOmit<ExtArgs> | null;
    include?: Prisma.ArticleMediaInclude<ExtArgs> | null;
    where: Prisma.ArticleMediaWhereUniqueInput;
};
export type ArticleMediaFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticleMediaSelect<ExtArgs> | null;
    omit?: Prisma.ArticleMediaOmit<ExtArgs> | null;
    include?: Prisma.ArticleMediaInclude<ExtArgs> | null;
    where: Prisma.ArticleMediaWhereUniqueInput;
};
export type ArticleMediaFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticleMediaSelect<ExtArgs> | null;
    omit?: Prisma.ArticleMediaOmit<ExtArgs> | null;
    include?: Prisma.ArticleMediaInclude<ExtArgs> | null;
    where?: Prisma.ArticleMediaWhereInput;
    orderBy?: Prisma.ArticleMediaOrderByWithRelationInput | Prisma.ArticleMediaOrderByWithRelationInput[];
    cursor?: Prisma.ArticleMediaWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ArticleMediaScalarFieldEnum | Prisma.ArticleMediaScalarFieldEnum[];
};
export type ArticleMediaFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticleMediaSelect<ExtArgs> | null;
    omit?: Prisma.ArticleMediaOmit<ExtArgs> | null;
    include?: Prisma.ArticleMediaInclude<ExtArgs> | null;
    where?: Prisma.ArticleMediaWhereInput;
    orderBy?: Prisma.ArticleMediaOrderByWithRelationInput | Prisma.ArticleMediaOrderByWithRelationInput[];
    cursor?: Prisma.ArticleMediaWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ArticleMediaScalarFieldEnum | Prisma.ArticleMediaScalarFieldEnum[];
};
export type ArticleMediaFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticleMediaSelect<ExtArgs> | null;
    omit?: Prisma.ArticleMediaOmit<ExtArgs> | null;
    include?: Prisma.ArticleMediaInclude<ExtArgs> | null;
    where?: Prisma.ArticleMediaWhereInput;
    orderBy?: Prisma.ArticleMediaOrderByWithRelationInput | Prisma.ArticleMediaOrderByWithRelationInput[];
    cursor?: Prisma.ArticleMediaWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ArticleMediaScalarFieldEnum | Prisma.ArticleMediaScalarFieldEnum[];
};
export type ArticleMediaCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticleMediaSelect<ExtArgs> | null;
    omit?: Prisma.ArticleMediaOmit<ExtArgs> | null;
    include?: Prisma.ArticleMediaInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ArticleMediaCreateInput, Prisma.ArticleMediaUncheckedCreateInput>;
};
export type ArticleMediaCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ArticleMediaCreateManyInput | Prisma.ArticleMediaCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ArticleMediaCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticleMediaSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ArticleMediaOmit<ExtArgs> | null;
    data: Prisma.ArticleMediaCreateManyInput | Prisma.ArticleMediaCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ArticleMediaIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ArticleMediaUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticleMediaSelect<ExtArgs> | null;
    omit?: Prisma.ArticleMediaOmit<ExtArgs> | null;
    include?: Prisma.ArticleMediaInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ArticleMediaUpdateInput, Prisma.ArticleMediaUncheckedUpdateInput>;
    where: Prisma.ArticleMediaWhereUniqueInput;
};
export type ArticleMediaUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ArticleMediaUpdateManyMutationInput, Prisma.ArticleMediaUncheckedUpdateManyInput>;
    where?: Prisma.ArticleMediaWhereInput;
    limit?: number;
};
export type ArticleMediaUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticleMediaSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ArticleMediaOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ArticleMediaUpdateManyMutationInput, Prisma.ArticleMediaUncheckedUpdateManyInput>;
    where?: Prisma.ArticleMediaWhereInput;
    limit?: number;
    include?: Prisma.ArticleMediaIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ArticleMediaUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticleMediaSelect<ExtArgs> | null;
    omit?: Prisma.ArticleMediaOmit<ExtArgs> | null;
    include?: Prisma.ArticleMediaInclude<ExtArgs> | null;
    where: Prisma.ArticleMediaWhereUniqueInput;
    create: Prisma.XOR<Prisma.ArticleMediaCreateInput, Prisma.ArticleMediaUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ArticleMediaUpdateInput, Prisma.ArticleMediaUncheckedUpdateInput>;
};
export type ArticleMediaDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticleMediaSelect<ExtArgs> | null;
    omit?: Prisma.ArticleMediaOmit<ExtArgs> | null;
    include?: Prisma.ArticleMediaInclude<ExtArgs> | null;
    where: Prisma.ArticleMediaWhereUniqueInput;
};
export type ArticleMediaDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ArticleMediaWhereInput;
    limit?: number;
};
export type ArticleMediaDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticleMediaSelect<ExtArgs> | null;
    omit?: Prisma.ArticleMediaOmit<ExtArgs> | null;
    include?: Prisma.ArticleMediaInclude<ExtArgs> | null;
};
