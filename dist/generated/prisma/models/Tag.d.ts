import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type TagModel = runtime.Types.Result.DefaultSelection<Prisma.$TagPayload>;
export type AggregateTag = {
    _count: TagCountAggregateOutputType | null;
    _min: TagMinAggregateOutputType | null;
    _max: TagMaxAggregateOutputType | null;
};
export type TagMinAggregateOutputType = {
    id: string | null;
    tenantId: string | null;
    name: string | null;
    slug: string | null;
};
export type TagMaxAggregateOutputType = {
    id: string | null;
    tenantId: string | null;
    name: string | null;
    slug: string | null;
};
export type TagCountAggregateOutputType = {
    id: number;
    tenantId: number;
    name: number;
    slug: number;
    _all: number;
};
export type TagMinAggregateInputType = {
    id?: true;
    tenantId?: true;
    name?: true;
    slug?: true;
};
export type TagMaxAggregateInputType = {
    id?: true;
    tenantId?: true;
    name?: true;
    slug?: true;
};
export type TagCountAggregateInputType = {
    id?: true;
    tenantId?: true;
    name?: true;
    slug?: true;
    _all?: true;
};
export type TagAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TagWhereInput;
    orderBy?: Prisma.TagOrderByWithRelationInput | Prisma.TagOrderByWithRelationInput[];
    cursor?: Prisma.TagWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | TagCountAggregateInputType;
    _min?: TagMinAggregateInputType;
    _max?: TagMaxAggregateInputType;
};
export type GetTagAggregateType<T extends TagAggregateArgs> = {
    [P in keyof T & keyof AggregateTag]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTag[P]> : Prisma.GetScalarType<T[P], AggregateTag[P]>;
};
export type TagGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TagWhereInput;
    orderBy?: Prisma.TagOrderByWithAggregationInput | Prisma.TagOrderByWithAggregationInput[];
    by: Prisma.TagScalarFieldEnum[] | Prisma.TagScalarFieldEnum;
    having?: Prisma.TagScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TagCountAggregateInputType | true;
    _min?: TagMinAggregateInputType;
    _max?: TagMaxAggregateInputType;
};
export type TagGroupByOutputType = {
    id: string;
    tenantId: string;
    name: string;
    slug: string;
    _count: TagCountAggregateOutputType | null;
    _min: TagMinAggregateOutputType | null;
    _max: TagMaxAggregateOutputType | null;
};
export type GetTagGroupByPayload<T extends TagGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<TagGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof TagGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], TagGroupByOutputType[P]> : Prisma.GetScalarType<T[P], TagGroupByOutputType[P]>;
}>>;
export type TagWhereInput = {
    AND?: Prisma.TagWhereInput | Prisma.TagWhereInput[];
    OR?: Prisma.TagWhereInput[];
    NOT?: Prisma.TagWhereInput | Prisma.TagWhereInput[];
    id?: Prisma.StringFilter<"Tag"> | string;
    tenantId?: Prisma.StringFilter<"Tag"> | string;
    name?: Prisma.StringFilter<"Tag"> | string;
    slug?: Prisma.StringFilter<"Tag"> | string;
    tenant?: Prisma.XOR<Prisma.TenantScalarRelationFilter, Prisma.TenantWhereInput>;
    articles?: Prisma.ArticleTagListRelationFilter;
};
export type TagOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    tenant?: Prisma.TenantOrderByWithRelationInput;
    articles?: Prisma.ArticleTagOrderByRelationAggregateInput;
};
export type TagWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    tenantId_slug?: Prisma.TagTenantIdSlugCompoundUniqueInput;
    AND?: Prisma.TagWhereInput | Prisma.TagWhereInput[];
    OR?: Prisma.TagWhereInput[];
    NOT?: Prisma.TagWhereInput | Prisma.TagWhereInput[];
    tenantId?: Prisma.StringFilter<"Tag"> | string;
    name?: Prisma.StringFilter<"Tag"> | string;
    slug?: Prisma.StringFilter<"Tag"> | string;
    tenant?: Prisma.XOR<Prisma.TenantScalarRelationFilter, Prisma.TenantWhereInput>;
    articles?: Prisma.ArticleTagListRelationFilter;
}, "id" | "tenantId_slug">;
export type TagOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    _count?: Prisma.TagCountOrderByAggregateInput;
    _max?: Prisma.TagMaxOrderByAggregateInput;
    _min?: Prisma.TagMinOrderByAggregateInput;
};
export type TagScalarWhereWithAggregatesInput = {
    AND?: Prisma.TagScalarWhereWithAggregatesInput | Prisma.TagScalarWhereWithAggregatesInput[];
    OR?: Prisma.TagScalarWhereWithAggregatesInput[];
    NOT?: Prisma.TagScalarWhereWithAggregatesInput | Prisma.TagScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Tag"> | string;
    tenantId?: Prisma.StringWithAggregatesFilter<"Tag"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Tag"> | string;
    slug?: Prisma.StringWithAggregatesFilter<"Tag"> | string;
};
export type TagCreateInput = {
    id?: string;
    name: string;
    slug: string;
    tenant: Prisma.TenantCreateNestedOneWithoutTagsInput;
    articles?: Prisma.ArticleTagCreateNestedManyWithoutTagInput;
};
export type TagUncheckedCreateInput = {
    id?: string;
    tenantId: string;
    name: string;
    slug: string;
    articles?: Prisma.ArticleTagUncheckedCreateNestedManyWithoutTagInput;
};
export type TagUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    tenant?: Prisma.TenantUpdateOneRequiredWithoutTagsNestedInput;
    articles?: Prisma.ArticleTagUpdateManyWithoutTagNestedInput;
};
export type TagUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    articles?: Prisma.ArticleTagUncheckedUpdateManyWithoutTagNestedInput;
};
export type TagCreateManyInput = {
    id?: string;
    tenantId: string;
    name: string;
    slug: string;
};
export type TagUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type TagUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type TagListRelationFilter = {
    every?: Prisma.TagWhereInput;
    some?: Prisma.TagWhereInput;
    none?: Prisma.TagWhereInput;
};
export type TagOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type TagTenantIdSlugCompoundUniqueInput = {
    tenantId: string;
    slug: string;
};
export type TagCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
};
export type TagMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
};
export type TagMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
};
export type TagScalarRelationFilter = {
    is?: Prisma.TagWhereInput;
    isNot?: Prisma.TagWhereInput;
};
export type TagCreateNestedManyWithoutTenantInput = {
    create?: Prisma.XOR<Prisma.TagCreateWithoutTenantInput, Prisma.TagUncheckedCreateWithoutTenantInput> | Prisma.TagCreateWithoutTenantInput[] | Prisma.TagUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.TagCreateOrConnectWithoutTenantInput | Prisma.TagCreateOrConnectWithoutTenantInput[];
    createMany?: Prisma.TagCreateManyTenantInputEnvelope;
    connect?: Prisma.TagWhereUniqueInput | Prisma.TagWhereUniqueInput[];
};
export type TagUncheckedCreateNestedManyWithoutTenantInput = {
    create?: Prisma.XOR<Prisma.TagCreateWithoutTenantInput, Prisma.TagUncheckedCreateWithoutTenantInput> | Prisma.TagCreateWithoutTenantInput[] | Prisma.TagUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.TagCreateOrConnectWithoutTenantInput | Prisma.TagCreateOrConnectWithoutTenantInput[];
    createMany?: Prisma.TagCreateManyTenantInputEnvelope;
    connect?: Prisma.TagWhereUniqueInput | Prisma.TagWhereUniqueInput[];
};
export type TagUpdateManyWithoutTenantNestedInput = {
    create?: Prisma.XOR<Prisma.TagCreateWithoutTenantInput, Prisma.TagUncheckedCreateWithoutTenantInput> | Prisma.TagCreateWithoutTenantInput[] | Prisma.TagUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.TagCreateOrConnectWithoutTenantInput | Prisma.TagCreateOrConnectWithoutTenantInput[];
    upsert?: Prisma.TagUpsertWithWhereUniqueWithoutTenantInput | Prisma.TagUpsertWithWhereUniqueWithoutTenantInput[];
    createMany?: Prisma.TagCreateManyTenantInputEnvelope;
    set?: Prisma.TagWhereUniqueInput | Prisma.TagWhereUniqueInput[];
    disconnect?: Prisma.TagWhereUniqueInput | Prisma.TagWhereUniqueInput[];
    delete?: Prisma.TagWhereUniqueInput | Prisma.TagWhereUniqueInput[];
    connect?: Prisma.TagWhereUniqueInput | Prisma.TagWhereUniqueInput[];
    update?: Prisma.TagUpdateWithWhereUniqueWithoutTenantInput | Prisma.TagUpdateWithWhereUniqueWithoutTenantInput[];
    updateMany?: Prisma.TagUpdateManyWithWhereWithoutTenantInput | Prisma.TagUpdateManyWithWhereWithoutTenantInput[];
    deleteMany?: Prisma.TagScalarWhereInput | Prisma.TagScalarWhereInput[];
};
export type TagUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: Prisma.XOR<Prisma.TagCreateWithoutTenantInput, Prisma.TagUncheckedCreateWithoutTenantInput> | Prisma.TagCreateWithoutTenantInput[] | Prisma.TagUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.TagCreateOrConnectWithoutTenantInput | Prisma.TagCreateOrConnectWithoutTenantInput[];
    upsert?: Prisma.TagUpsertWithWhereUniqueWithoutTenantInput | Prisma.TagUpsertWithWhereUniqueWithoutTenantInput[];
    createMany?: Prisma.TagCreateManyTenantInputEnvelope;
    set?: Prisma.TagWhereUniqueInput | Prisma.TagWhereUniqueInput[];
    disconnect?: Prisma.TagWhereUniqueInput | Prisma.TagWhereUniqueInput[];
    delete?: Prisma.TagWhereUniqueInput | Prisma.TagWhereUniqueInput[];
    connect?: Prisma.TagWhereUniqueInput | Prisma.TagWhereUniqueInput[];
    update?: Prisma.TagUpdateWithWhereUniqueWithoutTenantInput | Prisma.TagUpdateWithWhereUniqueWithoutTenantInput[];
    updateMany?: Prisma.TagUpdateManyWithWhereWithoutTenantInput | Prisma.TagUpdateManyWithWhereWithoutTenantInput[];
    deleteMany?: Prisma.TagScalarWhereInput | Prisma.TagScalarWhereInput[];
};
export type TagCreateNestedOneWithoutArticlesInput = {
    create?: Prisma.XOR<Prisma.TagCreateWithoutArticlesInput, Prisma.TagUncheckedCreateWithoutArticlesInput>;
    connectOrCreate?: Prisma.TagCreateOrConnectWithoutArticlesInput;
    connect?: Prisma.TagWhereUniqueInput;
};
export type TagUpdateOneRequiredWithoutArticlesNestedInput = {
    create?: Prisma.XOR<Prisma.TagCreateWithoutArticlesInput, Prisma.TagUncheckedCreateWithoutArticlesInput>;
    connectOrCreate?: Prisma.TagCreateOrConnectWithoutArticlesInput;
    upsert?: Prisma.TagUpsertWithoutArticlesInput;
    connect?: Prisma.TagWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TagUpdateToOneWithWhereWithoutArticlesInput, Prisma.TagUpdateWithoutArticlesInput>, Prisma.TagUncheckedUpdateWithoutArticlesInput>;
};
export type TagCreateWithoutTenantInput = {
    id?: string;
    name: string;
    slug: string;
    articles?: Prisma.ArticleTagCreateNestedManyWithoutTagInput;
};
export type TagUncheckedCreateWithoutTenantInput = {
    id?: string;
    name: string;
    slug: string;
    articles?: Prisma.ArticleTagUncheckedCreateNestedManyWithoutTagInput;
};
export type TagCreateOrConnectWithoutTenantInput = {
    where: Prisma.TagWhereUniqueInput;
    create: Prisma.XOR<Prisma.TagCreateWithoutTenantInput, Prisma.TagUncheckedCreateWithoutTenantInput>;
};
export type TagCreateManyTenantInputEnvelope = {
    data: Prisma.TagCreateManyTenantInput | Prisma.TagCreateManyTenantInput[];
    skipDuplicates?: boolean;
};
export type TagUpsertWithWhereUniqueWithoutTenantInput = {
    where: Prisma.TagWhereUniqueInput;
    update: Prisma.XOR<Prisma.TagUpdateWithoutTenantInput, Prisma.TagUncheckedUpdateWithoutTenantInput>;
    create: Prisma.XOR<Prisma.TagCreateWithoutTenantInput, Prisma.TagUncheckedCreateWithoutTenantInput>;
};
export type TagUpdateWithWhereUniqueWithoutTenantInput = {
    where: Prisma.TagWhereUniqueInput;
    data: Prisma.XOR<Prisma.TagUpdateWithoutTenantInput, Prisma.TagUncheckedUpdateWithoutTenantInput>;
};
export type TagUpdateManyWithWhereWithoutTenantInput = {
    where: Prisma.TagScalarWhereInput;
    data: Prisma.XOR<Prisma.TagUpdateManyMutationInput, Prisma.TagUncheckedUpdateManyWithoutTenantInput>;
};
export type TagScalarWhereInput = {
    AND?: Prisma.TagScalarWhereInput | Prisma.TagScalarWhereInput[];
    OR?: Prisma.TagScalarWhereInput[];
    NOT?: Prisma.TagScalarWhereInput | Prisma.TagScalarWhereInput[];
    id?: Prisma.StringFilter<"Tag"> | string;
    tenantId?: Prisma.StringFilter<"Tag"> | string;
    name?: Prisma.StringFilter<"Tag"> | string;
    slug?: Prisma.StringFilter<"Tag"> | string;
};
export type TagCreateWithoutArticlesInput = {
    id?: string;
    name: string;
    slug: string;
    tenant: Prisma.TenantCreateNestedOneWithoutTagsInput;
};
export type TagUncheckedCreateWithoutArticlesInput = {
    id?: string;
    tenantId: string;
    name: string;
    slug: string;
};
export type TagCreateOrConnectWithoutArticlesInput = {
    where: Prisma.TagWhereUniqueInput;
    create: Prisma.XOR<Prisma.TagCreateWithoutArticlesInput, Prisma.TagUncheckedCreateWithoutArticlesInput>;
};
export type TagUpsertWithoutArticlesInput = {
    update: Prisma.XOR<Prisma.TagUpdateWithoutArticlesInput, Prisma.TagUncheckedUpdateWithoutArticlesInput>;
    create: Prisma.XOR<Prisma.TagCreateWithoutArticlesInput, Prisma.TagUncheckedCreateWithoutArticlesInput>;
    where?: Prisma.TagWhereInput;
};
export type TagUpdateToOneWithWhereWithoutArticlesInput = {
    where?: Prisma.TagWhereInput;
    data: Prisma.XOR<Prisma.TagUpdateWithoutArticlesInput, Prisma.TagUncheckedUpdateWithoutArticlesInput>;
};
export type TagUpdateWithoutArticlesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    tenant?: Prisma.TenantUpdateOneRequiredWithoutTagsNestedInput;
};
export type TagUncheckedUpdateWithoutArticlesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type TagCreateManyTenantInput = {
    id?: string;
    name: string;
    slug: string;
};
export type TagUpdateWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    articles?: Prisma.ArticleTagUpdateManyWithoutTagNestedInput;
};
export type TagUncheckedUpdateWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    articles?: Prisma.ArticleTagUncheckedUpdateManyWithoutTagNestedInput;
};
export type TagUncheckedUpdateManyWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type TagCountOutputType = {
    articles: number;
};
export type TagCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    articles?: boolean | TagCountOutputTypeCountArticlesArgs;
};
export type TagCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TagCountOutputTypeSelect<ExtArgs> | null;
};
export type TagCountOutputTypeCountArticlesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ArticleTagWhereInput;
};
export type TagSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    name?: boolean;
    slug?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
    articles?: boolean | Prisma.Tag$articlesArgs<ExtArgs>;
    _count?: boolean | Prisma.TagCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["tag"]>;
