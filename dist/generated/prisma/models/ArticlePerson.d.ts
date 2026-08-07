import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ArticlePersonModel = runtime.Types.Result.DefaultSelection<Prisma.$ArticlePersonPayload>;
export type AggregateArticlePerson = {
    _count: ArticlePersonCountAggregateOutputType | null;
    _min: ArticlePersonMinAggregateOutputType | null;
    _max: ArticlePersonMaxAggregateOutputType | null;
};
export type ArticlePersonMinAggregateOutputType = {
    articleId: string | null;
    personId: string | null;
};
export type ArticlePersonMaxAggregateOutputType = {
    articleId: string | null;
    personId: string | null;
};
export type ArticlePersonCountAggregateOutputType = {
    articleId: number;
    personId: number;
    _all: number;
};
export type ArticlePersonMinAggregateInputType = {
    articleId?: true;
    personId?: true;
};
export type ArticlePersonMaxAggregateInputType = {
    articleId?: true;
    personId?: true;
};
export type ArticlePersonCountAggregateInputType = {
    articleId?: true;
    personId?: true;
    _all?: true;
};
export type ArticlePersonAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ArticlePersonWhereInput;
    orderBy?: Prisma.ArticlePersonOrderByWithRelationInput | Prisma.ArticlePersonOrderByWithRelationInput[];
    cursor?: Prisma.ArticlePersonWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ArticlePersonCountAggregateInputType;
    _min?: ArticlePersonMinAggregateInputType;
    _max?: ArticlePersonMaxAggregateInputType;
};
export type GetArticlePersonAggregateType<T extends ArticlePersonAggregateArgs> = {
    [P in keyof T & keyof AggregateArticlePerson]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateArticlePerson[P]> : Prisma.GetScalarType<T[P], AggregateArticlePerson[P]>;
};
export type ArticlePersonGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ArticlePersonWhereInput;
    orderBy?: Prisma.ArticlePersonOrderByWithAggregationInput | Prisma.ArticlePersonOrderByWithAggregationInput[];
    by: Prisma.ArticlePersonScalarFieldEnum[] | Prisma.ArticlePersonScalarFieldEnum;
    having?: Prisma.ArticlePersonScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ArticlePersonCountAggregateInputType | true;
    _min?: ArticlePersonMinAggregateInputType;
    _max?: ArticlePersonMaxAggregateInputType;
};
export type ArticlePersonGroupByOutputType = {
    articleId: string;
    personId: string;
    _count: ArticlePersonCountAggregateOutputType | null;
    _min: ArticlePersonMinAggregateOutputType | null;
    _max: ArticlePersonMaxAggregateOutputType | null;
};
export type GetArticlePersonGroupByPayload<T extends ArticlePersonGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ArticlePersonGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ArticlePersonGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ArticlePersonGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ArticlePersonGroupByOutputType[P]>;
}>>;
export type ArticlePersonWhereInput = {
    AND?: Prisma.ArticlePersonWhereInput | Prisma.ArticlePersonWhereInput[];
    OR?: Prisma.ArticlePersonWhereInput[];
    NOT?: Prisma.ArticlePersonWhereInput | Prisma.ArticlePersonWhereInput[];
    articleId?: Prisma.StringFilter<"ArticlePerson"> | string;
    personId?: Prisma.StringFilter<"ArticlePerson"> | string;
    article?: Prisma.XOR<Prisma.ArticleScalarRelationFilter, Prisma.ArticleWhereInput>;
    person?: Prisma.XOR<Prisma.PersonProfileScalarRelationFilter, Prisma.PersonProfileWhereInput>;
};
export type ArticlePersonOrderByWithRelationInput = {
    articleId?: Prisma.SortOrder;
    personId?: Prisma.SortOrder;
    article?: Prisma.ArticleOrderByWithRelationInput;
    person?: Prisma.PersonProfileOrderByWithRelationInput;
};
export type ArticlePersonWhereUniqueInput = Prisma.AtLeast<{
    articleId_personId?: Prisma.ArticlePersonArticleIdPersonIdCompoundUniqueInput;
    AND?: Prisma.ArticlePersonWhereInput | Prisma.ArticlePersonWhereInput[];
    OR?: Prisma.ArticlePersonWhereInput[];
    NOT?: Prisma.ArticlePersonWhereInput | Prisma.ArticlePersonWhereInput[];
    articleId?: Prisma.StringFilter<"ArticlePerson"> | string;
    personId?: Prisma.StringFilter<"ArticlePerson"> | string;
    article?: Prisma.XOR<Prisma.ArticleScalarRelationFilter, Prisma.ArticleWhereInput>;
    person?: Prisma.XOR<Prisma.PersonProfileScalarRelationFilter, Prisma.PersonProfileWhereInput>;
}, "articleId_personId">;
export type ArticlePersonOrderByWithAggregationInput = {
    articleId?: Prisma.SortOrder;
    personId?: Prisma.SortOrder;
    _count?: Prisma.ArticlePersonCountOrderByAggregateInput;
    _max?: Prisma.ArticlePersonMaxOrderByAggregateInput;
    _min?: Prisma.ArticlePersonMinOrderByAggregateInput;
};
export type ArticlePersonScalarWhereWithAggregatesInput = {
    AND?: Prisma.ArticlePersonScalarWhereWithAggregatesInput | Prisma.ArticlePersonScalarWhereWithAggregatesInput[];
    OR?: Prisma.ArticlePersonScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ArticlePersonScalarWhereWithAggregatesInput | Prisma.ArticlePersonScalarWhereWithAggregatesInput[];
    articleId?: Prisma.StringWithAggregatesFilter<"ArticlePerson"> | string;
    personId?: Prisma.StringWithAggregatesFilter<"ArticlePerson"> | string;
};
export type ArticlePersonCreateInput = {
    article: Prisma.ArticleCreateNestedOneWithoutPersonsInput;
    person: Prisma.PersonProfileCreateNestedOneWithoutArticlesInput;
};
export type ArticlePersonUncheckedCreateInput = {
    articleId: string;
    personId: string;
};
export type ArticlePersonUpdateInput = {
    article?: Prisma.ArticleUpdateOneRequiredWithoutPersonsNestedInput;
    person?: Prisma.PersonProfileUpdateOneRequiredWithoutArticlesNestedInput;
};
export type ArticlePersonUncheckedUpdateInput = {
    articleId?: Prisma.StringFieldUpdateOperationsInput | string;
    personId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ArticlePersonCreateManyInput = {
    articleId: string;
    personId: string;
};
export type ArticlePersonUpdateManyMutationInput = {};
export type ArticlePersonUncheckedUpdateManyInput = {
    articleId?: Prisma.StringFieldUpdateOperationsInput | string;
    personId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ArticlePersonListRelationFilter = {
    every?: Prisma.ArticlePersonWhereInput;
    some?: Prisma.ArticlePersonWhereInput;
    none?: Prisma.ArticlePersonWhereInput;
};
export type ArticlePersonOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ArticlePersonArticleIdPersonIdCompoundUniqueInput = {
    articleId: string;
    personId: string;
};
export type ArticlePersonCountOrderByAggregateInput = {
    articleId?: Prisma.SortOrder;
    personId?: Prisma.SortOrder;
};
export type ArticlePersonMaxOrderByAggregateInput = {
    articleId?: Prisma.SortOrder;
    personId?: Prisma.SortOrder;
};
export type ArticlePersonMinOrderByAggregateInput = {
    articleId?: Prisma.SortOrder;
    personId?: Prisma.SortOrder;
};
export type ArticlePersonCreateNestedManyWithoutArticleInput = {
    create?: Prisma.XOR<Prisma.ArticlePersonCreateWithoutArticleInput, Prisma.ArticlePersonUncheckedCreateWithoutArticleInput> | Prisma.ArticlePersonCreateWithoutArticleInput[] | Prisma.ArticlePersonUncheckedCreateWithoutArticleInput[];
    connectOrCreate?: Prisma.ArticlePersonCreateOrConnectWithoutArticleInput | Prisma.ArticlePersonCreateOrConnectWithoutArticleInput[];
    createMany?: Prisma.ArticlePersonCreateManyArticleInputEnvelope;
    connect?: Prisma.ArticlePersonWhereUniqueInput | Prisma.ArticlePersonWhereUniqueInput[];
};
export type ArticlePersonUncheckedCreateNestedManyWithoutArticleInput = {
    create?: Prisma.XOR<Prisma.ArticlePersonCreateWithoutArticleInput, Prisma.ArticlePersonUncheckedCreateWithoutArticleInput> | Prisma.ArticlePersonCreateWithoutArticleInput[] | Prisma.ArticlePersonUncheckedCreateWithoutArticleInput[];
    connectOrCreate?: Prisma.ArticlePersonCreateOrConnectWithoutArticleInput | Prisma.ArticlePersonCreateOrConnectWithoutArticleInput[];
    createMany?: Prisma.ArticlePersonCreateManyArticleInputEnvelope;
    connect?: Prisma.ArticlePersonWhereUniqueInput | Prisma.ArticlePersonWhereUniqueInput[];
};
export type ArticlePersonUpdateManyWithoutArticleNestedInput = {
    create?: Prisma.XOR<Prisma.ArticlePersonCreateWithoutArticleInput, Prisma.ArticlePersonUncheckedCreateWithoutArticleInput> | Prisma.ArticlePersonCreateWithoutArticleInput[] | Prisma.ArticlePersonUncheckedCreateWithoutArticleInput[];
    connectOrCreate?: Prisma.ArticlePersonCreateOrConnectWithoutArticleInput | Prisma.ArticlePersonCreateOrConnectWithoutArticleInput[];
    upsert?: Prisma.ArticlePersonUpsertWithWhereUniqueWithoutArticleInput | Prisma.ArticlePersonUpsertWithWhereUniqueWithoutArticleInput[];
    createMany?: Prisma.ArticlePersonCreateManyArticleInputEnvelope;
    set?: Prisma.ArticlePersonWhereUniqueInput | Prisma.ArticlePersonWhereUniqueInput[];
    disconnect?: Prisma.ArticlePersonWhereUniqueInput | Prisma.ArticlePersonWhereUniqueInput[];
    delete?: Prisma.ArticlePersonWhereUniqueInput | Prisma.ArticlePersonWhereUniqueInput[];
    connect?: Prisma.ArticlePersonWhereUniqueInput | Prisma.ArticlePersonWhereUniqueInput[];
    update?: Prisma.ArticlePersonUpdateWithWhereUniqueWithoutArticleInput | Prisma.ArticlePersonUpdateWithWhereUniqueWithoutArticleInput[];
    updateMany?: Prisma.ArticlePersonUpdateManyWithWhereWithoutArticleInput | Prisma.ArticlePersonUpdateManyWithWhereWithoutArticleInput[];
    deleteMany?: Prisma.ArticlePersonScalarWhereInput | Prisma.ArticlePersonScalarWhereInput[];
};
export type ArticlePersonUncheckedUpdateManyWithoutArticleNestedInput = {
    create?: Prisma.XOR<Prisma.ArticlePersonCreateWithoutArticleInput, Prisma.ArticlePersonUncheckedCreateWithoutArticleInput> | Prisma.ArticlePersonCreateWithoutArticleInput[] | Prisma.ArticlePersonUncheckedCreateWithoutArticleInput[];
    connectOrCreate?: Prisma.ArticlePersonCreateOrConnectWithoutArticleInput | Prisma.ArticlePersonCreateOrConnectWithoutArticleInput[];
    upsert?: Prisma.ArticlePersonUpsertWithWhereUniqueWithoutArticleInput | Prisma.ArticlePersonUpsertWithWhereUniqueWithoutArticleInput[];
    createMany?: Prisma.ArticlePersonCreateManyArticleInputEnvelope;
    set?: Prisma.ArticlePersonWhereUniqueInput | Prisma.ArticlePersonWhereUniqueInput[];
    disconnect?: Prisma.ArticlePersonWhereUniqueInput | Prisma.ArticlePersonWhereUniqueInput[];
    delete?: Prisma.ArticlePersonWhereUniqueInput | Prisma.ArticlePersonWhereUniqueInput[];
    connect?: Prisma.ArticlePersonWhereUniqueInput | Prisma.ArticlePersonWhereUniqueInput[];
    update?: Prisma.ArticlePersonUpdateWithWhereUniqueWithoutArticleInput | Prisma.ArticlePersonUpdateWithWhereUniqueWithoutArticleInput[];
    updateMany?: Prisma.ArticlePersonUpdateManyWithWhereWithoutArticleInput | Prisma.ArticlePersonUpdateManyWithWhereWithoutArticleInput[];
    deleteMany?: Prisma.ArticlePersonScalarWhereInput | Prisma.ArticlePersonScalarWhereInput[];
};
export type ArticlePersonCreateNestedManyWithoutPersonInput = {
    create?: Prisma.XOR<Prisma.ArticlePersonCreateWithoutPersonInput, Prisma.ArticlePersonUncheckedCreateWithoutPersonInput> | Prisma.ArticlePersonCreateWithoutPersonInput[] | Prisma.ArticlePersonUncheckedCreateWithoutPersonInput[];
    connectOrCreate?: Prisma.ArticlePersonCreateOrConnectWithoutPersonInput | Prisma.ArticlePersonCreateOrConnectWithoutPersonInput[];
    createMany?: Prisma.ArticlePersonCreateManyPersonInputEnvelope;
    connect?: Prisma.ArticlePersonWhereUniqueInput | Prisma.ArticlePersonWhereUniqueInput[];
};
export type ArticlePersonUncheckedCreateNestedManyWithoutPersonInput = {
    create?: Prisma.XOR<Prisma.ArticlePersonCreateWithoutPersonInput, Prisma.ArticlePersonUncheckedCreateWithoutPersonInput> | Prisma.ArticlePersonCreateWithoutPersonInput[] | Prisma.ArticlePersonUncheckedCreateWithoutPersonInput[];
    connectOrCreate?: Prisma.ArticlePersonCreateOrConnectWithoutPersonInput | Prisma.ArticlePersonCreateOrConnectWithoutPersonInput[];
    createMany?: Prisma.ArticlePersonCreateManyPersonInputEnvelope;
    connect?: Prisma.ArticlePersonWhereUniqueInput | Prisma.ArticlePersonWhereUniqueInput[];
};
export type ArticlePersonUpdateManyWithoutPersonNestedInput = {
    create?: Prisma.XOR<Prisma.ArticlePersonCreateWithoutPersonInput, Prisma.ArticlePersonUncheckedCreateWithoutPersonInput> | Prisma.ArticlePersonCreateWithoutPersonInput[] | Prisma.ArticlePersonUncheckedCreateWithoutPersonInput[];
    connectOrCreate?: Prisma.ArticlePersonCreateOrConnectWithoutPersonInput | Prisma.ArticlePersonCreateOrConnectWithoutPersonInput[];
    upsert?: Prisma.ArticlePersonUpsertWithWhereUniqueWithoutPersonInput | Prisma.ArticlePersonUpsertWithWhereUniqueWithoutPersonInput[];
    createMany?: Prisma.ArticlePersonCreateManyPersonInputEnvelope;
    set?: Prisma.ArticlePersonWhereUniqueInput | Prisma.ArticlePersonWhereUniqueInput[];
    disconnect?: Prisma.ArticlePersonWhereUniqueInput | Prisma.ArticlePersonWhereUniqueInput[];
    delete?: Prisma.ArticlePersonWhereUniqueInput | Prisma.ArticlePersonWhereUniqueInput[];
    connect?: Prisma.ArticlePersonWhereUniqueInput | Prisma.ArticlePersonWhereUniqueInput[];
    update?: Prisma.ArticlePersonUpdateWithWhereUniqueWithoutPersonInput | Prisma.ArticlePersonUpdateWithWhereUniqueWithoutPersonInput[];
    updateMany?: Prisma.ArticlePersonUpdateManyWithWhereWithoutPersonInput | Prisma.ArticlePersonUpdateManyWithWhereWithoutPersonInput[];
    deleteMany?: Prisma.ArticlePersonScalarWhereInput | Prisma.ArticlePersonScalarWhereInput[];
};
export type ArticlePersonUncheckedUpdateManyWithoutPersonNestedInput = {
    create?: Prisma.XOR<Prisma.ArticlePersonCreateWithoutPersonInput, Prisma.ArticlePersonUncheckedCreateWithoutPersonInput> | Prisma.ArticlePersonCreateWithoutPersonInput[] | Prisma.ArticlePersonUncheckedCreateWithoutPersonInput[];
    connectOrCreate?: Prisma.ArticlePersonCreateOrConnectWithoutPersonInput | Prisma.ArticlePersonCreateOrConnectWithoutPersonInput[];
    upsert?: Prisma.ArticlePersonUpsertWithWhereUniqueWithoutPersonInput | Prisma.ArticlePersonUpsertWithWhereUniqueWithoutPersonInput[];
    createMany?: Prisma.ArticlePersonCreateManyPersonInputEnvelope;
    set?: Prisma.ArticlePersonWhereUniqueInput | Prisma.ArticlePersonWhereUniqueInput[];
    disconnect?: Prisma.ArticlePersonWhereUniqueInput | Prisma.ArticlePersonWhereUniqueInput[];
    delete?: Prisma.ArticlePersonWhereUniqueInput | Prisma.ArticlePersonWhereUniqueInput[];
    connect?: Prisma.ArticlePersonWhereUniqueInput | Prisma.ArticlePersonWhereUniqueInput[];
    update?: Prisma.ArticlePersonUpdateWithWhereUniqueWithoutPersonInput | Prisma.ArticlePersonUpdateWithWhereUniqueWithoutPersonInput[];
    updateMany?: Prisma.ArticlePersonUpdateManyWithWhereWithoutPersonInput | Prisma.ArticlePersonUpdateManyWithWhereWithoutPersonInput[];
    deleteMany?: Prisma.ArticlePersonScalarWhereInput | Prisma.ArticlePersonScalarWhereInput[];
};
export type ArticlePersonCreateWithoutArticleInput = {
    person: Prisma.PersonProfileCreateNestedOneWithoutArticlesInput;
};
export type ArticlePersonUncheckedCreateWithoutArticleInput = {
    personId: string;
};
export type ArticlePersonCreateOrConnectWithoutArticleInput = {
    where: Prisma.ArticlePersonWhereUniqueInput;
    create: Prisma.XOR<Prisma.ArticlePersonCreateWithoutArticleInput, Prisma.ArticlePersonUncheckedCreateWithoutArticleInput>;
};
export type ArticlePersonCreateManyArticleInputEnvelope = {
    data: Prisma.ArticlePersonCreateManyArticleInput | Prisma.ArticlePersonCreateManyArticleInput[];
    skipDuplicates?: boolean;
};
export type ArticlePersonUpsertWithWhereUniqueWithoutArticleInput = {
    where: Prisma.ArticlePersonWhereUniqueInput;
    update: Prisma.XOR<Prisma.ArticlePersonUpdateWithoutArticleInput, Prisma.ArticlePersonUncheckedUpdateWithoutArticleInput>;
    create: Prisma.XOR<Prisma.ArticlePersonCreateWithoutArticleInput, Prisma.ArticlePersonUncheckedCreateWithoutArticleInput>;
};
export type ArticlePersonUpdateWithWhereUniqueWithoutArticleInput = {
    where: Prisma.ArticlePersonWhereUniqueInput;
    data: Prisma.XOR<Prisma.ArticlePersonUpdateWithoutArticleInput, Prisma.ArticlePersonUncheckedUpdateWithoutArticleInput>;
};
export type ArticlePersonUpdateManyWithWhereWithoutArticleInput = {
    where: Prisma.ArticlePersonScalarWhereInput;
    data: Prisma.XOR<Prisma.ArticlePersonUpdateManyMutationInput, Prisma.ArticlePersonUncheckedUpdateManyWithoutArticleInput>;
};
export type ArticlePersonScalarWhereInput = {
    AND?: Prisma.ArticlePersonScalarWhereInput | Prisma.ArticlePersonScalarWhereInput[];
    OR?: Prisma.ArticlePersonScalarWhereInput[];
    NOT?: Prisma.ArticlePersonScalarWhereInput | Prisma.ArticlePersonScalarWhereInput[];
    articleId?: Prisma.StringFilter<"ArticlePerson"> | string;
    personId?: Prisma.StringFilter<"ArticlePerson"> | string;
};
export type ArticlePersonCreateWithoutPersonInput = {
    article: Prisma.ArticleCreateNestedOneWithoutPersonsInput;
};
export type ArticlePersonUncheckedCreateWithoutPersonInput = {
    articleId: string;
};
export type ArticlePersonCreateOrConnectWithoutPersonInput = {
    where: Prisma.ArticlePersonWhereUniqueInput;
    create: Prisma.XOR<Prisma.ArticlePersonCreateWithoutPersonInput, Prisma.ArticlePersonUncheckedCreateWithoutPersonInput>;
};
export type ArticlePersonCreateManyPersonInputEnvelope = {
    data: Prisma.ArticlePersonCreateManyPersonInput | Prisma.ArticlePersonCreateManyPersonInput[];
    skipDuplicates?: boolean;
};
export type ArticlePersonUpsertWithWhereUniqueWithoutPersonInput = {
    where: Prisma.ArticlePersonWhereUniqueInput;
    update: Prisma.XOR<Prisma.ArticlePersonUpdateWithoutPersonInput, Prisma.ArticlePersonUncheckedUpdateWithoutPersonInput>;
    create: Prisma.XOR<Prisma.ArticlePersonCreateWithoutPersonInput, Prisma.ArticlePersonUncheckedCreateWithoutPersonInput>;
};
export type ArticlePersonUpdateWithWhereUniqueWithoutPersonInput = {
    where: Prisma.ArticlePersonWhereUniqueInput;
    data: Prisma.XOR<Prisma.ArticlePersonUpdateWithoutPersonInput, Prisma.ArticlePersonUncheckedUpdateWithoutPersonInput>;
};
export type ArticlePersonUpdateManyWithWhereWithoutPersonInput = {
    where: Prisma.ArticlePersonScalarWhereInput;
    data: Prisma.XOR<Prisma.ArticlePersonUpdateManyMutationInput, Prisma.ArticlePersonUncheckedUpdateManyWithoutPersonInput>;
};
export type ArticlePersonCreateManyArticleInput = {
    personId: string;
};
export type ArticlePersonUpdateWithoutArticleInput = {
    person?: Prisma.PersonProfileUpdateOneRequiredWithoutArticlesNestedInput;
};
export type ArticlePersonUncheckedUpdateWithoutArticleInput = {
    personId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ArticlePersonUncheckedUpdateManyWithoutArticleInput = {
    personId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ArticlePersonCreateManyPersonInput = {
    articleId: string;
};
export type ArticlePersonUpdateWithoutPersonInput = {
    article?: Prisma.ArticleUpdateOneRequiredWithoutPersonsNestedInput;
};
export type ArticlePersonUncheckedUpdateWithoutPersonInput = {
    articleId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ArticlePersonUncheckedUpdateManyWithoutPersonInput = {
    articleId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ArticlePersonSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    articleId?: boolean;
    personId?: boolean;
    article?: boolean | Prisma.ArticleDefaultArgs<ExtArgs>;
    person?: boolean | Prisma.PersonProfileDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["articlePerson"]>;
export type ArticlePersonSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    articleId?: boolean;
    personId?: boolean;
    article?: boolean | Prisma.ArticleDefaultArgs<ExtArgs>;
    person?: boolean | Prisma.PersonProfileDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["articlePerson"]>;
export type ArticlePersonSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    articleId?: boolean;
    personId?: boolean;
    article?: boolean | Prisma.ArticleDefaultArgs<ExtArgs>;
    person?: boolean | Prisma.PersonProfileDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["articlePerson"]>;
export type ArticlePersonSelectScalar = {
    articleId?: boolean;
    personId?: boolean;
};
export type ArticlePersonOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"articleId" | "personId", ExtArgs["result"]["articlePerson"]>;
export type ArticlePersonInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    article?: boolean | Prisma.ArticleDefaultArgs<ExtArgs>;
    person?: boolean | Prisma.PersonProfileDefaultArgs<ExtArgs>;
};
export type ArticlePersonIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    article?: boolean | Prisma.ArticleDefaultArgs<ExtArgs>;
    person?: boolean | Prisma.PersonProfileDefaultArgs<ExtArgs>;
};
export type ArticlePersonIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    article?: boolean | Prisma.ArticleDefaultArgs<ExtArgs>;
    person?: boolean | Prisma.PersonProfileDefaultArgs<ExtArgs>;
};
export type $ArticlePersonPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ArticlePerson";
    objects: {
        article: Prisma.$ArticlePayload<ExtArgs>;
        person: Prisma.$PersonProfilePayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        articleId: string;
        personId: string;
    }, ExtArgs["result"]["articlePerson"]>;
    composites: {};
};
export type ArticlePersonGetPayload<S extends boolean | null | undefined | ArticlePersonDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ArticlePersonPayload, S>;
export type ArticlePersonCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ArticlePersonFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ArticlePersonCountAggregateInputType | true;
};
export interface ArticlePersonDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ArticlePerson'];
        meta: {
            name: 'ArticlePerson';
        };
    };
    findUnique<T extends ArticlePersonFindUniqueArgs>(args: Prisma.SelectSubset<T, ArticlePersonFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ArticlePersonClient<runtime.Types.Result.GetResult<Prisma.$ArticlePersonPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ArticlePersonFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ArticlePersonFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ArticlePersonClient<runtime.Types.Result.GetResult<Prisma.$ArticlePersonPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ArticlePersonFindFirstArgs>(args?: Prisma.SelectSubset<T, ArticlePersonFindFirstArgs<ExtArgs>>): Prisma.Prisma__ArticlePersonClient<runtime.Types.Result.GetResult<Prisma.$ArticlePersonPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ArticlePersonFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ArticlePersonFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ArticlePersonClient<runtime.Types.Result.GetResult<Prisma.$ArticlePersonPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ArticlePersonFindManyArgs>(args?: Prisma.SelectSubset<T, ArticlePersonFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ArticlePersonPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ArticlePersonCreateArgs>(args: Prisma.SelectSubset<T, ArticlePersonCreateArgs<ExtArgs>>): Prisma.Prisma__ArticlePersonClient<runtime.Types.Result.GetResult<Prisma.$ArticlePersonPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ArticlePersonCreateManyArgs>(args?: Prisma.SelectSubset<T, ArticlePersonCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ArticlePersonCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ArticlePersonCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ArticlePersonPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ArticlePersonDeleteArgs>(args: Prisma.SelectSubset<T, ArticlePersonDeleteArgs<ExtArgs>>): Prisma.Prisma__ArticlePersonClient<runtime.Types.Result.GetResult<Prisma.$ArticlePersonPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ArticlePersonUpdateArgs>(args: Prisma.SelectSubset<T, ArticlePersonUpdateArgs<ExtArgs>>): Prisma.Prisma__ArticlePersonClient<runtime.Types.Result.GetResult<Prisma.$ArticlePersonPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ArticlePersonDeleteManyArgs>(args?: Prisma.SelectSubset<T, ArticlePersonDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ArticlePersonUpdateManyArgs>(args: Prisma.SelectSubset<T, ArticlePersonUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ArticlePersonUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ArticlePersonUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ArticlePersonPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ArticlePersonUpsertArgs>(args: Prisma.SelectSubset<T, ArticlePersonUpsertArgs<ExtArgs>>): Prisma.Prisma__ArticlePersonClient<runtime.Types.Result.GetResult<Prisma.$ArticlePersonPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ArticlePersonCountArgs>(args?: Prisma.Subset<T, ArticlePersonCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ArticlePersonCountAggregateOutputType> : number>;
    aggregate<T extends ArticlePersonAggregateArgs>(args: Prisma.Subset<T, ArticlePersonAggregateArgs>): Prisma.PrismaPromise<GetArticlePersonAggregateType<T>>;
    groupBy<T extends ArticlePersonGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ArticlePersonGroupByArgs['orderBy'];
    } : {
        orderBy?: ArticlePersonGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ArticlePersonGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetArticlePersonGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ArticlePersonFieldRefs;
}
export interface Prisma__ArticlePersonClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    article<T extends Prisma.ArticleDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ArticleDefaultArgs<ExtArgs>>): Prisma.Prisma__ArticleClient<runtime.Types.Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    person<T extends Prisma.PersonProfileDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PersonProfileDefaultArgs<ExtArgs>>): Prisma.Prisma__PersonProfileClient<runtime.Types.Result.GetResult<Prisma.$PersonProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ArticlePersonFieldRefs {
    readonly articleId: Prisma.FieldRef<"ArticlePerson", 'String'>;
    readonly personId: Prisma.FieldRef<"ArticlePerson", 'String'>;
}
export type ArticlePersonFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticlePersonSelect<ExtArgs> | null;
    omit?: Prisma.ArticlePersonOmit<ExtArgs> | null;
    include?: Prisma.ArticlePersonInclude<ExtArgs> | null;
    where: Prisma.ArticlePersonWhereUniqueInput;
};
export type ArticlePersonFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticlePersonSelect<ExtArgs> | null;
    omit?: Prisma.ArticlePersonOmit<ExtArgs> | null;
    include?: Prisma.ArticlePersonInclude<ExtArgs> | null;
    where: Prisma.ArticlePersonWhereUniqueInput;
};
export type ArticlePersonFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticlePersonSelect<ExtArgs> | null;
    omit?: Prisma.ArticlePersonOmit<ExtArgs> | null;
    include?: Prisma.ArticlePersonInclude<ExtArgs> | null;
    where?: Prisma.ArticlePersonWhereInput;
    orderBy?: Prisma.ArticlePersonOrderByWithRelationInput | Prisma.ArticlePersonOrderByWithRelationInput[];
    cursor?: Prisma.ArticlePersonWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ArticlePersonScalarFieldEnum | Prisma.ArticlePersonScalarFieldEnum[];
};
export type ArticlePersonFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticlePersonSelect<ExtArgs> | null;
    omit?: Prisma.ArticlePersonOmit<ExtArgs> | null;
    include?: Prisma.ArticlePersonInclude<ExtArgs> | null;
    where?: Prisma.ArticlePersonWhereInput;
    orderBy?: Prisma.ArticlePersonOrderByWithRelationInput | Prisma.ArticlePersonOrderByWithRelationInput[];
    cursor?: Prisma.ArticlePersonWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ArticlePersonScalarFieldEnum | Prisma.ArticlePersonScalarFieldEnum[];
};
export type ArticlePersonFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticlePersonSelect<ExtArgs> | null;
    omit?: Prisma.ArticlePersonOmit<ExtArgs> | null;
    include?: Prisma.ArticlePersonInclude<ExtArgs> | null;
    where?: Prisma.ArticlePersonWhereInput;
    orderBy?: Prisma.ArticlePersonOrderByWithRelationInput | Prisma.ArticlePersonOrderByWithRelationInput[];
    cursor?: Prisma.ArticlePersonWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ArticlePersonScalarFieldEnum | Prisma.ArticlePersonScalarFieldEnum[];
};
export type ArticlePersonCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticlePersonSelect<ExtArgs> | null;
    omit?: Prisma.ArticlePersonOmit<ExtArgs> | null;
    include?: Prisma.ArticlePersonInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ArticlePersonCreateInput, Prisma.ArticlePersonUncheckedCreateInput>;
};
export type ArticlePersonCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ArticlePersonCreateManyInput | Prisma.ArticlePersonCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ArticlePersonCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticlePersonSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ArticlePersonOmit<ExtArgs> | null;
    data: Prisma.ArticlePersonCreateManyInput | Prisma.ArticlePersonCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ArticlePersonIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ArticlePersonUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticlePersonSelect<ExtArgs> | null;
    omit?: Prisma.ArticlePersonOmit<ExtArgs> | null;
    include?: Prisma.ArticlePersonInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ArticlePersonUpdateInput, Prisma.ArticlePersonUncheckedUpdateInput>;
    where: Prisma.ArticlePersonWhereUniqueInput;
};
export type ArticlePersonUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ArticlePersonUpdateManyMutationInput, Prisma.ArticlePersonUncheckedUpdateManyInput>;
    where?: Prisma.ArticlePersonWhereInput;
    limit?: number;
};
export type ArticlePersonUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticlePersonSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ArticlePersonOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ArticlePersonUpdateManyMutationInput, Prisma.ArticlePersonUncheckedUpdateManyInput>;
    where?: Prisma.ArticlePersonWhereInput;
    limit?: number;
    include?: Prisma.ArticlePersonIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ArticlePersonUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticlePersonSelect<ExtArgs> | null;
    omit?: Prisma.ArticlePersonOmit<ExtArgs> | null;
    include?: Prisma.ArticlePersonInclude<ExtArgs> | null;
    where: Prisma.ArticlePersonWhereUniqueInput;
    create: Prisma.XOR<Prisma.ArticlePersonCreateInput, Prisma.ArticlePersonUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ArticlePersonUpdateInput, Prisma.ArticlePersonUncheckedUpdateInput>;
};
export type ArticlePersonDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticlePersonSelect<ExtArgs> | null;
    omit?: Prisma.ArticlePersonOmit<ExtArgs> | null;
    include?: Prisma.ArticlePersonInclude<ExtArgs> | null;
    where: Prisma.ArticlePersonWhereUniqueInput;
};
export type ArticlePersonDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ArticlePersonWhereInput;
    limit?: number;
};
export type ArticlePersonDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ArticlePersonSelect<ExtArgs> | null;
    omit?: Prisma.ArticlePersonOmit<ExtArgs> | null;
    include?: Prisma.ArticlePersonInclude<ExtArgs> | null;
};
