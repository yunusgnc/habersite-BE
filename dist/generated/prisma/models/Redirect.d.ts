import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type RedirectModel = runtime.Types.Result.DefaultSelection<Prisma.$RedirectPayload>;
export type AggregateRedirect = {
    _count: RedirectCountAggregateOutputType | null;
    _min: RedirectMinAggregateOutputType | null;
    _max: RedirectMaxAggregateOutputType | null;
};
export type RedirectMinAggregateOutputType = {
    id: string | null;
    tenantId: string | null;
    source: string | null;
    target: string | null;
    permanent: boolean | null;
};
export type RedirectMaxAggregateOutputType = {
    id: string | null;
    tenantId: string | null;
    source: string | null;
    target: string | null;
    permanent: boolean | null;
};
export type RedirectCountAggregateOutputType = {
    id: number;
    tenantId: number;
    source: number;
    target: number;
    permanent: number;
    _all: number;
};
export type RedirectMinAggregateInputType = {
    id?: true;
    tenantId?: true;
    source?: true;
    target?: true;
    permanent?: true;
};
export type RedirectMaxAggregateInputType = {
    id?: true;
    tenantId?: true;
    source?: true;
    target?: true;
    permanent?: true;
};
export type RedirectCountAggregateInputType = {
    id?: true;
    tenantId?: true;
    source?: true;
    target?: true;
    permanent?: true;
    _all?: true;
};
export type RedirectAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RedirectWhereInput;
    orderBy?: Prisma.RedirectOrderByWithRelationInput | Prisma.RedirectOrderByWithRelationInput[];
    cursor?: Prisma.RedirectWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | RedirectCountAggregateInputType;
    _min?: RedirectMinAggregateInputType;
    _max?: RedirectMaxAggregateInputType;
};
export type GetRedirectAggregateType<T extends RedirectAggregateArgs> = {
    [P in keyof T & keyof AggregateRedirect]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateRedirect[P]> : Prisma.GetScalarType<T[P], AggregateRedirect[P]>;
};
export type RedirectGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RedirectWhereInput;
    orderBy?: Prisma.RedirectOrderByWithAggregationInput | Prisma.RedirectOrderByWithAggregationInput[];
    by: Prisma.RedirectScalarFieldEnum[] | Prisma.RedirectScalarFieldEnum;
    having?: Prisma.RedirectScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: RedirectCountAggregateInputType | true;
    _min?: RedirectMinAggregateInputType;
    _max?: RedirectMaxAggregateInputType;
};
export type RedirectGroupByOutputType = {
    id: string;
    tenantId: string;
    source: string;
    target: string;
    permanent: boolean;
    _count: RedirectCountAggregateOutputType | null;
    _min: RedirectMinAggregateOutputType | null;
    _max: RedirectMaxAggregateOutputType | null;
};
export type GetRedirectGroupByPayload<T extends RedirectGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<RedirectGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof RedirectGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], RedirectGroupByOutputType[P]> : Prisma.GetScalarType<T[P], RedirectGroupByOutputType[P]>;
}>>;
export type RedirectWhereInput = {
    AND?: Prisma.RedirectWhereInput | Prisma.RedirectWhereInput[];
    OR?: Prisma.RedirectWhereInput[];
    NOT?: Prisma.RedirectWhereInput | Prisma.RedirectWhereInput[];
    id?: Prisma.StringFilter<"Redirect"> | string;
    tenantId?: Prisma.StringFilter<"Redirect"> | string;
    source?: Prisma.StringFilter<"Redirect"> | string;
    target?: Prisma.StringFilter<"Redirect"> | string;
    permanent?: Prisma.BoolFilter<"Redirect"> | boolean;
    tenant?: Prisma.XOR<Prisma.TenantScalarRelationFilter, Prisma.TenantWhereInput>;
};
export type RedirectOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    target?: Prisma.SortOrder;
    permanent?: Prisma.SortOrder;
    tenant?: Prisma.TenantOrderByWithRelationInput;
};
export type RedirectWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    tenantId_source?: Prisma.RedirectTenantIdSourceCompoundUniqueInput;
    AND?: Prisma.RedirectWhereInput | Prisma.RedirectWhereInput[];
    OR?: Prisma.RedirectWhereInput[];
    NOT?: Prisma.RedirectWhereInput | Prisma.RedirectWhereInput[];
    tenantId?: Prisma.StringFilter<"Redirect"> | string;
    source?: Prisma.StringFilter<"Redirect"> | string;
    target?: Prisma.StringFilter<"Redirect"> | string;
    permanent?: Prisma.BoolFilter<"Redirect"> | boolean;
    tenant?: Prisma.XOR<Prisma.TenantScalarRelationFilter, Prisma.TenantWhereInput>;
}, "id" | "tenantId_source">;
export type RedirectOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    target?: Prisma.SortOrder;
    permanent?: Prisma.SortOrder;
    _count?: Prisma.RedirectCountOrderByAggregateInput;
    _max?: Prisma.RedirectMaxOrderByAggregateInput;
    _min?: Prisma.RedirectMinOrderByAggregateInput;
};
export type RedirectScalarWhereWithAggregatesInput = {
    AND?: Prisma.RedirectScalarWhereWithAggregatesInput | Prisma.RedirectScalarWhereWithAggregatesInput[];
    OR?: Prisma.RedirectScalarWhereWithAggregatesInput[];
    NOT?: Prisma.RedirectScalarWhereWithAggregatesInput | Prisma.RedirectScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Redirect"> | string;
    tenantId?: Prisma.StringWithAggregatesFilter<"Redirect"> | string;
    source?: Prisma.StringWithAggregatesFilter<"Redirect"> | string;
    target?: Prisma.StringWithAggregatesFilter<"Redirect"> | string;
    permanent?: Prisma.BoolWithAggregatesFilter<"Redirect"> | boolean;
};
export type RedirectCreateInput = {
    id?: string;
    source: string;
    target: string;
    permanent?: boolean;
    tenant: Prisma.TenantCreateNestedOneWithoutRedirectsInput;
};
export type RedirectUncheckedCreateInput = {
    id?: string;
    tenantId: string;
    source: string;
    target: string;
    permanent?: boolean;
};
export type RedirectUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    target?: Prisma.StringFieldUpdateOperationsInput | string;
    permanent?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    tenant?: Prisma.TenantUpdateOneRequiredWithoutRedirectsNestedInput;
};
export type RedirectUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    target?: Prisma.StringFieldUpdateOperationsInput | string;
    permanent?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type RedirectCreateManyInput = {
    id?: string;
    tenantId: string;
    source: string;
    target: string;
    permanent?: boolean;
};
export type RedirectUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    target?: Prisma.StringFieldUpdateOperationsInput | string;
    permanent?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type RedirectUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    target?: Prisma.StringFieldUpdateOperationsInput | string;
    permanent?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type RedirectListRelationFilter = {
    every?: Prisma.RedirectWhereInput;
    some?: Prisma.RedirectWhereInput;
    none?: Prisma.RedirectWhereInput;
};
export type RedirectOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type RedirectTenantIdSourceCompoundUniqueInput = {
    tenantId: string;
    source: string;
};
export type RedirectCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    target?: Prisma.SortOrder;
    permanent?: Prisma.SortOrder;
};
export type RedirectMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    target?: Prisma.SortOrder;
    permanent?: Prisma.SortOrder;
};
export type RedirectMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    target?: Prisma.SortOrder;
    permanent?: Prisma.SortOrder;
};
export type RedirectCreateNestedManyWithoutTenantInput = {
    create?: Prisma.XOR<Prisma.RedirectCreateWithoutTenantInput, Prisma.RedirectUncheckedCreateWithoutTenantInput> | Prisma.RedirectCreateWithoutTenantInput[] | Prisma.RedirectUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.RedirectCreateOrConnectWithoutTenantInput | Prisma.RedirectCreateOrConnectWithoutTenantInput[];
    createMany?: Prisma.RedirectCreateManyTenantInputEnvelope;
    connect?: Prisma.RedirectWhereUniqueInput | Prisma.RedirectWhereUniqueInput[];
};
export type RedirectUncheckedCreateNestedManyWithoutTenantInput = {
    create?: Prisma.XOR<Prisma.RedirectCreateWithoutTenantInput, Prisma.RedirectUncheckedCreateWithoutTenantInput> | Prisma.RedirectCreateWithoutTenantInput[] | Prisma.RedirectUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.RedirectCreateOrConnectWithoutTenantInput | Prisma.RedirectCreateOrConnectWithoutTenantInput[];
    createMany?: Prisma.RedirectCreateManyTenantInputEnvelope;
    connect?: Prisma.RedirectWhereUniqueInput | Prisma.RedirectWhereUniqueInput[];
};
export type RedirectUpdateManyWithoutTenantNestedInput = {
    create?: Prisma.XOR<Prisma.RedirectCreateWithoutTenantInput, Prisma.RedirectUncheckedCreateWithoutTenantInput> | Prisma.RedirectCreateWithoutTenantInput[] | Prisma.RedirectUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.RedirectCreateOrConnectWithoutTenantInput | Prisma.RedirectCreateOrConnectWithoutTenantInput[];
    upsert?: Prisma.RedirectUpsertWithWhereUniqueWithoutTenantInput | Prisma.RedirectUpsertWithWhereUniqueWithoutTenantInput[];
    createMany?: Prisma.RedirectCreateManyTenantInputEnvelope;
    set?: Prisma.RedirectWhereUniqueInput | Prisma.RedirectWhereUniqueInput[];
    disconnect?: Prisma.RedirectWhereUniqueInput | Prisma.RedirectWhereUniqueInput[];
    delete?: Prisma.RedirectWhereUniqueInput | Prisma.RedirectWhereUniqueInput[];
    connect?: Prisma.RedirectWhereUniqueInput | Prisma.RedirectWhereUniqueInput[];
    update?: Prisma.RedirectUpdateWithWhereUniqueWithoutTenantInput | Prisma.RedirectUpdateWithWhereUniqueWithoutTenantInput[];
    updateMany?: Prisma.RedirectUpdateManyWithWhereWithoutTenantInput | Prisma.RedirectUpdateManyWithWhereWithoutTenantInput[];
    deleteMany?: Prisma.RedirectScalarWhereInput | Prisma.RedirectScalarWhereInput[];
};
export type RedirectUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: Prisma.XOR<Prisma.RedirectCreateWithoutTenantInput, Prisma.RedirectUncheckedCreateWithoutTenantInput> | Prisma.RedirectCreateWithoutTenantInput[] | Prisma.RedirectUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.RedirectCreateOrConnectWithoutTenantInput | Prisma.RedirectCreateOrConnectWithoutTenantInput[];
    upsert?: Prisma.RedirectUpsertWithWhereUniqueWithoutTenantInput | Prisma.RedirectUpsertWithWhereUniqueWithoutTenantInput[];
    createMany?: Prisma.RedirectCreateManyTenantInputEnvelope;
    set?: Prisma.RedirectWhereUniqueInput | Prisma.RedirectWhereUniqueInput[];
    disconnect?: Prisma.RedirectWhereUniqueInput | Prisma.RedirectWhereUniqueInput[];
    delete?: Prisma.RedirectWhereUniqueInput | Prisma.RedirectWhereUniqueInput[];
    connect?: Prisma.RedirectWhereUniqueInput | Prisma.RedirectWhereUniqueInput[];
    update?: Prisma.RedirectUpdateWithWhereUniqueWithoutTenantInput | Prisma.RedirectUpdateWithWhereUniqueWithoutTenantInput[];
    updateMany?: Prisma.RedirectUpdateManyWithWhereWithoutTenantInput | Prisma.RedirectUpdateManyWithWhereWithoutTenantInput[];
    deleteMany?: Prisma.RedirectScalarWhereInput | Prisma.RedirectScalarWhereInput[];
};
export type RedirectCreateWithoutTenantInput = {
    id?: string;
    source: string;
    target: string;
    permanent?: boolean;
};
export type RedirectUncheckedCreateWithoutTenantInput = {
    id?: string;
    source: string;
    target: string;
    permanent?: boolean;
};
export type RedirectCreateOrConnectWithoutTenantInput = {
    where: Prisma.RedirectWhereUniqueInput;
    create: Prisma.XOR<Prisma.RedirectCreateWithoutTenantInput, Prisma.RedirectUncheckedCreateWithoutTenantInput>;
};
export type RedirectCreateManyTenantInputEnvelope = {
    data: Prisma.RedirectCreateManyTenantInput | Prisma.RedirectCreateManyTenantInput[];
    skipDuplicates?: boolean;
};
export type RedirectUpsertWithWhereUniqueWithoutTenantInput = {
    where: Prisma.RedirectWhereUniqueInput;
    update: Prisma.XOR<Prisma.RedirectUpdateWithoutTenantInput, Prisma.RedirectUncheckedUpdateWithoutTenantInput>;
    create: Prisma.XOR<Prisma.RedirectCreateWithoutTenantInput, Prisma.RedirectUncheckedCreateWithoutTenantInput>;
};
export type RedirectUpdateWithWhereUniqueWithoutTenantInput = {
    where: Prisma.RedirectWhereUniqueInput;
    data: Prisma.XOR<Prisma.RedirectUpdateWithoutTenantInput, Prisma.RedirectUncheckedUpdateWithoutTenantInput>;
};
export type RedirectUpdateManyWithWhereWithoutTenantInput = {
    where: Prisma.RedirectScalarWhereInput;
    data: Prisma.XOR<Prisma.RedirectUpdateManyMutationInput, Prisma.RedirectUncheckedUpdateManyWithoutTenantInput>;
};
export type RedirectScalarWhereInput = {
    AND?: Prisma.RedirectScalarWhereInput | Prisma.RedirectScalarWhereInput[];
    OR?: Prisma.RedirectScalarWhereInput[];
    NOT?: Prisma.RedirectScalarWhereInput | Prisma.RedirectScalarWhereInput[];
    id?: Prisma.StringFilter<"Redirect"> | string;
    tenantId?: Prisma.StringFilter<"Redirect"> | string;
    source?: Prisma.StringFilter<"Redirect"> | string;
    target?: Prisma.StringFilter<"Redirect"> | string;
    permanent?: Prisma.BoolFilter<"Redirect"> | boolean;
};
export type RedirectCreateManyTenantInput = {
    id?: string;
    source: string;
    target: string;
    permanent?: boolean;
};
export type RedirectUpdateWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    target?: Prisma.StringFieldUpdateOperationsInput | string;
    permanent?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type RedirectUncheckedUpdateWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    target?: Prisma.StringFieldUpdateOperationsInput | string;
    permanent?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type RedirectUncheckedUpdateManyWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    target?: Prisma.StringFieldUpdateOperationsInput | string;
    permanent?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type RedirectSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    source?: boolean;
    target?: boolean;
    permanent?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["redirect"]>;
