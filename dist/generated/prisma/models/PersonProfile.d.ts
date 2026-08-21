import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type PersonProfileModel = runtime.Types.Result.DefaultSelection<Prisma.$PersonProfilePayload>;
export type AggregatePersonProfile = {
    _count: PersonProfileCountAggregateOutputType | null;
    _min: PersonProfileMinAggregateOutputType | null;
    _max: PersonProfileMaxAggregateOutputType | null;
};
export type PersonProfileMinAggregateOutputType = {
    id: string | null;
    tenantId: string | null;
    name: string | null;
    slug: string | null;
    bio: string | null;
    image: string | null;
    birthDate: string | null;
    title: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type PersonProfileMaxAggregateOutputType = {
    id: string | null;
    tenantId: string | null;
    name: string | null;
    slug: string | null;
    bio: string | null;
    image: string | null;
    birthDate: string | null;
    title: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type PersonProfileCountAggregateOutputType = {
    id: number;
    tenantId: number;
    name: number;
    slug: number;
    bio: number;
    image: number;
    birthDate: number;
    title: number;
    social: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type PersonProfileMinAggregateInputType = {
    id?: true;
    tenantId?: true;
    name?: true;
    slug?: true;
    bio?: true;
    image?: true;
    birthDate?: true;
    title?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type PersonProfileMaxAggregateInputType = {
    id?: true;
    tenantId?: true;
    name?: true;
    slug?: true;
    bio?: true;
    image?: true;
    birthDate?: true;
    title?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type PersonProfileCountAggregateInputType = {
    id?: true;
    tenantId?: true;
    name?: true;
    slug?: true;
    bio?: true;
    image?: true;
    birthDate?: true;
    title?: true;
    social?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type PersonProfileAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PersonProfileWhereInput;
    orderBy?: Prisma.PersonProfileOrderByWithRelationInput | Prisma.PersonProfileOrderByWithRelationInput[];
    cursor?: Prisma.PersonProfileWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PersonProfileCountAggregateInputType;
    _min?: PersonProfileMinAggregateInputType;
    _max?: PersonProfileMaxAggregateInputType;
};
export type GetPersonProfileAggregateType<T extends PersonProfileAggregateArgs> = {
    [P in keyof T & keyof AggregatePersonProfile]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePersonProfile[P]> : Prisma.GetScalarType<T[P], AggregatePersonProfile[P]>;
};
export type PersonProfileGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PersonProfileWhereInput;
    orderBy?: Prisma.PersonProfileOrderByWithAggregationInput | Prisma.PersonProfileOrderByWithAggregationInput[];
    by: Prisma.PersonProfileScalarFieldEnum[] | Prisma.PersonProfileScalarFieldEnum;
    having?: Prisma.PersonProfileScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PersonProfileCountAggregateInputType | true;
    _min?: PersonProfileMinAggregateInputType;
    _max?: PersonProfileMaxAggregateInputType;
};
export type PersonProfileGroupByOutputType = {
    id: string;
    tenantId: string;
    name: string;
    slug: string;
    bio: string | null;
    image: string | null;
    birthDate: string | null;
    title: string | null;
    social: runtime.JsonValue;
    createdAt: Date;
    updatedAt: Date;
    _count: PersonProfileCountAggregateOutputType | null;
    _min: PersonProfileMinAggregateOutputType | null;
    _max: PersonProfileMaxAggregateOutputType | null;
};
export type GetPersonProfileGroupByPayload<T extends PersonProfileGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PersonProfileGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PersonProfileGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PersonProfileGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PersonProfileGroupByOutputType[P]>;
}>>;
export type PersonProfileWhereInput = {
    AND?: Prisma.PersonProfileWhereInput | Prisma.PersonProfileWhereInput[];
    OR?: Prisma.PersonProfileWhereInput[];
    NOT?: Prisma.PersonProfileWhereInput | Prisma.PersonProfileWhereInput[];
    id?: Prisma.StringFilter<"PersonProfile"> | string;
    tenantId?: Prisma.StringFilter<"PersonProfile"> | string;
    name?: Prisma.StringFilter<"PersonProfile"> | string;
    slug?: Prisma.StringFilter<"PersonProfile"> | string;
    bio?: Prisma.StringNullableFilter<"PersonProfile"> | string | null;
    image?: Prisma.StringNullableFilter<"PersonProfile"> | string | null;
    birthDate?: Prisma.StringNullableFilter<"PersonProfile"> | string | null;
    title?: Prisma.StringNullableFilter<"PersonProfile"> | string | null;
    social?: Prisma.JsonFilter<"PersonProfile">;
    createdAt?: Prisma.DateTimeFilter<"PersonProfile"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"PersonProfile"> | Date | string;
    tenant?: Prisma.XOR<Prisma.TenantScalarRelationFilter, Prisma.TenantWhereInput>;
    articles?: Prisma.ArticlePersonListRelationFilter;
};
export type PersonProfileOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    bio?: Prisma.SortOrderInput | Prisma.SortOrder;
    image?: Prisma.SortOrderInput | Prisma.SortOrder;
    birthDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    title?: Prisma.SortOrderInput | Prisma.SortOrder;
    social?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    tenant?: Prisma.TenantOrderByWithRelationInput;
    articles?: Prisma.ArticlePersonOrderByRelationAggregateInput;
};
export type PersonProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    tenantId_slug?: Prisma.PersonProfileTenantIdSlugCompoundUniqueInput;
    AND?: Prisma.PersonProfileWhereInput | Prisma.PersonProfileWhereInput[];
    OR?: Prisma.PersonProfileWhereInput[];
    NOT?: Prisma.PersonProfileWhereInput | Prisma.PersonProfileWhereInput[];
    tenantId?: Prisma.StringFilter<"PersonProfile"> | string;
    name?: Prisma.StringFilter<"PersonProfile"> | string;
    slug?: Prisma.StringFilter<"PersonProfile"> | string;
    bio?: Prisma.StringNullableFilter<"PersonProfile"> | string | null;
    image?: Prisma.StringNullableFilter<"PersonProfile"> | string | null;
    birthDate?: Prisma.StringNullableFilter<"PersonProfile"> | string | null;
    title?: Prisma.StringNullableFilter<"PersonProfile"> | string | null;
    social?: Prisma.JsonFilter<"PersonProfile">;
    createdAt?: Prisma.DateTimeFilter<"PersonProfile"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"PersonProfile"> | Date | string;
    tenant?: Prisma.XOR<Prisma.TenantScalarRelationFilter, Prisma.TenantWhereInput>;
    articles?: Prisma.ArticlePersonListRelationFilter;
}, "id" | "tenantId_slug">;
export type PersonProfileOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    bio?: Prisma.SortOrderInput | Prisma.SortOrder;
    image?: Prisma.SortOrderInput | Prisma.SortOrder;
    birthDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    title?: Prisma.SortOrderInput | Prisma.SortOrder;
    social?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.PersonProfileCountOrderByAggregateInput;
    _max?: Prisma.PersonProfileMaxOrderByAggregateInput;
    _min?: Prisma.PersonProfileMinOrderByAggregateInput;
};
export type PersonProfileScalarWhereWithAggregatesInput = {
    AND?: Prisma.PersonProfileScalarWhereWithAggregatesInput | Prisma.PersonProfileScalarWhereWithAggregatesInput[];
    OR?: Prisma.PersonProfileScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PersonProfileScalarWhereWithAggregatesInput | Prisma.PersonProfileScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"PersonProfile"> | string;
    tenantId?: Prisma.StringWithAggregatesFilter<"PersonProfile"> | string;
    name?: Prisma.StringWithAggregatesFilter<"PersonProfile"> | string;
    slug?: Prisma.StringWithAggregatesFilter<"PersonProfile"> | string;
    bio?: Prisma.StringNullableWithAggregatesFilter<"PersonProfile"> | string | null;
    image?: Prisma.StringNullableWithAggregatesFilter<"PersonProfile"> | string | null;
    birthDate?: Prisma.StringNullableWithAggregatesFilter<"PersonProfile"> | string | null;
    title?: Prisma.StringNullableWithAggregatesFilter<"PersonProfile"> | string | null;
    social?: Prisma.JsonWithAggregatesFilter<"PersonProfile">;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"PersonProfile"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"PersonProfile"> | Date | string;
};
export type PersonProfileCreateInput = {
    id?: string;
    name: string;
    slug: string;
    bio?: string | null;
    image?: string | null;
    birthDate?: string | null;
    title?: string | null;
    social?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tenant: Prisma.TenantCreateNestedOneWithoutPersonProfilesInput;
    articles?: Prisma.ArticlePersonCreateNestedManyWithoutPersonInput;
};
export type PersonProfileUncheckedCreateInput = {
    id?: string;
    tenantId: string;
    name: string;
    slug: string;
    bio?: string | null;
    image?: string | null;
    birthDate?: string | null;
    title?: string | null;
    social?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    articles?: Prisma.ArticlePersonUncheckedCreateNestedManyWithoutPersonInput;
};
export type PersonProfileUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    birthDate?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    social?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tenant?: Prisma.TenantUpdateOneRequiredWithoutPersonProfilesNestedInput;
    articles?: Prisma.ArticlePersonUpdateManyWithoutPersonNestedInput;
};
export type PersonProfileUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    birthDate?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    social?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    articles?: Prisma.ArticlePersonUncheckedUpdateManyWithoutPersonNestedInput;
};
export type PersonProfileCreateManyInput = {
    id?: string;
    tenantId: string;
    name: string;
    slug: string;
    bio?: string | null;
    image?: string | null;
    birthDate?: string | null;
    title?: string | null;
    social?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PersonProfileUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    birthDate?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    social?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PersonProfileUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    birthDate?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    social?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PersonProfileListRelationFilter = {
    every?: Prisma.PersonProfileWhereInput;
    some?: Prisma.PersonProfileWhereInput;
    none?: Prisma.PersonProfileWhereInput;
};
export type PersonProfileOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type PersonProfileTenantIdSlugCompoundUniqueInput = {
    tenantId: string;
    slug: string;
};
export type PersonProfileCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    bio?: Prisma.SortOrder;
    image?: Prisma.SortOrder;
    birthDate?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    social?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PersonProfileMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    bio?: Prisma.SortOrder;
    image?: Prisma.SortOrder;
    birthDate?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PersonProfileMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    bio?: Prisma.SortOrder;
    image?: Prisma.SortOrder;
    birthDate?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PersonProfileScalarRelationFilter = {
    is?: Prisma.PersonProfileWhereInput;
    isNot?: Prisma.PersonProfileWhereInput;
};
export type PersonProfileCreateNestedManyWithoutTenantInput = {
    create?: Prisma.XOR<Prisma.PersonProfileCreateWithoutTenantInput, Prisma.PersonProfileUncheckedCreateWithoutTenantInput> | Prisma.PersonProfileCreateWithoutTenantInput[] | Prisma.PersonProfileUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.PersonProfileCreateOrConnectWithoutTenantInput | Prisma.PersonProfileCreateOrConnectWithoutTenantInput[];
    createMany?: Prisma.PersonProfileCreateManyTenantInputEnvelope;
    connect?: Prisma.PersonProfileWhereUniqueInput | Prisma.PersonProfileWhereUniqueInput[];
};
export type PersonProfileUncheckedCreateNestedManyWithoutTenantInput = {
    create?: Prisma.XOR<Prisma.PersonProfileCreateWithoutTenantInput, Prisma.PersonProfileUncheckedCreateWithoutTenantInput> | Prisma.PersonProfileCreateWithoutTenantInput[] | Prisma.PersonProfileUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.PersonProfileCreateOrConnectWithoutTenantInput | Prisma.PersonProfileCreateOrConnectWithoutTenantInput[];
    createMany?: Prisma.PersonProfileCreateManyTenantInputEnvelope;
    connect?: Prisma.PersonProfileWhereUniqueInput | Prisma.PersonProfileWhereUniqueInput[];
};
export type PersonProfileUpdateManyWithoutTenantNestedInput = {
    create?: Prisma.XOR<Prisma.PersonProfileCreateWithoutTenantInput, Prisma.PersonProfileUncheckedCreateWithoutTenantInput> | Prisma.PersonProfileCreateWithoutTenantInput[] | Prisma.PersonProfileUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.PersonProfileCreateOrConnectWithoutTenantInput | Prisma.PersonProfileCreateOrConnectWithoutTenantInput[];
    upsert?: Prisma.PersonProfileUpsertWithWhereUniqueWithoutTenantInput | Prisma.PersonProfileUpsertWithWhereUniqueWithoutTenantInput[];
    createMany?: Prisma.PersonProfileCreateManyTenantInputEnvelope;
    set?: Prisma.PersonProfileWhereUniqueInput | Prisma.PersonProfileWhereUniqueInput[];
    disconnect?: Prisma.PersonProfileWhereUniqueInput | Prisma.PersonProfileWhereUniqueInput[];
    delete?: Prisma.PersonProfileWhereUniqueInput | Prisma.PersonProfileWhereUniqueInput[];
    connect?: Prisma.PersonProfileWhereUniqueInput | Prisma.PersonProfileWhereUniqueInput[];
    update?: Prisma.PersonProfileUpdateWithWhereUniqueWithoutTenantInput | Prisma.PersonProfileUpdateWithWhereUniqueWithoutTenantInput[];
    updateMany?: Prisma.PersonProfileUpdateManyWithWhereWithoutTenantInput | Prisma.PersonProfileUpdateManyWithWhereWithoutTenantInput[];
    deleteMany?: Prisma.PersonProfileScalarWhereInput | Prisma.PersonProfileScalarWhereInput[];
};
export type PersonProfileUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: Prisma.XOR<Prisma.PersonProfileCreateWithoutTenantInput, Prisma.PersonProfileUncheckedCreateWithoutTenantInput> | Prisma.PersonProfileCreateWithoutTenantInput[] | Prisma.PersonProfileUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.PersonProfileCreateOrConnectWithoutTenantInput | Prisma.PersonProfileCreateOrConnectWithoutTenantInput[];
    upsert?: Prisma.PersonProfileUpsertWithWhereUniqueWithoutTenantInput | Prisma.PersonProfileUpsertWithWhereUniqueWithoutTenantInput[];
    createMany?: Prisma.PersonProfileCreateManyTenantInputEnvelope;
    set?: Prisma.PersonProfileWhereUniqueInput | Prisma.PersonProfileWhereUniqueInput[];
    disconnect?: Prisma.PersonProfileWhereUniqueInput | Prisma.PersonProfileWhereUniqueInput[];
    delete?: Prisma.PersonProfileWhereUniqueInput | Prisma.PersonProfileWhereUniqueInput[];
    connect?: Prisma.PersonProfileWhereUniqueInput | Prisma.PersonProfileWhereUniqueInput[];
    update?: Prisma.PersonProfileUpdateWithWhereUniqueWithoutTenantInput | Prisma.PersonProfileUpdateWithWhereUniqueWithoutTenantInput[];
    updateMany?: Prisma.PersonProfileUpdateManyWithWhereWithoutTenantInput | Prisma.PersonProfileUpdateManyWithWhereWithoutTenantInput[];
    deleteMany?: Prisma.PersonProfileScalarWhereInput | Prisma.PersonProfileScalarWhereInput[];
};
export type PersonProfileCreateNestedOneWithoutArticlesInput = {
    create?: Prisma.XOR<Prisma.PersonProfileCreateWithoutArticlesInput, Prisma.PersonProfileUncheckedCreateWithoutArticlesInput>;
    connectOrCreate?: Prisma.PersonProfileCreateOrConnectWithoutArticlesInput;
    connect?: Prisma.PersonProfileWhereUniqueInput;
};
export type PersonProfileUpdateOneRequiredWithoutArticlesNestedInput = {
    create?: Prisma.XOR<Prisma.PersonProfileCreateWithoutArticlesInput, Prisma.PersonProfileUncheckedCreateWithoutArticlesInput>;
    connectOrCreate?: Prisma.PersonProfileCreateOrConnectWithoutArticlesInput;
    upsert?: Prisma.PersonProfileUpsertWithoutArticlesInput;
    connect?: Prisma.PersonProfileWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PersonProfileUpdateToOneWithWhereWithoutArticlesInput, Prisma.PersonProfileUpdateWithoutArticlesInput>, Prisma.PersonProfileUncheckedUpdateWithoutArticlesInput>;
};
export type PersonProfileCreateWithoutTenantInput = {
    id?: string;
    name: string;
    slug: string;
    bio?: string | null;
    image?: string | null;
    birthDate?: string | null;
    title?: string | null;
    social?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    articles?: Prisma.ArticlePersonCreateNestedManyWithoutPersonInput;
};
export type PersonProfileUncheckedCreateWithoutTenantInput = {
    id?: string;
    name: string;
    slug: string;
    bio?: string | null;
    image?: string | null;
    birthDate?: string | null;
    title?: string | null;
    social?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    articles?: Prisma.ArticlePersonUncheckedCreateNestedManyWithoutPersonInput;
};
export type PersonProfileCreateOrConnectWithoutTenantInput = {
    where: Prisma.PersonProfileWhereUniqueInput;
    create: Prisma.XOR<Prisma.PersonProfileCreateWithoutTenantInput, Prisma.PersonProfileUncheckedCreateWithoutTenantInput>;
};
export type PersonProfileCreateManyTenantInputEnvelope = {
    data: Prisma.PersonProfileCreateManyTenantInput | Prisma.PersonProfileCreateManyTenantInput[];
    skipDuplicates?: boolean;
};
export type PersonProfileUpsertWithWhereUniqueWithoutTenantInput = {
    where: Prisma.PersonProfileWhereUniqueInput;
    update: Prisma.XOR<Prisma.PersonProfileUpdateWithoutTenantInput, Prisma.PersonProfileUncheckedUpdateWithoutTenantInput>;
    create: Prisma.XOR<Prisma.PersonProfileCreateWithoutTenantInput, Prisma.PersonProfileUncheckedCreateWithoutTenantInput>;
};
export type PersonProfileUpdateWithWhereUniqueWithoutTenantInput = {
    where: Prisma.PersonProfileWhereUniqueInput;
    data: Prisma.XOR<Prisma.PersonProfileUpdateWithoutTenantInput, Prisma.PersonProfileUncheckedUpdateWithoutTenantInput>;
};
export type PersonProfileUpdateManyWithWhereWithoutTenantInput = {
    where: Prisma.PersonProfileScalarWhereInput;
    data: Prisma.XOR<Prisma.PersonProfileUpdateManyMutationInput, Prisma.PersonProfileUncheckedUpdateManyWithoutTenantInput>;
};
export type PersonProfileScalarWhereInput = {
    AND?: Prisma.PersonProfileScalarWhereInput | Prisma.PersonProfileScalarWhereInput[];
    OR?: Prisma.PersonProfileScalarWhereInput[];
    NOT?: Prisma.PersonProfileScalarWhereInput | Prisma.PersonProfileScalarWhereInput[];
    id?: Prisma.StringFilter<"PersonProfile"> | string;
    tenantId?: Prisma.StringFilter<"PersonProfile"> | string;
    name?: Prisma.StringFilter<"PersonProfile"> | string;
    slug?: Prisma.StringFilter<"PersonProfile"> | string;
    bio?: Prisma.StringNullableFilter<"PersonProfile"> | string | null;
    image?: Prisma.StringNullableFilter<"PersonProfile"> | string | null;
    birthDate?: Prisma.StringNullableFilter<"PersonProfile"> | string | null;
    title?: Prisma.StringNullableFilter<"PersonProfile"> | string | null;
    social?: Prisma.JsonFilter<"PersonProfile">;
    createdAt?: Prisma.DateTimeFilter<"PersonProfile"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"PersonProfile"> | Date | string;
};
export type PersonProfileCreateWithoutArticlesInput = {
    id?: string;
    name: string;
    slug: string;
    bio?: string | null;
    image?: string | null;
    birthDate?: string | null;
    title?: string | null;
    social?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tenant: Prisma.TenantCreateNestedOneWithoutPersonProfilesInput;
};
export type PersonProfileUncheckedCreateWithoutArticlesInput = {
    id?: string;
    tenantId: string;
    name: string;
    slug: string;
    bio?: string | null;
    image?: string | null;
    birthDate?: string | null;
    title?: string | null;
    social?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PersonProfileCreateOrConnectWithoutArticlesInput = {
    where: Prisma.PersonProfileWhereUniqueInput;
    create: Prisma.XOR<Prisma.PersonProfileCreateWithoutArticlesInput, Prisma.PersonProfileUncheckedCreateWithoutArticlesInput>;
};
export type PersonProfileUpsertWithoutArticlesInput = {
    update: Prisma.XOR<Prisma.PersonProfileUpdateWithoutArticlesInput, Prisma.PersonProfileUncheckedUpdateWithoutArticlesInput>;
    create: Prisma.XOR<Prisma.PersonProfileCreateWithoutArticlesInput, Prisma.PersonProfileUncheckedCreateWithoutArticlesInput>;
    where?: Prisma.PersonProfileWhereInput;
};
export type PersonProfileUpdateToOneWithWhereWithoutArticlesInput = {
    where?: Prisma.PersonProfileWhereInput;
    data: Prisma.XOR<Prisma.PersonProfileUpdateWithoutArticlesInput, Prisma.PersonProfileUncheckedUpdateWithoutArticlesInput>;
};
export type PersonProfileUpdateWithoutArticlesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    birthDate?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    social?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tenant?: Prisma.TenantUpdateOneRequiredWithoutPersonProfilesNestedInput;
};
export type PersonProfileUncheckedUpdateWithoutArticlesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    birthDate?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    social?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PersonProfileCreateManyTenantInput = {
    id?: string;
    name: string;
    slug: string;
    bio?: string | null;
    image?: string | null;
    birthDate?: string | null;
    title?: string | null;
    social?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PersonProfileUpdateWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    birthDate?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    social?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    articles?: Prisma.ArticlePersonUpdateManyWithoutPersonNestedInput;
};
export type PersonProfileUncheckedUpdateWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    birthDate?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    social?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    articles?: Prisma.ArticlePersonUncheckedUpdateManyWithoutPersonNestedInput;
};
export type PersonProfileUncheckedUpdateManyWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    birthDate?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    social?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PersonProfileCountOutputType = {
    articles: number;
};
export type PersonProfileCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    articles?: boolean | PersonProfileCountOutputTypeCountArticlesArgs;
};
export type PersonProfileCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PersonProfileCountOutputTypeSelect<ExtArgs> | null;
};
export type PersonProfileCountOutputTypeCountArticlesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ArticlePersonWhereInput;
};
export type PersonProfileSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    name?: boolean;
    slug?: boolean;
    bio?: boolean;
    image?: boolean;
    birthDate?: boolean;
    title?: boolean;
    social?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
    articles?: boolean | Prisma.PersonProfile$articlesArgs<ExtArgs>;
    _count?: boolean | Prisma.PersonProfileCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["personProfile"]>;
