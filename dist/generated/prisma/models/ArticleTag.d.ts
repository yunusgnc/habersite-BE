import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ArticleTagModel = runtime.Types.Result.DefaultSelection<Prisma.$ArticleTagPayload>;
export type AggregateArticleTag = {
    _count: ArticleTagCountAggregateOutputType | null;
    _min: ArticleTagMinAggregateOutputType | null;
    _max: ArticleTagMaxAggregateOutputType | null;
};
export type ArticleTagMinAggregateOutputType = {
    articleId: string | null;
    tagId: string | null;
};
export type ArticleTagMaxAggregateOutputType = {
    articleId: string | null;
    tagId: string | null;
};
export type ArticleTagCountAggregateOutputType = {
    articleId: number;
    tagId: number;
    _all: number;
};
export type ArticleTagMinAggregateInputType = {
    articleId?: true;
    tagId?: true;
};
export type ArticleTagMaxAggregateInputType = {
    articleId?: true;
    tagId?: true;
};
export type ArticleTagCountAggregateInputType = {
    articleId?: true;
    tagId?: true;
    _all?: true;
};
export type ArticleTagAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ArticleTagWhereInput;
    orderBy?: Prisma.ArticleTagOrderByWithRelationInput | Prisma.ArticleTagOrderByWithRelationInput[];
    cursor?: Prisma.ArticleTagWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ArticleTagCountAggregateInputType;
    _min?: ArticleTagMinAggregateInputType;
    _max?: ArticleTagMaxAggregateInputType;
};
export type GetArticleTagAggregateType<T extends ArticleTagAggregateArgs> = {
    [P in keyof T & keyof AggregateArticleTag]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateArticleTag[P]> : Prisma.GetScalarType<T[P], AggregateArticleTag[P]>;
};
export type ArticleTagGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ArticleTagWhereInput;
    orderBy?: Prisma.ArticleTagOrderByWithAggregationInput | Prisma.ArticleTagOrderByWithAggregationInput[];
    by: Prisma.ArticleTagScalarFieldEnum[] | Prisma.ArticleTagScalarFieldEnum;
    having?: Prisma.ArticleTagScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ArticleTagCountAggregateInputType | true;
    _min?: ArticleTagMinAggregateInputType;
    _max?: ArticleTagMaxAggregateInputType;
};
export type ArticleTagGroupByOutputType = {
    articleId: string;
    tagId: string;
    _count: ArticleTagCountAggregateOutputType | null;
    _min: ArticleTagMinAggregateOutputType | null;
    _max: ArticleTagMaxAggregateOutputType | null;
};
export type GetArticleTagGroupByPayload<T extends ArticleTagGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ArticleTagGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ArticleTagGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ArticleTagGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ArticleTagGroupByOutputType[P]>;
}>>;
export type ArticleTagWhereInput = {
    AND?: Prisma.ArticleTagWhereInput | Prisma.ArticleTagWhereInput[];
    OR?: Prisma.ArticleTagWhereInput[];
    NOT?: Prisma.ArticleTagWhereInput | Prisma.ArticleTagWhereInput[];
    articleId?: Prisma.StringFilter<"ArticleTag"> | string;
    tagId?: Prisma.StringFilter<"ArticleTag"> | string;
    article?: Prisma.XOR<Prisma.ArticleScalarRelationFilter, Prisma.ArticleWhereInput>;
    tag?: Prisma.XOR<Prisma.TagScalarRelationFilter, Prisma.TagWhereInput>;
};
export type ArticleTagOrderByWithRelationInput = {
    articleId?: Prisma.SortOrder;
    tagId?: Prisma.SortOrder;
    article?: Prisma.ArticleOrderByWithRelationInput;
    tag?: Prisma.TagOrderByWithRelationInput;
};
export type ArticleTagWhereUniqueInput = Prisma.AtLeast<{
    articleId_tagId?: Prisma.ArticleTagArticleIdTagIdCompoundUniqueInput;
    AND?: Prisma.ArticleTagWhereInput | Prisma.ArticleTagWhereInput[];
    OR?: Prisma.ArticleTagWhereInput[];
    NOT?: Prisma.ArticleTagWhereInput | Prisma.ArticleTagWhereInput[];
    articleId?: Prisma.StringFilter<"ArticleTag"> | string;
    tagId?: Prisma.StringFilter<"ArticleTag"> | string;
    article?: Prisma.XOR<Prisma.ArticleScalarRelationFilter, Prisma.ArticleWhereInput>;
    tag?: Prisma.XOR<Prisma.TagScalarRelationFilter, Prisma.TagWhereInput>;
}, "articleId_tagId">;
export type ArticleTagOrderByWithAggregationInput = {
    articleId?: Prisma.SortOrder;
    tagId?: Prisma.SortOrder;
    _count?: Prisma.ArticleTagCountOrderByAggregateInput;
    _max?: Prisma.ArticleTagMaxOrderByAggregateInput;
    _min?: Prisma.ArticleTagMinOrderByAggregateInput;
};
export type ArticleTagScalarWhereWithAggregatesInput = {
    AND?: Prisma.ArticleTagScalarWhereWithAggregatesInput | Prisma.ArticleTagScalarWhereWithAggregatesInput[];
    OR?: Prisma.ArticleTagScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ArticleTagScalarWhereWithAggregatesInput | Prisma.ArticleTagScalarWhereWithAggregatesInput[];
    articleId?: Prisma.StringWithAggregatesFilter<"ArticleTag"> | string;
    tagId?: Prisma.StringWithAggregatesFilter<"ArticleTag"> | string;
};
export type ArticleTagCreateInput = {
    article: Prisma.ArticleCreateNestedOneWithoutTagsInput;
    tag: Prisma.TagCreateNestedOneWithoutArticlesInput;
};
export type ArticleTagUncheckedCreateInput = {
    articleId: string;
    tagId: string;
};
export type ArticleTagUpdateInput = {
    article?: Prisma.ArticleUpdateOneRequiredWithoutTagsNestedInput;
    tag?: Prisma.TagUpdateOneRequiredWithoutArticlesNestedInput;
};
export type ArticleTagUncheckedUpdateInput = {
    articleId?: Prisma.StringFieldUpdateOperationsInput | string;
    tagId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ArticleTagCreateManyInput = {
    articleId: string;
    tagId: string;
};
export type ArticleTagUpdateManyMutationInput = {};
export type ArticleTagUncheckedUpdateManyInput = {
    articleId?: Prisma.StringFieldUpdateOperationsInput | string;
    tagId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ArticleTagListRelationFilter = {
    every?: Prisma.ArticleTagWhereInput;
    some?: Prisma.ArticleTagWhereInput;
    none?: Prisma.ArticleTagWhereInput;
};
export type ArticleTagOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ArticleTagArticleIdTagIdCompoundUniqueInput = {
    articleId: string;
    tagId: string;
};
export type ArticleTagCountOrderByAggregateInput = {
    articleId?: Prisma.SortOrder;
    tagId?: Prisma.SortOrder;
};
export type ArticleTagMaxOrderByAggregateInput = {
    articleId?: Prisma.SortOrder;
    tagId?: Prisma.SortOrder;
};
export type ArticleTagMinOrderByAggregateInput = {
    articleId?: Prisma.SortOrder;
    tagId?: Prisma.SortOrder;
};
export type ArticleTagCreateNestedManyWithoutTagInput = {
    create?: Prisma.XOR<Prisma.ArticleTagCreateWithoutTagInput, Prisma.ArticleTagUncheckedCreateWithoutTagInput> | Prisma.ArticleTagCreateWithoutTagInput[] | Prisma.ArticleTagUncheckedCreateWithoutTagInput[];
    connectOrCreate?: Prisma.ArticleTagCreateOrConnectWithoutTagInput | Prisma.ArticleTagCreateOrConnectWithoutTagInput[];
    createMany?: Prisma.ArticleTagCreateManyTagInputEnvelope;
    connect?: Prisma.ArticleTagWhereUniqueInput | Prisma.ArticleTagWhereUniqueInput[];
};
export type ArticleTagUncheckedCreateNestedManyWithoutTagInput = {
    create?: Prisma.XOR<Prisma.ArticleTagCreateWithoutTagInput, Prisma.ArticleTagUncheckedCreateWithoutTagInput> | Prisma.ArticleTagCreateWithoutTagInput[] | Prisma.ArticleTagUncheckedCreateWithoutTagInput[];
    connectOrCreate?: Prisma.ArticleTagCreateOrConnectWithoutTagInput | Prisma.ArticleTagCreateOrConnectWithoutTagInput[];
    createMany?: Prisma.ArticleTagCreateManyTagInputEnvelope;
    connect?: Prisma.ArticleTagWhereUniqueInput | Prisma.ArticleTagWhereUniqueInput[];
};
export type ArticleTagUpdateManyWithoutTagNestedInput = {
    create?: Prisma.XOR<Prisma.ArticleTagCreateWithoutTagInput, Prisma.ArticleTagUncheckedCreateWithoutTagInput> | Prisma.ArticleTagCreateWithoutTagInput[] | Prisma.ArticleTagUncheckedCreateWithoutTagInput[];
    connectOrCreate?: Prisma.ArticleTagCreateOrConnectWithoutTagInput | Prisma.ArticleTagCreateOrConnectWithoutTagInput[];
    upsert?: Prisma.ArticleTagUpsertWithWhereUniqueWithoutTagInput | Prisma.ArticleTagUpsertWithWhereUniqueWithoutTagInput[];
    createMany?: Prisma.ArticleTagCreateManyTagInputEnvelope;
    set?: Prisma.ArticleTagWhereUniqueInput | Prisma.ArticleTagWhereUniqueInput[];
    disconnect?: Prisma.ArticleTagWhereUniqueInput | Prisma.ArticleTagWhereUniqueInput[];
    delete?: Prisma.ArticleTagWhereUniqueInput | Prisma.ArticleTagWhereUniqueInput[];
    connect?: Prisma.ArticleTagWhereUniqueInput | Prisma.ArticleTagWhereUniqueInput[];
    update?: Prisma.ArticleTagUpdateWithWhereUniqueWithoutTagInput | Prisma.ArticleTagUpdateWithWhereUniqueWithoutTagInput[];
    updateMany?: Prisma.ArticleTagUpdateManyWithWhereWithoutTagInput | Prisma.ArticleTagUpdateManyWithWhereWithoutTagInput[];
    deleteMany?: Prisma.ArticleTagScalarWhereInput | Prisma.ArticleTagScalarWhereInput[];
};
export type ArticleTagUncheckedUpdateManyWithoutTagNestedInput = {
    create?: Prisma.XOR<Prisma.ArticleTagCreateWithoutTagInput, Prisma.ArticleTagUncheckedCreateWithoutTagInput> | Prisma.ArticleTagCreateWithoutTagInput[] | Prisma.ArticleTagUncheckedCreateWithoutTagInput[];
    connectOrCreate?: Prisma.ArticleTagCreateOrConnectWithoutTagInput | Prisma.ArticleTagCreateOrConnectWithoutTagInput[];
    upsert?: Prisma.ArticleTagUpsertWithWhereUniqueWithoutTagInput | Prisma.ArticleTagUpsertWithWhereUniqueWithoutTagInput[];
    createMany?: Prisma.ArticleTagCreateManyTagInputEnvelope;
    set?: Prisma.ArticleTagWhereUniqueInput | Prisma.ArticleTagWhereUniqueInput[];
    disconnect?: Prisma.ArticleTagWhereUniqueInput | Prisma.ArticleTagWhereUniqueInput[];
    delete?: Prisma.ArticleTagWhereUniqueInput | Prisma.ArticleTagWhereUniqueInput[];
    connect?: Prisma.ArticleTagWhereUniqueInput | Prisma.ArticleTagWhereUniqueInput[];
    update?: Prisma.ArticleTagUpdateWithWhereUniqueWithoutTagInput | Prisma.ArticleTagUpdateWithWhereUniqueWithoutTagInput[];
    updateMany?: Prisma.ArticleTagUpdateManyWithWhereWithoutTagInput | Prisma.ArticleTagUpdateManyWithWhereWithoutTagInput[];
    deleteMany?: Prisma.ArticleTagScalarWhereInput | Prisma.ArticleTagScalarWhereInput[];
};
export type ArticleTagCreateNestedManyWithoutArticleInput = {
    create?: Prisma.XOR<Prisma.ArticleTagCreateWithoutArticleInput, Prisma.ArticleTagUncheckedCreateWithoutArticleInput> | Prisma.ArticleTagCreateWithoutArticleInput[] | Prisma.ArticleTagUncheckedCreateWithoutArticleInput[];
    connectOrCreate?: Prisma.ArticleTagCreateOrConnectWithoutArticleInput | Prisma.ArticleTagCreateOrConnectWithoutArticleInput[];
    createMany?: Prisma.ArticleTagCreateManyArticleInputEnvelope;
    connect?: Prisma.ArticleTagWhereUniqueInput | Prisma.ArticleTagWhereUniqueInput[];
};
export type ArticleTagUncheckedCreateNestedManyWithoutArticleInput = {
    create?: Prisma.XOR<Prisma.ArticleTagCreateWithoutArticleInput, Prisma.ArticleTagUncheckedCreateWithoutArticleInput> | Prisma.ArticleTagCreateWithoutArticleInput[] | Prisma.ArticleTagUncheckedCreateWithoutArticleInput[];
    connectOrCreate?: Prisma.ArticleTagCreateOrConnectWithoutArticleInput | Prisma.ArticleTagCreateOrConnectWithoutArticleInput[];
    createMany?: Prisma.ArticleTagCreateManyArticleInputEnvelope;
    connect?: Prisma.ArticleTagWhereUniqueInput | Prisma.ArticleTagWhereUniqueInput[];
};
export type ArticleTagUpdateManyWithoutArticleNestedInput = {
    create?: Prisma.XOR<Prisma.ArticleTagCreateWithoutArticleInput, Prisma.ArticleTagUncheckedCreateWithoutArticleInput> | Prisma.ArticleTagCreateWithoutArticleInput[] | Prisma.ArticleTagUncheckedCreateWithoutArticleInput[];
    connectOrCreate?: Prisma.ArticleTagCreateOrConnectWithoutArticleInput | Prisma.ArticleTagCreateOrConnectWithoutArticleInput[];
    upsert?: Prisma.ArticleTagUpsertWithWhereUniqueWithoutArticleInput | Prisma.ArticleTagUpsertWithWhereUniqueWithoutArticleInput[];
    createMany?: Prisma.ArticleTagCreateManyArticleInputEnvelope;
    set?: Prisma.ArticleTagWhereUniqueInput | Prisma.ArticleTagWhereUniqueInput[];
    disconnect?: Prisma.ArticleTagWhereUniqueInput | Prisma.ArticleTagWhereUniqueInput[];
    delete?: Prisma.ArticleTagWhereUniqueInput | Prisma.ArticleTagWhereUniqueInput[];
    connect?: Prisma.ArticleTagWhereUniqueInput | Prisma.ArticleTagWhereUniqueInput[];
    update?: Prisma.ArticleTagUpdateWithWhereUniqueWithoutArticleInput | Prisma.ArticleTagUpdateWithWhereUniqueWithoutArticleInput[];
    updateMany?: Prisma.ArticleTagUpdateManyWithWhereWithoutArticleInput | Prisma.ArticleTagUpdateManyWithWhereWithoutArticleInput[];
    deleteMany?: Prisma.ArticleTagScalarWhereInput | Prisma.ArticleTagScalarWhereInput[];
};
export type ArticleTagUncheckedUpdateManyWithoutArticleNestedInput = {
    create?: Prisma.XOR<Prisma.ArticleTagCreateWithoutArticleInput, Prisma.ArticleTagUncheckedCreateWithoutArticleInput> | Prisma.ArticleTagCreateWithoutArticleInput[] | Prisma.ArticleTagUncheckedCreateWithoutArticleInput[];
    connectOrCreate?: Prisma.ArticleTagCreateOrConnectWithoutArticleInput | Prisma.ArticleTagCreateOrConnectWithoutArticleInput[];
    upsert?: Prisma.ArticleTagUpsertWithWhereUniqueWithoutArticleInput | Prisma.ArticleTagUpsertWithWhereUniqueWithoutArticleInput[];
    createMany?: Prisma.ArticleTagCreateManyArticleInputEnvelope;
    set?: Prisma.ArticleTagWhereUniqueInput | Prisma.ArticleTagWhereUniqueInput[];
    disconnect?: Prisma.ArticleTagWhereUniqueInput | Prisma.ArticleTagWhereUniqueInput[];
    delete?: Prisma.ArticleTagWhereUniqueInput | Prisma.ArticleTagWhereUniqueInput[];
    connect?: Prisma.ArticleTagWhereUniqueInput | Prisma.ArticleTagWhereUniqueInput[];
    update?: Prisma.ArticleTagUpdateWithWhereUniqueWithoutArticleInput | Prisma.ArticleTagUpdateWithWhereUniqueWithoutArticleInput[];
    updateMany?: Prisma.ArticleTagUpdateManyWithWhereWithoutArticleInput | Prisma.ArticleTagUpdateManyWithWhereWithoutArticleInput[];
    deleteMany?: Prisma.ArticleTagScalarWhereInput | Prisma.ArticleTagScalarWhereInput[];
};
export type ArticleTagCreateWithoutTagInput = {
    article: Prisma.ArticleCreateNestedOneWithoutTagsInput;
};
export type ArticleTagUncheckedCreateWithoutTagInput = {
    articleId: string;
};
export type ArticleTagCreateOrConnectWithoutTagInput = {
    where: Prisma.ArticleTagWhereUniqueInput;
    create: Prisma.XOR<Prisma.ArticleTagCreateWithoutTagInput, Prisma.ArticleTagUncheckedCreateWithoutTagInput>;
};
export type ArticleTagCreateManyTagInputEnvelope = {
    data: Prisma.ArticleTagCreateManyTagInput | Prisma.ArticleTagCreateManyTagInput[];
    skipDuplicates?: boolean;
};
export type ArticleTagUpsertWithWhereUniqueWithoutTagInput = {
    where: Prisma.ArticleTagWhereUniqueInput;
    update: Prisma.XOR<Prisma.ArticleTagUpdateWithoutTagInput, Prisma.ArticleTagUncheckedUpdateWithoutTagInput>;
    create: Prisma.XOR<Prisma.ArticleTagCreateWithoutTagInput, Prisma.ArticleTagUncheckedCreateWithoutTagInput>;
};
export type ArticleTagUpdateWithWhereUniqueWithoutTagInput = {
    where: Prisma.ArticleTagWhereUniqueInput;
    data: Prisma.XOR<Prisma.ArticleTagUpdateWithoutTagInput, Prisma.ArticleTagUncheckedUpdateWithoutTagInput>;
};
export type ArticleTagUpdateManyWithWhereWithoutTagInput = {
    where: Prisma.ArticleTagScalarWhereInput;
    data: Prisma.XOR<Prisma.ArticleTagUpdateManyMutationInput, Prisma.ArticleTagUncheckedUpdateManyWithoutTagInput>;
};
export type ArticleTagScalarWhereInput = {
    AND?: Prisma.ArticleTagScalarWhereInput | Prisma.ArticleTagScalarWhereInput[];
    OR?: Prisma.ArticleTagScalarWhereInput[];
    NOT?: Prisma.ArticleTagScalarWhereInput | Prisma.ArticleTagScalarWhereInput[];
    articleId?: Prisma.StringFilter<"ArticleTag"> | string;
    tagId?: Prisma.StringFilter<"ArticleTag"> | string;
};
export type ArticleTagCreateWithoutArticleInput = {
    tag: Prisma.TagCreateNestedOneWithoutArticlesInput;
};
export type ArticleTagUncheckedCreateWithoutArticleInput = {
    tagId: string;
};
export type ArticleTagCreateOrConnectWithoutArticleInput = {
    where: Prisma.ArticleTagWhereUniqueInput;
    create: Prisma.XOR<Prisma.ArticleTagCreateWithoutArticleInput, Prisma.ArticleTagUncheckedCreateWithoutArticleInput>;
};
export type ArticleTagCreateManyArticleInputEnvelope = {
    data: Prisma.ArticleTagCreateManyArticleInput | Prisma.ArticleTagCreateManyArticleInput[];
    skipDuplicates?: boolean;
};
export type ArticleTagUpsertWithWhereUniqueWithoutArticleInput = {
    where: Prisma.ArticleTagWhereUniqueInput;
    update: Prisma.XOR<Prisma.ArticleTagUpdateWithoutArticleInput, Prisma.ArticleTagUncheckedUpdateWithoutArticleInput>;
    create: Prisma.XOR<Prisma.ArticleTagCreateWithoutArticleInput, Prisma.ArticleTagUncheckedCreateWithoutArticleInput>;
};
export type ArticleTagUpdateWithWhereUniqueWithoutArticleInput = {
    where: Prisma.ArticleTagWhereUniqueInput;
    data: Prisma.XOR<Prisma.ArticleTagUpdateWithoutArticleInput, Prisma.ArticleTagUncheckedUpdateWithoutArticleInput>;
};
export type ArticleTagUpdateManyWithWhereWithoutArticleInput = {
    where: Prisma.ArticleTagScalarWhereInput;
    data: Prisma.XOR<Prisma.ArticleTagUpdateManyMutationInput, Prisma.ArticleTagUncheckedUpdateManyWithoutArticleInput>;
};
export type ArticleTagCreateManyTagInput = {
    articleId: string;
};
export type ArticleTagUpdateWithoutTagInput = {
    article?: Prisma.ArticleUpdateOneRequiredWithoutTagsNestedInput;
};
export type ArticleTagUncheckedUpdateWithoutTagInput = {
    articleId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ArticleTagUncheckedUpdateManyWithoutTagInput = {
    articleId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ArticleTagCreateManyArticleInput = {
    tagId: string;
};
export type ArticleTagUpdateWithoutArticleInput = {
    tag?: Prisma.TagUpdateOneRequiredWithoutArticlesNestedInput;
};
export type ArticleTagUncheckedUpdateWithoutArticleInput = {
    tagId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ArticleTagUncheckedUpdateManyWithoutArticleInput = {
    tagId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ArticleTagSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    articleId?: boolean;
    tagId?: boolean;
    article?: boolean | Prisma.ArticleDefaultArgs<ExtArgs>;
    tag?: boolean | Prisma.TagDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["articleTag"]>;
export type ArticleTagSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    articleId?: boolean;
    tagId?: boolean;
    article?: boolean | Prisma.ArticleDefaultArgs<ExtArgs>;
    tag?: boolean | Prisma.TagDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["articleTag"]>;
export type ArticleTagSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    articleId?: boolean;
    tagId?: boolean;
    article?: boolean | Prisma.ArticleDefaultArgs<ExtArgs>;
    tag?: boolean | Prisma.TagDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["articleTag"]>;
export type ArticleTagSelectScalar = {
    articleId?: boolean;
    tagId?: boolean;
};
export type ArticleTagOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"articleId" | "tagId", ExtArgs["result"]["articleTag"]>;
export type ArticleTagInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    article?: boolean | Prisma.ArticleDefaultArgs<ExtArgs>;
    tag?: boolean | Prisma.TagDefaultArgs<ExtArgs>;
};
export type ArticleTagIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    article?: boolean | Prisma.ArticleDefaultArgs<ExtArgs>;
    tag?: boolean | Prisma.TagDefaultArgs<ExtArgs>;
};
export type ArticleTagIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    article?: boolean | Prisma.ArticleDefaultArgs<ExtArgs>;
    tag?: boolean | Prisma.TagDefaultArgs<ExtArgs>;
};
export type $ArticleTagPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ArticleTag";
    objects: {
        article: Prisma.$ArticlePayload<ExtArgs>;
        tag: Prisma.$TagPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        articleId: string;
        tagId: string;
    }, ExtArgs["result"]["articleTag"]>;
    composites: {};
};
export type ArticleTagGetPayload<S extends boolean | null | undefined | ArticleTagDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ArticleTagPayload, S>;
export type ArticleTagCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ArticleTagFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ArticleTagCountAggregateInputType | true;
};
export interface ArticleTagDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ArticleTag'];
        meta: {
            name: 'ArticleTag';
        };
    };
    findUnique<T extends ArticleTagFindUniqueArgs>(args: Prisma.SelectSubset<T, ArticleTagFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ArticleTagClient<runtime.Types.Result.GetResult<Prisma.$ArticleTagPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ArticleTagFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ArticleTagFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ArticleTagClient<runtime.Types.Result.GetResult<Prisma.$ArticleTagPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ArticleTagFindFirstArgs>(args?: Prisma.SelectSubset<T, ArticleTagFindFirstArgs<ExtArgs>>): Prisma.Prisma__ArticleTagClient<runtime.Types.Result.GetResult<Prisma.$ArticleTagPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ArticleTagFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ArticleTagFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ArticleTagClient<runtime.Types.Result.GetResult<Prisma.$ArticleTagPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ArticleTagFindManyArgs>(args?: Prisma.SelectSubset<T, ArticleTagFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ArticleTagPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ArticleTagCreateArgs>(args: Prisma.SelectSubset<T, ArticleTagCreateArgs<ExtArgs>>): Prisma.Prisma__ArticleTagClient<runtime.Types.Result.GetResult<Prisma.$ArticleTagPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ArticleTagCreateManyArgs>(args?: Prisma.SelectSubset<T, ArticleTagCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ArticleTagCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ArticleTagCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ArticleTagPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ArticleTagDeleteArgs>(args: Prisma.SelectSubset<T, ArticleTagDeleteArgs<ExtArgs>>): Prisma.Prisma__ArticleTagClient<runtime.Types.Result.GetResult<Prisma.$ArticleTagPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ArticleTagUpdateArgs>(args: Prisma.SelectSubset<T, ArticleTagUpdateArgs<ExtArgs>>): Prisma.Prisma__ArticleTagClient<runtime.Types.Result.GetResult<Prisma.$ArticleTagPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ArticleTagDeleteManyArgs>(args?: Prisma.SelectSubset<T, ArticleTagDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ArticleTagUpdateManyArgs>(args: Prisma.SelectSubset<T, ArticleTagUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ArticleTagUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ArticleTagUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ArticleTagPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ArticleTagUpsertArgs>(args: Prisma.SelectSubset<T, ArticleTagUpsertArgs<ExtArgs>>): Prisma.Prisma__ArticleTagClient<runtime.Types.Result.GetResult<Prisma.$ArticleTagPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ArticleTagCountArgs>(args?: Prisma.Subset<T, ArticleTagCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ArticleTagCountAggregateOutputType> : number>;
    aggregate<T extends ArticleTagAggregateArgs>(args: Prisma.Subset<T, ArticleTagAggregateArgs>): Prisma.PrismaPromise<GetArticleTagAggregateType<T>>;
    groupBy<T extends ArticleTagGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ArticleTagGroupByArgs['orderBy'];
    } : {
        orderBy?: ArticleTagGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ArticleTagGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetArticleTagGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ArticleTagFieldRefs;
}
export interface Prisma__ArticleTagClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    article<T extends Prisma.ArticleDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ArticleDefaultArgs<ExtArgs>>): Prisma.Prisma__ArticleClient<runtime.Types.Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    tag<T extends Prisma.TagDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TagDefaultArgs<ExtArgs>>): Prisma.Prisma__TagClient<runtime.Types.Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ArticleTagFieldRefs {
    readonly articleId: Prisma.FieldRef<"ArticleTag", 'String'>;
    readonly tagId: Prisma.FieldRef<"ArticleTag", 'String'>;
}
export type ArticleTagFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticleTagSelect<ExtArgs> | null;
    omit?: Prisma.ArticleTagOmit<ExtArgs> | null;
    include?: Prisma.ArticleTagInclude<ExtArgs> | null;
    where: Prisma.ArticleTagWhereUniqueInput;
};
export type ArticleTagFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticleTagSelect<ExtArgs> | null;
    omit?: Prisma.ArticleTagOmit<ExtArgs> | null;
    include?: Prisma.ArticleTagInclude<ExtArgs> | null;
    where: Prisma.ArticleTagWhereUniqueInput;
};
export type ArticleTagFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticleTagSelect<ExtArgs> | null;
    omit?: Prisma.ArticleTagOmit<ExtArgs> | null;
    include?: Prisma.ArticleTagInclude<ExtArgs> | null;
    where?: Prisma.ArticleTagWhereInput;
    orderBy?: Prisma.ArticleTagOrderByWithRelationInput | Prisma.ArticleTagOrderByWithRelationInput[];
    cursor?: Prisma.ArticleTagWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ArticleTagScalarFieldEnum | Prisma.ArticleTagScalarFieldEnum[];
};
export type ArticleTagFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticleTagSelect<ExtArgs> | null;
    omit?: Prisma.ArticleTagOmit<ExtArgs> | null;
    include?: Prisma.ArticleTagInclude<ExtArgs> | null;
    where?: Prisma.ArticleTagWhereInput;
    orderBy?: Prisma.ArticleTagOrderByWithRelationInput | Prisma.ArticleTagOrderByWithRelationInput[];
    cursor?: Prisma.ArticleTagWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ArticleTagScalarFieldEnum | Prisma.ArticleTagScalarFieldEnum[];
};
export type ArticleTagFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticleTagSelect<ExtArgs> | null;
    omit?: Prisma.ArticleTagOmit<ExtArgs> | null;
    include?: Prisma.ArticleTagInclude<ExtArgs> | null;
    where?: Prisma.ArticleTagWhereInput;
    orderBy?: Prisma.ArticleTagOrderByWithRelationInput | Prisma.ArticleTagOrderByWithRelationInput[];
    cursor?: Prisma.ArticleTagWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ArticleTagScalarFieldEnum | Prisma.ArticleTagScalarFieldEnum[];
};
export type ArticleTagCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticleTagSelect<ExtArgs> | null;
    omit?: Prisma.ArticleTagOmit<ExtArgs> | null;
    include?: Prisma.ArticleTagInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ArticleTagCreateInput, Prisma.ArticleTagUncheckedCreateInput>;
};
export type ArticleTagCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ArticleTagCreateManyInput | Prisma.ArticleTagCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ArticleTagCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticleTagSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ArticleTagOmit<ExtArgs> | null;
    data: Prisma.ArticleTagCreateManyInput | Prisma.ArticleTagCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ArticleTagIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ArticleTagUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticleTagSelect<ExtArgs> | null;
    omit?: Prisma.ArticleTagOmit<ExtArgs> | null;
    include?: Prisma.ArticleTagInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ArticleTagUpdateInput, Prisma.ArticleTagUncheckedUpdateInput>;
    where: Prisma.ArticleTagWhereUniqueInput;
};
export type ArticleTagUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ArticleTagUpdateManyMutationInput, Prisma.ArticleTagUncheckedUpdateManyInput>;
    where?: Prisma.ArticleTagWhereInput;
    limit?: number;
};
export type ArticleTagUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticleTagSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ArticleTagOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ArticleTagUpdateManyMutationInput, Prisma.ArticleTagUncheckedUpdateManyInput>;
    where?: Prisma.ArticleTagWhereInput;
    limit?: number;
    include?: Prisma.ArticleTagIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ArticleTagUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticleTagSelect<ExtArgs> | null;
    omit?: Prisma.ArticleTagOmit<ExtArgs> | null;
    include?: Prisma.ArticleTagInclude<ExtArgs> | null;
    where: Prisma.ArticleTagWhereUniqueInput;
    create: Prisma.XOR<Prisma.ArticleTagCreateInput, Prisma.ArticleTagUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ArticleTagUpdateInput, Prisma.ArticleTagUncheckedUpdateInput>;
};
export type ArticleTagDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticleTagSelect<ExtArgs> | null;
    omit?: Prisma.ArticleTagOmit<ExtArgs> | null;
    include?: Prisma.ArticleTagInclude<ExtArgs> | null;
    where: Prisma.ArticleTagWhereUniqueInput;
};
export type ArticleTagDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ArticleTagWhereInput;
    limit?: number;
};
export type ArticleTagDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticleTagSelect<ExtArgs> | null;
    omit?: Prisma.ArticleTagOmit<ExtArgs> | null;
    include?: Prisma.ArticleTagInclude<ExtArgs> | null;
};
