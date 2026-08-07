import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type WidgetModel = runtime.Types.Result.DefaultSelection<Prisma.$WidgetPayload>;
export type AggregateWidget = {
    _count: WidgetCountAggregateOutputType | null;
    _avg: WidgetAvgAggregateOutputType | null;
    _sum: WidgetSumAggregateOutputType | null;
    _min: WidgetMinAggregateOutputType | null;
    _max: WidgetMaxAggregateOutputType | null;
};
export type WidgetAvgAggregateOutputType = {
    sortOrder: number | null;
};
export type WidgetSumAggregateOutputType = {
    sortOrder: number | null;
};
export type WidgetMinAggregateOutputType = {
    id: string | null;
    tenantId: string | null;
    type: string | null;
    active: boolean | null;
    sortOrder: number | null;
    cachedAt: Date | null;
};
export type WidgetMaxAggregateOutputType = {
    id: string | null;
    tenantId: string | null;
    type: string | null;
    active: boolean | null;
    sortOrder: number | null;
    cachedAt: Date | null;
};
export type WidgetCountAggregateOutputType = {
    id: number;
    tenantId: number;
    type: number;
    config: number;
    active: number;
    sortOrder: number;
    cache: number;
    cachedAt: number;
    _all: number;
};
export type WidgetAvgAggregateInputType = {
    sortOrder?: true;
};
export type WidgetSumAggregateInputType = {
    sortOrder?: true;
};
export type WidgetMinAggregateInputType = {
    id?: true;
    tenantId?: true;
    type?: true;
    active?: true;
    sortOrder?: true;
    cachedAt?: true;
};
export type WidgetMaxAggregateInputType = {
    id?: true;
    tenantId?: true;
    type?: true;
    active?: true;
    sortOrder?: true;
    cachedAt?: true;
};
export type WidgetCountAggregateInputType = {
    id?: true;
    tenantId?: true;
    type?: true;
    config?: true;
    active?: true;
    sortOrder?: true;
    cache?: true;
    cachedAt?: true;
    _all?: true;
};
export type WidgetAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WidgetWhereInput;
    orderBy?: Prisma.WidgetOrderByWithRelationInput | Prisma.WidgetOrderByWithRelationInput[];
    cursor?: Prisma.WidgetWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | WidgetCountAggregateInputType;
    _avg?: WidgetAvgAggregateInputType;
    _sum?: WidgetSumAggregateInputType;
    _min?: WidgetMinAggregateInputType;
    _max?: WidgetMaxAggregateInputType;
};
export type GetWidgetAggregateType<T extends WidgetAggregateArgs> = {
    [P in keyof T & keyof AggregateWidget]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateWidget[P]> : Prisma.GetScalarType<T[P], AggregateWidget[P]>;
};
export type WidgetGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WidgetWhereInput;
    orderBy?: Prisma.WidgetOrderByWithAggregationInput | Prisma.WidgetOrderByWithAggregationInput[];
    by: Prisma.WidgetScalarFieldEnum[] | Prisma.WidgetScalarFieldEnum;
    having?: Prisma.WidgetScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: WidgetCountAggregateInputType | true;
    _avg?: WidgetAvgAggregateInputType;
    _sum?: WidgetSumAggregateInputType;
    _min?: WidgetMinAggregateInputType;
    _max?: WidgetMaxAggregateInputType;
};
export type WidgetGroupByOutputType = {
    id: string;
    tenantId: string;
    type: string;
    config: runtime.JsonValue;
    active: boolean;
    sortOrder: number;
    cache: runtime.JsonValue | null;
    cachedAt: Date | null;
    _count: WidgetCountAggregateOutputType | null;
    _avg: WidgetAvgAggregateOutputType | null;
    _sum: WidgetSumAggregateOutputType | null;
    _min: WidgetMinAggregateOutputType | null;
    _max: WidgetMaxAggregateOutputType | null;
};
export type GetWidgetGroupByPayload<T extends WidgetGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<WidgetGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof WidgetGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], WidgetGroupByOutputType[P]> : Prisma.GetScalarType<T[P], WidgetGroupByOutputType[P]>;
}>>;
export type WidgetWhereInput = {
    AND?: Prisma.WidgetWhereInput | Prisma.WidgetWhereInput[];
    OR?: Prisma.WidgetWhereInput[];
    NOT?: Prisma.WidgetWhereInput | Prisma.WidgetWhereInput[];
    id?: Prisma.StringFilter<"Widget"> | string;
    tenantId?: Prisma.StringFilter<"Widget"> | string;
    type?: Prisma.StringFilter<"Widget"> | string;
    config?: Prisma.JsonFilter<"Widget">;
    active?: Prisma.BoolFilter<"Widget"> | boolean;
    sortOrder?: Prisma.IntFilter<"Widget"> | number;
    cache?: Prisma.JsonNullableFilter<"Widget">;
    cachedAt?: Prisma.DateTimeNullableFilter<"Widget"> | Date | string | null;
    tenant?: Prisma.XOR<Prisma.TenantScalarRelationFilter, Prisma.TenantWhereInput>;
};
export type WidgetOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    config?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    cache?: Prisma.SortOrderInput | Prisma.SortOrder;
    cachedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    tenant?: Prisma.TenantOrderByWithRelationInput;
};
export type WidgetWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    tenantId_type?: Prisma.WidgetTenantIdTypeCompoundUniqueInput;
    AND?: Prisma.WidgetWhereInput | Prisma.WidgetWhereInput[];
    OR?: Prisma.WidgetWhereInput[];
    NOT?: Prisma.WidgetWhereInput | Prisma.WidgetWhereInput[];
    tenantId?: Prisma.StringFilter<"Widget"> | string;
    type?: Prisma.StringFilter<"Widget"> | string;
    config?: Prisma.JsonFilter<"Widget">;
    active?: Prisma.BoolFilter<"Widget"> | boolean;
    sortOrder?: Prisma.IntFilter<"Widget"> | number;
    cache?: Prisma.JsonNullableFilter<"Widget">;
    cachedAt?: Prisma.DateTimeNullableFilter<"Widget"> | Date | string | null;
    tenant?: Prisma.XOR<Prisma.TenantScalarRelationFilter, Prisma.TenantWhereInput>;
}, "id" | "tenantId_type">;
export type WidgetOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    config?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    cache?: Prisma.SortOrderInput | Prisma.SortOrder;
    cachedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.WidgetCountOrderByAggregateInput;
    _avg?: Prisma.WidgetAvgOrderByAggregateInput;
    _max?: Prisma.WidgetMaxOrderByAggregateInput;
    _min?: Prisma.WidgetMinOrderByAggregateInput;
    _sum?: Prisma.WidgetSumOrderByAggregateInput;
};
export type WidgetScalarWhereWithAggregatesInput = {
    AND?: Prisma.WidgetScalarWhereWithAggregatesInput | Prisma.WidgetScalarWhereWithAggregatesInput[];
    OR?: Prisma.WidgetScalarWhereWithAggregatesInput[];
    NOT?: Prisma.WidgetScalarWhereWithAggregatesInput | Prisma.WidgetScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Widget"> | string;
    tenantId?: Prisma.StringWithAggregatesFilter<"Widget"> | string;
    type?: Prisma.StringWithAggregatesFilter<"Widget"> | string;
    config?: Prisma.JsonWithAggregatesFilter<"Widget">;
    active?: Prisma.BoolWithAggregatesFilter<"Widget"> | boolean;
    sortOrder?: Prisma.IntWithAggregatesFilter<"Widget"> | number;
    cache?: Prisma.JsonNullableWithAggregatesFilter<"Widget">;
    cachedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"Widget"> | Date | string | null;
};
export type WidgetCreateInput = {
    id?: string;
    type: string;
    config?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    active?: boolean;
    sortOrder?: number;
    cache?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    cachedAt?: Date | string | null;
    tenant: Prisma.TenantCreateNestedOneWithoutWidgetsInput;
};
export type WidgetUncheckedCreateInput = {
    id?: string;
    tenantId: string;
    type: string;
    config?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    active?: boolean;
    sortOrder?: number;
    cache?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    cachedAt?: Date | string | null;
};
export type WidgetUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    config?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    cache?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    cachedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    tenant?: Prisma.TenantUpdateOneRequiredWithoutWidgetsNestedInput;
};
export type WidgetUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    config?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    cache?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    cachedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type WidgetCreateManyInput = {
    id?: string;
    tenantId: string;
    type: string;
    config?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    active?: boolean;
    sortOrder?: number;
    cache?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    cachedAt?: Date | string | null;
};
export type WidgetUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    config?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    cache?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    cachedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type WidgetUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    config?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    cache?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    cachedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type WidgetListRelationFilter = {
    every?: Prisma.WidgetWhereInput;
    some?: Prisma.WidgetWhereInput;
    none?: Prisma.WidgetWhereInput;
};
export type WidgetOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type WidgetTenantIdTypeCompoundUniqueInput = {
    tenantId: string;
    type: string;
};
export type WidgetCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    config?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    cache?: Prisma.SortOrder;
    cachedAt?: Prisma.SortOrder;
};
export type WidgetAvgOrderByAggregateInput = {
    sortOrder?: Prisma.SortOrder;
};
export type WidgetMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    cachedAt?: Prisma.SortOrder;
};
export type WidgetMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    sortOrder?: Prisma.SortOrder;
    cachedAt?: Prisma.SortOrder;
};
export type WidgetSumOrderByAggregateInput = {
    sortOrder?: Prisma.SortOrder;
};
export type WidgetCreateNestedManyWithoutTenantInput = {
    create?: Prisma.XOR<Prisma.WidgetCreateWithoutTenantInput, Prisma.WidgetUncheckedCreateWithoutTenantInput> | Prisma.WidgetCreateWithoutTenantInput[] | Prisma.WidgetUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.WidgetCreateOrConnectWithoutTenantInput | Prisma.WidgetCreateOrConnectWithoutTenantInput[];
    createMany?: Prisma.WidgetCreateManyTenantInputEnvelope;
    connect?: Prisma.WidgetWhereUniqueInput | Prisma.WidgetWhereUniqueInput[];
};
export type WidgetUncheckedCreateNestedManyWithoutTenantInput = {
    create?: Prisma.XOR<Prisma.WidgetCreateWithoutTenantInput, Prisma.WidgetUncheckedCreateWithoutTenantInput> | Prisma.WidgetCreateWithoutTenantInput[] | Prisma.WidgetUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.WidgetCreateOrConnectWithoutTenantInput | Prisma.WidgetCreateOrConnectWithoutTenantInput[];
    createMany?: Prisma.WidgetCreateManyTenantInputEnvelope;
    connect?: Prisma.WidgetWhereUniqueInput | Prisma.WidgetWhereUniqueInput[];
};
export type WidgetUpdateManyWithoutTenantNestedInput = {
    create?: Prisma.XOR<Prisma.WidgetCreateWithoutTenantInput, Prisma.WidgetUncheckedCreateWithoutTenantInput> | Prisma.WidgetCreateWithoutTenantInput[] | Prisma.WidgetUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.WidgetCreateOrConnectWithoutTenantInput | Prisma.WidgetCreateOrConnectWithoutTenantInput[];
    upsert?: Prisma.WidgetUpsertWithWhereUniqueWithoutTenantInput | Prisma.WidgetUpsertWithWhereUniqueWithoutTenantInput[];
    createMany?: Prisma.WidgetCreateManyTenantInputEnvelope;
    set?: Prisma.WidgetWhereUniqueInput | Prisma.WidgetWhereUniqueInput[];
    disconnect?: Prisma.WidgetWhereUniqueInput | Prisma.WidgetWhereUniqueInput[];
    delete?: Prisma.WidgetWhereUniqueInput | Prisma.WidgetWhereUniqueInput[];
    connect?: Prisma.WidgetWhereUniqueInput | Prisma.WidgetWhereUniqueInput[];
    update?: Prisma.WidgetUpdateWithWhereUniqueWithoutTenantInput | Prisma.WidgetUpdateWithWhereUniqueWithoutTenantInput[];
    updateMany?: Prisma.WidgetUpdateManyWithWhereWithoutTenantInput | Prisma.WidgetUpdateManyWithWhereWithoutTenantInput[];
    deleteMany?: Prisma.WidgetScalarWhereInput | Prisma.WidgetScalarWhereInput[];
};
export type WidgetUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: Prisma.XOR<Prisma.WidgetCreateWithoutTenantInput, Prisma.WidgetUncheckedCreateWithoutTenantInput> | Prisma.WidgetCreateWithoutTenantInput[] | Prisma.WidgetUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.WidgetCreateOrConnectWithoutTenantInput | Prisma.WidgetCreateOrConnectWithoutTenantInput[];
    upsert?: Prisma.WidgetUpsertWithWhereUniqueWithoutTenantInput | Prisma.WidgetUpsertWithWhereUniqueWithoutTenantInput[];
    createMany?: Prisma.WidgetCreateManyTenantInputEnvelope;
    set?: Prisma.WidgetWhereUniqueInput | Prisma.WidgetWhereUniqueInput[];
    disconnect?: Prisma.WidgetWhereUniqueInput | Prisma.WidgetWhereUniqueInput[];
    delete?: Prisma.WidgetWhereUniqueInput | Prisma.WidgetWhereUniqueInput[];
    connect?: Prisma.WidgetWhereUniqueInput | Prisma.WidgetWhereUniqueInput[];
    update?: Prisma.WidgetUpdateWithWhereUniqueWithoutTenantInput | Prisma.WidgetUpdateWithWhereUniqueWithoutTenantInput[];
    updateMany?: Prisma.WidgetUpdateManyWithWhereWithoutTenantInput | Prisma.WidgetUpdateManyWithWhereWithoutTenantInput[];
    deleteMany?: Prisma.WidgetScalarWhereInput | Prisma.WidgetScalarWhereInput[];
};
export type WidgetCreateWithoutTenantInput = {
    id?: string;
    type: string;
    config?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    active?: boolean;
    sortOrder?: number;
    cache?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    cachedAt?: Date | string | null;
};
export type WidgetUncheckedCreateWithoutTenantInput = {
    id?: string;
    type: string;
    config?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    active?: boolean;
    sortOrder?: number;
    cache?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    cachedAt?: Date | string | null;
};
export type WidgetCreateOrConnectWithoutTenantInput = {
    where: Prisma.WidgetWhereUniqueInput;
    create: Prisma.XOR<Prisma.WidgetCreateWithoutTenantInput, Prisma.WidgetUncheckedCreateWithoutTenantInput>;
};
export type WidgetCreateManyTenantInputEnvelope = {
    data: Prisma.WidgetCreateManyTenantInput | Prisma.WidgetCreateManyTenantInput[];
    skipDuplicates?: boolean;
};
export type WidgetUpsertWithWhereUniqueWithoutTenantInput = {
    where: Prisma.WidgetWhereUniqueInput;
    update: Prisma.XOR<Prisma.WidgetUpdateWithoutTenantInput, Prisma.WidgetUncheckedUpdateWithoutTenantInput>;
    create: Prisma.XOR<Prisma.WidgetCreateWithoutTenantInput, Prisma.WidgetUncheckedCreateWithoutTenantInput>;
};
export type WidgetUpdateWithWhereUniqueWithoutTenantInput = {
    where: Prisma.WidgetWhereUniqueInput;
    data: Prisma.XOR<Prisma.WidgetUpdateWithoutTenantInput, Prisma.WidgetUncheckedUpdateWithoutTenantInput>;
};
export type WidgetUpdateManyWithWhereWithoutTenantInput = {
    where: Prisma.WidgetScalarWhereInput;
    data: Prisma.XOR<Prisma.WidgetUpdateManyMutationInput, Prisma.WidgetUncheckedUpdateManyWithoutTenantInput>;
};
export type WidgetScalarWhereInput = {
    AND?: Prisma.WidgetScalarWhereInput | Prisma.WidgetScalarWhereInput[];
    OR?: Prisma.WidgetScalarWhereInput[];
    NOT?: Prisma.WidgetScalarWhereInput | Prisma.WidgetScalarWhereInput[];
    id?: Prisma.StringFilter<"Widget"> | string;
    tenantId?: Prisma.StringFilter<"Widget"> | string;
    type?: Prisma.StringFilter<"Widget"> | string;
    config?: Prisma.JsonFilter<"Widget">;
    active?: Prisma.BoolFilter<"Widget"> | boolean;
    sortOrder?: Prisma.IntFilter<"Widget"> | number;
    cache?: Prisma.JsonNullableFilter<"Widget">;
    cachedAt?: Prisma.DateTimeNullableFilter<"Widget"> | Date | string | null;
};
export type WidgetCreateManyTenantInput = {
    id?: string;
    type: string;
    config?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    active?: boolean;
    sortOrder?: number;
    cache?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    cachedAt?: Date | string | null;
};
export type WidgetUpdateWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    config?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    cache?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    cachedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type WidgetUncheckedUpdateWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    config?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    cache?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    cachedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type WidgetUncheckedUpdateManyWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    config?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    sortOrder?: Prisma.IntFieldUpdateOperationsInput | number;
    cache?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    cachedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type WidgetSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    type?: boolean;
    config?: boolean;
    active?: boolean;
    sortOrder?: boolean;
    cache?: boolean;
    cachedAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["widget"]>;
