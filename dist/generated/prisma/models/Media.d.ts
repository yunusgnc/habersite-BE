import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type MediaModel = runtime.Types.Result.DefaultSelection<Prisma.$MediaPayload>;
export type AggregateMedia = {
    _count: MediaCountAggregateOutputType | null;
    _avg: MediaAvgAggregateOutputType | null;
    _sum: MediaSumAggregateOutputType | null;
    _min: MediaMinAggregateOutputType | null;
    _max: MediaMaxAggregateOutputType | null;
};
export type MediaAvgAggregateOutputType = {
    size: number | null;
    width: number | null;
    height: number | null;
};
export type MediaSumAggregateOutputType = {
    size: number | null;
    width: number | null;
    height: number | null;
};
export type MediaMinAggregateOutputType = {
    id: string | null;
    tenantId: string | null;
    type: $Enums.MediaType | null;
    filename: string | null;
    originalName: string | null;
    mimeType: string | null;
    size: number | null;
    url: string | null;
    thumbnailUrl: string | null;
    width: number | null;
    height: number | null;
    alt: string | null;
    credit: string | null;
    createdAt: Date | null;
};
export type MediaMaxAggregateOutputType = {
    id: string | null;
    tenantId: string | null;
    type: $Enums.MediaType | null;
    filename: string | null;
    originalName: string | null;
    mimeType: string | null;
    size: number | null;
    url: string | null;
    thumbnailUrl: string | null;
    width: number | null;
    height: number | null;
    alt: string | null;
    credit: string | null;
    createdAt: Date | null;
};
export type MediaCountAggregateOutputType = {
    id: number;
    tenantId: number;
    type: number;
    filename: number;
    originalName: number;
    mimeType: number;
    size: number;
    url: number;
    thumbnailUrl: number;
    width: number;
    height: number;
    alt: number;
    credit: number;
    createdAt: number;
    _all: number;
};
export type MediaAvgAggregateInputType = {
    size?: true;
    width?: true;
    height?: true;
};
export type MediaSumAggregateInputType = {
    size?: true;
    width?: true;
    height?: true;
};
export type MediaMinAggregateInputType = {
    id?: true;
    tenantId?: true;
    type?: true;
    filename?: true;
    originalName?: true;
    mimeType?: true;
    size?: true;
    url?: true;
    thumbnailUrl?: true;
    width?: true;
    height?: true;
    alt?: true;
    credit?: true;
    createdAt?: true;
};
export type MediaMaxAggregateInputType = {
    id?: true;
    tenantId?: true;
    type?: true;
    filename?: true;
    originalName?: true;
    mimeType?: true;
    size?: true;
    url?: true;
    thumbnailUrl?: true;
    width?: true;
    height?: true;
    alt?: true;
    credit?: true;
    createdAt?: true;
};
export type MediaCountAggregateInputType = {
    id?: true;
    tenantId?: true;
    type?: true;
    filename?: true;
    originalName?: true;
    mimeType?: true;
    size?: true;
    url?: true;
    thumbnailUrl?: true;
    width?: true;
    height?: true;
    alt?: true;
    credit?: true;
    createdAt?: true;
    _all?: true;
};
export type MediaAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MediaWhereInput;
    orderBy?: Prisma.MediaOrderByWithRelationInput | Prisma.MediaOrderByWithRelationInput[];
    cursor?: Prisma.MediaWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | MediaCountAggregateInputType;
    _avg?: MediaAvgAggregateInputType;
    _sum?: MediaSumAggregateInputType;
    _min?: MediaMinAggregateInputType;
    _max?: MediaMaxAggregateInputType;
};
export type GetMediaAggregateType<T extends MediaAggregateArgs> = {
    [P in keyof T & keyof AggregateMedia]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateMedia[P]> : Prisma.GetScalarType<T[P], AggregateMedia[P]>;
};
export type MediaGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MediaWhereInput;
    orderBy?: Prisma.MediaOrderByWithAggregationInput | Prisma.MediaOrderByWithAggregationInput[];
    by: Prisma.MediaScalarFieldEnum[] | Prisma.MediaScalarFieldEnum;
    having?: Prisma.MediaScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MediaCountAggregateInputType | true;
    _avg?: MediaAvgAggregateInputType;
    _sum?: MediaSumAggregateInputType;
    _min?: MediaMinAggregateInputType;
    _max?: MediaMaxAggregateInputType;
};
export type MediaGroupByOutputType = {
    id: string;
    tenantId: string;
    type: $Enums.MediaType;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    thumbnailUrl: string | null;
    width: number | null;
    height: number | null;
    alt: string | null;
    credit: string | null;
    createdAt: Date;
    _count: MediaCountAggregateOutputType | null;
    _avg: MediaAvgAggregateOutputType | null;
    _sum: MediaSumAggregateOutputType | null;
    _min: MediaMinAggregateOutputType | null;
    _max: MediaMaxAggregateOutputType | null;
};
export type GetMediaGroupByPayload<T extends MediaGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<MediaGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof MediaGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], MediaGroupByOutputType[P]> : Prisma.GetScalarType<T[P], MediaGroupByOutputType[P]>;
}>>;
export type MediaWhereInput = {
    AND?: Prisma.MediaWhereInput | Prisma.MediaWhereInput[];
    OR?: Prisma.MediaWhereInput[];
    NOT?: Prisma.MediaWhereInput | Prisma.MediaWhereInput[];
    id?: Prisma.StringFilter<"Media"> | string;
    tenantId?: Prisma.StringFilter<"Media"> | string;
    type?: Prisma.EnumMediaTypeFilter<"Media"> | $Enums.MediaType;
    filename?: Prisma.StringFilter<"Media"> | string;
    originalName?: Prisma.StringFilter<"Media"> | string;
    mimeType?: Prisma.StringFilter<"Media"> | string;
    size?: Prisma.IntFilter<"Media"> | number;
    url?: Prisma.StringFilter<"Media"> | string;
    thumbnailUrl?: Prisma.StringNullableFilter<"Media"> | string | null;
    width?: Prisma.IntNullableFilter<"Media"> | number | null;
    height?: Prisma.IntNullableFilter<"Media"> | number | null;
    alt?: Prisma.StringNullableFilter<"Media"> | string | null;
    credit?: Prisma.StringNullableFilter<"Media"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Media"> | Date | string;
    tenant?: Prisma.XOR<Prisma.TenantScalarRelationFilter, Prisma.TenantWhereInput>;
    articles?: Prisma.ArticleMediaListRelationFilter;
};
export type MediaOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    filename?: Prisma.SortOrder;
    originalName?: Prisma.SortOrder;
    mimeType?: Prisma.SortOrder;
    size?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    thumbnailUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    width?: Prisma.SortOrderInput | Prisma.SortOrder;
    height?: Prisma.SortOrderInput | Prisma.SortOrder;
    alt?: Prisma.SortOrderInput | Prisma.SortOrder;
    credit?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    tenant?: Prisma.TenantOrderByWithRelationInput;
    articles?: Prisma.ArticleMediaOrderByRelationAggregateInput;
};
export type MediaWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.MediaWhereInput | Prisma.MediaWhereInput[];
    OR?: Prisma.MediaWhereInput[];
    NOT?: Prisma.MediaWhereInput | Prisma.MediaWhereInput[];
    tenantId?: Prisma.StringFilter<"Media"> | string;
    type?: Prisma.EnumMediaTypeFilter<"Media"> | $Enums.MediaType;
    filename?: Prisma.StringFilter<"Media"> | string;
    originalName?: Prisma.StringFilter<"Media"> | string;
    mimeType?: Prisma.StringFilter<"Media"> | string;
    size?: Prisma.IntFilter<"Media"> | number;
    url?: Prisma.StringFilter<"Media"> | string;
    thumbnailUrl?: Prisma.StringNullableFilter<"Media"> | string | null;
    width?: Prisma.IntNullableFilter<"Media"> | number | null;
    height?: Prisma.IntNullableFilter<"Media"> | number | null;
    alt?: Prisma.StringNullableFilter<"Media"> | string | null;
    credit?: Prisma.StringNullableFilter<"Media"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Media"> | Date | string;
    tenant?: Prisma.XOR<Prisma.TenantScalarRelationFilter, Prisma.TenantWhereInput>;
    articles?: Prisma.ArticleMediaListRelationFilter;
}, "id">;
export type MediaOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    filename?: Prisma.SortOrder;
    originalName?: Prisma.SortOrder;
    mimeType?: Prisma.SortOrder;
    size?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    thumbnailUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    width?: Prisma.SortOrderInput | Prisma.SortOrder;
    height?: Prisma.SortOrderInput | Prisma.SortOrder;
    alt?: Prisma.SortOrderInput | Prisma.SortOrder;
    credit?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.MediaCountOrderByAggregateInput;
    _avg?: Prisma.MediaAvgOrderByAggregateInput;
    _max?: Prisma.MediaMaxOrderByAggregateInput;
    _min?: Prisma.MediaMinOrderByAggregateInput;
    _sum?: Prisma.MediaSumOrderByAggregateInput;
};
export type MediaScalarWhereWithAggregatesInput = {
    AND?: Prisma.MediaScalarWhereWithAggregatesInput | Prisma.MediaScalarWhereWithAggregatesInput[];
    OR?: Prisma.MediaScalarWhereWithAggregatesInput[];
    NOT?: Prisma.MediaScalarWhereWithAggregatesInput | Prisma.MediaScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Media"> | string;
    tenantId?: Prisma.StringWithAggregatesFilter<"Media"> | string;
    type?: Prisma.EnumMediaTypeWithAggregatesFilter<"Media"> | $Enums.MediaType;
    filename?: Prisma.StringWithAggregatesFilter<"Media"> | string;
    originalName?: Prisma.StringWithAggregatesFilter<"Media"> | string;
    mimeType?: Prisma.StringWithAggregatesFilter<"Media"> | string;
    size?: Prisma.IntWithAggregatesFilter<"Media"> | number;
    url?: Prisma.StringWithAggregatesFilter<"Media"> | string;
    thumbnailUrl?: Prisma.StringNullableWithAggregatesFilter<"Media"> | string | null;
    width?: Prisma.IntNullableWithAggregatesFilter<"Media"> | number | null;
    height?: Prisma.IntNullableWithAggregatesFilter<"Media"> | number | null;
    alt?: Prisma.StringNullableWithAggregatesFilter<"Media"> | string | null;
    credit?: Prisma.StringNullableWithAggregatesFilter<"Media"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Media"> | Date | string;
};
export type MediaCreateInput = {
    id?: string;
    type?: $Enums.MediaType;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    thumbnailUrl?: string | null;
    width?: number | null;
    height?: number | null;
    alt?: string | null;
    credit?: string | null;
    createdAt?: Date | string;
    tenant: Prisma.TenantCreateNestedOneWithoutMediaInput;
    articles?: Prisma.ArticleMediaCreateNestedManyWithoutMediaInput;
};
export type MediaUncheckedCreateInput = {
    id?: string;
    tenantId: string;
    type?: $Enums.MediaType;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    thumbnailUrl?: string | null;
    width?: number | null;
    height?: number | null;
    alt?: string | null;
    credit?: string | null;
    createdAt?: Date | string;
    articles?: Prisma.ArticleMediaUncheckedCreateNestedManyWithoutMediaInput;
};
export type MediaUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumMediaTypeFieldUpdateOperationsInput | $Enums.MediaType;
    filename?: Prisma.StringFieldUpdateOperationsInput | string;
    originalName?: Prisma.StringFieldUpdateOperationsInput | string;
    mimeType?: Prisma.StringFieldUpdateOperationsInput | string;
    size?: Prisma.IntFieldUpdateOperationsInput | number;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    thumbnailUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    width?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    height?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    alt?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    credit?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tenant?: Prisma.TenantUpdateOneRequiredWithoutMediaNestedInput;
    articles?: Prisma.ArticleMediaUpdateManyWithoutMediaNestedInput;
};
export type MediaUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumMediaTypeFieldUpdateOperationsInput | $Enums.MediaType;
    filename?: Prisma.StringFieldUpdateOperationsInput | string;
    originalName?: Prisma.StringFieldUpdateOperationsInput | string;
    mimeType?: Prisma.StringFieldUpdateOperationsInput | string;
    size?: Prisma.IntFieldUpdateOperationsInput | number;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    thumbnailUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    width?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    height?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    alt?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    credit?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    articles?: Prisma.ArticleMediaUncheckedUpdateManyWithoutMediaNestedInput;
};
export type MediaCreateManyInput = {
    id?: string;
    tenantId: string;
    type?: $Enums.MediaType;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    thumbnailUrl?: string | null;
    width?: number | null;
    height?: number | null;
    alt?: string | null;
    credit?: string | null;
    createdAt?: Date | string;
};
export type MediaUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumMediaTypeFieldUpdateOperationsInput | $Enums.MediaType;
    filename?: Prisma.StringFieldUpdateOperationsInput | string;
    originalName?: Prisma.StringFieldUpdateOperationsInput | string;
    mimeType?: Prisma.StringFieldUpdateOperationsInput | string;
    size?: Prisma.IntFieldUpdateOperationsInput | number;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    thumbnailUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    width?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    height?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    alt?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    credit?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MediaUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumMediaTypeFieldUpdateOperationsInput | $Enums.MediaType;
    filename?: Prisma.StringFieldUpdateOperationsInput | string;
    originalName?: Prisma.StringFieldUpdateOperationsInput | string;
    mimeType?: Prisma.StringFieldUpdateOperationsInput | string;
    size?: Prisma.IntFieldUpdateOperationsInput | number;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    thumbnailUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    width?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    height?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    alt?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    credit?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MediaListRelationFilter = {
    every?: Prisma.MediaWhereInput;
    some?: Prisma.MediaWhereInput;
    none?: Prisma.MediaWhereInput;
};
export type MediaOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type MediaCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    filename?: Prisma.SortOrder;
    originalName?: Prisma.SortOrder;
    mimeType?: Prisma.SortOrder;
    size?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    thumbnailUrl?: Prisma.SortOrder;
    width?: Prisma.SortOrder;
    height?: Prisma.SortOrder;
    alt?: Prisma.SortOrder;
    credit?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type MediaAvgOrderByAggregateInput = {
    size?: Prisma.SortOrder;
    width?: Prisma.SortOrder;
    height?: Prisma.SortOrder;
};
export type MediaMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    filename?: Prisma.SortOrder;
    originalName?: Prisma.SortOrder;
    mimeType?: Prisma.SortOrder;
    size?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    thumbnailUrl?: Prisma.SortOrder;
    width?: Prisma.SortOrder;
    height?: Prisma.SortOrder;
    alt?: Prisma.SortOrder;
    credit?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type MediaMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    filename?: Prisma.SortOrder;
    originalName?: Prisma.SortOrder;
    mimeType?: Prisma.SortOrder;
    size?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    thumbnailUrl?: Prisma.SortOrder;
    width?: Prisma.SortOrder;
    height?: Prisma.SortOrder;
    alt?: Prisma.SortOrder;
    credit?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type MediaSumOrderByAggregateInput = {
    size?: Prisma.SortOrder;
    width?: Prisma.SortOrder;
    height?: Prisma.SortOrder;
};
export type MediaScalarRelationFilter = {
    is?: Prisma.MediaWhereInput;
    isNot?: Prisma.MediaWhereInput;
};
export type MediaCreateNestedManyWithoutTenantInput = {
    create?: Prisma.XOR<Prisma.MediaCreateWithoutTenantInput, Prisma.MediaUncheckedCreateWithoutTenantInput> | Prisma.MediaCreateWithoutTenantInput[] | Prisma.MediaUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.MediaCreateOrConnectWithoutTenantInput | Prisma.MediaCreateOrConnectWithoutTenantInput[];
    createMany?: Prisma.MediaCreateManyTenantInputEnvelope;
    connect?: Prisma.MediaWhereUniqueInput | Prisma.MediaWhereUniqueInput[];
};
export type MediaUncheckedCreateNestedManyWithoutTenantInput = {
    create?: Prisma.XOR<Prisma.MediaCreateWithoutTenantInput, Prisma.MediaUncheckedCreateWithoutTenantInput> | Prisma.MediaCreateWithoutTenantInput[] | Prisma.MediaUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.MediaCreateOrConnectWithoutTenantInput | Prisma.MediaCreateOrConnectWithoutTenantInput[];
    createMany?: Prisma.MediaCreateManyTenantInputEnvelope;
    connect?: Prisma.MediaWhereUniqueInput | Prisma.MediaWhereUniqueInput[];
};
export type MediaUpdateManyWithoutTenantNestedInput = {
    create?: Prisma.XOR<Prisma.MediaCreateWithoutTenantInput, Prisma.MediaUncheckedCreateWithoutTenantInput> | Prisma.MediaCreateWithoutTenantInput[] | Prisma.MediaUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.MediaCreateOrConnectWithoutTenantInput | Prisma.MediaCreateOrConnectWithoutTenantInput[];
    upsert?: Prisma.MediaUpsertWithWhereUniqueWithoutTenantInput | Prisma.MediaUpsertWithWhereUniqueWithoutTenantInput[];
    createMany?: Prisma.MediaCreateManyTenantInputEnvelope;
    set?: Prisma.MediaWhereUniqueInput | Prisma.MediaWhereUniqueInput[];
    disconnect?: Prisma.MediaWhereUniqueInput | Prisma.MediaWhereUniqueInput[];
    delete?: Prisma.MediaWhereUniqueInput | Prisma.MediaWhereUniqueInput[];
    connect?: Prisma.MediaWhereUniqueInput | Prisma.MediaWhereUniqueInput[];
    update?: Prisma.MediaUpdateWithWhereUniqueWithoutTenantInput | Prisma.MediaUpdateWithWhereUniqueWithoutTenantInput[];
    updateMany?: Prisma.MediaUpdateManyWithWhereWithoutTenantInput | Prisma.MediaUpdateManyWithWhereWithoutTenantInput[];
    deleteMany?: Prisma.MediaScalarWhereInput | Prisma.MediaScalarWhereInput[];
};
export type MediaUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: Prisma.XOR<Prisma.MediaCreateWithoutTenantInput, Prisma.MediaUncheckedCreateWithoutTenantInput> | Prisma.MediaCreateWithoutTenantInput[] | Prisma.MediaUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.MediaCreateOrConnectWithoutTenantInput | Prisma.MediaCreateOrConnectWithoutTenantInput[];
    upsert?: Prisma.MediaUpsertWithWhereUniqueWithoutTenantInput | Prisma.MediaUpsertWithWhereUniqueWithoutTenantInput[];
    createMany?: Prisma.MediaCreateManyTenantInputEnvelope;
    set?: Prisma.MediaWhereUniqueInput | Prisma.MediaWhereUniqueInput[];
    disconnect?: Prisma.MediaWhereUniqueInput | Prisma.MediaWhereUniqueInput[];
    delete?: Prisma.MediaWhereUniqueInput | Prisma.MediaWhereUniqueInput[];
    connect?: Prisma.MediaWhereUniqueInput | Prisma.MediaWhereUniqueInput[];
    update?: Prisma.MediaUpdateWithWhereUniqueWithoutTenantInput | Prisma.MediaUpdateWithWhereUniqueWithoutTenantInput[];
    updateMany?: Prisma.MediaUpdateManyWithWhereWithoutTenantInput | Prisma.MediaUpdateManyWithWhereWithoutTenantInput[];
    deleteMany?: Prisma.MediaScalarWhereInput | Prisma.MediaScalarWhereInput[];
};
export type EnumMediaTypeFieldUpdateOperationsInput = {
    set?: $Enums.MediaType;
};
export type MediaCreateNestedOneWithoutArticlesInput = {
    create?: Prisma.XOR<Prisma.MediaCreateWithoutArticlesInput, Prisma.MediaUncheckedCreateWithoutArticlesInput>;
    connectOrCreate?: Prisma.MediaCreateOrConnectWithoutArticlesInput;
    connect?: Prisma.MediaWhereUniqueInput;
};
export type MediaUpdateOneRequiredWithoutArticlesNestedInput = {
    create?: Prisma.XOR<Prisma.MediaCreateWithoutArticlesInput, Prisma.MediaUncheckedCreateWithoutArticlesInput>;
    connectOrCreate?: Prisma.MediaCreateOrConnectWithoutArticlesInput;
    upsert?: Prisma.MediaUpsertWithoutArticlesInput;
    connect?: Prisma.MediaWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.MediaUpdateToOneWithWhereWithoutArticlesInput, Prisma.MediaUpdateWithoutArticlesInput>, Prisma.MediaUncheckedUpdateWithoutArticlesInput>;
};
export type MediaCreateWithoutTenantInput = {
    id?: string;
    type?: $Enums.MediaType;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    thumbnailUrl?: string | null;
    width?: number | null;
    height?: number | null;
    alt?: string | null;
    credit?: string | null;
    createdAt?: Date | string;
    articles?: Prisma.ArticleMediaCreateNestedManyWithoutMediaInput;
};
export type MediaUncheckedCreateWithoutTenantInput = {
    id?: string;
    type?: $Enums.MediaType;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    thumbnailUrl?: string | null;
    width?: number | null;
    height?: number | null;
    alt?: string | null;
    credit?: string | null;
    createdAt?: Date | string;
    articles?: Prisma.ArticleMediaUncheckedCreateNestedManyWithoutMediaInput;
};
export type MediaCreateOrConnectWithoutTenantInput = {
    where: Prisma.MediaWhereUniqueInput;
    create: Prisma.XOR<Prisma.MediaCreateWithoutTenantInput, Prisma.MediaUncheckedCreateWithoutTenantInput>;
};
export type MediaCreateManyTenantInputEnvelope = {
    data: Prisma.MediaCreateManyTenantInput | Prisma.MediaCreateManyTenantInput[];
    skipDuplicates?: boolean;
};
export type MediaUpsertWithWhereUniqueWithoutTenantInput = {
    where: Prisma.MediaWhereUniqueInput;
    update: Prisma.XOR<Prisma.MediaUpdateWithoutTenantInput, Prisma.MediaUncheckedUpdateWithoutTenantInput>;
    create: Prisma.XOR<Prisma.MediaCreateWithoutTenantInput, Prisma.MediaUncheckedCreateWithoutTenantInput>;
};
export type MediaUpdateWithWhereUniqueWithoutTenantInput = {
    where: Prisma.MediaWhereUniqueInput;
    data: Prisma.XOR<Prisma.MediaUpdateWithoutTenantInput, Prisma.MediaUncheckedUpdateWithoutTenantInput>;
};
export type MediaUpdateManyWithWhereWithoutTenantInput = {
    where: Prisma.MediaScalarWhereInput;
    data: Prisma.XOR<Prisma.MediaUpdateManyMutationInput, Prisma.MediaUncheckedUpdateManyWithoutTenantInput>;
};
export type MediaScalarWhereInput = {
    AND?: Prisma.MediaScalarWhereInput | Prisma.MediaScalarWhereInput[];
    OR?: Prisma.MediaScalarWhereInput[];
    NOT?: Prisma.MediaScalarWhereInput | Prisma.MediaScalarWhereInput[];
    id?: Prisma.StringFilter<"Media"> | string;
    tenantId?: Prisma.StringFilter<"Media"> | string;
    type?: Prisma.EnumMediaTypeFilter<"Media"> | $Enums.MediaType;
    filename?: Prisma.StringFilter<"Media"> | string;
    originalName?: Prisma.StringFilter<"Media"> | string;
    mimeType?: Prisma.StringFilter<"Media"> | string;
    size?: Prisma.IntFilter<"Media"> | number;
    url?: Prisma.StringFilter<"Media"> | string;
    thumbnailUrl?: Prisma.StringNullableFilter<"Media"> | string | null;
    width?: Prisma.IntNullableFilter<"Media"> | number | null;
    height?: Prisma.IntNullableFilter<"Media"> | number | null;
    alt?: Prisma.StringNullableFilter<"Media"> | string | null;
    credit?: Prisma.StringNullableFilter<"Media"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Media"> | Date | string;
};
export type MediaCreateWithoutArticlesInput = {
    id?: string;
    type?: $Enums.MediaType;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    thumbnailUrl?: string | null;
    width?: number | null;
    height?: number | null;
    alt?: string | null;
    credit?: string | null;
    createdAt?: Date | string;
    tenant: Prisma.TenantCreateNestedOneWithoutMediaInput;
};
export type MediaUncheckedCreateWithoutArticlesInput = {
    id?: string;
    tenantId: string;
    type?: $Enums.MediaType;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    thumbnailUrl?: string | null;
    width?: number | null;
    height?: number | null;
    alt?: string | null;
    credit?: string | null;
    createdAt?: Date | string;
};
export type MediaCreateOrConnectWithoutArticlesInput = {
    where: Prisma.MediaWhereUniqueInput;
    create: Prisma.XOR<Prisma.MediaCreateWithoutArticlesInput, Prisma.MediaUncheckedCreateWithoutArticlesInput>;
};
export type MediaUpsertWithoutArticlesInput = {
    update: Prisma.XOR<Prisma.MediaUpdateWithoutArticlesInput, Prisma.MediaUncheckedUpdateWithoutArticlesInput>;
    create: Prisma.XOR<Prisma.MediaCreateWithoutArticlesInput, Prisma.MediaUncheckedCreateWithoutArticlesInput>;
    where?: Prisma.MediaWhereInput;
};
export type MediaUpdateToOneWithWhereWithoutArticlesInput = {
    where?: Prisma.MediaWhereInput;
    data: Prisma.XOR<Prisma.MediaUpdateWithoutArticlesInput, Prisma.MediaUncheckedUpdateWithoutArticlesInput>;
};
export type MediaUpdateWithoutArticlesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumMediaTypeFieldUpdateOperationsInput | $Enums.MediaType;
    filename?: Prisma.StringFieldUpdateOperationsInput | string;
    originalName?: Prisma.StringFieldUpdateOperationsInput | string;
    mimeType?: Prisma.StringFieldUpdateOperationsInput | string;
    size?: Prisma.IntFieldUpdateOperationsInput | number;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    thumbnailUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    width?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    height?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    alt?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    credit?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tenant?: Prisma.TenantUpdateOneRequiredWithoutMediaNestedInput;
};
export type MediaUncheckedUpdateWithoutArticlesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumMediaTypeFieldUpdateOperationsInput | $Enums.MediaType;
    filename?: Prisma.StringFieldUpdateOperationsInput | string;
    originalName?: Prisma.StringFieldUpdateOperationsInput | string;
    mimeType?: Prisma.StringFieldUpdateOperationsInput | string;
    size?: Prisma.IntFieldUpdateOperationsInput | number;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    thumbnailUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    width?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    height?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    alt?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    credit?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MediaCreateManyTenantInput = {
    id?: string;
    type?: $Enums.MediaType;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    thumbnailUrl?: string | null;
    width?: number | null;
    height?: number | null;
    alt?: string | null;
    credit?: string | null;
    createdAt?: Date | string;
};
export type MediaUpdateWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumMediaTypeFieldUpdateOperationsInput | $Enums.MediaType;
    filename?: Prisma.StringFieldUpdateOperationsInput | string;
    originalName?: Prisma.StringFieldUpdateOperationsInput | string;
    mimeType?: Prisma.StringFieldUpdateOperationsInput | string;
    size?: Prisma.IntFieldUpdateOperationsInput | number;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    thumbnailUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    width?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    height?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    alt?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    credit?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    articles?: Prisma.ArticleMediaUpdateManyWithoutMediaNestedInput;
};
export type MediaUncheckedUpdateWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumMediaTypeFieldUpdateOperationsInput | $Enums.MediaType;
    filename?: Prisma.StringFieldUpdateOperationsInput | string;
    originalName?: Prisma.StringFieldUpdateOperationsInput | string;
    mimeType?: Prisma.StringFieldUpdateOperationsInput | string;
    size?: Prisma.IntFieldUpdateOperationsInput | number;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    thumbnailUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    width?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    height?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    alt?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    credit?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    articles?: Prisma.ArticleMediaUncheckedUpdateManyWithoutMediaNestedInput;
};
export type MediaUncheckedUpdateManyWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumMediaTypeFieldUpdateOperationsInput | $Enums.MediaType;
    filename?: Prisma.StringFieldUpdateOperationsInput | string;
    originalName?: Prisma.StringFieldUpdateOperationsInput | string;
    mimeType?: Prisma.StringFieldUpdateOperationsInput | string;
    size?: Prisma.IntFieldUpdateOperationsInput | number;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    thumbnailUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    width?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    height?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    alt?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    credit?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MediaCountOutputType = {
    articles: number;
};
export type MediaCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    articles?: boolean | MediaCountOutputTypeCountArticlesArgs;
};
export type MediaCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MediaCountOutputTypeSelect<ExtArgs> | null;
};
export type MediaCountOutputTypeCountArticlesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ArticleMediaWhereInput;
};
export type MediaSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    type?: boolean;
    filename?: boolean;
    originalName?: boolean;
    mimeType?: boolean;
    size?: boolean;
    url?: boolean;
    thumbnailUrl?: boolean;
    width?: boolean;
    height?: boolean;
    alt?: boolean;
    credit?: boolean;
    createdAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
    articles?: boolean | Prisma.Media$articlesArgs<ExtArgs>;
    _count?: boolean | Prisma.MediaCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["media"]>;
