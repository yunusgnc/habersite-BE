import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type PopupModel = runtime.Types.Result.DefaultSelection<Prisma.$PopupPayload>;
export type AggregatePopup = {
    _count: PopupCountAggregateOutputType | null;
    _avg: PopupAvgAggregateOutputType | null;
    _sum: PopupSumAggregateOutputType | null;
    _min: PopupMinAggregateOutputType | null;
    _max: PopupMaxAggregateOutputType | null;
};
export type PopupAvgAggregateOutputType = {
    delayMs: number | null;
};
export type PopupSumAggregateOutputType = {
    delayMs: number | null;
};
export type PopupMinAggregateOutputType = {
    id: string | null;
    tenantId: string | null;
    title: string | null;
    content: string | null;
    imageUrl: string | null;
    targetUrl: string | null;
    trigger: string | null;
    delayMs: number | null;
    active: boolean | null;
    startsAt: Date | null;
    endsAt: Date | null;
    createdAt: Date | null;
};
export type PopupMaxAggregateOutputType = {
    id: string | null;
    tenantId: string | null;
    title: string | null;
    content: string | null;
    imageUrl: string | null;
    targetUrl: string | null;
    trigger: string | null;
    delayMs: number | null;
    active: boolean | null;
    startsAt: Date | null;
    endsAt: Date | null;
    createdAt: Date | null;
};
export type PopupCountAggregateOutputType = {
    id: number;
    tenantId: number;
    title: number;
    content: number;
    imageUrl: number;
    targetUrl: number;
    trigger: number;
    delayMs: number;
    active: number;
    startsAt: number;
    endsAt: number;
    createdAt: number;
    _all: number;
};
export type PopupAvgAggregateInputType = {
    delayMs?: true;
};
export type PopupSumAggregateInputType = {
    delayMs?: true;
};
export type PopupMinAggregateInputType = {
    id?: true;
    tenantId?: true;
    title?: true;
    content?: true;
    imageUrl?: true;
    targetUrl?: true;
    trigger?: true;
    delayMs?: true;
    active?: true;
    startsAt?: true;
    endsAt?: true;
    createdAt?: true;
};
export type PopupMaxAggregateInputType = {
    id?: true;
    tenantId?: true;
    title?: true;
    content?: true;
    imageUrl?: true;
    targetUrl?: true;
    trigger?: true;
    delayMs?: true;
    active?: true;
    startsAt?: true;
    endsAt?: true;
    createdAt?: true;
};
export type PopupCountAggregateInputType = {
    id?: true;
    tenantId?: true;
    title?: true;
    content?: true;
    imageUrl?: true;
    targetUrl?: true;
    trigger?: true;
    delayMs?: true;
    active?: true;
    startsAt?: true;
    endsAt?: true;
    createdAt?: true;
    _all?: true;
};
export type PopupAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PopupWhereInput;
    orderBy?: Prisma.PopupOrderByWithRelationInput | Prisma.PopupOrderByWithRelationInput[];
    cursor?: Prisma.PopupWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PopupCountAggregateInputType;
    _avg?: PopupAvgAggregateInputType;
    _sum?: PopupSumAggregateInputType;
    _min?: PopupMinAggregateInputType;
    _max?: PopupMaxAggregateInputType;
};
export type GetPopupAggregateType<T extends PopupAggregateArgs> = {
    [P in keyof T & keyof AggregatePopup]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePopup[P]> : Prisma.GetScalarType<T[P], AggregatePopup[P]>;
};
export type PopupGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PopupWhereInput;
    orderBy?: Prisma.PopupOrderByWithAggregationInput | Prisma.PopupOrderByWithAggregationInput[];
    by: Prisma.PopupScalarFieldEnum[] | Prisma.PopupScalarFieldEnum;
    having?: Prisma.PopupScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PopupCountAggregateInputType | true;
    _avg?: PopupAvgAggregateInputType;
    _sum?: PopupSumAggregateInputType;
    _min?: PopupMinAggregateInputType;
    _max?: PopupMaxAggregateInputType;
};
export type PopupGroupByOutputType = {
    id: string;
    tenantId: string;
    title: string;
    content: string | null;
    imageUrl: string | null;
    targetUrl: string | null;
    trigger: string;
    delayMs: number;
    active: boolean;
    startsAt: Date | null;
    endsAt: Date | null;
    createdAt: Date;
    _count: PopupCountAggregateOutputType | null;
    _avg: PopupAvgAggregateOutputType | null;
    _sum: PopupSumAggregateOutputType | null;
    _min: PopupMinAggregateOutputType | null;
    _max: PopupMaxAggregateOutputType | null;
};
export type GetPopupGroupByPayload<T extends PopupGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PopupGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PopupGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PopupGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PopupGroupByOutputType[P]>;
}>>;
export type PopupWhereInput = {
    AND?: Prisma.PopupWhereInput | Prisma.PopupWhereInput[];
    OR?: Prisma.PopupWhereInput[];
    NOT?: Prisma.PopupWhereInput | Prisma.PopupWhereInput[];
    id?: Prisma.StringFilter<"Popup"> | string;
    tenantId?: Prisma.StringFilter<"Popup"> | string;
    title?: Prisma.StringFilter<"Popup"> | string;
    content?: Prisma.StringNullableFilter<"Popup"> | string | null;
    imageUrl?: Prisma.StringNullableFilter<"Popup"> | string | null;
    targetUrl?: Prisma.StringNullableFilter<"Popup"> | string | null;
    trigger?: Prisma.StringFilter<"Popup"> | string;
    delayMs?: Prisma.IntFilter<"Popup"> | number;
    active?: Prisma.BoolFilter<"Popup"> | boolean;
    startsAt?: Prisma.DateTimeNullableFilter<"Popup"> | Date | string | null;
    endsAt?: Prisma.DateTimeNullableFilter<"Popup"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"Popup"> | Date | string;
    tenant?: Prisma.XOR<Prisma.TenantScalarRelationFilter, Prisma.TenantWhereInput>;
};
export type PopupOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    content?: Prisma.SortOrderInput | Prisma.SortOrder;
    imageUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    targetUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    trigger?: Prisma.SortOrder;
    delayMs?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    startsAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    endsAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    tenant?: Prisma.TenantOrderByWithRelationInput;
};
export type PopupWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.PopupWhereInput | Prisma.PopupWhereInput[];
    OR?: Prisma.PopupWhereInput[];
    NOT?: Prisma.PopupWhereInput | Prisma.PopupWhereInput[];
    tenantId?: Prisma.StringFilter<"Popup"> | string;
    title?: Prisma.StringFilter<"Popup"> | string;
    content?: Prisma.StringNullableFilter<"Popup"> | string | null;
    imageUrl?: Prisma.StringNullableFilter<"Popup"> | string | null;
    targetUrl?: Prisma.StringNullableFilter<"Popup"> | string | null;
    trigger?: Prisma.StringFilter<"Popup"> | string;
    delayMs?: Prisma.IntFilter<"Popup"> | number;
    active?: Prisma.BoolFilter<"Popup"> | boolean;
    startsAt?: Prisma.DateTimeNullableFilter<"Popup"> | Date | string | null;
    endsAt?: Prisma.DateTimeNullableFilter<"Popup"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"Popup"> | Date | string;
    tenant?: Prisma.XOR<Prisma.TenantScalarRelationFilter, Prisma.TenantWhereInput>;
}, "id">;
export type PopupOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    content?: Prisma.SortOrderInput | Prisma.SortOrder;
    imageUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    targetUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    trigger?: Prisma.SortOrder;
    delayMs?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    startsAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    endsAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.PopupCountOrderByAggregateInput;
    _avg?: Prisma.PopupAvgOrderByAggregateInput;
    _max?: Prisma.PopupMaxOrderByAggregateInput;
    _min?: Prisma.PopupMinOrderByAggregateInput;
    _sum?: Prisma.PopupSumOrderByAggregateInput;
};
export type PopupScalarWhereWithAggregatesInput = {
    AND?: Prisma.PopupScalarWhereWithAggregatesInput | Prisma.PopupScalarWhereWithAggregatesInput[];
    OR?: Prisma.PopupScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PopupScalarWhereWithAggregatesInput | Prisma.PopupScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Popup"> | string;
    tenantId?: Prisma.StringWithAggregatesFilter<"Popup"> | string;
    title?: Prisma.StringWithAggregatesFilter<"Popup"> | string;
    content?: Prisma.StringNullableWithAggregatesFilter<"Popup"> | string | null;
    imageUrl?: Prisma.StringNullableWithAggregatesFilter<"Popup"> | string | null;
    targetUrl?: Prisma.StringNullableWithAggregatesFilter<"Popup"> | string | null;
    trigger?: Prisma.StringWithAggregatesFilter<"Popup"> | string;
    delayMs?: Prisma.IntWithAggregatesFilter<"Popup"> | number;
    active?: Prisma.BoolWithAggregatesFilter<"Popup"> | boolean;
    startsAt?: Prisma.DateTimeNullableWithAggregatesFilter<"Popup"> | Date | string | null;
    endsAt?: Prisma.DateTimeNullableWithAggregatesFilter<"Popup"> | Date | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Popup"> | Date | string;
};
export type PopupCreateInput = {
    id?: string;
    title: string;
    content?: string | null;
    imageUrl?: string | null;
    targetUrl?: string | null;
    trigger?: string;
    delayMs?: number;
    active?: boolean;
    startsAt?: Date | string | null;
    endsAt?: Date | string | null;
    createdAt?: Date | string;
    tenant: Prisma.TenantCreateNestedOneWithoutPopupsInput;
};
export type PopupUncheckedCreateInput = {
    id?: string;
    tenantId: string;
    title: string;
    content?: string | null;
    imageUrl?: string | null;
    targetUrl?: string | null;
    trigger?: string;
    delayMs?: number;
    active?: boolean;
    startsAt?: Date | string | null;
    endsAt?: Date | string | null;
    createdAt?: Date | string;
};
export type PopupUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    imageUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    targetUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    trigger?: Prisma.StringFieldUpdateOperationsInput | string;
    delayMs?: Prisma.IntFieldUpdateOperationsInput | number;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    startsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    endsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tenant?: Prisma.TenantUpdateOneRequiredWithoutPopupsNestedInput;
};
export type PopupUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    imageUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    targetUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    trigger?: Prisma.StringFieldUpdateOperationsInput | string;
    delayMs?: Prisma.IntFieldUpdateOperationsInput | number;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    startsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    endsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PopupCreateManyInput = {
    id?: string;
    tenantId: string;
    title: string;
    content?: string | null;
    imageUrl?: string | null;
    targetUrl?: string | null;
    trigger?: string;
    delayMs?: number;
    active?: boolean;
    startsAt?: Date | string | null;
    endsAt?: Date | string | null;
    createdAt?: Date | string;
};
export type PopupUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    imageUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    targetUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    trigger?: Prisma.StringFieldUpdateOperationsInput | string;
    delayMs?: Prisma.IntFieldUpdateOperationsInput | number;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    startsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    endsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PopupUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    imageUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    targetUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    trigger?: Prisma.StringFieldUpdateOperationsInput | string;
    delayMs?: Prisma.IntFieldUpdateOperationsInput | number;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    startsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    endsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PopupListRelationFilter = {
    every?: Prisma.PopupWhereInput;
    some?: Prisma.PopupWhereInput;
    none?: Prisma.PopupWhereInput;
};
export type PopupOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type PopupCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    imageUrl?: Prisma.SortOrder;
    targetUrl?: Prisma.SortOrder;
    trigger?: Prisma.SortOrder;
    delayMs?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    startsAt?: Prisma.SortOrder;
    endsAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type PopupAvgOrderByAggregateInput = {
    delayMs?: Prisma.SortOrder;
};
export type PopupMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    imageUrl?: Prisma.SortOrder;
    targetUrl?: Prisma.SortOrder;
    trigger?: Prisma.SortOrder;
    delayMs?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    startsAt?: Prisma.SortOrder;
    endsAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type PopupMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    imageUrl?: Prisma.SortOrder;
    targetUrl?: Prisma.SortOrder;
    trigger?: Prisma.SortOrder;
    delayMs?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    startsAt?: Prisma.SortOrder;
    endsAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type PopupSumOrderByAggregateInput = {
    delayMs?: Prisma.SortOrder;
};
export type PopupCreateNestedManyWithoutTenantInput = {
    create?: Prisma.XOR<Prisma.PopupCreateWithoutTenantInput, Prisma.PopupUncheckedCreateWithoutTenantInput> | Prisma.PopupCreateWithoutTenantInput[] | Prisma.PopupUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.PopupCreateOrConnectWithoutTenantInput | Prisma.PopupCreateOrConnectWithoutTenantInput[];
    createMany?: Prisma.PopupCreateManyTenantInputEnvelope;
    connect?: Prisma.PopupWhereUniqueInput | Prisma.PopupWhereUniqueInput[];
};
export type PopupUncheckedCreateNestedManyWithoutTenantInput = {
    create?: Prisma.XOR<Prisma.PopupCreateWithoutTenantInput, Prisma.PopupUncheckedCreateWithoutTenantInput> | Prisma.PopupCreateWithoutTenantInput[] | Prisma.PopupUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.PopupCreateOrConnectWithoutTenantInput | Prisma.PopupCreateOrConnectWithoutTenantInput[];
    createMany?: Prisma.PopupCreateManyTenantInputEnvelope;
    connect?: Prisma.PopupWhereUniqueInput | Prisma.PopupWhereUniqueInput[];
};
export type PopupUpdateManyWithoutTenantNestedInput = {
    create?: Prisma.XOR<Prisma.PopupCreateWithoutTenantInput, Prisma.PopupUncheckedCreateWithoutTenantInput> | Prisma.PopupCreateWithoutTenantInput[] | Prisma.PopupUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.PopupCreateOrConnectWithoutTenantInput | Prisma.PopupCreateOrConnectWithoutTenantInput[];
    upsert?: Prisma.PopupUpsertWithWhereUniqueWithoutTenantInput | Prisma.PopupUpsertWithWhereUniqueWithoutTenantInput[];
    createMany?: Prisma.PopupCreateManyTenantInputEnvelope;
    set?: Prisma.PopupWhereUniqueInput | Prisma.PopupWhereUniqueInput[];
    disconnect?: Prisma.PopupWhereUniqueInput | Prisma.PopupWhereUniqueInput[];
    delete?: Prisma.PopupWhereUniqueInput | Prisma.PopupWhereUniqueInput[];
    connect?: Prisma.PopupWhereUniqueInput | Prisma.PopupWhereUniqueInput[];
    update?: Prisma.PopupUpdateWithWhereUniqueWithoutTenantInput | Prisma.PopupUpdateWithWhereUniqueWithoutTenantInput[];
    updateMany?: Prisma.PopupUpdateManyWithWhereWithoutTenantInput | Prisma.PopupUpdateManyWithWhereWithoutTenantInput[];
    deleteMany?: Prisma.PopupScalarWhereInput | Prisma.PopupScalarWhereInput[];
};
export type PopupUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: Prisma.XOR<Prisma.PopupCreateWithoutTenantInput, Prisma.PopupUncheckedCreateWithoutTenantInput> | Prisma.PopupCreateWithoutTenantInput[] | Prisma.PopupUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.PopupCreateOrConnectWithoutTenantInput | Prisma.PopupCreateOrConnectWithoutTenantInput[];
    upsert?: Prisma.PopupUpsertWithWhereUniqueWithoutTenantInput | Prisma.PopupUpsertWithWhereUniqueWithoutTenantInput[];
    createMany?: Prisma.PopupCreateManyTenantInputEnvelope;
    set?: Prisma.PopupWhereUniqueInput | Prisma.PopupWhereUniqueInput[];
    disconnect?: Prisma.PopupWhereUniqueInput | Prisma.PopupWhereUniqueInput[];
    delete?: Prisma.PopupWhereUniqueInput | Prisma.PopupWhereUniqueInput[];
    connect?: Prisma.PopupWhereUniqueInput | Prisma.PopupWhereUniqueInput[];
    update?: Prisma.PopupUpdateWithWhereUniqueWithoutTenantInput | Prisma.PopupUpdateWithWhereUniqueWithoutTenantInput[];
    updateMany?: Prisma.PopupUpdateManyWithWhereWithoutTenantInput | Prisma.PopupUpdateManyWithWhereWithoutTenantInput[];
    deleteMany?: Prisma.PopupScalarWhereInput | Prisma.PopupScalarWhereInput[];
};
export type PopupCreateWithoutTenantInput = {
    id?: string;
    title: string;
    content?: string | null;
    imageUrl?: string | null;
    targetUrl?: string | null;
    trigger?: string;
    delayMs?: number;
    active?: boolean;
    startsAt?: Date | string | null;
    endsAt?: Date | string | null;
    createdAt?: Date | string;
};
export type PopupUncheckedCreateWithoutTenantInput = {
    id?: string;
    title: string;
    content?: string | null;
    imageUrl?: string | null;
    targetUrl?: string | null;
    trigger?: string;
    delayMs?: number;
    active?: boolean;
    startsAt?: Date | string | null;
    endsAt?: Date | string | null;
    createdAt?: Date | string;
};
export type PopupCreateOrConnectWithoutTenantInput = {
    where: Prisma.PopupWhereUniqueInput;
    create: Prisma.XOR<Prisma.PopupCreateWithoutTenantInput, Prisma.PopupUncheckedCreateWithoutTenantInput>;
};
export type PopupCreateManyTenantInputEnvelope = {
    data: Prisma.PopupCreateManyTenantInput | Prisma.PopupCreateManyTenantInput[];
    skipDuplicates?: boolean;
};
export type PopupUpsertWithWhereUniqueWithoutTenantInput = {
    where: Prisma.PopupWhereUniqueInput;
    update: Prisma.XOR<Prisma.PopupUpdateWithoutTenantInput, Prisma.PopupUncheckedUpdateWithoutTenantInput>;
    create: Prisma.XOR<Prisma.PopupCreateWithoutTenantInput, Prisma.PopupUncheckedCreateWithoutTenantInput>;
};
export type PopupUpdateWithWhereUniqueWithoutTenantInput = {
    where: Prisma.PopupWhereUniqueInput;
    data: Prisma.XOR<Prisma.PopupUpdateWithoutTenantInput, Prisma.PopupUncheckedUpdateWithoutTenantInput>;
};
export type PopupUpdateManyWithWhereWithoutTenantInput = {
    where: Prisma.PopupScalarWhereInput;
    data: Prisma.XOR<Prisma.PopupUpdateManyMutationInput, Prisma.PopupUncheckedUpdateManyWithoutTenantInput>;
};
export type PopupScalarWhereInput = {
    AND?: Prisma.PopupScalarWhereInput | Prisma.PopupScalarWhereInput[];
    OR?: Prisma.PopupScalarWhereInput[];
    NOT?: Prisma.PopupScalarWhereInput | Prisma.PopupScalarWhereInput[];
    id?: Prisma.StringFilter<"Popup"> | string;
    tenantId?: Prisma.StringFilter<"Popup"> | string;
    title?: Prisma.StringFilter<"Popup"> | string;
    content?: Prisma.StringNullableFilter<"Popup"> | string | null;
    imageUrl?: Prisma.StringNullableFilter<"Popup"> | string | null;
    targetUrl?: Prisma.StringNullableFilter<"Popup"> | string | null;
    trigger?: Prisma.StringFilter<"Popup"> | string;
    delayMs?: Prisma.IntFilter<"Popup"> | number;
    active?: Prisma.BoolFilter<"Popup"> | boolean;
    startsAt?: Prisma.DateTimeNullableFilter<"Popup"> | Date | string | null;
    endsAt?: Prisma.DateTimeNullableFilter<"Popup"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"Popup"> | Date | string;
};
export type PopupCreateManyTenantInput = {
    id?: string;
    title: string;
    content?: string | null;
    imageUrl?: string | null;
    targetUrl?: string | null;
    trigger?: string;
    delayMs?: number;
    active?: boolean;
    startsAt?: Date | string | null;
    endsAt?: Date | string | null;
    createdAt?: Date | string;
};
export type PopupUpdateWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    imageUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    targetUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    trigger?: Prisma.StringFieldUpdateOperationsInput | string;
    delayMs?: Prisma.IntFieldUpdateOperationsInput | number;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    startsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    endsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PopupUncheckedUpdateWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    imageUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    targetUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    trigger?: Prisma.StringFieldUpdateOperationsInput | string;
    delayMs?: Prisma.IntFieldUpdateOperationsInput | number;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    startsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    endsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PopupUncheckedUpdateManyWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    imageUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    targetUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    trigger?: Prisma.StringFieldUpdateOperationsInput | string;
    delayMs?: Prisma.IntFieldUpdateOperationsInput | number;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    startsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    endsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PopupSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    title?: boolean;
    content?: boolean;
    imageUrl?: boolean;
    targetUrl?: boolean;
    trigger?: boolean;
    delayMs?: boolean;
    active?: boolean;
    startsAt?: boolean;
    endsAt?: boolean;
    createdAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["popup"]>;