export type WidgetSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    type?: boolean;
    config?: boolean;
    active?: boolean;
    sortOrder?: boolean;
    cache?: boolean;
    cachedAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["widget"]>;
export type WidgetSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    type?: boolean;
    config?: boolean;
    active?: boolean;
    sortOrder?: boolean;
    cache?: boolean;
    cachedAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["widget"]>;
export type WidgetSelectScalar = {
    id?: boolean;
    tenantId?: boolean;
    type?: boolean;
    config?: boolean;
    active?: boolean;
    sortOrder?: boolean;
    cache?: boolean;
    cachedAt?: boolean;
};
export type WidgetOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "tenantId" | "type" | "config" | "active" | "sortOrder" | "cache" | "cachedAt", ExtArgs["result"]["widget"]>;
export type WidgetInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
};
export type WidgetIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
};
export type WidgetIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
};
export type $WidgetPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Widget";
    objects: {
        tenant: Prisma.$TenantPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        tenantId: string;
        type: string;
        config: runtime.JsonValue;
        active: boolean;
        sortOrder: number;
        cache: runtime.JsonValue | null;
        cachedAt: Date | null;
    }, ExtArgs["result"]["widget"]>;
    composites: {};
};
export type WidgetGetPayload<S extends boolean | null | undefined | WidgetDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$WidgetPayload, S>;
export type WidgetCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<WidgetFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: WidgetCountAggregateInputType | true;
};
export interface WidgetDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Widget'];
        meta: {
            name: 'Widget';
        };
    };
    findUnique<T extends WidgetFindUniqueArgs>(args: Prisma.SelectSubset<T, WidgetFindUniqueArgs<ExtArgs>>): Prisma.Prisma__WidgetClient<runtime.Types.Result.GetResult<Prisma.$WidgetPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends WidgetFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, WidgetFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__WidgetClient<runtime.Types.Result.GetResult<Prisma.$WidgetPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends WidgetFindFirstArgs>(args?: Prisma.SelectSubset<T, WidgetFindFirstArgs<ExtArgs>>): Prisma.Prisma__WidgetClient<runtime.Types.Result.GetResult<Prisma.$WidgetPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends WidgetFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, WidgetFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__WidgetClient<runtime.Types.Result.GetResult<Prisma.$WidgetPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends WidgetFindManyArgs>(args?: Prisma.SelectSubset<T, WidgetFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WidgetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends WidgetCreateArgs>(args: Prisma.SelectSubset<T, WidgetCreateArgs<ExtArgs>>): Prisma.Prisma__WidgetClient<runtime.Types.Result.GetResult<Prisma.$WidgetPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends WidgetCreateManyArgs>(args?: Prisma.SelectSubset<T, WidgetCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends WidgetCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, WidgetCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WidgetPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends WidgetDeleteArgs>(args: Prisma.SelectSubset<T, WidgetDeleteArgs<ExtArgs>>): Prisma.Prisma__WidgetClient<runtime.Types.Result.GetResult<Prisma.$WidgetPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends WidgetUpdateArgs>(args: Prisma.SelectSubset<T, WidgetUpdateArgs<ExtArgs>>): Prisma.Prisma__WidgetClient<runtime.Types.Result.GetResult<Prisma.$WidgetPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends WidgetDeleteManyArgs>(args?: Prisma.SelectSubset<T, WidgetDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends WidgetUpdateManyArgs>(args: Prisma.SelectSubset<T, WidgetUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends WidgetUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, WidgetUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WidgetPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends WidgetUpsertArgs>(args: Prisma.SelectSubset<T, WidgetUpsertArgs<ExtArgs>>): Prisma.Prisma__WidgetClient<runtime.Types.Result.GetResult<Prisma.$WidgetPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends WidgetCountArgs>(args?: Prisma.Subset<T, WidgetCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], WidgetCountAggregateOutputType> : number>;
    aggregate<T extends WidgetAggregateArgs>(args: Prisma.Subset<T, WidgetAggregateArgs>): Prisma.PrismaPromise<GetWidgetAggregateType<T>>;
    groupBy<T extends WidgetGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: WidgetGroupByArgs['orderBy'];
    } : {
        orderBy?: WidgetGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, WidgetGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWidgetGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: WidgetFieldRefs;
}
export interface Prisma__WidgetClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    tenant<T extends Prisma.TenantDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TenantDefaultArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface WidgetFieldRefs {
    readonly id: Prisma.FieldRef<"Widget", 'String'>;
    readonly tenantId: Prisma.FieldRef<"Widget", 'String'>;
    readonly type: Prisma.FieldRef<"Widget", 'String'>;
    readonly config: Prisma.FieldRef<"Widget", 'Json'>;
    readonly active: Prisma.FieldRef<"Widget", 'Boolean'>;
    readonly sortOrder: Prisma.FieldRef<"Widget", 'Int'>;
    readonly cache: Prisma.FieldRef<"Widget", 'Json'>;
    readonly cachedAt: Prisma.FieldRef<"Widget", 'DateTime'>;
}
export type WidgetFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WidgetSelect<ExtArgs> | null;
    omit?: Prisma.WidgetOmit<ExtArgs> | null;
    include?: Prisma.WidgetInclude<ExtArgs> | null;
    where: Prisma.WidgetWhereUniqueInput;
};
export type WidgetFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WidgetSelect<ExtArgs> | null;
    omit?: Prisma.WidgetOmit<ExtArgs> | null;
    include?: Prisma.WidgetInclude<ExtArgs> | null;
    where: Prisma.WidgetWhereUniqueInput;
};
export type WidgetFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WidgetSelect<ExtArgs> | null;
    omit?: Prisma.WidgetOmit<ExtArgs> | null;
    include?: Prisma.WidgetInclude<ExtArgs> | null;
    where?: Prisma.WidgetWhereInput;
    orderBy?: Prisma.WidgetOrderByWithRelationInput | Prisma.WidgetOrderByWithRelationInput[];
    cursor?: Prisma.WidgetWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WidgetScalarFieldEnum | Prisma.WidgetScalarFieldEnum[];
};
export type WidgetFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WidgetSelect<ExtArgs> | null;
    omit?: Prisma.WidgetOmit<ExtArgs> | null;
    include?: Prisma.WidgetInclude<ExtArgs> | null;
    where?: Prisma.WidgetWhereInput;
    orderBy?: Prisma.WidgetOrderByWithRelationInput | Prisma.WidgetOrderByWithRelationInput[];
    cursor?: Prisma.WidgetWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WidgetScalarFieldEnum | Prisma.WidgetScalarFieldEnum[];
};
export type WidgetFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WidgetSelect<ExtArgs> | null;
    omit?: Prisma.WidgetOmit<ExtArgs> | null;
    include?: Prisma.WidgetInclude<ExtArgs> | null;
    where?: Prisma.WidgetWhereInput;
    orderBy?: Prisma.WidgetOrderByWithRelationInput | Prisma.WidgetOrderByWithRelationInput[];
    cursor?: Prisma.WidgetWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WidgetScalarFieldEnum | Prisma.WidgetScalarFieldEnum[];
};
export type WidgetCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WidgetSelect<ExtArgs> | null;
    omit?: Prisma.WidgetOmit<ExtArgs> | null;
    include?: Prisma.WidgetInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WidgetCreateInput, Prisma.WidgetUncheckedCreateInput>;
};
export type WidgetCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.WidgetCreateManyInput | Prisma.WidgetCreateManyInput[];
    skipDuplicates?: boolean;
};
export type WidgetCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WidgetSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.WidgetOmit<ExtArgs> | null;
    data: Prisma.WidgetCreateManyInput | Prisma.WidgetCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.WidgetIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type WidgetUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WidgetSelect<ExtArgs> | null;
    omit?: Prisma.WidgetOmit<ExtArgs> | null;
    include?: Prisma.WidgetInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WidgetUpdateInput, Prisma.WidgetUncheckedUpdateInput>;
    where: Prisma.WidgetWhereUniqueInput;
};
export type WidgetUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.WidgetUpdateManyMutationInput, Prisma.WidgetUncheckedUpdateManyInput>;
    where?: Prisma.WidgetWhereInput;
    limit?: number;
};
export type WidgetUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WidgetSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.WidgetOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WidgetUpdateManyMutationInput, Prisma.WidgetUncheckedUpdateManyInput>;
    where?: Prisma.WidgetWhereInput;
    limit?: number;
    include?: Prisma.WidgetIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type WidgetUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WidgetSelect<ExtArgs> | null;
    omit?: Prisma.WidgetOmit<ExtArgs> | null;
    include?: Prisma.WidgetInclude<ExtArgs> | null;
    where: Prisma.WidgetWhereUniqueInput;
    create: Prisma.XOR<Prisma.WidgetCreateInput, Prisma.WidgetUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.WidgetUpdateInput, Prisma.WidgetUncheckedUpdateInput>;
};
export type WidgetDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WidgetSelect<ExtArgs> | null;
    omit?: Prisma.WidgetOmit<ExtArgs> | null;
    include?: Prisma.WidgetInclude<ExtArgs> | null;
    where: Prisma.WidgetWhereUniqueInput;
};
export type WidgetDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WidgetWhereInput;
    limit?: number;
};
export type WidgetDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WidgetSelect<ExtArgs> | null;
    omit?: Prisma.WidgetOmit<ExtArgs> | null;
    include?: Prisma.WidgetInclude<ExtArgs> | null;
};