export type RedirectSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    source?: boolean;
    target?: boolean;
    permanent?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["redirect"]>;
export type RedirectSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    source?: boolean;
    target?: boolean;
    permanent?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["redirect"]>;
export type RedirectSelectScalar = {
    id?: boolean;
    tenantId?: boolean;
    source?: boolean;
    target?: boolean;
    permanent?: boolean;
};
export type RedirectOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "tenantId" | "source" | "target" | "permanent", ExtArgs["result"]["redirect"]>;
export type RedirectInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
};
export type RedirectIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
};
export type RedirectIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
};
export type $RedirectPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Redirect";
    objects: {
        tenant: Prisma.$TenantPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        tenantId: string;
        source: string;
        target: string;
        permanent: boolean;
    }, ExtArgs["result"]["redirect"]>;
    composites: {};
};
export type RedirectGetPayload<S extends boolean | null | undefined | RedirectDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$RedirectPayload, S>;
export type RedirectCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<RedirectFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: RedirectCountAggregateInputType | true;
};
export interface RedirectDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Redirect'];
        meta: {
            name: 'Redirect';
        };
    };
    findUnique<T extends RedirectFindUniqueArgs>(args: Prisma.SelectSubset<T, RedirectFindUniqueArgs<ExtArgs>>): Prisma.Prisma__RedirectClient<runtime.Types.Result.GetResult<Prisma.$RedirectPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends RedirectFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, RedirectFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__RedirectClient<runtime.Types.Result.GetResult<Prisma.$RedirectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends RedirectFindFirstArgs>(args?: Prisma.SelectSubset<T, RedirectFindFirstArgs<ExtArgs>>): Prisma.Prisma__RedirectClient<runtime.Types.Result.GetResult<Prisma.$RedirectPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends RedirectFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, RedirectFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__RedirectClient<runtime.Types.Result.GetResult<Prisma.$RedirectPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends RedirectFindManyArgs>(args?: Prisma.SelectSubset<T, RedirectFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RedirectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends RedirectCreateArgs>(args: Prisma.SelectSubset<T, RedirectCreateArgs<ExtArgs>>): Prisma.Prisma__RedirectClient<runtime.Types.Result.GetResult<Prisma.$RedirectPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends RedirectCreateManyArgs>(args?: Prisma.SelectSubset<T, RedirectCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends RedirectCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, RedirectCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RedirectPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends RedirectDeleteArgs>(args: Prisma.SelectSubset<T, RedirectDeleteArgs<ExtArgs>>): Prisma.Prisma__RedirectClient<runtime.Types.Result.GetResult<Prisma.$RedirectPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends RedirectUpdateArgs>(args: Prisma.SelectSubset<T, RedirectUpdateArgs<ExtArgs>>): Prisma.Prisma__RedirectClient<runtime.Types.Result.GetResult<Prisma.$RedirectPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends RedirectDeleteManyArgs>(args?: Prisma.SelectSubset<T, RedirectDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends RedirectUpdateManyArgs>(args: Prisma.SelectSubset<T, RedirectUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends RedirectUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, RedirectUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RedirectPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends RedirectUpsertArgs>(args: Prisma.SelectSubset<T, RedirectUpsertArgs<ExtArgs>>): Prisma.Prisma__RedirectClient<runtime.Types.Result.GetResult<Prisma.$RedirectPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends RedirectCountArgs>(args?: Prisma.Subset<T, RedirectCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], RedirectCountAggregateOutputType> : number>;
    aggregate<T extends RedirectAggregateArgs>(args: Prisma.Subset<T, RedirectAggregateArgs>): Prisma.PrismaPromise<GetRedirectAggregateType<T>>;
    groupBy<T extends RedirectGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: RedirectGroupByArgs['orderBy'];
    } : {
        orderBy?: RedirectGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, RedirectGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRedirectGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: RedirectFieldRefs;
}
export interface Prisma__RedirectClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    tenant<T extends Prisma.TenantDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TenantDefaultArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface RedirectFieldRefs {
    readonly id: Prisma.FieldRef<"Redirect", 'String'>;
    readonly tenantId: Prisma.FieldRef<"Redirect", 'String'>;
    readonly source: Prisma.FieldRef<"Redirect", 'String'>;
    readonly target: Prisma.FieldRef<"Redirect", 'String'>;
    readonly permanent: Prisma.FieldRef<"Redirect", 'Boolean'>;
}
export type RedirectFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RedirectSelect<ExtArgs> | null;
    omit?: Prisma.RedirectOmit<ExtArgs> | null;
    include?: Prisma.RedirectInclude<ExtArgs> | null;
    where: Prisma.RedirectWhereUniqueInput;
};
export type RedirectFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RedirectSelect<ExtArgs> | null;
    omit?: Prisma.RedirectOmit<ExtArgs> | null;
    include?: Prisma.RedirectInclude<ExtArgs> | null;
    where: Prisma.RedirectWhereUniqueInput;
};
export type RedirectFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RedirectSelect<ExtArgs> | null;
    omit?: Prisma.RedirectOmit<ExtArgs> | null;
    include?: Prisma.RedirectInclude<ExtArgs> | null;
    where?: Prisma.RedirectWhereInput;
    orderBy?: Prisma.RedirectOrderByWithRelationInput | Prisma.RedirectOrderByWithRelationInput[];
    cursor?: Prisma.RedirectWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RedirectScalarFieldEnum | Prisma.RedirectScalarFieldEnum[];
};
export type RedirectFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RedirectSelect<ExtArgs> | null;
    omit?: Prisma.RedirectOmit<ExtArgs> | null;
    include?: Prisma.RedirectInclude<ExtArgs> | null;
    where?: Prisma.RedirectWhereInput;
    orderBy?: Prisma.RedirectOrderByWithRelationInput | Prisma.RedirectOrderByWithRelationInput[];
    cursor?: Prisma.RedirectWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RedirectScalarFieldEnum | Prisma.RedirectScalarFieldEnum[];
};
export type RedirectFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RedirectSelect<ExtArgs> | null;
    omit?: Prisma.RedirectOmit<ExtArgs> | null;
    include?: Prisma.RedirectInclude<ExtArgs> | null;
    where?: Prisma.RedirectWhereInput;
    orderBy?: Prisma.RedirectOrderByWithRelationInput | Prisma.RedirectOrderByWithRelationInput[];
    cursor?: Prisma.RedirectWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RedirectScalarFieldEnum | Prisma.RedirectScalarFieldEnum[];
};
export type RedirectCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RedirectSelect<ExtArgs> | null;
    omit?: Prisma.RedirectOmit<ExtArgs> | null;
    include?: Prisma.RedirectInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RedirectCreateInput, Prisma.RedirectUncheckedCreateInput>;
};
export type RedirectCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.RedirectCreateManyInput | Prisma.RedirectCreateManyInput[];
    skipDuplicates?: boolean;
};
export type RedirectCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RedirectSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RedirectOmit<ExtArgs> | null;
    data: Prisma.RedirectCreateManyInput | Prisma.RedirectCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.RedirectIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type RedirectUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RedirectSelect<ExtArgs> | null;
    omit?: Prisma.RedirectOmit<ExtArgs> | null;
    include?: Prisma.RedirectInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RedirectUpdateInput, Prisma.RedirectUncheckedUpdateInput>;
    where: Prisma.RedirectWhereUniqueInput;
};
export type RedirectUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.RedirectUpdateManyMutationInput, Prisma.RedirectUncheckedUpdateManyInput>;
    where?: Prisma.RedirectWhereInput;
    limit?: number;
};
export type RedirectUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RedirectSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RedirectOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RedirectUpdateManyMutationInput, Prisma.RedirectUncheckedUpdateManyInput>;
    where?: Prisma.RedirectWhereInput;
    limit?: number;
    include?: Prisma.RedirectIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type RedirectUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RedirectSelect<ExtArgs> | null;
    omit?: Prisma.RedirectOmit<ExtArgs> | null;
    include?: Prisma.RedirectInclude<ExtArgs> | null;
    where: Prisma.RedirectWhereUniqueInput;
    create: Prisma.XOR<Prisma.RedirectCreateInput, Prisma.RedirectUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.RedirectUpdateInput, Prisma.RedirectUncheckedUpdateInput>;
};
export type RedirectDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RedirectSelect<ExtArgs> | null;
    omit?: Prisma.RedirectOmit<ExtArgs> | null;
    include?: Prisma.RedirectInclude<ExtArgs> | null;
    where: Prisma.RedirectWhereUniqueInput;
};
export type RedirectDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RedirectWhereInput;
    limit?: number;
};
export type RedirectDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RedirectSelect<ExtArgs> | null;
    omit?: Prisma.RedirectOmit<ExtArgs> | null;
    include?: Prisma.RedirectInclude<ExtArgs> | null;
};
