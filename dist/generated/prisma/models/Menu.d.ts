import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type MenuModel = runtime.Types.Result.DefaultSelection<Prisma.$MenuPayload>;
export type AggregateMenu = {
    _count: MenuCountAggregateOutputType | null;
    _min: MenuMinAggregateOutputType | null;
    _max: MenuMaxAggregateOutputType | null;
};
export type MenuMinAggregateOutputType = {
    id: string | null;
    tenantId: string | null;
    location: string | null;
    updatedAt: Date | null;
};
export type MenuMaxAggregateOutputType = {
    id: string | null;
    tenantId: string | null;
    location: string | null;
    updatedAt: Date | null;
};
export type MenuCountAggregateOutputType = {
    id: number;
    tenantId: number;
    location: number;
    items: number;
    updatedAt: number;
    _all: number;
};
export type MenuMinAggregateInputType = {
    id?: true;
    tenantId?: true;
    location?: true;
    updatedAt?: true;
};
export type MenuMaxAggregateInputType = {
    id?: true;
    tenantId?: true;
    location?: true;
    updatedAt?: true;
};
export type MenuCountAggregateInputType = {
    id?: true;
    tenantId?: true;
    location?: true;
    items?: true;
    updatedAt?: true;
    _all?: true;
};
export type MenuAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MenuWhereInput;
    orderBy?: Prisma.MenuOrderByWithRelationInput | Prisma.MenuOrderByWithRelationInput[];
    cursor?: Prisma.MenuWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | MenuCountAggregateInputType;
    _min?: MenuMinAggregateInputType;
    _max?: MenuMaxAggregateInputType;
};
export type GetMenuAggregateType<T extends MenuAggregateArgs> = {
    [P in keyof T & keyof AggregateMenu]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateMenu[P]> : Prisma.GetScalarType<T[P], AggregateMenu[P]>;
};
export type MenuGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MenuWhereInput;
    orderBy?: Prisma.MenuOrderByWithAggregationInput | Prisma.MenuOrderByWithAggregationInput[];
    by: Prisma.MenuScalarFieldEnum[] | Prisma.MenuScalarFieldEnum;
    having?: Prisma.MenuScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MenuCountAggregateInputType | true;
    _min?: MenuMinAggregateInputType;
    _max?: MenuMaxAggregateInputType;
};
export type MenuGroupByOutputType = {
    id: string;
    tenantId: string;
    location: string;
    items: runtime.JsonValue;
    updatedAt: Date;
    _count: MenuCountAggregateOutputType | null;
    _min: MenuMinAggregateOutputType | null;
    _max: MenuMaxAggregateOutputType | null;
};
export type GetMenuGroupByPayload<T extends MenuGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<MenuGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof MenuGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], MenuGroupByOutputType[P]> : Prisma.GetScalarType<T[P], MenuGroupByOutputType[P]>;
}>>;
export type MenuWhereInput = {
    AND?: Prisma.MenuWhereInput | Prisma.MenuWhereInput[];
    OR?: Prisma.MenuWhereInput[];
    NOT?: Prisma.MenuWhereInput | Prisma.MenuWhereInput[];
    id?: Prisma.StringFilter<"Menu"> | string;
    tenantId?: Prisma.StringFilter<"Menu"> | string;
    location?: Prisma.StringFilter<"Menu"> | string;
    items?: Prisma.JsonFilter<"Menu">;
    updatedAt?: Prisma.DateTimeFilter<"Menu"> | Date | string;
    tenant?: Prisma.XOR<Prisma.TenantScalarRelationFilter, Prisma.TenantWhereInput>;
};
export type MenuOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    location?: Prisma.SortOrder;
    items?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    tenant?: Prisma.TenantOrderByWithRelationInput;
};
export type MenuWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    tenantId_location?: Prisma.MenuTenantIdLocationCompoundUniqueInput;
    AND?: Prisma.MenuWhereInput | Prisma.MenuWhereInput[];
    OR?: Prisma.MenuWhereInput[];
    NOT?: Prisma.MenuWhereInput | Prisma.MenuWhereInput[];
    tenantId?: Prisma.StringFilter<"Menu"> | string;
    location?: Prisma.StringFilter<"Menu"> | string;
    items?: Prisma.JsonFilter<"Menu">;
    updatedAt?: Prisma.DateTimeFilter<"Menu"> | Date | string;
    tenant?: Prisma.XOR<Prisma.TenantScalarRelationFilter, Prisma.TenantWhereInput>;
}, "id" | "tenantId_location">;
export type MenuOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    location?: Prisma.SortOrder;
    items?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.MenuCountOrderByAggregateInput;
    _max?: Prisma.MenuMaxOrderByAggregateInput;
    _min?: Prisma.MenuMinOrderByAggregateInput;
};
export type MenuScalarWhereWithAggregatesInput = {
    AND?: Prisma.MenuScalarWhereWithAggregatesInput | Prisma.MenuScalarWhereWithAggregatesInput[];
    OR?: Prisma.MenuScalarWhereWithAggregatesInput[];
    NOT?: Prisma.MenuScalarWhereWithAggregatesInput | Prisma.MenuScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Menu"> | string;
    tenantId?: Prisma.StringWithAggregatesFilter<"Menu"> | string;
    location?: Prisma.StringWithAggregatesFilter<"Menu"> | string;
    items?: Prisma.JsonWithAggregatesFilter<"Menu">;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Menu"> | Date | string;
};
export type MenuCreateInput = {
    id?: string;
    location: string;
    items?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    updatedAt?: Date | string;
    tenant: Prisma.TenantCreateNestedOneWithoutMenusInput;
};
export type MenuUncheckedCreateInput = {
    id?: string;
    tenantId: string;
    location: string;
    items?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    updatedAt?: Date | string;
};
export type MenuUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    location?: Prisma.StringFieldUpdateOperationsInput | string;
    items?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tenant?: Prisma.TenantUpdateOneRequiredWithoutMenusNestedInput;
};
export type MenuUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    location?: Prisma.StringFieldUpdateOperationsInput | string;
    items?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MenuCreateManyInput = {
    id?: string;
    tenantId: string;
    location: string;
    items?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    updatedAt?: Date | string;
};
export type MenuUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    location?: Prisma.StringFieldUpdateOperationsInput | string;
    items?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MenuUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    location?: Prisma.StringFieldUpdateOperationsInput | string;
    items?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MenuListRelationFilter = {
    every?: Prisma.MenuWhereInput;
    some?: Prisma.MenuWhereInput;
    none?: Prisma.MenuWhereInput;
};
export type MenuOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type MenuTenantIdLocationCompoundUniqueInput = {
    tenantId: string;
    location: string;
};
export type MenuCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    location?: Prisma.SortOrder;
    items?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type MenuMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    location?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type MenuMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    location?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type MenuCreateNestedManyWithoutTenantInput = {
    create?: Prisma.XOR<Prisma.MenuCreateWithoutTenantInput, Prisma.MenuUncheckedCreateWithoutTenantInput> | Prisma.MenuCreateWithoutTenantInput[] | Prisma.MenuUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.MenuCreateOrConnectWithoutTenantInput | Prisma.MenuCreateOrConnectWithoutTenantInput[];
    createMany?: Prisma.MenuCreateManyTenantInputEnvelope;
    connect?: Prisma.MenuWhereUniqueInput | Prisma.MenuWhereUniqueInput[];
};
export type MenuUncheckedCreateNestedManyWithoutTenantInput = {
    create?: Prisma.XOR<Prisma.MenuCreateWithoutTenantInput, Prisma.MenuUncheckedCreateWithoutTenantInput> | Prisma.MenuCreateWithoutTenantInput[] | Prisma.MenuUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.MenuCreateOrConnectWithoutTenantInput | Prisma.MenuCreateOrConnectWithoutTenantInput[];
    createMany?: Prisma.MenuCreateManyTenantInputEnvelope;
    connect?: Prisma.MenuWhereUniqueInput | Prisma.MenuWhereUniqueInput[];
};
export type MenuUpdateManyWithoutTenantNestedInput = {
    create?: Prisma.XOR<Prisma.MenuCreateWithoutTenantInput, Prisma.MenuUncheckedCreateWithoutTenantInput> | Prisma.MenuCreateWithoutTenantInput[] | Prisma.MenuUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.MenuCreateOrConnectWithoutTenantInput | Prisma.MenuCreateOrConnectWithoutTenantInput[];
    upsert?: Prisma.MenuUpsertWithWhereUniqueWithoutTenantInput | Prisma.MenuUpsertWithWhereUniqueWithoutTenantInput[];
    createMany?: Prisma.MenuCreateManyTenantInputEnvelope;
    set?: Prisma.MenuWhereUniqueInput | Prisma.MenuWhereUniqueInput[];
    disconnect?: Prisma.MenuWhereUniqueInput | Prisma.MenuWhereUniqueInput[];
    delete?: Prisma.MenuWhereUniqueInput | Prisma.MenuWhereUniqueInput[];
    connect?: Prisma.MenuWhereUniqueInput | Prisma.MenuWhereUniqueInput[];
    update?: Prisma.MenuUpdateWithWhereUniqueWithoutTenantInput | Prisma.MenuUpdateWithWhereUniqueWithoutTenantInput[];
    updateMany?: Prisma.MenuUpdateManyWithWhereWithoutTenantInput | Prisma.MenuUpdateManyWithWhereWithoutTenantInput[];
    deleteMany?: Prisma.MenuScalarWhereInput | Prisma.MenuScalarWhereInput[];
};
export type MenuUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: Prisma.XOR<Prisma.MenuCreateWithoutTenantInput, Prisma.MenuUncheckedCreateWithoutTenantInput> | Prisma.MenuCreateWithoutTenantInput[] | Prisma.MenuUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.MenuCreateOrConnectWithoutTenantInput | Prisma.MenuCreateOrConnectWithoutTenantInput[];
    upsert?: Prisma.MenuUpsertWithWhereUniqueWithoutTenantInput | Prisma.MenuUpsertWithWhereUniqueWithoutTenantInput[];
    createMany?: Prisma.MenuCreateManyTenantInputEnvelope;
    set?: Prisma.MenuWhereUniqueInput | Prisma.MenuWhereUniqueInput[];
    disconnect?: Prisma.MenuWhereUniqueInput | Prisma.MenuWhereUniqueInput[];
    delete?: Prisma.MenuWhereUniqueInput | Prisma.MenuWhereUniqueInput[];
    connect?: Prisma.MenuWhereUniqueInput | Prisma.MenuWhereUniqueInput[];
    update?: Prisma.MenuUpdateWithWhereUniqueWithoutTenantInput | Prisma.MenuUpdateWithWhereUniqueWithoutTenantInput[];
    updateMany?: Prisma.MenuUpdateManyWithWhereWithoutTenantInput | Prisma.MenuUpdateManyWithWhereWithoutTenantInput[];
    deleteMany?: Prisma.MenuScalarWhereInput | Prisma.MenuScalarWhereInput[];
};
export type MenuCreateWithoutTenantInput = {
    id?: string;
    location: string;
    items?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    updatedAt?: Date | string;
};
export type MenuUncheckedCreateWithoutTenantInput = {
    id?: string;
    location: string;
    items?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    updatedAt?: Date | string;
};
export type MenuCreateOrConnectWithoutTenantInput = {
    where: Prisma.MenuWhereUniqueInput;
    create: Prisma.XOR<Prisma.MenuCreateWithoutTenantInput, Prisma.MenuUncheckedCreateWithoutTenantInput>;
};
export type MenuCreateManyTenantInputEnvelope = {
    data: Prisma.MenuCreateManyTenantInput | Prisma.MenuCreateManyTenantInput[];
    skipDuplicates?: boolean;
};
export type MenuUpsertWithWhereUniqueWithoutTenantInput = {
    where: Prisma.MenuWhereUniqueInput;
    update: Prisma.XOR<Prisma.MenuUpdateWithoutTenantInput, Prisma.MenuUncheckedUpdateWithoutTenantInput>;
    create: Prisma.XOR<Prisma.MenuCreateWithoutTenantInput, Prisma.MenuUncheckedCreateWithoutTenantInput>;
};
export type MenuUpdateWithWhereUniqueWithoutTenantInput = {
    where: Prisma.MenuWhereUniqueInput;
    data: Prisma.XOR<Prisma.MenuUpdateWithoutTenantInput, Prisma.MenuUncheckedUpdateWithoutTenantInput>;
};
export type MenuUpdateManyWithWhereWithoutTenantInput = {
    where: Prisma.MenuScalarWhereInput;
    data: Prisma.XOR<Prisma.MenuUpdateManyMutationInput, Prisma.MenuUncheckedUpdateManyWithoutTenantInput>;
};
export type MenuScalarWhereInput = {
    AND?: Prisma.MenuScalarWhereInput | Prisma.MenuScalarWhereInput[];
    OR?: Prisma.MenuScalarWhereInput[];
    NOT?: Prisma.MenuScalarWhereInput | Prisma.MenuScalarWhereInput[];
    id?: Prisma.StringFilter<"Menu"> | string;
    tenantId?: Prisma.StringFilter<"Menu"> | string;
    location?: Prisma.StringFilter<"Menu"> | string;
    items?: Prisma.JsonFilter<"Menu">;
    updatedAt?: Prisma.DateTimeFilter<"Menu"> | Date | string;
};
export type MenuCreateManyTenantInput = {
    id?: string;
    location: string;
    items?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    updatedAt?: Date | string;
};
export type MenuUpdateWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    location?: Prisma.StringFieldUpdateOperationsInput | string;
    items?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MenuUncheckedUpdateWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    location?: Prisma.StringFieldUpdateOperationsInput | string;
    items?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MenuUncheckedUpdateManyWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    location?: Prisma.StringFieldUpdateOperationsInput | string;
    items?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MenuSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    location?: boolean;
    items?: boolean;
    updatedAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["menu"]>;
