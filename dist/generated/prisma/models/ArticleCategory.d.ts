import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ArticleCategoryModel = runtime.Types.Result.DefaultSelection<Prisma.$ArticleCategoryPayload>;
export type AggregateArticleCategory = {
    _count: ArticleCategoryCountAggregateOutputType | null;
    _min: ArticleCategoryMinAggregateOutputType | null;
    _max: ArticleCategoryMaxAggregateOutputType | null;
};
export type ArticleCategoryMinAggregateOutputType = {
    articleId: string | null;
    categoryId: string | null;
    primary: boolean | null;
};
export type ArticleCategoryMaxAggregateOutputType = {
    articleId: string | null;
    categoryId: string | null;
    primary: boolean | null;
};
export type ArticleCategoryCountAggregateOutputType = {
    articleId: number;
    categoryId: number;
    primary: number;
    _all: number;
};
export type ArticleCategoryMinAggregateInputType = {
    articleId?: true;
    categoryId?: true;
    primary?: true;
};
export type ArticleCategoryMaxAggregateInputType = {
    articleId?: true;
    categoryId?: true;
    primary?: true;
};
export type ArticleCategoryCountAggregateInputType = {
    articleId?: true;
    categoryId?: true;
    primary?: true;
    _all?: true;
};
export type ArticleCategoryAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ArticleCategoryWhereInput;
    orderBy?: Prisma.ArticleCategoryOrderByWithRelationInput | Prisma.ArticleCategoryOrderByWithRelationInput[];
    cursor?: Prisma.ArticleCategoryWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ArticleCategoryCountAggregateInputType;
    _min?: ArticleCategoryMinAggregateInputType;
    _max?: ArticleCategoryMaxAggregateInputType;
};
export type GetArticleCategoryAggregateType<T extends ArticleCategoryAggregateArgs> = {
    [P in keyof T & keyof AggregateArticleCategory]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateArticleCategory[P]> : Prisma.GetScalarType<T[P], AggregateArticleCategory[P]>;
};
export type ArticleCategoryGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ArticleCategoryWhereInput;
    orderBy?: Prisma.ArticleCategoryOrderByWithAggregationInput | Prisma.ArticleCategoryOrderByWithAggregationInput[];
    by: Prisma.ArticleCategoryScalarFieldEnum[] | Prisma.ArticleCategoryScalarFieldEnum;
    having?: Prisma.ArticleCategoryScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ArticleCategoryCountAggregateInputType | true;
    _min?: ArticleCategoryMinAggregateInputType;
    _max?: ArticleCategoryMaxAggregateInputType;
};
export type ArticleCategoryGroupByOutputType = {
    articleId: string;
    categoryId: string;
    primary: boolean;
    _count: ArticleCategoryCountAggregateOutputType | null;
    _min: ArticleCategoryMinAggregateOutputType | null;
    _max: ArticleCategoryMaxAggregateOutputType | null;
};
export type GetArticleCategoryGroupByPayload<T extends ArticleCategoryGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ArticleCategoryGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ArticleCategoryGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ArticleCategoryGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ArticleCategoryGroupByOutputType[P]>;
}>>;
export type ArticleCategoryWhereInput = {
    AND?: Prisma.ArticleCategoryWhereInput | Prisma.ArticleCategoryWhereInput[];
    OR?: Prisma.ArticleCategoryWhereInput[];
    NOT?: Prisma.ArticleCategoryWhereInput | Prisma.ArticleCategoryWhereInput[];
    articleId?: Prisma.StringFilter<"ArticleCategory"> | string;
    categoryId?: Prisma.StringFilter<"ArticleCategory"> | string;
    primary?: Prisma.BoolFilter<"ArticleCategory"> | boolean;
    article?: Prisma.XOR<Prisma.ArticleScalarRelationFilter, Prisma.ArticleWhereInput>;
    category?: Prisma.XOR<Prisma.CategoryScalarRelationFilter, Prisma.CategoryWhereInput>;
};
export type ArticleCategoryOrderByWithRelationInput = {
    articleId?: Prisma.SortOrder;
    categoryId?: Prisma.SortOrder;
    primary?: Prisma.SortOrder;
    article?: Prisma.ArticleOrderByWithRelationInput;
    category?: Prisma.CategoryOrderByWithRelationInput;
};
export type ArticleCategoryWhereUniqueInput = Prisma.AtLeast<{
    articleId_categoryId?: Prisma.ArticleCategoryArticleIdCategoryIdCompoundUniqueInput;
    AND?: Prisma.ArticleCategoryWhereInput | Prisma.ArticleCategoryWhereInput[];
    OR?: Prisma.ArticleCategoryWhereInput[];
    NOT?: Prisma.ArticleCategoryWhereInput | Prisma.ArticleCategoryWhereInput[];
    articleId?: Prisma.StringFilter<"ArticleCategory"> | string;
    categoryId?: Prisma.StringFilter<"ArticleCategory"> | string;
    primary?: Prisma.BoolFilter<"ArticleCategory"> | boolean;
    article?: Prisma.XOR<Prisma.ArticleScalarRelationFilter, Prisma.ArticleWhereInput>;
    category?: Prisma.XOR<Prisma.CategoryScalarRelationFilter, Prisma.CategoryWhereInput>;
}, "articleId_categoryId">;
export type ArticleCategoryOrderByWithAggregationInput = {
    articleId?: Prisma.SortOrder;
    categoryId?: Prisma.SortOrder;
    primary?: Prisma.SortOrder;
    _count?: Prisma.ArticleCategoryCountOrderByAggregateInput;
    _max?: Prisma.ArticleCategoryMaxOrderByAggregateInput;
    _min?: Prisma.ArticleCategoryMinOrderByAggregateInput;
};
export type ArticleCategoryScalarWhereWithAggregatesInput = {
    AND?: Prisma.ArticleCategoryScalarWhereWithAggregatesInput | Prisma.ArticleCategoryScalarWhereWithAggregatesInput[];
    OR?: Prisma.ArticleCategoryScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ArticleCategoryScalarWhereWithAggregatesInput | Prisma.ArticleCategoryScalarWhereWithAggregatesInput[];
    articleId?: Prisma.StringWithAggregatesFilter<"ArticleCategory"> | string;
    categoryId?: Prisma.StringWithAggregatesFilter<"ArticleCategory"> | string;
    primary?: Prisma.BoolWithAggregatesFilter<"ArticleCategory"> | boolean;
};
export type ArticleCategoryCreateInput = {
    primary?: boolean;
    article: Prisma.ArticleCreateNestedOneWithoutCategoriesInput;
    category: Prisma.CategoryCreateNestedOneWithoutArticlesInput;
};
export type ArticleCategoryUncheckedCreateInput = {
    articleId: string;
    categoryId: string;
    primary?: boolean;
};
export type ArticleCategoryUpdateInput = {
    primary?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    article?: Prisma.ArticleUpdateOneRequiredWithoutCategoriesNestedInput;
    category?: Prisma.CategoryUpdateOneRequiredWithoutArticlesNestedInput;
};
export type ArticleCategoryUncheckedUpdateInput = {
    articleId?: Prisma.StringFieldUpdateOperationsInput | string;
    categoryId?: Prisma.StringFieldUpdateOperationsInput | string;
    primary?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type ArticleCategoryCreateManyInput = {
    articleId: string;
    categoryId: string;
    primary?: boolean;
};
export type ArticleCategoryUpdateManyMutationInput = {
    primary?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type ArticleCategoryUncheckedUpdateManyInput = {
    articleId?: Prisma.StringFieldUpdateOperationsInput | string;
    categoryId?: Prisma.StringFieldUpdateOperationsInput | string;
    primary?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type ArticleCategoryListRelationFilter = {
    every?: Prisma.ArticleCategoryWhereInput;
    some?: Prisma.ArticleCategoryWhereInput;
    none?: Prisma.ArticleCategoryWhereInput;
};
export type ArticleCategoryOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ArticleCategoryArticleIdCategoryIdCompoundUniqueInput = {
    articleId: string;
    categoryId: string;
};
export type ArticleCategoryCountOrderByAggregateInput = {
    articleId?: Prisma.SortOrder;
    categoryId?: Prisma.SortOrder;
    primary?: Prisma.SortOrder;
};
export type ArticleCategoryMaxOrderByAggregateInput = {
    articleId?: Prisma.SortOrder;
    categoryId?: Prisma.SortOrder;
    primary?: Prisma.SortOrder;
};
export type ArticleCategoryMinOrderByAggregateInput = {
    articleId?: Prisma.SortOrder;
    categoryId?: Prisma.SortOrder;
    primary?: Prisma.SortOrder;
};
export type ArticleCategoryCreateNestedManyWithoutCategoryInput = {
    create?: Prisma.XOR<Prisma.ArticleCategoryCreateWithoutCategoryInput, Prisma.ArticleCategoryUncheckedCreateWithoutCategoryInput> | Prisma.ArticleCategoryCreateWithoutCategoryInput[] | Prisma.ArticleCategoryUncheckedCreateWithoutCategoryInput[];
    connectOrCreate?: Prisma.ArticleCategoryCreateOrConnectWithoutCategoryInput | Prisma.ArticleCategoryCreateOrConnectWithoutCategoryInput[];
    createMany?: Prisma.ArticleCategoryCreateManyCategoryInputEnvelope;
    connect?: Prisma.ArticleCategoryWhereUniqueInput | Prisma.ArticleCategoryWhereUniqueInput[];
};
export type ArticleCategoryUncheckedCreateNestedManyWithoutCategoryInput = {
    create?: Prisma.XOR<Prisma.ArticleCategoryCreateWithoutCategoryInput, Prisma.ArticleCategoryUncheckedCreateWithoutCategoryInput> | Prisma.ArticleCategoryCreateWithoutCategoryInput[] | Prisma.ArticleCategoryUncheckedCreateWithoutCategoryInput[];
    connectOrCreate?: Prisma.ArticleCategoryCreateOrConnectWithoutCategoryInput | Prisma.ArticleCategoryCreateOrConnectWithoutCategoryInput[];
    createMany?: Prisma.ArticleCategoryCreateManyCategoryInputEnvelope;
    connect?: Prisma.ArticleCategoryWhereUniqueInput | Prisma.ArticleCategoryWhereUniqueInput[];
};
export type ArticleCategoryUpdateManyWithoutCategoryNestedInput = {
    create?: Prisma.XOR<Prisma.ArticleCategoryCreateWithoutCategoryInput, Prisma.ArticleCategoryUncheckedCreateWithoutCategoryInput> | Prisma.ArticleCategoryCreateWithoutCategoryInput[] | Prisma.ArticleCategoryUncheckedCreateWithoutCategoryInput[];
    connectOrCreate?: Prisma.ArticleCategoryCreateOrConnectWithoutCategoryInput | Prisma.ArticleCategoryCreateOrConnectWithoutCategoryInput[];
    upsert?: Prisma.ArticleCategoryUpsertWithWhereUniqueWithoutCategoryInput | Prisma.ArticleCategoryUpsertWithWhereUniqueWithoutCategoryInput[];
    createMany?: Prisma.ArticleCategoryCreateManyCategoryInputEnvelope;
    set?: Prisma.ArticleCategoryWhereUniqueInput | Prisma.ArticleCategoryWhereUniqueInput[];
    disconnect?: Prisma.ArticleCategoryWhereUniqueInput | Prisma.ArticleCategoryWhereUniqueInput[];
    delete?: Prisma.ArticleCategoryWhereUniqueInput | Prisma.ArticleCategoryWhereUniqueInput[];
    connect?: Prisma.ArticleCategoryWhereUniqueInput | Prisma.ArticleCategoryWhereUniqueInput[];
    update?: Prisma.ArticleCategoryUpdateWithWhereUniqueWithoutCategoryInput | Prisma.ArticleCategoryUpdateWithWhereUniqueWithoutCategoryInput[];
    updateMany?: Prisma.ArticleCategoryUpdateManyWithWhereWithoutCategoryInput | Prisma.ArticleCategoryUpdateManyWithWhereWithoutCategoryInput[];
    deleteMany?: Prisma.ArticleCategoryScalarWhereInput | Prisma.ArticleCategoryScalarWhereInput[];
};
export type ArticleCategoryUncheckedUpdateManyWithoutCategoryNestedInput = {
    create?: Prisma.XOR<Prisma.ArticleCategoryCreateWithoutCategoryInput, Prisma.ArticleCategoryUncheckedCreateWithoutCategoryInput> | Prisma.ArticleCategoryCreateWithoutCategoryInput[] | Prisma.ArticleCategoryUncheckedCreateWithoutCategoryInput[];
    connectOrCreate?: Prisma.ArticleCategoryCreateOrConnectWithoutCategoryInput | Prisma.ArticleCategoryCreateOrConnectWithoutCategoryInput[];
    upsert?: Prisma.ArticleCategoryUpsertWithWhereUniqueWithoutCategoryInput | Prisma.ArticleCategoryUpsertWithWhereUniqueWithoutCategoryInput[];
    createMany?: Prisma.ArticleCategoryCreateManyCategoryInputEnvelope;
    set?: Prisma.ArticleCategoryWhereUniqueInput | Prisma.ArticleCategoryWhereUniqueInput[];
    disconnect?: Prisma.ArticleCategoryWhereUniqueInput | Prisma.ArticleCategoryWhereUniqueInput[];
    delete?: Prisma.ArticleCategoryWhereUniqueInput | Prisma.ArticleCategoryWhereUniqueInput[];
    connect?: Prisma.ArticleCategoryWhereUniqueInput | Prisma.ArticleCategoryWhereUniqueInput[];
    update?: Prisma.ArticleCategoryUpdateWithWhereUniqueWithoutCategoryInput | Prisma.ArticleCategoryUpdateWithWhereUniqueWithoutCategoryInput[];
    updateMany?: Prisma.ArticleCategoryUpdateManyWithWhereWithoutCategoryInput | Prisma.ArticleCategoryUpdateManyWithWhereWithoutCategoryInput[];
    deleteMany?: Prisma.ArticleCategoryScalarWhereInput | Prisma.ArticleCategoryScalarWhereInput[];
};
export type ArticleCategoryCreateNestedManyWithoutArticleInput = {
    create?: Prisma.XOR<Prisma.ArticleCategoryCreateWithoutArticleInput, Prisma.ArticleCategoryUncheckedCreateWithoutArticleInput> | Prisma.ArticleCategoryCreateWithoutArticleInput[] | Prisma.ArticleCategoryUncheckedCreateWithoutArticleInput[];
    connectOrCreate?: Prisma.ArticleCategoryCreateOrConnectWithoutArticleInput | Prisma.ArticleCategoryCreateOrConnectWithoutArticleInput[];
    createMany?: Prisma.ArticleCategoryCreateManyArticleInputEnvelope;
    connect?: Prisma.ArticleCategoryWhereUniqueInput | Prisma.ArticleCategoryWhereUniqueInput[];
};
export type ArticleCategoryUncheckedCreateNestedManyWithoutArticleInput = {
    create?: Prisma.XOR<Prisma.ArticleCategoryCreateWithoutArticleInput, Prisma.ArticleCategoryUncheckedCreateWithoutArticleInput> | Prisma.ArticleCategoryCreateWithoutArticleInput[] | Prisma.ArticleCategoryUncheckedCreateWithoutArticleInput[];
    connectOrCreate?: Prisma.ArticleCategoryCreateOrConnectWithoutArticleInput | Prisma.ArticleCategoryCreateOrConnectWithoutArticleInput[];
    createMany?: Prisma.ArticleCategoryCreateManyArticleInputEnvelope;
    connect?: Prisma.ArticleCategoryWhereUniqueInput | Prisma.ArticleCategoryWhereUniqueInput[];
};
export type ArticleCategoryUpdateManyWithoutArticleNestedInput = {
    create?: Prisma.XOR<Prisma.ArticleCategoryCreateWithoutArticleInput, Prisma.ArticleCategoryUncheckedCreateWithoutArticleInput> | Prisma.ArticleCategoryCreateWithoutArticleInput[] | Prisma.ArticleCategoryUncheckedCreateWithoutArticleInput[];
    connectOrCreate?: Prisma.ArticleCategoryCreateOrConnectWithoutArticleInput | Prisma.ArticleCategoryCreateOrConnectWithoutArticleInput[];
    upsert?: Prisma.ArticleCategoryUpsertWithWhereUniqueWithoutArticleInput | Prisma.ArticleCategoryUpsertWithWhereUniqueWithoutArticleInput[];
    createMany?: Prisma.ArticleCategoryCreateManyArticleInputEnvelope;
    set?: Prisma.ArticleCategoryWhereUniqueInput | Prisma.ArticleCategoryWhereUniqueInput[];
    disconnect?: Prisma.ArticleCategoryWhereUniqueInput | Prisma.ArticleCategoryWhereUniqueInput[];
    delete?: Prisma.ArticleCategoryWhereUniqueInput | Prisma.ArticleCategoryWhereUniqueInput[];
    connect?: Prisma.ArticleCategoryWhereUniqueInput | Prisma.ArticleCategoryWhereUniqueInput[];
    update?: Prisma.ArticleCategoryUpdateWithWhereUniqueWithoutArticleInput | Prisma.ArticleCategoryUpdateWithWhereUniqueWithoutArticleInput[];
    updateMany?: Prisma.ArticleCategoryUpdateManyWithWhereWithoutArticleInput | Prisma.ArticleCategoryUpdateManyWithWhereWithoutArticleInput[];
    deleteMany?: Prisma.ArticleCategoryScalarWhereInput | Prisma.ArticleCategoryScalarWhereInput[];
};
export type ArticleCategoryUncheckedUpdateManyWithoutArticleNestedInput = {
    create?: Prisma.XOR<Prisma.ArticleCategoryCreateWithoutArticleInput, Prisma.ArticleCategoryUncheckedCreateWithoutArticleInput> | Prisma.ArticleCategoryCreateWithoutArticleInput[] | Prisma.ArticleCategoryUncheckedCreateWithoutArticleInput[];
    connectOrCreate?: Prisma.ArticleCategoryCreateOrConnectWithoutArticleInput | Prisma.ArticleCategoryCreateOrConnectWithoutArticleInput[];
    upsert?: Prisma.ArticleCategoryUpsertWithWhereUniqueWithoutArticleInput | Prisma.ArticleCategoryUpsertWithWhereUniqueWithoutArticleInput[];
    createMany?: Prisma.ArticleCategoryCreateManyArticleInputEnvelope;
    set?: Prisma.ArticleCategoryWhereUniqueInput | Prisma.ArticleCategoryWhereUniqueInput[];
    disconnect?: Prisma.ArticleCategoryWhereUniqueInput | Prisma.ArticleCategoryWhereUniqueInput[];
    delete?: Prisma.ArticleCategoryWhereUniqueInput | Prisma.ArticleCategoryWhereUniqueInput[];
    connect?: Prisma.ArticleCategoryWhereUniqueInput | Prisma.ArticleCategoryWhereUniqueInput[];
    update?: Prisma.ArticleCategoryUpdateWithWhereUniqueWithoutArticleInput | Prisma.ArticleCategoryUpdateWithWhereUniqueWithoutArticleInput[];
    updateMany?: Prisma.ArticleCategoryUpdateManyWithWhereWithoutArticleInput | Prisma.ArticleCategoryUpdateManyWithWhereWithoutArticleInput[];
    deleteMany?: Prisma.ArticleCategoryScalarWhereInput | Prisma.ArticleCategoryScalarWhereInput[];
};
export type ArticleCategoryCreateWithoutCategoryInput = {
    primary?: boolean;
    article: Prisma.ArticleCreateNestedOneWithoutCategoriesInput;
};
export type ArticleCategoryUncheckedCreateWithoutCategoryInput = {
    articleId: string;
    primary?: boolean;
};
export type ArticleCategoryCreateOrConnectWithoutCategoryInput = {
    where: Prisma.ArticleCategoryWhereUniqueInput;
    create: Prisma.XOR<Prisma.ArticleCategoryCreateWithoutCategoryInput, Prisma.ArticleCategoryUncheckedCreateWithoutCategoryInput>;
};
export type ArticleCategoryCreateManyCategoryInputEnvelope = {
    data: Prisma.ArticleCategoryCreateManyCategoryInput | Prisma.ArticleCategoryCreateManyCategoryInput[];
    skipDuplicates?: boolean;
};
export type ArticleCategoryUpsertWithWhereUniqueWithoutCategoryInput = {
    where: Prisma.ArticleCategoryWhereUniqueInput;
    update: Prisma.XOR<Prisma.ArticleCategoryUpdateWithoutCategoryInput, Prisma.ArticleCategoryUncheckedUpdateWithoutCategoryInput>;
    create: Prisma.XOR<Prisma.ArticleCategoryCreateWithoutCategoryInput, Prisma.ArticleCategoryUncheckedCreateWithoutCategoryInput>;
};
export type ArticleCategoryUpdateWithWhereUniqueWithoutCategoryInput = {
    where: Prisma.ArticleCategoryWhereUniqueInput;
    data: Prisma.XOR<Prisma.ArticleCategoryUpdateWithoutCategoryInput, Prisma.ArticleCategoryUncheckedUpdateWithoutCategoryInput>;
};
export type ArticleCategoryUpdateManyWithWhereWithoutCategoryInput = {
    where: Prisma.ArticleCategoryScalarWhereInput;
    data: Prisma.XOR<Prisma.ArticleCategoryUpdateManyMutationInput, Prisma.ArticleCategoryUncheckedUpdateManyWithoutCategoryInput>;
};
export type ArticleCategoryScalarWhereInput = {
    AND?: Prisma.ArticleCategoryScalarWhereInput | Prisma.ArticleCategoryScalarWhereInput[];
    OR?: Prisma.ArticleCategoryScalarWhereInput[];
    NOT?: Prisma.ArticleCategoryScalarWhereInput | Prisma.ArticleCategoryScalarWhereInput[];
    articleId?: Prisma.StringFilter<"ArticleCategory"> | string;
    categoryId?: Prisma.StringFilter<"ArticleCategory"> | string;
    primary?: Prisma.BoolFilter<"ArticleCategory"> | boolean;
};
export type ArticleCategoryCreateWithoutArticleInput = {
    primary?: boolean;
    category: Prisma.CategoryCreateNestedOneWithoutArticlesInput;
};
export type ArticleCategoryUncheckedCreateWithoutArticleInput = {
    categoryId: string;
    primary?: boolean;
};
export type ArticleCategoryCreateOrConnectWithoutArticleInput = {
    where: Prisma.ArticleCategoryWhereUniqueInput;
    create: Prisma.XOR<Prisma.ArticleCategoryCreateWithoutArticleInput, Prisma.ArticleCategoryUncheckedCreateWithoutArticleInput>;
};
export type ArticleCategoryCreateManyArticleInputEnvelope = {
    data: Prisma.ArticleCategoryCreateManyArticleInput | Prisma.ArticleCategoryCreateManyArticleInput[];
    skipDuplicates?: boolean;
};
export type ArticleCategoryUpsertWithWhereUniqueWithoutArticleInput = {
    where: Prisma.ArticleCategoryWhereUniqueInput;
    update: Prisma.XOR<Prisma.ArticleCategoryUpdateWithoutArticleInput, Prisma.ArticleCategoryUncheckedUpdateWithoutArticleInput>;
    create: Prisma.XOR<Prisma.ArticleCategoryCreateWithoutArticleInput, Prisma.ArticleCategoryUncheckedCreateWithoutArticleInput>;
};
export type ArticleCategoryUpdateWithWhereUniqueWithoutArticleInput = {
    where: Prisma.ArticleCategoryWhereUniqueInput;
    data: Prisma.XOR<Prisma.ArticleCategoryUpdateWithoutArticleInput, Prisma.ArticleCategoryUncheckedUpdateWithoutArticleInput>;
};
export type ArticleCategoryUpdateManyWithWhereWithoutArticleInput = {
    where: Prisma.ArticleCategoryScalarWhereInput;
    data: Prisma.XOR<Prisma.ArticleCategoryUpdateManyMutationInput, Prisma.ArticleCategoryUncheckedUpdateManyWithoutArticleInput>;
};
export type ArticleCategoryCreateManyCategoryInput = {
    articleId: string;
    primary?: boolean;
};
export type ArticleCategoryUpdateWithoutCategoryInput = {
    primary?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    article?: Prisma.ArticleUpdateOneRequiredWithoutCategoriesNestedInput;
};
export type ArticleCategoryUncheckedUpdateWithoutCategoryInput = {
    articleId?: Prisma.StringFieldUpdateOperationsInput | string;
    primary?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type ArticleCategoryUncheckedUpdateManyWithoutCategoryInput = {
    articleId?: Prisma.StringFieldUpdateOperationsInput | string;
    primary?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type ArticleCategoryCreateManyArticleInput = {
    categoryId: string;
    primary?: boolean;
};
export type ArticleCategoryUpdateWithoutArticleInput = {
    primary?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    category?: Prisma.CategoryUpdateOneRequiredWithoutArticlesNestedInput;
};
export type ArticleCategoryUncheckedUpdateWithoutArticleInput = {
    categoryId?: Prisma.StringFieldUpdateOperationsInput | string;
    primary?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type ArticleCategoryUncheckedUpdateManyWithoutArticleInput = {
    categoryId?: Prisma.StringFieldUpdateOperationsInput | string;
    primary?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type ArticleCategorySelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    articleId?: boolean;
    categoryId?: boolean;
    primary?: boolean;
    article?: boolean | Prisma.ArticleDefaultArgs<ExtArgs>;
    category?: boolean | Prisma.CategoryDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["articleCategory"]>;
export type ArticleCategorySelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    articleId?: boolean;
    categoryId?: boolean;
    primary?: boolean;
    article?: boolean | Prisma.ArticleDefaultArgs<ExtArgs>;
    category?: boolean | Prisma.CategoryDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["articleCategory"]>;
export type ArticleCategorySelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    articleId?: boolean;
    categoryId?: boolean;
    primary?: boolean;
    article?: boolean | Prisma.ArticleDefaultArgs<ExtArgs>;
    category?: boolean | Prisma.CategoryDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["articleCategory"]>;
export type ArticleCategorySelectScalar = {
    articleId?: boolean;
    categoryId?: boolean;
    primary?: boolean;
};
export type ArticleCategoryOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"articleId" | "categoryId" | "primary", ExtArgs["result"]["articleCategory"]>;
export type ArticleCategoryInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    article?: boolean | Prisma.ArticleDefaultArgs<ExtArgs>;
    category?: boolean | Prisma.CategoryDefaultArgs<ExtArgs>;
};
export type ArticleCategoryIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    article?: boolean | Prisma.ArticleDefaultArgs<ExtArgs>;
    category?: boolean | Prisma.CategoryDefaultArgs<ExtArgs>;
};
export type ArticleCategoryIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    article?: boolean | Prisma.ArticleDefaultArgs<ExtArgs>;
    category?: boolean | Prisma.CategoryDefaultArgs<ExtArgs>;
};
export type $ArticleCategoryPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ArticleCategory";
    objects: {
        article: Prisma.$ArticlePayload<ExtArgs>;
        category: Prisma.$CategoryPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        articleId: string;
        categoryId: string;
        primary: boolean;
    }, ExtArgs["result"]["articleCategory"]>;
    composites: {};
};
export type ArticleCategoryGetPayload<S extends boolean | null | undefined | ArticleCategoryDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ArticleCategoryPayload, S>;
export type ArticleCategoryCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ArticleCategoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ArticleCategoryCountAggregateInputType | true;
};
export interface ArticleCategoryDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ArticleCategory'];
        meta: {
            name: 'ArticleCategory';
        };
    };
    findUnique<T extends ArticleCategoryFindUniqueArgs>(args: Prisma.SelectSubset<T, ArticleCategoryFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ArticleCategoryClient<runtime.Types.Result.GetResult<Prisma.$ArticleCategoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ArticleCategoryFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ArticleCategoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ArticleCategoryClient<runtime.Types.Result.GetResult<Prisma.$ArticleCategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ArticleCategoryFindFirstArgs>(args?: Prisma.SelectSubset<T, ArticleCategoryFindFirstArgs<ExtArgs>>): Prisma.Prisma__ArticleCategoryClient<runtime.Types.Result.GetResult<Prisma.$ArticleCategoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ArticleCategoryFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ArticleCategoryFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ArticleCategoryClient<runtime.Types.Result.GetResult<Prisma.$ArticleCategoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ArticleCategoryFindManyArgs>(args?: Prisma.SelectSubset<T, ArticleCategoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ArticleCategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ArticleCategoryCreateArgs>(args: Prisma.SelectSubset<T, ArticleCategoryCreateArgs<ExtArgs>>): Prisma.Prisma__ArticleCategoryClient<runtime.Types.Result.GetResult<Prisma.$ArticleCategoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ArticleCategoryCreateManyArgs>(args?: Prisma.SelectSubset<T, ArticleCategoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ArticleCategoryCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ArticleCategoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ArticleCategoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ArticleCategoryDeleteArgs>(args: Prisma.SelectSubset<T, ArticleCategoryDeleteArgs<ExtArgs>>): Prisma.Prisma__ArticleCategoryClient<runtime.Types.Result.GetResult<Prisma.$ArticleCategoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ArticleCategoryUpdateArgs>(args: Prisma.SelectSubset<T, ArticleCategoryUpdateArgs<ExtArgs>>): Prisma.Prisma__ArticleCategoryClient<runtime.Types.Result.GetResult<Prisma.$ArticleCategoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ArticleCategoryDeleteManyArgs>(args?: Prisma.SelectSubset<T, ArticleCategoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ArticleCategoryUpdateManyArgs>(args: Prisma.SelectSubset<T, ArticleCategoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ArticleCategoryUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ArticleCategoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ArticleCategoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ArticleCategoryUpsertArgs>(args: Prisma.SelectSubset<T, ArticleCategoryUpsertArgs<ExtArgs>>): Prisma.Prisma__ArticleCategoryClient<runtime.Types.Result.GetResult<Prisma.$ArticleCategoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ArticleCategoryCountArgs>(args?: Prisma.Subset<T, ArticleCategoryCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ArticleCategoryCountAggregateOutputType> : number>;
    aggregate<T extends ArticleCategoryAggregateArgs>(args: Prisma.Subset<T, ArticleCategoryAggregateArgs>): Prisma.PrismaPromise<GetArticleCategoryAggregateType<T>>;
    groupBy<T extends ArticleCategoryGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ArticleCategoryGroupByArgs['orderBy'];
    } : {
        orderBy?: ArticleCategoryGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ArticleCategoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetArticleCategoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ArticleCategoryFieldRefs;
}
export interface Prisma__ArticleCategoryClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    article<T extends Prisma.ArticleDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ArticleDefaultArgs<ExtArgs>>): Prisma.Prisma__ArticleClient<runtime.Types.Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    category<T extends Prisma.CategoryDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CategoryDefaultArgs<ExtArgs>>): Prisma.Prisma__CategoryClient<runtime.Types.Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ArticleCategoryFieldRefs {
    readonly articleId: Prisma.FieldRef<"ArticleCategory", 'String'>;
    readonly categoryId: Prisma.FieldRef<"ArticleCategory", 'String'>;
    readonly primary: Prisma.FieldRef<"ArticleCategory", 'Boolean'>;
}
export type ArticleCategoryFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticleCategorySelect<ExtArgs> | null;
    omit?: Prisma.ArticleCategoryOmit<ExtArgs> | null;
    include?: Prisma.ArticleCategoryInclude<ExtArgs> | null;
    where: Prisma.ArticleCategoryWhereUniqueInput;
};
export type ArticleCategoryFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticleCategorySelect<ExtArgs> | null;
    omit?: Prisma.ArticleCategoryOmit<ExtArgs> | null;
    include?: Prisma.ArticleCategoryInclude<ExtArgs> | null;
    where: Prisma.ArticleCategoryWhereUniqueInput;
};
export type ArticleCategoryFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ArticleCategoryFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ArticleCategoryFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ArticleCategoryCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticleCategorySelect<ExtArgs> | null;
    omit?: Prisma.ArticleCategoryOmit<ExtArgs> | null;
    include?: Prisma.ArticleCategoryInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ArticleCategoryCreateInput, Prisma.ArticleCategoryUncheckedCreateInput>;
};
export type ArticleCategoryCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ArticleCategoryCreateManyInput | Prisma.ArticleCategoryCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ArticleCategoryCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticleCategorySelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ArticleCategoryOmit<ExtArgs> | null;
    data: Prisma.ArticleCategoryCreateManyInput | Prisma.ArticleCategoryCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ArticleCategoryIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ArticleCategoryUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticleCategorySelect<ExtArgs> | null;
    omit?: Prisma.ArticleCategoryOmit<ExtArgs> | null;
    include?: Prisma.ArticleCategoryInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ArticleCategoryUpdateInput, Prisma.ArticleCategoryUncheckedUpdateInput>;
    where: Prisma.ArticleCategoryWhereUniqueInput;
};
export type ArticleCategoryUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ArticleCategoryUpdateManyMutationInput, Prisma.ArticleCategoryUncheckedUpdateManyInput>;
    where?: Prisma.ArticleCategoryWhereInput;
    limit?: number;
};
export type ArticleCategoryUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticleCategorySelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ArticleCategoryOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ArticleCategoryUpdateManyMutationInput, Prisma.ArticleCategoryUncheckedUpdateManyInput>;
    where?: Prisma.ArticleCategoryWhereInput;
    limit?: number;
    include?: Prisma.ArticleCategoryIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ArticleCategoryUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticleCategorySelect<ExtArgs> | null;
    omit?: Prisma.ArticleCategoryOmit<ExtArgs> | null;
    include?: Prisma.ArticleCategoryInclude<ExtArgs> | null;
    where: Prisma.ArticleCategoryWhereUniqueInput;
    create: Prisma.XOR<Prisma.ArticleCategoryCreateInput, Prisma.ArticleCategoryUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ArticleCategoryUpdateInput, Prisma.ArticleCategoryUncheckedUpdateInput>;
};
export type ArticleCategoryDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticleCategorySelect<ExtArgs> | null;
    omit?: Prisma.ArticleCategoryOmit<ExtArgs> | null;
    include?: Prisma.ArticleCategoryInclude<ExtArgs> | null;
    where: Prisma.ArticleCategoryWhereUniqueInput;
};
export type ArticleCategoryDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ArticleCategoryWhereInput;
    limit?: number;
};
export type ArticleCategoryDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticleCategorySelect<ExtArgs> | null;
    omit?: Prisma.ArticleCategoryOmit<ExtArgs> | null;
    include?: Prisma.ArticleCategoryInclude<ExtArgs> | null;
};