export type MediaSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    type?: boolean;
    filename?: boolean;
    originalName?: boolean;
    mimeType?: boolean;
    size?: boolean;
    url?: boolean;
    thumbnailUrl?: boolean;
    width?: boolean;
    height?: boolean;
    alt?: boolean;
    credit?: boolean;
    createdAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["media"]>;
export type MediaSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    type?: boolean;
    filename?: boolean;
    originalName?: boolean;
    mimeType?: boolean;
    size?: boolean;
    url?: boolean;
    thumbnailUrl?: boolean;
    width?: boolean;
    height?: boolean;
    alt?: boolean;
    credit?: boolean;
    createdAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["media"]>;
export type MediaSelectScalar = {
    id?: boolean;
    tenantId?: boolean;
    type?: boolean;
    filename?: boolean;
    originalName?: boolean;
    mimeType?: boolean;
    size?: boolean;
    url?: boolean;
    thumbnailUrl?: boolean;
    width?: boolean;
    height?: boolean;
    alt?: boolean;
    credit?: boolean;
    createdAt?: boolean;
};
export type MediaOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "tenantId" | "type" | "filename" | "originalName" | "mimeType" | "size" | "url" | "thumbnailUrl" | "width" | "height" | "alt" | "credit" | "createdAt", ExtArgs["result"]["media"]>;
export type MediaInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
    articles?: boolean | Prisma.Media$articlesArgs<ExtArgs>;
    _count?: boolean | Prisma.MediaCountOutputTypeDefaultArgs<ExtArgs>;
};
export type MediaIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
};
export type MediaIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
};
export type $MediaPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Media";
    objects: {
        tenant: Prisma.$TenantPayload<ExtArgs>;
        articles: Prisma.$ArticleMediaPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        tenantId: string;
        type: $Enums.MediaType;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        url: string;
        thumbnailUrl: string | null;
        width: number | null;
        height: number | null;
        alt: string | null;
        credit: string | null;
        createdAt: Date;
    }, ExtArgs["result"]["media"]>;
    composites: {};
};
export type MediaGetPayload<S extends boolean | null | undefined | MediaDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$MediaPayload, S>;
export type MediaCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<MediaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: MediaCountAggregateInputType | true;
};
export interface MediaDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Media'];
        meta: {
            name: 'Media';
        };
    };
    findUnique<T extends MediaFindUniqueArgs>(args: Prisma.SelectSubset<T, MediaFindUniqueArgs<ExtArgs>>): Prisma.Prisma__MediaClient<runtime.Types.Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends MediaFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, MediaFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__MediaClient<runtime.Types.Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends MediaFindFirstArgs>(args?: Prisma.SelectSubset<T, MediaFindFirstArgs<ExtArgs>>): Prisma.Prisma__MediaClient<runtime.Types.Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends MediaFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, MediaFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__MediaClient<runtime.Types.Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends MediaFindManyArgs>(args?: Prisma.SelectSubset<T, MediaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends MediaCreateArgs>(args: Prisma.SelectSubset<T, MediaCreateArgs<ExtArgs>>): Prisma.Prisma__MediaClient<runtime.Types.Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends MediaCreateManyArgs>(args?: Prisma.SelectSubset<T, MediaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends MediaCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, MediaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends MediaDeleteArgs>(args: Prisma.SelectSubset<T, MediaDeleteArgs<ExtArgs>>): Prisma.Prisma__MediaClient<runtime.Types.Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends MediaUpdateArgs>(args: Prisma.SelectSubset<T, MediaUpdateArgs<ExtArgs>>): Prisma.Prisma__MediaClient<runtime.Types.Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends MediaDeleteManyArgs>(args?: Prisma.SelectSubset<T, MediaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends MediaUpdateManyArgs>(args: Prisma.SelectSubset<T, MediaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends MediaUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, MediaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends MediaUpsertArgs>(args: Prisma.SelectSubset<T, MediaUpsertArgs<ExtArgs>>): Prisma.Prisma__MediaClient<runtime.Types.Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends MediaCountArgs>(args?: Prisma.Subset<T, MediaCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], MediaCountAggregateOutputType> : number>;
    aggregate<T extends MediaAggregateArgs>(args: Prisma.Subset<T, MediaAggregateArgs>): Prisma.PrismaPromise<GetMediaAggregateType<T>>;
    groupBy<T extends MediaGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: MediaGroupByArgs['orderBy'];
    } : {
        orderBy?: MediaGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, MediaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMediaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: MediaFieldRefs;
}
export interface Prisma__MediaClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    tenant<T extends Prisma.TenantDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TenantDefaultArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    articles<T extends Prisma.Media$articlesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Media$articlesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ArticleMediaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface MediaFieldRefs {
    readonly id: Prisma.FieldRef<"Media", 'String'>;
    readonly tenantId: Prisma.FieldRef<"Media", 'String'>;
    readonly type: Prisma.FieldRef<"Media", 'MediaType'>;
    readonly filename: Prisma.FieldRef<"Media", 'String'>;
    readonly originalName: Prisma.FieldRef<"Media", 'String'>;
    readonly mimeType: Prisma.FieldRef<"Media", 'String'>;
    readonly size: Prisma.FieldRef<"Media", 'Int'>;
    readonly url: Prisma.FieldRef<"Media", 'String'>;
    readonly thumbnailUrl: Prisma.FieldRef<"Media", 'String'>;
    readonly width: Prisma.FieldRef<"Media", 'Int'>;
    readonly height: Prisma.FieldRef<"Media", 'Int'>;
    readonly alt: Prisma.FieldRef<"Media", 'String'>;
    readonly credit: Prisma.FieldRef<"Media", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Media", 'DateTime'>;
}
export type MediaFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MediaSelect<ExtArgs> | null;
    omit?: Prisma.MediaOmit<ExtArgs> | null;
    include?: Prisma.MediaInclude<ExtArgs> | null;
    where: Prisma.MediaWhereUniqueInput;
};
export type MediaFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MediaSelect<ExtArgs> | null;
    omit?: Prisma.MediaOmit<ExtArgs> | null;
    include?: Prisma.MediaInclude<ExtArgs> | null;
    where: Prisma.MediaWhereUniqueInput;
};
export type MediaFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MediaSelect<ExtArgs> | null;
    omit?: Prisma.MediaOmit<ExtArgs> | null;
    include?: Prisma.MediaInclude<ExtArgs> | null;
    where?: Prisma.MediaWhereInput;
    orderBy?: Prisma.MediaOrderByWithRelationInput | Prisma.MediaOrderByWithRelationInput[];
    cursor?: Prisma.MediaWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MediaScalarFieldEnum | Prisma.MediaScalarFieldEnum[];
};
export type MediaFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MediaSelect<ExtArgs> | null;
    omit?: Prisma.MediaOmit<ExtArgs> | null;
    include?: Prisma.MediaInclude<ExtArgs> | null;
    where?: Prisma.MediaWhereInput;
    orderBy?: Prisma.MediaOrderByWithRelationInput | Prisma.MediaOrderByWithRelationInput[];
    cursor?: Prisma.MediaWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MediaScalarFieldEnum | Prisma.MediaScalarFieldEnum[];
};
export type MediaFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MediaSelect<ExtArgs> | null;
    omit?: Prisma.MediaOmit<ExtArgs> | null;
    include?: Prisma.MediaInclude<ExtArgs> | null;
    where?: Prisma.MediaWhereInput;
    orderBy?: Prisma.MediaOrderByWithRelationInput | Prisma.MediaOrderByWithRelationInput[];
    cursor?: Prisma.MediaWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MediaScalarFieldEnum | Prisma.MediaScalarFieldEnum[];
};
export type MediaCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MediaSelect<ExtArgs> | null;
    omit?: Prisma.MediaOmit<ExtArgs> | null;
    include?: Prisma.MediaInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MediaCreateInput, Prisma.MediaUncheckedCreateInput>;
};
export type MediaCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.MediaCreateManyInput | Prisma.MediaCreateManyInput[];
    skipDuplicates?: boolean;
};
export type MediaCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MediaSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.MediaOmit<ExtArgs> | null;
    data: Prisma.MediaCreateManyInput | Prisma.MediaCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.MediaIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type MediaUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MediaSelect<ExtArgs> | null;
    omit?: Prisma.MediaOmit<ExtArgs> | null;
    include?: Prisma.MediaInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MediaUpdateInput, Prisma.MediaUncheckedUpdateInput>;
    where: Prisma.MediaWhereUniqueInput;
};
export type MediaUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.MediaUpdateManyMutationInput, Prisma.MediaUncheckedUpdateManyInput>;
    where?: Prisma.MediaWhereInput;
    limit?: number;
};
export type MediaUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MediaSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.MediaOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MediaUpdateManyMutationInput, Prisma.MediaUncheckedUpdateManyInput>;
    where?: Prisma.MediaWhereInput;
    limit?: number;
    include?: Prisma.MediaIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type MediaUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MediaSelect<ExtArgs> | null;
    omit?: Prisma.MediaOmit<ExtArgs> | null;
    include?: Prisma.MediaInclude<ExtArgs> | null;
    where: Prisma.MediaWhereUniqueInput;
    create: Prisma.XOR<Prisma.MediaCreateInput, Prisma.MediaUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.MediaUpdateInput, Prisma.MediaUncheckedUpdateInput>;
};
export type MediaDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MediaSelect<ExtArgs> | null;
    omit?: Prisma.MediaOmit<ExtArgs> | null;
    include?: Prisma.MediaInclude<ExtArgs> | null;
    where: Prisma.MediaWhereUniqueInput;
};
export type MediaDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MediaWhereInput;
    limit?: number;
};
export type Media$articlesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type MediaDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MediaSelect<ExtArgs> | null;
    omit?: Prisma.MediaOmit<ExtArgs> | null;
    include?: Prisma.MediaInclude<ExtArgs> | null;
};