export type MenuSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    location?: boolean;
    items?: boolean;
    updatedAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["menu"]>;
export type MenuSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    location?: boolean;
    items?: boolean;
    updatedAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["menu"]>;
export type MenuSelectScalar = {
    id?: boolean;
    tenantId?: boolean;
    location?: boolean;
    items?: boolean;
    updatedAt?: boolean;
};
export type MenuOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "tenantId" | "location" | "items" | "updatedAt", ExtArgs["result"]["menu"]>;
export type MenuInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
};
export type MenuIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
};
export type MenuIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
};
export type $MenuPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Menu";
    objects: {
        tenant: Prisma.$TenantPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        tenantId: string;
        location: string;
        items: runtime.JsonValue;
        updatedAt: Date;
    }, ExtArgs["result"]["menu"]>;
    composites: {};
};
export type MenuGetPayload<S extends boolean | null | undefined | MenuDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$MenuPayload, S>;
export type MenuCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<MenuFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: MenuCountAggregateInputType | true;
};
export interface MenuDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Menu'];
        meta: {
            name: 'Menu';
        };
    };
    findUnique<T extends MenuFindUniqueArgs>(args: Prisma.SelectSubset<T, MenuFindUniqueArgs<ExtArgs>>): Prisma.Prisma__MenuClient<runtime.Types.Result.GetResult<Prisma.$MenuPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends MenuFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, MenuFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__MenuClient<runtime.Types.Result.GetResult<Prisma.$MenuPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends MenuFindFirstArgs>(args?: Prisma.SelectSubset<T, MenuFindFirstArgs<ExtArgs>>): Prisma.Prisma__MenuClient<runtime.Types.Result.GetResult<Prisma.$MenuPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends MenuFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, MenuFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__MenuClient<runtime.Types.Result.GetResult<Prisma.$MenuPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends MenuFindManyArgs>(args?: Prisma.SelectSubset<T, MenuFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MenuPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends MenuCreateArgs>(args: Prisma.SelectSubset<T, MenuCreateArgs<ExtArgs>>): Prisma.Prisma__MenuClient<runtime.Types.Result.GetResult<Prisma.$MenuPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends MenuCreateManyArgs>(args?: Prisma.SelectSubset<T, MenuCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends MenuCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, MenuCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MenuPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends MenuDeleteArgs>(args: Prisma.SelectSubset<T, MenuDeleteArgs<ExtArgs>>): Prisma.Prisma__MenuClient<runtime.Types.Result.GetResult<Prisma.$MenuPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends MenuUpdateArgs>(args: Prisma.SelectSubset<T, MenuUpdateArgs<ExtArgs>>): Prisma.Prisma__MenuClient<runtime.Types.Result.GetResult<Prisma.$MenuPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends MenuDeleteManyArgs>(args?: Prisma.SelectSubset<T, MenuDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends MenuUpdateManyArgs>(args: Prisma.SelectSubset<T, MenuUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends MenuUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, MenuUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MenuPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends MenuUpsertArgs>(args: Prisma.SelectSubset<T, MenuUpsertArgs<ExtArgs>>): Prisma.Prisma__MenuClient<runtime.Types.Result.GetResult<Prisma.$MenuPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends MenuCountArgs>(args?: Prisma.Subset<T, MenuCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], MenuCountAggregateOutputType> : number>;
    aggregate<T extends MenuAggregateArgs>(args: Prisma.Subset<T, MenuAggregateArgs>): Prisma.PrismaPromise<GetMenuAggregateType<T>>;
    groupBy<T extends MenuGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: MenuGroupByArgs['orderBy'];
    } : {
        orderBy?: MenuGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, MenuGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMenuGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: MenuFieldRefs;
}
export interface Prisma__MenuClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    tenant<T extends Prisma.TenantDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TenantDefaultArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface MenuFieldRefs {
    readonly id: Prisma.FieldRef<"Menu", 'String'>;
    readonly tenantId: Prisma.FieldRef<"Menu", 'String'>;
    readonly location: Prisma.FieldRef<"Menu", 'String'>;
    readonly items: Prisma.FieldRef<"Menu", 'Json'>;
    readonly updatedAt: Prisma.FieldRef<"Menu", 'DateTime'>;
}
export type MenuFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MenuSelect<ExtArgs> | null;
    omit?: Prisma.MenuOmit<ExtArgs> | null;
    include?: Prisma.MenuInclude<ExtArgs> | null;
    where: Prisma.MenuWhereUniqueInput;
};
export type MenuFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MenuSelect<ExtArgs> | null;
    omit?: Prisma.MenuOmit<ExtArgs> | null;
    include?: Prisma.MenuInclude<ExtArgs> | null;
    where: Prisma.MenuWhereUniqueInput;
};
export type MenuFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MenuSelect<ExtArgs> | null;
    omit?: Prisma.MenuOmit<ExtArgs> | null;
    include?: Prisma.MenuInclude<ExtArgs> | null;
    where?: Prisma.MenuWhereInput;
    orderBy?: Prisma.MenuOrderByWithRelationInput | Prisma.MenuOrderByWithRelationInput[];
    cursor?: Prisma.MenuWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MenuScalarFieldEnum | Prisma.MenuScalarFieldEnum[];
};
export type MenuFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MenuSelect<ExtArgs> | null;
    omit?: Prisma.MenuOmit<ExtArgs> | null;
    include?: Prisma.MenuInclude<ExtArgs> | null;
    where?: Prisma.MenuWhereInput;
    orderBy?: Prisma.MenuOrderByWithRelationInput | Prisma.MenuOrderByWithRelationInput[];
    cursor?: Prisma.MenuWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MenuScalarFieldEnum | Prisma.MenuScalarFieldEnum[];
};
export type MenuFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MenuSelect<ExtArgs> | null;
    omit?: Prisma.MenuOmit<ExtArgs> | null;
    include?: Prisma.MenuInclude<ExtArgs> | null;
    where?: Prisma.MenuWhereInput;
    orderBy?: Prisma.MenuOrderByWithRelationInput | Prisma.MenuOrderByWithRelationInput[];
    cursor?: Prisma.MenuWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MenuScalarFieldEnum | Prisma.MenuScalarFieldEnum[];
};
export type MenuCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MenuSelect<ExtArgs> | null;
    omit?: Prisma.MenuOmit<ExtArgs> | null;
    include?: Prisma.MenuInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MenuCreateInput, Prisma.MenuUncheckedCreateInput>;
};
export type MenuCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.MenuCreateManyInput | Prisma.MenuCreateManyInput[];
    skipDuplicates?: boolean;
};
export type MenuCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MenuSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.MenuOmit<ExtArgs> | null;
    data: Prisma.MenuCreateManyInput | Prisma.MenuCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.MenuIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type MenuUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MenuSelect<ExtArgs> | null;
    omit?: Prisma.MenuOmit<ExtArgs> | null;
    include?: Prisma.MenuInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MenuUpdateInput, Prisma.MenuUncheckedUpdateInput>;
    where: Prisma.MenuWhereUniqueInput;
};
export type MenuUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.MenuUpdateManyMutationInput, Prisma.MenuUncheckedUpdateManyInput>;
    where?: Prisma.MenuWhereInput;
    limit?: number;
};
export type MenuUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MenuSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.MenuOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MenuUpdateManyMutationInput, Prisma.MenuUncheckedUpdateManyInput>;
    where?: Prisma.MenuWhereInput;
    limit?: number;
    include?: Prisma.MenuIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type MenuUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MenuSelect<ExtArgs> | null;
    omit?: Prisma.MenuOmit<ExtArgs> | null;
    include?: Prisma.MenuInclude<ExtArgs> | null;
    where: Prisma.MenuWhereUniqueInput;
    create: Prisma.XOR<Prisma.MenuCreateInput, Prisma.MenuUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.MenuUpdateInput, Prisma.MenuUncheckedUpdateInput>;
};
export type MenuDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MenuSelect<ExtArgs> | null;
    omit?: Prisma.MenuOmit<ExtArgs> | null;
    include?: Prisma.MenuInclude<ExtArgs> | null;
    where: Prisma.MenuWhereUniqueInput;
};
export type MenuDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MenuWhereInput;
    limit?: number;
};
export type MenuDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MenuSelect<ExtArgs> | null;
    omit?: Prisma.MenuOmit<ExtArgs> | null;
    include?: Prisma.MenuInclude<ExtArgs> | null;
};