export type PersonProfileSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    name?: boolean;
    slug?: boolean;
    bio?: boolean;
    image?: boolean;
    birthDate?: boolean;
    title?: boolean;
    social?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["personProfile"]>;
export type PersonProfileSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    name?: boolean;
    slug?: boolean;
    bio?: boolean;
    image?: boolean;
    birthDate?: boolean;
    title?: boolean;
    social?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["personProfile"]>;
export type PersonProfileSelectScalar = {
    id?: boolean;
    tenantId?: boolean;
    name?: boolean;
    slug?: boolean;
    bio?: boolean;
    image?: boolean;
    birthDate?: boolean;
    title?: boolean;
    social?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type PersonProfileOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "tenantId" | "name" | "slug" | "bio" | "image" | "birthDate" | "title" | "social" | "createdAt" | "updatedAt", ExtArgs["result"]["personProfile"]>;
export type PersonProfileInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
    articles?: boolean | Prisma.PersonProfile$articlesArgs<ExtArgs>;
    _count?: boolean | Prisma.PersonProfileCountOutputTypeDefaultArgs<ExtArgs>;
};
export type PersonProfileIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
};
export type PersonProfileIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
};
export type $PersonProfilePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "PersonProfile";
    objects: {
        tenant: Prisma.$TenantPayload<ExtArgs>;
        articles: Prisma.$ArticlePersonPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        tenantId: string;
        name: string;
        slug: string;
        bio: string | null;
        image: string | null;
        birthDate: string | null;
        title: string | null;
        social: runtime.JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["personProfile"]>;
    composites: {};
};
export type PersonProfileGetPayload<S extends boolean | null | undefined | PersonProfileDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PersonProfilePayload, S>;
export type PersonProfileCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PersonProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PersonProfileCountAggregateInputType | true;
};
export interface PersonProfileDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['PersonProfile'];
        meta: {
            name: 'PersonProfile';
        };
    };
    findUnique<T extends PersonProfileFindUniqueArgs>(args: Prisma.SelectSubset<T, PersonProfileFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PersonProfileClient<runtime.Types.Result.GetResult<Prisma.$PersonProfilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends PersonProfileFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PersonProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PersonProfileClient<runtime.Types.Result.GetResult<Prisma.$PersonProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends PersonProfileFindFirstArgs>(args?: Prisma.SelectSubset<T, PersonProfileFindFirstArgs<ExtArgs>>): Prisma.Prisma__PersonProfileClient<runtime.Types.Result.GetResult<Prisma.$PersonProfilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends PersonProfileFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PersonProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PersonProfileClient<runtime.Types.Result.GetResult<Prisma.$PersonProfilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends PersonProfileFindManyArgs>(args?: Prisma.SelectSubset<T, PersonProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PersonProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends PersonProfileCreateArgs>(args: Prisma.SelectSubset<T, PersonProfileCreateArgs<ExtArgs>>): Prisma.Prisma__PersonProfileClient<runtime.Types.Result.GetResult<Prisma.$PersonProfilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends PersonProfileCreateManyArgs>(args?: Prisma.SelectSubset<T, PersonProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends PersonProfileCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PersonProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PersonProfilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends PersonProfileDeleteArgs>(args: Prisma.SelectSubset<T, PersonProfileDeleteArgs<ExtArgs>>): Prisma.Prisma__PersonProfileClient<runtime.Types.Result.GetResult<Prisma.$PersonProfilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends PersonProfileUpdateArgs>(args: Prisma.SelectSubset<T, PersonProfileUpdateArgs<ExtArgs>>): Prisma.Prisma__PersonProfileClient<runtime.Types.Result.GetResult<Prisma.$PersonProfilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends PersonProfileDeleteManyArgs>(args?: Prisma.SelectSubset<T, PersonProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends PersonProfileUpdateManyArgs>(args: Prisma.SelectSubset<T, PersonProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends PersonProfileUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PersonProfileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PersonProfilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends PersonProfileUpsertArgs>(args: Prisma.SelectSubset<T, PersonProfileUpsertArgs<ExtArgs>>): Prisma.Prisma__PersonProfileClient<runtime.Types.Result.GetResult<Prisma.$PersonProfilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends PersonProfileCountArgs>(args?: Prisma.Subset<T, PersonProfileCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PersonProfileCountAggregateOutputType> : number>;
    aggregate<T extends PersonProfileAggregateArgs>(args: Prisma.Subset<T, PersonProfileAggregateArgs>): Prisma.PrismaPromise<GetPersonProfileAggregateType<T>>;
    groupBy<T extends PersonProfileGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PersonProfileGroupByArgs['orderBy'];
    } : {
        orderBy?: PersonProfileGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PersonProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPersonProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PersonProfileFieldRefs;
}
export interface Prisma__PersonProfileClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    tenant<T extends Prisma.TenantDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TenantDefaultArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    articles<T extends Prisma.PersonProfile$articlesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PersonProfile$articlesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ArticlePersonPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface PersonProfileFieldRefs {
    readonly id: Prisma.FieldRef<"PersonProfile", 'String'>;
    readonly tenantId: Prisma.FieldRef<"PersonProfile", 'String'>;
    readonly name: Prisma.FieldRef<"PersonProfile", 'String'>;
    readonly slug: Prisma.FieldRef<"PersonProfile", 'String'>;
    readonly bio: Prisma.FieldRef<"PersonProfile", 'String'>;
    readonly image: Prisma.FieldRef<"PersonProfile", 'String'>;
    readonly birthDate: Prisma.FieldRef<"PersonProfile", 'String'>;
    readonly title: Prisma.FieldRef<"PersonProfile", 'String'>;
    readonly social: Prisma.FieldRef<"PersonProfile", 'Json'>;
    readonly createdAt: Prisma.FieldRef<"PersonProfile", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"PersonProfile", 'DateTime'>;
}
export type PersonProfileFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PersonProfileSelect<ExtArgs> | null;
    omit?: Prisma.PersonProfileOmit<ExtArgs> | null;
    include?: Prisma.PersonProfileInclude<ExtArgs> | null;
    where: Prisma.PersonProfileWhereUniqueInput;
};
export type PersonProfileFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PersonProfileSelect<ExtArgs> | null;
    omit?: Prisma.PersonProfileOmit<ExtArgs> | null;
    include?: Prisma.PersonProfileInclude<ExtArgs> | null;
    where: Prisma.PersonProfileWhereUniqueInput;
};
export type PersonProfileFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PersonProfileSelect<ExtArgs> | null;
    omit?: Prisma.PersonProfileOmit<ExtArgs> | null;
    include?: Prisma.PersonProfileInclude<ExtArgs> | null;
    where?: Prisma.PersonProfileWhereInput;
    orderBy?: Prisma.PersonProfileOrderByWithRelationInput | Prisma.PersonProfileOrderByWithRelationInput[];
    cursor?: Prisma.PersonProfileWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PersonProfileScalarFieldEnum | Prisma.PersonProfileScalarFieldEnum[];
};
export type PersonProfileFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PersonProfileSelect<ExtArgs> | null;
    omit?: Prisma.PersonProfileOmit<ExtArgs> | null;
    include?: Prisma.PersonProfileInclude<ExtArgs> | null;
    where?: Prisma.PersonProfileWhereInput;
    orderBy?: Prisma.PersonProfileOrderByWithRelationInput | Prisma.PersonProfileOrderByWithRelationInput[];
    cursor?: Prisma.PersonProfileWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PersonProfileScalarFieldEnum | Prisma.PersonProfileScalarFieldEnum[];
};
export type PersonProfileFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PersonProfileSelect<ExtArgs> | null;
    omit?: Prisma.PersonProfileOmit<ExtArgs> | null;
    include?: Prisma.PersonProfileInclude<ExtArgs> | null;
    where?: Prisma.PersonProfileWhereInput;
    orderBy?: Prisma.PersonProfileOrderByWithRelationInput | Prisma.PersonProfileOrderByWithRelationInput[];
    cursor?: Prisma.PersonProfileWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PersonProfileScalarFieldEnum | Prisma.PersonProfileScalarFieldEnum[];
};
export type PersonProfileCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PersonProfileSelect<ExtArgs> | null;
    omit?: Prisma.PersonProfileOmit<ExtArgs> | null;
    include?: Prisma.PersonProfileInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PersonProfileCreateInput, Prisma.PersonProfileUncheckedCreateInput>;
};
export type PersonProfileCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.PersonProfileCreateManyInput | Prisma.PersonProfileCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PersonProfileCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PersonProfileSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PersonProfileOmit<ExtArgs> | null;
    data: Prisma.PersonProfileCreateManyInput | Prisma.PersonProfileCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.PersonProfileIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type PersonProfileUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PersonProfileSelect<ExtArgs> | null;
    omit?: Prisma.PersonProfileOmit<ExtArgs> | null;
    include?: Prisma.PersonProfileInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PersonProfileUpdateInput, Prisma.PersonProfileUncheckedUpdateInput>;
    where: Prisma.PersonProfileWhereUniqueInput;
};
export type PersonProfileUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.PersonProfileUpdateManyMutationInput, Prisma.PersonProfileUncheckedUpdateManyInput>;
    where?: Prisma.PersonProfileWhereInput;
    limit?: number;
};
export type PersonProfileUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PersonProfileSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PersonProfileOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PersonProfileUpdateManyMutationInput, Prisma.PersonProfileUncheckedUpdateManyInput>;
    where?: Prisma.PersonProfileWhereInput;
    limit?: number;
    include?: Prisma.PersonProfileIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type PersonProfileUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PersonProfileSelect<ExtArgs> | null;
    omit?: Prisma.PersonProfileOmit<ExtArgs> | null;
    include?: Prisma.PersonProfileInclude<ExtArgs> | null;
    where: Prisma.PersonProfileWhereUniqueInput;
    create: Prisma.XOR<Prisma.PersonProfileCreateInput, Prisma.PersonProfileUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.PersonProfileUpdateInput, Prisma.PersonProfileUncheckedUpdateInput>;
};
export type PersonProfileDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PersonProfileSelect<ExtArgs> | null;
    omit?: Prisma.PersonProfileOmit<ExtArgs> | null;
    include?: Prisma.PersonProfileInclude<ExtArgs> | null;
    where: Prisma.PersonProfileWhereUniqueInput;
};
export type PersonProfileDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PersonProfileWhereInput;
    limit?: number;
};
export type PersonProfile$articlesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type PersonProfileDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PersonProfileSelect<ExtArgs> | null;
    omit?: Prisma.PersonProfileOmit<ExtArgs> | null;
    include?: Prisma.PersonProfileInclude<ExtArgs> | null;
};