export type PopupSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    title?: boolean;
    content?: boolean;
    imageUrl?: boolean;
    targetUrl?: boolean;
    trigger?: boolean;
    delayMs?: boolean;
    active?: boolean;
    startsAt?: boolean;
    endsAt?: boolean;
    createdAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["popup"]>;
export type PopupSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    title?: boolean;
    content?: boolean;
    imageUrl?: boolean;
    targetUrl?: boolean;
    trigger?: boolean;
    delayMs?: boolean;
    active?: boolean;
    startsAt?: boolean;
    endsAt?: boolean;
    createdAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["popup"]>;
export type PopupSelectScalar = {
    id?: boolean;
    tenantId?: boolean;
    title?: boolean;
    content?: boolean;
    imageUrl?: boolean;
    targetUrl?: boolean;
    trigger?: boolean;
    delayMs?: boolean;
    active?: boolean;
    startsAt?: boolean;
    endsAt?: boolean;
    createdAt?: boolean;
};
export type PopupOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "tenantId" | "title" | "content" | "imageUrl" | "targetUrl" | "trigger" | "delayMs" | "active" | "startsAt" | "endsAt" | "createdAt", ExtArgs["result"]["popup"]>;
export type PopupInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
};
export type PopupIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
};
export type PopupIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
};
export type $PopupPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Popup";
    objects: {
        tenant: Prisma.$TenantPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        tenantId: string;
        title: string;
        content: string | null;
        imageUrl: string | null;
        targetUrl: string | null;
        trigger: string;
        delayMs: number;
        active: boolean;
        startsAt: Date | null;
        endsAt: Date | null;
        createdAt: Date;
    }, ExtArgs["result"]["popup"]>;
    composites: {};
};
export type PopupGetPayload<S extends boolean | null | undefined | PopupDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PopupPayload, S>;
export type PopupCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PopupFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PopupCountAggregateInputType | true;
};
export interface PopupDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Popup'];
        meta: {
            name: 'Popup';
        };
    };
    findUnique<T extends PopupFindUniqueArgs>(args: Prisma.SelectSubset<T, PopupFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PopupClient<runtime.Types.Result.GetResult<Prisma.$PopupPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends PopupFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PopupFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PopupClient<runtime.Types.Result.GetResult<Prisma.$PopupPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends PopupFindFirstArgs>(args?: Prisma.SelectSubset<T, PopupFindFirstArgs<ExtArgs>>): Prisma.Prisma__PopupClient<runtime.Types.Result.GetResult<Prisma.$PopupPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends PopupFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PopupFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PopupClient<runtime.Types.Result.GetResult<Prisma.$PopupPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends PopupFindManyArgs>(args?: Prisma.SelectSubset<T, PopupFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PopupPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends PopupCreateArgs>(args: Prisma.SelectSubset<T, PopupCreateArgs<ExtArgs>>): Prisma.Prisma__PopupClient<runtime.Types.Result.GetResult<Prisma.$PopupPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends PopupCreateManyArgs>(args?: Prisma.SelectSubset<T, PopupCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends PopupCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PopupCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PopupPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends PopupDeleteArgs>(args: Prisma.SelectSubset<T, PopupDeleteArgs<ExtArgs>>): Prisma.Prisma__PopupClient<runtime.Types.Result.GetResult<Prisma.$PopupPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends PopupUpdateArgs>(args: Prisma.SelectSubset<T, PopupUpdateArgs<ExtArgs>>): Prisma.Prisma__PopupClient<runtime.Types.Result.GetResult<Prisma.$PopupPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends PopupDeleteManyArgs>(args?: Prisma.SelectSubset<T, PopupDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends PopupUpdateManyArgs>(args: Prisma.SelectSubset<T, PopupUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends PopupUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PopupUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PopupPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends PopupUpsertArgs>(args: Prisma.SelectSubset<T, PopupUpsertArgs<ExtArgs>>): Prisma.Prisma__PopupClient<runtime.Types.Result.GetResult<Prisma.$PopupPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends PopupCountArgs>(args?: Prisma.Subset<T, PopupCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PopupCountAggregateOutputType> : number>;
    aggregate<T extends PopupAggregateArgs>(args: Prisma.Subset<T, PopupAggregateArgs>): Prisma.PrismaPromise<GetPopupAggregateType<T>>;
    groupBy<T extends PopupGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PopupGroupByArgs['orderBy'];
    } : {
        orderBy?: PopupGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PopupGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPopupGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PopupFieldRefs;
}
export interface Prisma__PopupClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    tenant<T extends Prisma.TenantDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TenantDefaultArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface PopupFieldRefs {
    readonly id: Prisma.FieldRef<"Popup", 'String'>;
    readonly tenantId: Prisma.FieldRef<"Popup", 'String'>;
    readonly title: Prisma.FieldRef<"Popup", 'String'>;
    readonly content: Prisma.FieldRef<"Popup", 'String'>;
    readonly imageUrl: Prisma.FieldRef<"Popup", 'String'>;
    readonly targetUrl: Prisma.FieldRef<"Popup", 'String'>;
    readonly trigger: Prisma.FieldRef<"Popup", 'String'>;
    readonly delayMs: Prisma.FieldRef<"Popup", 'Int'>;
    readonly active: Prisma.FieldRef<"Popup", 'Boolean'>;
    readonly startsAt: Prisma.FieldRef<"Popup", 'DateTime'>;
    readonly endsAt: Prisma.FieldRef<"Popup", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"Popup", 'DateTime'>;
}
export type PopupFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PopupSelect<ExtArgs> | null;
    omit?: Prisma.PopupOmit<ExtArgs> | null;
    include?: Prisma.PopupInclude<ExtArgs> | null;
    where: Prisma.PopupWhereUniqueInput;
};
export type PopupFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PopupSelect<ExtArgs> | null;
    omit?: Prisma.PopupOmit<ExtArgs> | null;
    include?: Prisma.PopupInclude<ExtArgs> | null;
    where: Prisma.PopupWhereUniqueInput;
};
export type PopupFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PopupSelect<ExtArgs> | null;
    omit?: Prisma.PopupOmit<ExtArgs> | null;
    include?: Prisma.PopupInclude<ExtArgs> | null;
    where?: Prisma.PopupWhereInput;
    orderBy?: Prisma.PopupOrderByWithRelationInput | Prisma.PopupOrderByWithRelationInput[];
    cursor?: Prisma.PopupWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PopupScalarFieldEnum | Prisma.PopupScalarFieldEnum[];
};
export type PopupFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PopupSelect<ExtArgs> | null;
    omit?: Prisma.PopupOmit<ExtArgs> | null;
    include?: Prisma.PopupInclude<ExtArgs> | null;
    where?: Prisma.PopupWhereInput;
    orderBy?: Prisma.PopupOrderByWithRelationInput | Prisma.PopupOrderByWithRelationInput[];
    cursor?: Prisma.PopupWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PopupScalarFieldEnum | Prisma.PopupScalarFieldEnum[];
};
export type PopupFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PopupSelect<ExtArgs> | null;
    omit?: Prisma.PopupOmit<ExtArgs> | null;
    include?: Prisma.PopupInclude<ExtArgs> | null;
    where?: Prisma.PopupWhereInput;
    orderBy?: Prisma.PopupOrderByWithRelationInput | Prisma.PopupOrderByWithRelationInput[];
    cursor?: Prisma.PopupWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PopupScalarFieldEnum | Prisma.PopupScalarFieldEnum[];
};
export type PopupCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PopupSelect<ExtArgs> | null;
    omit?: Prisma.PopupOmit<ExtArgs> | null;
    include?: Prisma.PopupInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PopupCreateInput, Prisma.PopupUncheckedCreateInput>;
};
export type PopupCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.PopupCreateManyInput | Prisma.PopupCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PopupCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PopupSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PopupOmit<ExtArgs> | null;
    data: Prisma.PopupCreateManyInput | Prisma.PopupCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.PopupIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type PopupUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PopupSelect<ExtArgs> | null;
    omit?: Prisma.PopupOmit<ExtArgs> | null;
    include?: Prisma.PopupInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PopupUpdateInput, Prisma.PopupUncheckedUpdateInput>;
    where: Prisma.PopupWhereUniqueInput;
};
export type PopupUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.PopupUpdateManyMutationInput, Prisma.PopupUncheckedUpdateManyInput>;
    where?: Prisma.PopupWhereInput;
    limit?: number;
};
export type PopupUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PopupSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PopupOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PopupUpdateManyMutationInput, Prisma.PopupUncheckedUpdateManyInput>;
    where?: Prisma.PopupWhereInput;
    limit?: number;
    include?: Prisma.PopupIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type PopupUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PopupSelect<ExtArgs> | null;
    omit?: Prisma.PopupOmit<ExtArgs> | null;
    include?: Prisma.PopupInclude<ExtArgs> | null;
    where: Prisma.PopupWhereUniqueInput;
    create: Prisma.XOR<Prisma.PopupCreateInput, Prisma.PopupUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.PopupUpdateInput, Prisma.PopupUncheckedUpdateInput>;
};
export type PopupDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PopupSelect<ExtArgs> | null;
    omit?: Prisma.PopupOmit<ExtArgs> | null;
    include?: Prisma.PopupInclude<ExtArgs> | null;
    where: Prisma.PopupWhereUniqueInput;
};
export type PopupDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PopupWhereInput;
    limit?: number;
};
export type PopupDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PopupSelect<ExtArgs> | null;
    omit?: Prisma.PopupOmit<ExtArgs> | null;
    include?: Prisma.PopupInclude<ExtArgs> | null;
};