export type TagSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    name?: boolean;
    slug?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["tag"]>;
export type TagSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    name?: boolean;
    slug?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["tag"]>;
export type TagSelectScalar = {
    id?: boolean;
    tenantId?: boolean;
    name?: boolean;
    slug?: boolean;
};
export type TagOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "tenantId" | "name" | "slug", ExtArgs["result"]["tag"]>;
export type TagInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
    articles?: boolean | Prisma.Tag$articlesArgs<ExtArgs>;
    _count?: boolean | Prisma.TagCountOutputTypeDefaultArgs<ExtArgs>;
};
export type TagIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
};
export type TagIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
};
export type $TagPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Tag";
    objects: {
        tenant: Prisma.$TenantPayload<ExtArgs>;
        articles: Prisma.$ArticleTagPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        tenantId: string;
        name: string;
        slug: string;
    }, ExtArgs["result"]["tag"]>;
    composites: {};
};
export type TagGetPayload<S extends boolean | null | undefined | TagDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$TagPayload, S>;
export type TagCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<TagFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: TagCountAggregateInputType | true;
};
export interface TagDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Tag'];
        meta: {
            name: 'Tag';
        };
    };
    findUnique<T extends TagFindUniqueArgs>(args: Prisma.SelectSubset<T, TagFindUniqueArgs<ExtArgs>>): Prisma.Prisma__TagClient<runtime.Types.Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends TagFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, TagFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__TagClient<runtime.Types.Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends TagFindFirstArgs>(args?: Prisma.SelectSubset<T, TagFindFirstArgs<ExtArgs>>): Prisma.Prisma__TagClient<runtime.Types.Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends TagFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, TagFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__TagClient<runtime.Types.Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends TagFindManyArgs>(args?: Prisma.SelectSubset<T, TagFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends TagCreateArgs>(args: Prisma.SelectSubset<T, TagCreateArgs<ExtArgs>>): Prisma.Prisma__TagClient<runtime.Types.Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends TagCreateManyArgs>(args?: Prisma.SelectSubset<T, TagCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends TagCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, TagCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends TagDeleteArgs>(args: Prisma.SelectSubset<T, TagDeleteArgs<ExtArgs>>): Prisma.Prisma__TagClient<runtime.Types.Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends TagUpdateArgs>(args: Prisma.SelectSubset<T, TagUpdateArgs<ExtArgs>>): Prisma.Prisma__TagClient<runtime.Types.Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends TagDeleteManyArgs>(args?: Prisma.SelectSubset<T, TagDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends TagUpdateManyArgs>(args: Prisma.SelectSubset<T, TagUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends TagUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, TagUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends TagUpsertArgs>(args: Prisma.SelectSubset<T, TagUpsertArgs<ExtArgs>>): Prisma.Prisma__TagClient<runtime.Types.Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends TagCountArgs>(args?: Prisma.Subset<T, TagCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], TagCountAggregateOutputType> : number>;
    aggregate<T extends TagAggregateArgs>(args: Prisma.Subset<T, TagAggregateArgs>): Prisma.PrismaPromise<GetTagAggregateType<T>>;
    groupBy<T extends TagGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: TagGroupByArgs['orderBy'];
    } : {
        orderBy?: TagGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, TagGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTagGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: TagFieldRefs;
}
export interface Prisma__TagClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    tenant<T extends Prisma.TenantDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TenantDefaultArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    articles<T extends Prisma.Tag$articlesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Tag$articlesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ArticleTagPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface TagFieldRefs {
    readonly id: Prisma.FieldRef<"Tag", 'String'>;
    readonly tenantId: Prisma.FieldRef<"Tag", 'String'>;
    readonly name: Prisma.FieldRef<"Tag", 'String'>;
    readonly slug: Prisma.FieldRef<"Tag", 'String'>;
}
export type TagFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TagSelect<ExtArgs> | null;
    omit?: Prisma.TagOmit<ExtArgs> | null;
    include?: Prisma.TagInclude<ExtArgs> | null;
    where: Prisma.TagWhereUniqueInput;
};
export type TagFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TagSelect<ExtArgs> | null;
    omit?: Prisma.TagOmit<ExtArgs> | null;
    include?: Prisma.TagInclude<ExtArgs> | null;
    where: Prisma.TagWhereUniqueInput;
};
export type TagFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TagSelect<ExtArgs> | null;
    omit?: Prisma.TagOmit<ExtArgs> | null;
    include?: Prisma.TagInclude<ExtArgs> | null;
    where?: Prisma.TagWhereInput;
    orderBy?: Prisma.TagOrderByWithRelationInput | Prisma.TagOrderByWithRelationInput[];
    cursor?: Prisma.TagWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TagScalarFieldEnum | Prisma.TagScalarFieldEnum[];
};
export type TagFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TagSelect<ExtArgs> | null;
    omit?: Prisma.TagOmit<ExtArgs> | null;
    include?: Prisma.TagInclude<ExtArgs> | null;
    where?: Prisma.TagWhereInput;
    orderBy?: Prisma.TagOrderByWithRelationInput | Prisma.TagOrderByWithRelationInput[];
    cursor?: Prisma.TagWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TagScalarFieldEnum | Prisma.TagScalarFieldEnum[];
};
export type TagFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TagSelect<ExtArgs> | null;
    omit?: Prisma.TagOmit<ExtArgs> | null;
    include?: Prisma.TagInclude<ExtArgs> | null;
    where?: Prisma.TagWhereInput;
    orderBy?: Prisma.TagOrderByWithRelationInput | Prisma.TagOrderByWithRelationInput[];
    cursor?: Prisma.TagWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TagScalarFieldEnum | Prisma.TagScalarFieldEnum[];
};
export type TagCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TagSelect<ExtArgs> | null;
    omit?: Prisma.TagOmit<ExtArgs> | null;
    include?: Prisma.TagInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TagCreateInput, Prisma.TagUncheckedCreateInput>;
};
export type TagCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.TagCreateManyInput | Prisma.TagCreateManyInput[];
    skipDuplicates?: boolean;
};
export type TagCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TagSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TagOmit<ExtArgs> | null;
    data: Prisma.TagCreateManyInput | Prisma.TagCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.TagIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type TagUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TagSelect<ExtArgs> | null;
    omit?: Prisma.TagOmit<ExtArgs> | null;
    include?: Prisma.TagInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TagUpdateInput, Prisma.TagUncheckedUpdateInput>;
    where: Prisma.TagWhereUniqueInput;
};
export type TagUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.TagUpdateManyMutationInput, Prisma.TagUncheckedUpdateManyInput>;
    where?: Prisma.TagWhereInput;
    limit?: number;
};
export type TagUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TagSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TagOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TagUpdateManyMutationInput, Prisma.TagUncheckedUpdateManyInput>;
    where?: Prisma.TagWhereInput;
    limit?: number;
    include?: Prisma.TagIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type TagUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TagSelect<ExtArgs> | null;
    omit?: Prisma.TagOmit<ExtArgs> | null;
    include?: Prisma.TagInclude<ExtArgs> | null;
    where: Prisma.TagWhereUniqueInput;
    create: Prisma.XOR<Prisma.TagCreateInput, Prisma.TagUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.TagUpdateInput, Prisma.TagUncheckedUpdateInput>;
};
export type TagDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TagSelect<ExtArgs> | null;
    omit?: Prisma.TagOmit<ExtArgs> | null;
    include?: Prisma.TagInclude<ExtArgs> | null;
    where: Prisma.TagWhereUniqueInput;
};
export type TagDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TagWhereInput;
    limit?: number;
};
export type Tag$articlesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type TagDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TagSelect<ExtArgs> | null;
    omit?: Prisma.TagOmit<ExtArgs> | null;
    include?: Prisma.TagInclude<ExtArgs> | null;
};
