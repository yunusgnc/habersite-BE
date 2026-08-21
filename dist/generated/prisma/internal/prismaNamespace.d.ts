import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../models.js";
import { type PrismaClient } from "./class.js";
export type * from '../models.js';
export type DMMF = typeof runtime.DMMF;
export type PrismaPromise<T> = runtime.Types.Public.PrismaPromise<T>;
export declare const PrismaClientKnownRequestError: typeof runtime.PrismaClientKnownRequestError;
export type PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
export declare const PrismaClientUnknownRequestError: typeof runtime.PrismaClientUnknownRequestError;
export type PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
export declare const PrismaClientRustPanicError: typeof runtime.PrismaClientRustPanicError;
export type PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
export declare const PrismaClientInitializationError: typeof runtime.PrismaClientInitializationError;
export type PrismaClientInitializationError = runtime.PrismaClientInitializationError;
export declare const PrismaClientValidationError: typeof runtime.PrismaClientValidationError;
export type PrismaClientValidationError = runtime.PrismaClientValidationError;
export declare const sql: typeof runtime.sqltag;
export declare const empty: runtime.Sql;
export declare const join: typeof runtime.join;
export declare const raw: typeof runtime.raw;
export declare const Sql: typeof runtime.Sql;
export type Sql = runtime.Sql;
export declare const Decimal: typeof runtime.Decimal;
export type Decimal = runtime.Decimal;
export type DecimalJsLike = runtime.DecimalJsLike;
export type Extension = runtime.Types.Extensions.UserArgs;
export declare const getExtensionContext: typeof runtime.Extensions.getExtensionContext;
export type Args<T, F extends runtime.Operation> = runtime.Types.Public.Args<T, F>;
export type Payload<T, F extends runtime.Operation = never> = runtime.Types.Public.Payload<T, F>;
export type Result<T, A, F extends runtime.Operation> = runtime.Types.Public.Result<T, A, F>;
export type Exact<A, W> = runtime.Types.Public.Exact<A, W>;
export type PrismaVersion = {
    client: string;
    engine: string;
};
export declare const prismaVersion: PrismaVersion;
export type Bytes = runtime.Bytes;
export type JsonObject = runtime.JsonObject;
export type JsonArray = runtime.JsonArray;
export type JsonValue = runtime.JsonValue;
export type InputJsonObject = runtime.InputJsonObject;
export type InputJsonArray = runtime.InputJsonArray;
export type InputJsonValue = runtime.InputJsonValue;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
export declare const DbNull: runtime.DbNullClass;
export declare const JsonNull: runtime.JsonNullClass;
export declare const AnyNull: runtime.AnyNullClass;
type SelectAndInclude = {
    select: any;
    include: any;
};
type SelectAndOmit = {
    select: any;
    omit: any;
};
type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
export type Enumerable<T> = T | Array<T>;
export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
};
export type PrismaClientConstructorArgs<Options extends PrismaClientOptions> = [
    PrismaClientOptions
] extends [Options] ? PrismaClientOptions : Subset<Options, PrismaClientOptions>;
export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & (T extends SelectAndInclude ? 'Please either choose `select` or `include`.' : T extends SelectAndOmit ? 'Please either choose `select` or `omit`.' : {});
export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & K;
type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
};
export type XOR<T, U> = T extends object ? U extends object ? ((Without<T, U> & U) | (Without<U, T> & T)) & object : U : T;
type IsObject<T extends any> = T extends Array<any> ? False : T extends Date ? False : T extends Uint8Array ? False : T extends BigInt ? False : T extends object ? True : False;
export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;
type __Either<O extends object, K extends Key> = Omit<O, K> & {
    [P in K]: Prisma__Pick<O, P & keyof O>;
}[K];
type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;
type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>;
type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
}[strict];
export type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown ? _Either<O, K, strict> : never;
export type Union = any;
export type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
} & {};
export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
} & {};
type _Merge<U extends object> = IntersectOf<Overwrite<U, {
    [K in keyof U]-?: At<U, K>;
}>>;
type Key = string | number | symbol;
type AtStrict<O extends object, K extends Key> = O[K & keyof O];
type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
}[strict];
export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
} & {};
export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
} & {};
type _Record<K extends keyof any, T> = {
    [P in K]: T;
};
type NoExpand<T> = T extends unknown ? T : never;
export type AtLeast<O extends object, K extends string> = NoExpand<O extends unknown ? (K extends keyof O ? {
    [P in K]: O[P];
} & O : O) | {
    [P in keyof O as P extends K ? P : never]-?: O[P];
} & O : never>;
type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;
export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;
export type Boolean = True | False;
export type True = 1;
export type False = 0;
export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
}[B];
export type Extends<A1 extends any, A2 extends any> = [A1] extends [never] ? 0 : A1 extends A2 ? 1 : 0;
export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>;
export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
        0: 0;
        1: 1;
    };
    1: {
        0: 1;
        1: 1;
    };
}[B1][B2];
export type Keys<U extends Union> = U extends unknown ? keyof U : never;
export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O ? O[P] : never;
} : never;
type FieldPaths<T, U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>> = IsObject<T> extends True ? U : T;
export type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<'OR', K>, Extends<'AND', K>>, Extends<'NOT', K>> extends True ? T[K] extends infer TK ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never> : never : {} extends FieldPaths<T[K]> ? never : K;
}[keyof T];
type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
export type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;
export type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>;
export type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T;
export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;
type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>;
export declare const ModelName: {
    readonly Tenant: "Tenant";
    readonly User: "User";
    readonly Category: "Category";
    readonly Tag: "Tag";
    readonly Author: "Author";
    readonly Article: "Article";
    readonly ArticleCategory: "ArticleCategory";
    readonly ArticleTag: "ArticleTag";
    readonly Media: "Media";
    readonly ArticleMedia: "ArticleMedia";
    readonly Comment: "Comment";
    readonly BreakingNews: "BreakingNews";
    readonly Ad: "Ad";
    readonly Menu: "Menu";
    readonly Redirect: "Redirect";
    readonly PersonProfile: "PersonProfile";
    readonly ArticlePerson: "ArticlePerson";
    readonly Announcement: "Announcement";
    readonly Popup: "Popup";
    readonly NewsletterSubscriber: "NewsletterSubscriber";
    readonly Widget: "Widget";
    readonly Page: "Page";
    readonly AuditLog: "AuditLog";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export interface TypeMapCb<GlobalOmitOptions = {}> extends runtime.Types.Utils.Fn<{
    extArgs: runtime.Types.Extensions.InternalArgs;
}, runtime.Types.Utils.Record<string, any>> {
    returns: TypeMap<this['params']['extArgs'], GlobalOmitOptions>;
}
export type TypeMap<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
        omit: GlobalOmitOptions;
    };
    meta: {
        modelProps: "tenant" | "user" | "category" | "tag" | "author" | "article" | "articleCategory" | "articleTag" | "media" | "articleMedia" | "comment" | "breakingNews" | "ad" | "menu" | "redirect" | "personProfile" | "articlePerson" | "announcement" | "popup" | "newsletterSubscriber" | "widget" | "page" | "auditLog";
        txIsolationLevel: TransactionIsolationLevel;
    };
    model: {
        Tenant: {
            payload: Prisma.$TenantPayload<ExtArgs>;
            fields: Prisma.TenantFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.TenantFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TenantPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.TenantFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TenantPayload>;
                };
                findFirst: {
                    args: Prisma.TenantFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TenantPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.TenantFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TenantPayload>;
                };
                findMany: {
                    args: Prisma.TenantFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TenantPayload>[];
                };
                create: {
                    args: Prisma.TenantCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TenantPayload>;
                };
                createMany: {
                    args: Prisma.TenantCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.TenantCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TenantPayload>[];
                };
                delete: {
                    args: Prisma.TenantDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TenantPayload>;
                };
                update: {
                    args: Prisma.TenantUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TenantPayload>;
                };
                deleteMany: {
                    args: Prisma.TenantDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.TenantUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.TenantUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TenantPayload>[];
                };
                upsert: {
                    args: Prisma.TenantUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TenantPayload>;
                };
                aggregate: {
                    args: Prisma.TenantAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTenant>;
                };
                groupBy: {
                    args: Prisma.TenantGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TenantGroupByOutputType>[];
                };
                count: {
                    args: Prisma.TenantCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TenantCountAggregateOutputType> | number;
                };
            };
        };
        User: {
            payload: Prisma.$UserPayload<ExtArgs>;
            fields: Prisma.UserFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.UserFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                findFirst: {
                    args: Prisma.UserFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                findMany: {
                    args: Prisma.UserFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                create: {
                    args: Prisma.UserCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                createMany: {
                    args: Prisma.UserCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                delete: {
                    args: Prisma.UserDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                update: {
                    args: Prisma.UserUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                deleteMany: {
                    args: Prisma.UserDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.UserUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                upsert: {
                    args: Prisma.UserUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                aggregate: {
                    args: Prisma.UserAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateUser>;
                };
                groupBy: {
                    args: Prisma.UserGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserGroupByOutputType>[];
                };
                count: {
                    args: Prisma.UserCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserCountAggregateOutputType> | number;
                };
            };
        };
        Category: {
            payload: Prisma.$CategoryPayload<ExtArgs>;
            fields: Prisma.CategoryFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CategoryFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CategoryPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CategoryFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CategoryPayload>;
                };
                findFirst: {
                    args: Prisma.CategoryFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CategoryPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CategoryFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CategoryPayload>;
                };
                findMany: {
                    args: Prisma.CategoryFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CategoryPayload>[];
                };
                create: {
                    args: Prisma.CategoryCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CategoryPayload>;
                };
                createMany: {
                    args: Prisma.CategoryCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CategoryCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CategoryPayload>[];
                };
                delete: {
                    args: Prisma.CategoryDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CategoryPayload>;
                };
                update: {
                    args: Prisma.CategoryUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CategoryPayload>;
                };
                deleteMany: {
                    args: Prisma.CategoryDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CategoryUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CategoryUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CategoryPayload>[];
                };
                upsert: {
                    args: Prisma.CategoryUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CategoryPayload>;
                };
                aggregate: {
                    args: Prisma.CategoryAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCategory>;
                };
                groupBy: {
                    args: Prisma.CategoryGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CategoryGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CategoryCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CategoryCountAggregateOutputType> | number;
                };
            };
        };
        Tag: {
            payload: Prisma.$TagPayload<ExtArgs>;
            fields: Prisma.TagFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.TagFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TagPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.TagFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TagPayload>;
                };
                findFirst: {
                    args: Prisma.TagFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TagPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.TagFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TagPayload>;
                };
                findMany: {
                    args: Prisma.TagFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TagPayload>[];
                };
                create: {
                    args: Prisma.TagCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TagPayload>;
                };
                createMany: {
                    args: Prisma.TagCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.TagCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TagPayload>[];
                };
                delete: {
                    args: Prisma.TagDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TagPayload>;
                };
                update: {
                    args: Prisma.TagUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TagPayload>;
                };
                deleteMany: {
                    args: Prisma.TagDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.TagUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.TagUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TagPayload>[];
                };
                upsert: {
                    args: Prisma.TagUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TagPayload>;
                };
                aggregate: {
                    args: Prisma.TagAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTag>;
                };
                groupBy: {
                    args: Prisma.TagGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TagGroupByOutputType>[];
                };
                count: {
                    args: Prisma.TagCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TagCountAggregateOutputType> | number;
                };
            };
        };
        Author: {
            payload: Prisma.$AuthorPayload<ExtArgs>;
            fields: Prisma.AuthorFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.AuthorFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuthorPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.AuthorFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuthorPayload>;
                };
                findFirst: {
                    args: Prisma.AuthorFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuthorPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.AuthorFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuthorPayload>;
                };
                findMany: {
                    args: Prisma.AuthorFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuthorPayload>[];
                };
                create: {
                    args: Prisma.AuthorCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuthorPayload>;
                };
                createMany: {
                    args: Prisma.AuthorCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.AuthorCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuthorPayload>[];
                };
                delete: {
                    args: Prisma.AuthorDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuthorPayload>;
                };
                update: {
                    args: Prisma.AuthorUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuthorPayload>;
                };
                deleteMany: {
                    args: Prisma.AuthorDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.AuthorUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.AuthorUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuthorPayload>[];
                };
                upsert: {
                    args: Prisma.AuthorUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuthorPayload>;
                };
                aggregate: {
                    args: Prisma.AuthorAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateAuthor>;
                };
                groupBy: {
                    args: Prisma.AuthorGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AuthorGroupByOutputType>[];
                };
                count: {
                    args: Prisma.AuthorCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AuthorCountAggregateOutputType> | number;
                };
            };
        };
        Article: {
            payload: Prisma.$ArticlePayload<ExtArgs>;
            fields: Prisma.ArticleFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ArticleFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticlePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ArticleFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticlePayload>;
                };
                findFirst: {
                    args: Prisma.ArticleFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticlePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ArticleFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticlePayload>;
                };
                findMany: {
                    args: Prisma.ArticleFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticlePayload>[];
                };
                create: {
                    args: Prisma.ArticleCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticlePayload>;
                };
                createMany: {
                    args: Prisma.ArticleCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ArticleCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticlePayload>[];
                };
                delete: {
                    args: Prisma.ArticleDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticlePayload>;
                };
                update: {
                    args: Prisma.ArticleUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticlePayload>;
                };
                deleteMany: {
                    args: Prisma.ArticleDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ArticleUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ArticleUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticlePayload>[];
                };
                upsert: {
                    args: Prisma.ArticleUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticlePayload>;
                };
                aggregate: {
                    args: Prisma.ArticleAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateArticle>;
                };
                groupBy: {
                    args: Prisma.ArticleGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ArticleGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ArticleCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ArticleCountAggregateOutputType> | number;
                };
            };
        };
        ArticleCategory: {
            payload: Prisma.$ArticleCategoryPayload<ExtArgs>;
            fields: Prisma.ArticleCategoryFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ArticleCategoryFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleCategoryPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ArticleCategoryFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleCategoryPayload>;
                };
                findFirst: {
                    args: Prisma.ArticleCategoryFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleCategoryPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ArticleCategoryFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleCategoryPayload>;
                };
                findMany: {
                    args: Prisma.ArticleCategoryFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleCategoryPayload>[];
                };
                create: {
                    args: Prisma.ArticleCategoryCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleCategoryPayload>;
                };
                createMany: {
                    args: Prisma.ArticleCategoryCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ArticleCategoryCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleCategoryPayload>[];
                };
                delete: {
                    args: Prisma.ArticleCategoryDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleCategoryPayload>;
                };
                update: {
                    args: Prisma.ArticleCategoryUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleCategoryPayload>;
                };
                deleteMany: {
                    args: Prisma.ArticleCategoryDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ArticleCategoryUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ArticleCategoryUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleCategoryPayload>[];
                };
                upsert: {
                    args: Prisma.ArticleCategoryUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleCategoryPayload>;
                };
                aggregate: {
                    args: Prisma.ArticleCategoryAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateArticleCategory>;
                };
                groupBy: {
                    args: Prisma.ArticleCategoryGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ArticleCategoryGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ArticleCategoryCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ArticleCategoryCountAggregateOutputType> | number;
                };
            };
        };
        ArticleTag: {
            payload: Prisma.$ArticleTagPayload<ExtArgs>;
            fields: Prisma.ArticleTagFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ArticleTagFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleTagPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ArticleTagFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleTagPayload>;
                };
                findFirst: {
                    args: Prisma.ArticleTagFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleTagPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ArticleTagFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleTagPayload>;
                };
                findMany: {
                    args: Prisma.ArticleTagFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleTagPayload>[];
                };
                create: {
                    args: Prisma.ArticleTagCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleTagPayload>;
                };
                createMany: {
                    args: Prisma.ArticleTagCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ArticleTagCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleTagPayload>[];
                };
                delete: {
                    args: Prisma.ArticleTagDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleTagPayload>;
                };
                update: {
                    args: Prisma.ArticleTagUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleTagPayload>;
                };
                deleteMany: {
                    args: Prisma.ArticleTagDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ArticleTagUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ArticleTagUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleTagPayload>[];
                };
                upsert: {
                    args: Prisma.ArticleTagUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleTagPayload>;
                };
                aggregate: {
                    args: Prisma.ArticleTagAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateArticleTag>;
                };
                groupBy: {
                    args: Prisma.ArticleTagGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ArticleTagGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ArticleTagCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ArticleTagCountAggregateOutputType> | number;
                };
            };
        };
        Media: {
            payload: Prisma.$MediaPayload<ExtArgs>;
            fields: Prisma.MediaFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.MediaFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MediaPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.MediaFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MediaPayload>;
                };
                findFirst: {
                    args: Prisma.MediaFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MediaPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.MediaFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MediaPayload>;
                };
                findMany: {
                    args: Prisma.MediaFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MediaPayload>[];
                };
                create: {
                    args: Prisma.MediaCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MediaPayload>;
                };
                createMany: {
                    args: Prisma.MediaCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.MediaCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MediaPayload>[];
                };
                delete: {
                    args: Prisma.MediaDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MediaPayload>;
                };
                update: {
                    args: Prisma.MediaUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MediaPayload>;
                };
                deleteMany: {
                    args: Prisma.MediaDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.MediaUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.MediaUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MediaPayload>[];
                };
                upsert: {
                    args: Prisma.MediaUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MediaPayload>;
                };
                aggregate: {
                    args: Prisma.MediaAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateMedia>;
                };
                groupBy: {
                    args: Prisma.MediaGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MediaGroupByOutputType>[];
                };
                count: {
                    args: Prisma.MediaCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MediaCountAggregateOutputType> | number;
                };
            };
        };
        ArticleMedia: {
            payload: Prisma.$ArticleMediaPayload<ExtArgs>;
            fields: Prisma.ArticleMediaFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ArticleMediaFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleMediaPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ArticleMediaFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleMediaPayload>;
                };
                findFirst: {
                    args: Prisma.ArticleMediaFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleMediaPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ArticleMediaFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleMediaPayload>;
                };
                findMany: {
                    args: Prisma.ArticleMediaFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleMediaPayload>[];
                };
                create: {
                    args: Prisma.ArticleMediaCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleMediaPayload>;
                };
                createMany: {
                    args: Prisma.ArticleMediaCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ArticleMediaCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleMediaPayload>[];
                };
                delete: {
                    args: Prisma.ArticleMediaDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleMediaPayload>;
                };
                update: {
                    args: Prisma.ArticleMediaUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleMediaPayload>;
                };
                deleteMany: {
                    args: Prisma.ArticleMediaDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ArticleMediaUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ArticleMediaUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleMediaPayload>[];
                };
                upsert: {
                    args: Prisma.ArticleMediaUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticleMediaPayload>;
                };
                aggregate: {
                    args: Prisma.ArticleMediaAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateArticleMedia>;
                };
                groupBy: {
                    args: Prisma.ArticleMediaGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ArticleMediaGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ArticleMediaCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ArticleMediaCountAggregateOutputType> | number;
                };
            };
        };
        Comment: {
            payload: Prisma.$CommentPayload<ExtArgs>;
            fields: Prisma.CommentFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CommentFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommentPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CommentFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommentPayload>;
                };
                findFirst: {
                    args: Prisma.CommentFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommentPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CommentFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommentPayload>;
                };
                findMany: {
                    args: Prisma.CommentFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommentPayload>[];
                };
                create: {
                    args: Prisma.CommentCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommentPayload>;
                };
                createMany: {
                    args: Prisma.CommentCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CommentCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommentPayload>[];
                };
                delete: {
                    args: Prisma.CommentDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommentPayload>;
                };
                update: {
                    args: Prisma.CommentUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommentPayload>;
                };
                deleteMany: {
                    args: Prisma.CommentDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CommentUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CommentUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommentPayload>[];
                };
                upsert: {
                    args: Prisma.CommentUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommentPayload>;
                };
                aggregate: {
                    args: Prisma.CommentAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateComment>;
                };
                groupBy: {
                    args: Prisma.CommentGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CommentGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CommentCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CommentCountAggregateOutputType> | number;
                };
            };
        };
        BreakingNews: {
            payload: Prisma.$BreakingNewsPayload<ExtArgs>;
            fields: Prisma.BreakingNewsFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.BreakingNewsFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BreakingNewsPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.BreakingNewsFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BreakingNewsPayload>;
                };
                findFirst: {
                    args: Prisma.BreakingNewsFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BreakingNewsPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.BreakingNewsFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BreakingNewsPayload>;
                };
                findMany: {
                    args: Prisma.BreakingNewsFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BreakingNewsPayload>[];
                };
                create: {
                    args: Prisma.BreakingNewsCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BreakingNewsPayload>;
                };
                createMany: {
                    args: Prisma.BreakingNewsCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.BreakingNewsCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BreakingNewsPayload>[];
                };
                delete: {
                    args: Prisma.BreakingNewsDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BreakingNewsPayload>;
                };
                update: {
                    args: Prisma.BreakingNewsUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BreakingNewsPayload>;
                };
                deleteMany: {
                    args: Prisma.BreakingNewsDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.BreakingNewsUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.BreakingNewsUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BreakingNewsPayload>[];
                };
                upsert: {
                    args: Prisma.BreakingNewsUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BreakingNewsPayload>;
                };
                aggregate: {
                    args: Prisma.BreakingNewsAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateBreakingNews>;
                };
                groupBy: {
                    args: Prisma.BreakingNewsGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BreakingNewsGroupByOutputType>[];
                };
                count: {
                    args: Prisma.BreakingNewsCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BreakingNewsCountAggregateOutputType> | number;
                };
            };
        };
        Ad: {
            payload: Prisma.$AdPayload<ExtArgs>;
            fields: Prisma.AdFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.AdFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AdPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.AdFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AdPayload>;
                };
                findFirst: {
                    args: Prisma.AdFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AdPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.AdFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AdPayload>;
                };
                findMany: {
                    args: Prisma.AdFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AdPayload>[];
                };
                create: {
                    args: Prisma.AdCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AdPayload>;
                };
                createMany: {
                    args: Prisma.AdCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.AdCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AdPayload>[];
                };
                delete: {
                    args: Prisma.AdDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AdPayload>;
                };
                update: {
                    args: Prisma.AdUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AdPayload>;
                };
                deleteMany: {
                    args: Prisma.AdDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.AdUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.AdUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AdPayload>[];
                };
                upsert: {
                    args: Prisma.AdUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AdPayload>;
                };
                aggregate: {
                    args: Prisma.AdAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateAd>;
                };
                groupBy: {
                    args: Prisma.AdGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AdGroupByOutputType>[];
                };
                count: {
                    args: Prisma.AdCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AdCountAggregateOutputType> | number;
                };
            };
        };
        Menu: {
            payload: Prisma.$MenuPayload<ExtArgs>;
            fields: Prisma.MenuFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.MenuFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MenuPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.MenuFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MenuPayload>;
                };
                findFirst: {
                    args: Prisma.MenuFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MenuPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.MenuFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MenuPayload>;
                };
                findMany: {
                    args: Prisma.MenuFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MenuPayload>[];
                };
                create: {
                    args: Prisma.MenuCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MenuPayload>;
                };
                createMany: {
                    args: Prisma.MenuCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.MenuCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MenuPayload>[];
                };
                delete: {
                    args: Prisma.MenuDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MenuPayload>;
                };
                update: {
                    args: Prisma.MenuUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MenuPayload>;
                };
                deleteMany: {
                    args: Prisma.MenuDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.MenuUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.MenuUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MenuPayload>[];
                };
                upsert: {
                    args: Prisma.MenuUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MenuPayload>;
                };
                aggregate: {
                    args: Prisma.MenuAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateMenu>;
                };
                groupBy: {
                    args: Prisma.MenuGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MenuGroupByOutputType>[];
                };
                count: {
                    args: Prisma.MenuCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MenuCountAggregateOutputType> | number;
                };
            };
        };
        Redirect: {
            payload: Prisma.$RedirectPayload<ExtArgs>;
            fields: Prisma.RedirectFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.RedirectFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RedirectPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.RedirectFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RedirectPayload>;
                };
                findFirst: {
                    args: Prisma.RedirectFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RedirectPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.RedirectFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RedirectPayload>;
                };
                findMany: {
                    args: Prisma.RedirectFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RedirectPayload>[];
                };
                create: {
                    args: Prisma.RedirectCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RedirectPayload>;
                };
                createMany: {
                    args: Prisma.RedirectCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.RedirectCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RedirectPayload>[];
                };
                delete: {
                    args: Prisma.RedirectDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RedirectPayload>;
                };
                update: {
                    args: Prisma.RedirectUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RedirectPayload>;
                };
                deleteMany: {
                    args: Prisma.RedirectDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.RedirectUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.RedirectUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RedirectPayload>[];
                };
                upsert: {
                    args: Prisma.RedirectUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RedirectPayload>;
                };
                aggregate: {
                    args: Prisma.RedirectAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateRedirect>;
                };
                groupBy: {
                    args: Prisma.RedirectGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RedirectGroupByOutputType>[];
                };
                count: {
                    args: Prisma.RedirectCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RedirectCountAggregateOutputType> | number;
                };
            };
        };
        PersonProfile: {
            payload: Prisma.$PersonProfilePayload<ExtArgs>;
            fields: Prisma.PersonProfileFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PersonProfileFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PersonProfilePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PersonProfileFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PersonProfilePayload>;
                };
                findFirst: {
                    args: Prisma.PersonProfileFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PersonProfilePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PersonProfileFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PersonProfilePayload>;
                };
                findMany: {
                    args: Prisma.PersonProfileFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PersonProfilePayload>[];
                };
                create: {
                    args: Prisma.PersonProfileCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PersonProfilePayload>;
                };
                createMany: {
                    args: Prisma.PersonProfileCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PersonProfileCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PersonProfilePayload>[];
                };
                delete: {
                    args: Prisma.PersonProfileDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PersonProfilePayload>;
                };
                update: {
                    args: Prisma.PersonProfileUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PersonProfilePayload>;
                };
                deleteMany: {
                    args: Prisma.PersonProfileDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PersonProfileUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PersonProfileUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PersonProfilePayload>[];
                };
                upsert: {
                    args: Prisma.PersonProfileUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PersonProfilePayload>;
                };
                aggregate: {
                    args: Prisma.PersonProfileAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePersonProfile>;
                };
                groupBy: {
                    args: Prisma.PersonProfileGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PersonProfileGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PersonProfileCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PersonProfileCountAggregateOutputType> | number;
                };
            };
        };
        ArticlePerson: {
            payload: Prisma.$ArticlePersonPayload<ExtArgs>;
            fields: Prisma.ArticlePersonFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ArticlePersonFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticlePersonPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ArticlePersonFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticlePersonPayload>;
                };
                findFirst: {
                    args: Prisma.ArticlePersonFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticlePersonPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ArticlePersonFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticlePersonPayload>;
                };
                findMany: {
                    args: Prisma.ArticlePersonFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticlePersonPayload>[];
                };
                create: {
                    args: Prisma.ArticlePersonCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticlePersonPayload>;
                };
                createMany: {
                    args: Prisma.ArticlePersonCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ArticlePersonCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticlePersonPayload>[];
                };
                delete: {
                    args: Prisma.ArticlePersonDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticlePersonPayload>;
                };
                update: {
                    args: Prisma.ArticlePersonUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticlePersonPayload>;
                };
                deleteMany: {
                    args: Prisma.ArticlePersonDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ArticlePersonUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ArticlePersonUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticlePersonPayload>[];
                };
                upsert: {
                    args: Prisma.ArticlePersonUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ArticlePersonPayload>;
                };
                aggregate: {
                    args: Prisma.ArticlePersonAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateArticlePerson>;
                };
                groupBy: {
                    args: Prisma.ArticlePersonGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ArticlePersonGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ArticlePersonCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ArticlePersonCountAggregateOutputType> | number;
                };
            };
        };
        Announcement: {
            payload: Prisma.$AnnouncementPayload<ExtArgs>;
            fields: Prisma.AnnouncementFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.AnnouncementFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AnnouncementPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.AnnouncementFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AnnouncementPayload>;
                };
                findFirst: {
                    args: Prisma.AnnouncementFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AnnouncementPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.AnnouncementFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AnnouncementPayload>;
                };
                findMany: {
                    args: Prisma.AnnouncementFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AnnouncementPayload>[];
                };
                create: {
                    args: Prisma.AnnouncementCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AnnouncementPayload>;
                };
                createMany: {
                    args: Prisma.AnnouncementCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.AnnouncementCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AnnouncementPayload>[];
                };
                delete: {
                    args: Prisma.AnnouncementDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AnnouncementPayload>;
                };
                update: {
                    args: Prisma.AnnouncementUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AnnouncementPayload>;
                };
                deleteMany: {
                    args: Prisma.AnnouncementDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.AnnouncementUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.AnnouncementUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AnnouncementPayload>[];
                };
                upsert: {
                    args: Prisma.AnnouncementUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AnnouncementPayload>;
                };
                aggregate: {
                    args: Prisma.AnnouncementAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateAnnouncement>;
                };
                groupBy: {
                    args: Prisma.AnnouncementGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AnnouncementGroupByOutputType>[];
                };
                count: {
                    args: Prisma.AnnouncementCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AnnouncementCountAggregateOutputType> | number;
                };
            };
        };
        Popup: {
            payload: Prisma.$PopupPayload<ExtArgs>;
            fields: Prisma.PopupFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PopupFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PopupPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PopupFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PopupPayload>;
                };
                findFirst: {
                    args: Prisma.PopupFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PopupPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PopupFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PopupPayload>;
                };
                findMany: {
                    args: Prisma.PopupFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PopupPayload>[];
                };
                create: {
                    args: Prisma.PopupCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PopupPayload>;
                };
                createMany: {
                    args: Prisma.PopupCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PopupCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PopupPayload>[];
                };
                delete: {
                    args: Prisma.PopupDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PopupPayload>;
                };
                update: {
                    args: Prisma.PopupUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PopupPayload>;
                };
                deleteMany: {
                    args: Prisma.PopupDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PopupUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PopupUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PopupPayload>[];
                };
                upsert: {
                    args: Prisma.PopupUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PopupPayload>;
                };
                aggregate: {
                    args: Prisma.PopupAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePopup>;
                };
                groupBy: {
                    args: Prisma.PopupGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PopupGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PopupCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PopupCountAggregateOutputType> | number;
                };
            };
        };
        NewsletterSubscriber: {
            payload: Prisma.$NewsletterSubscriberPayload<ExtArgs>;
            fields: Prisma.NewsletterSubscriberFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.NewsletterSubscriberFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NewsletterSubscriberPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.NewsletterSubscriberFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NewsletterSubscriberPayload>;
                };
                findFirst: {
                    args: Prisma.NewsletterSubscriberFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NewsletterSubscriberPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.NewsletterSubscriberFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NewsletterSubscriberPayload>;
                };
                findMany: {
                    args: Prisma.NewsletterSubscriberFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NewsletterSubscriberPayload>[];
                };
                create: {
                    args: Prisma.NewsletterSubscriberCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NewsletterSubscriberPayload>;
                };
                createMany: {
                    args: Prisma.NewsletterSubscriberCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.NewsletterSubscriberCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NewsletterSubscriberPayload>[];
                };
                delete: {
                    args: Prisma.NewsletterSubscriberDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NewsletterSubscriberPayload>;
                };
                update: {
                    args: Prisma.NewsletterSubscriberUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NewsletterSubscriberPayload>;
                };
                deleteMany: {
                    args: Prisma.NewsletterSubscriberDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.NewsletterSubscriberUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.NewsletterSubscriberUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NewsletterSubscriberPayload>[];
                };
                upsert: {
                    args: Prisma.NewsletterSubscriberUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NewsletterSubscriberPayload>;
                };
                aggregate: {
                    args: Prisma.NewsletterSubscriberAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateNewsletterSubscriber>;
                };
                groupBy: {
                    args: Prisma.NewsletterSubscriberGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.NewsletterSubscriberGroupByOutputType>[];
                };
                count: {
                    args: Prisma.NewsletterSubscriberCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.NewsletterSubscriberCountAggregateOutputType> | number;
                };
            };
        };
        Widget: {
            payload: Prisma.$WidgetPayload<ExtArgs>;
            fields: Prisma.WidgetFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.WidgetFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WidgetPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.WidgetFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WidgetPayload>;
                };
                findFirst: {
                    args: Prisma.WidgetFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WidgetPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.WidgetFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WidgetPayload>;
                };
                findMany: {
                    args: Prisma.WidgetFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WidgetPayload>[];
                };
                create: {
                    args: Prisma.WidgetCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WidgetPayload>;
                };
                createMany: {
                    args: Prisma.WidgetCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.WidgetCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WidgetPayload>[];
                };
                delete: {
                    args: Prisma.WidgetDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WidgetPayload>;
                };
                update: {
                    args: Prisma.WidgetUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WidgetPayload>;
                };
                deleteMany: {
                    args: Prisma.WidgetDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.WidgetUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.WidgetUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WidgetPayload>[];
                };
                upsert: {
                    args: Prisma.WidgetUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WidgetPayload>;
                };
                aggregate: {
                    args: Prisma.WidgetAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateWidget>;
                };
                groupBy: {
                    args: Prisma.WidgetGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.WidgetGroupByOutputType>[];
                };
                count: {
                    args: Prisma.WidgetCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.WidgetCountAggregateOutputType> | number;
                };
            };
        };
        Page: {
            payload: Prisma.$PagePayload<ExtArgs>;
            fields: Prisma.PageFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PageFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PagePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PageFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PagePayload>;
                };
                findFirst: {
                    args: Prisma.PageFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PagePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PageFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PagePayload>;
                };
                findMany: {
                    args: Prisma.PageFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PagePayload>[];
                };
                create: {
                    args: Prisma.PageCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PagePayload>;
                };
                createMany: {
                    args: Prisma.PageCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PageCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PagePayload>[];
                };
                delete: {
                    args: Prisma.PageDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PagePayload>;
                };
                update: {
                    args: Prisma.PageUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PagePayload>;
                };
                deleteMany: {
                    args: Prisma.PageDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PageUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PageUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PagePayload>[];
                };
                upsert: {
                    args: Prisma.PageUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PagePayload>;
                };
                aggregate: {
                    args: Prisma.PageAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePage>;
                };
                groupBy: {
                    args: Prisma.PageGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PageGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PageCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PageCountAggregateOutputType> | number;
                };
            };
        };
        AuditLog: {
            payload: Prisma.$AuditLogPayload<ExtArgs>;
            fields: Prisma.AuditLogFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.AuditLogFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.AuditLogFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>;
                };
                findFirst: {
                    args: Prisma.AuditLogFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.AuditLogFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>;
                };
                findMany: {
                    args: Prisma.AuditLogFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>[];
                };
                create: {
                    args: Prisma.AuditLogCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>;
                };
                createMany: {
                    args: Prisma.AuditLogCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.AuditLogCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>[];
                };
                delete: {
                    args: Prisma.AuditLogDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>;
                };
                update: {
                    args: Prisma.AuditLogUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>;
                };
                deleteMany: {
                    args: Prisma.AuditLogDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.AuditLogUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.AuditLogUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>[];
                };
                upsert: {
                    args: Prisma.AuditLogUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>;
                };
                aggregate: {
                    args: Prisma.AuditLogAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateAuditLog>;
                };
                groupBy: {
                    args: Prisma.AuditLogGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AuditLogGroupByOutputType>[];
                };
                count: {
                    args: Prisma.AuditLogCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AuditLogCountAggregateOutputType> | number;
                };
            };
        };
    };
} & {
    other: {
        payload: any;
        operations: {
            $executeRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $executeRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
            $queryRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $queryRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
        };
    };
};
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const TenantScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly slug: "slug";
    readonly domain: "domain";
    readonly subdomain: "subdomain";
    readonly logo: "logo";
    readonly favicon: "favicon";
    readonly theme: "theme";
    readonly locale: "locale";
    readonly timezone: "timezone";
    readonly settings: "settings";
    readonly plan: "plan";
    readonly active: "active";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type TenantScalarFieldEnum = (typeof TenantScalarFieldEnum)[keyof typeof TenantScalarFieldEnum];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly tenantId: "tenantId";
    readonly email: "email";
    readonly passwordHash: "passwordHash";
    readonly name: "name";
    readonly avatar: "avatar";
    readonly role: "role";
    readonly active: "active";
    readonly lastLoginAt: "lastLoginAt";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const CategoryScalarFieldEnum: {
    readonly id: "id";
    readonly tenantId: "tenantId";
    readonly parentId: "parentId";
    readonly name: "name";
    readonly slug: "slug";
    readonly description: "description";
    readonly image: "image";
    readonly color: "color";
    readonly sortOrder: "sortOrder";
    readonly active: "active";
    readonly seoTitle: "seoTitle";
    readonly seoDesc: "seoDesc";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type CategoryScalarFieldEnum = (typeof CategoryScalarFieldEnum)[keyof typeof CategoryScalarFieldEnum];
export declare const TagScalarFieldEnum: {
    readonly id: "id";
    readonly tenantId: "tenantId";
    readonly name: "name";
    readonly slug: "slug";
};
export type TagScalarFieldEnum = (typeof TagScalarFieldEnum)[keyof typeof TagScalarFieldEnum];
export declare const AuthorScalarFieldEnum: {
    readonly id: "id";
    readonly tenantId: "tenantId";
    readonly name: "name";
    readonly slug: "slug";
    readonly bio: "bio";
    readonly avatar: "avatar";
    readonly email: "email";
    readonly social: "social";
    readonly active: "active";
    readonly sortOrder: "sortOrder";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type AuthorScalarFieldEnum = (typeof AuthorScalarFieldEnum)[keyof typeof AuthorScalarFieldEnum];
export declare const ArticleScalarFieldEnum: {
    readonly id: "id";
    readonly tenantId: "tenantId";
    readonly type: "type";
    readonly title: "title";
    readonly slug: "slug";
    readonly spot: "spot";
    readonly content: "content";
    readonly featuredImage: "featuredImage";
    readonly status: "status";
    readonly publishedAt: "publishedAt";
    readonly scheduledAt: "scheduledAt";
    readonly authorId: "authorId";
    readonly createdById: "createdById";
    readonly approvedById: "approvedById";
    readonly viewCount: "viewCount";
    readonly commentCount: "commentCount";
    readonly readingTime: "readingTime";
    readonly featured: "featured";
    readonly breakingLabel: "breakingLabel";
    readonly seoTitle: "seoTitle";
    readonly seoDesc: "seoDesc";
    readonly canonicalUrl: "canonicalUrl";
    readonly ogImage: "ogImage";
    readonly source: "source";
    readonly sourceUrl: "sourceUrl";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ArticleScalarFieldEnum = (typeof ArticleScalarFieldEnum)[keyof typeof ArticleScalarFieldEnum];
export declare const ArticleCategoryScalarFieldEnum: {
    readonly articleId: "articleId";
    readonly categoryId: "categoryId";
    readonly primary: "primary";
};
export type ArticleCategoryScalarFieldEnum = (typeof ArticleCategoryScalarFieldEnum)[keyof typeof ArticleCategoryScalarFieldEnum];
export declare const ArticleTagScalarFieldEnum: {
    readonly articleId: "articleId";
    readonly tagId: "tagId";
};
export type ArticleTagScalarFieldEnum = (typeof ArticleTagScalarFieldEnum)[keyof typeof ArticleTagScalarFieldEnum];
export declare const MediaScalarFieldEnum: {
    readonly id: "id";
    readonly tenantId: "tenantId";
    readonly type: "type";
    readonly filename: "filename";
    readonly originalName: "originalName";
    readonly mimeType: "mimeType";
    readonly size: "size";
    readonly url: "url";
    readonly thumbnailUrl: "thumbnailUrl";
    readonly width: "width";
    readonly height: "height";
    readonly alt: "alt";
    readonly credit: "credit";
    readonly createdAt: "createdAt";
};
export type MediaScalarFieldEnum = (typeof MediaScalarFieldEnum)[keyof typeof MediaScalarFieldEnum];
export declare const ArticleMediaScalarFieldEnum: {
    readonly articleId: "articleId";
    readonly mediaId: "mediaId";
    readonly sortOrder: "sortOrder";
    readonly caption: "caption";
};
export type ArticleMediaScalarFieldEnum = (typeof ArticleMediaScalarFieldEnum)[keyof typeof ArticleMediaScalarFieldEnum];
export declare const CommentScalarFieldEnum: {
    readonly id: "id";
    readonly tenantId: "tenantId";
    readonly articleId: "articleId";
    readonly parentId: "parentId";
    readonly name: "name";
    readonly email: "email";
    readonly content: "content";
    readonly ipAddress: "ipAddress";
    readonly status: "status";
    readonly createdAt: "createdAt";
};
export type CommentScalarFieldEnum = (typeof CommentScalarFieldEnum)[keyof typeof CommentScalarFieldEnum];
export declare const BreakingNewsScalarFieldEnum: {
    readonly id: "id";
    readonly tenantId: "tenantId";
    readonly title: "title";
    readonly url: "url";
    readonly active: "active";
    readonly sortOrder: "sortOrder";
    readonly expiresAt: "expiresAt";
    readonly createdAt: "createdAt";
};
export type BreakingNewsScalarFieldEnum = (typeof BreakingNewsScalarFieldEnum)[keyof typeof BreakingNewsScalarFieldEnum];
export declare const AdScalarFieldEnum: {
    readonly id: "id";
    readonly tenantId: "tenantId";
    readonly name: "name";
    readonly position: "position";
    readonly code: "code";
    readonly imageUrl: "imageUrl";
    readonly targetUrl: "targetUrl";
    readonly active: "active";
    readonly startsAt: "startsAt";
    readonly endsAt: "endsAt";
    readonly impressions: "impressions";
    readonly clicks: "clicks";
    readonly sortOrder: "sortOrder";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type AdScalarFieldEnum = (typeof AdScalarFieldEnum)[keyof typeof AdScalarFieldEnum];
export declare const MenuScalarFieldEnum: {
    readonly id: "id";
    readonly tenantId: "tenantId";
    readonly location: "location";
    readonly items: "items";
    readonly updatedAt: "updatedAt";
};
export type MenuScalarFieldEnum = (typeof MenuScalarFieldEnum)[keyof typeof MenuScalarFieldEnum];
export declare const RedirectScalarFieldEnum: {
    readonly id: "id";
    readonly tenantId: "tenantId";
    readonly source: "source";
    readonly target: "target";
    readonly permanent: "permanent";
};
export type RedirectScalarFieldEnum = (typeof RedirectScalarFieldEnum)[keyof typeof RedirectScalarFieldEnum];
export declare const PersonProfileScalarFieldEnum: {
    readonly id: "id";
    readonly tenantId: "tenantId";
    readonly name: "name";
    readonly slug: "slug";
    readonly bio: "bio";
    readonly image: "image";
    readonly birthDate: "birthDate";
    readonly title: "title";
    readonly social: "social";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type PersonProfileScalarFieldEnum = (typeof PersonProfileScalarFieldEnum)[keyof typeof PersonProfileScalarFieldEnum];
export declare const ArticlePersonScalarFieldEnum: {
    readonly articleId: "articleId";
    readonly personId: "personId";
};
export type ArticlePersonScalarFieldEnum = (typeof ArticlePersonScalarFieldEnum)[keyof typeof ArticlePersonScalarFieldEnum];
export declare const AnnouncementScalarFieldEnum: {
    readonly id: "id";
    readonly tenantId: "tenantId";
    readonly title: "title";
    readonly content: "content";
    readonly type: "type";
    readonly active: "active";
    readonly pinned: "pinned";
    readonly expiresAt: "expiresAt";
    readonly createdAt: "createdAt";
};
export type AnnouncementScalarFieldEnum = (typeof AnnouncementScalarFieldEnum)[keyof typeof AnnouncementScalarFieldEnum];
export declare const PopupScalarFieldEnum: {
    readonly id: "id";
    readonly tenantId: "tenantId";
    readonly title: "title";
    readonly content: "content";
    readonly imageUrl: "imageUrl";
    readonly targetUrl: "targetUrl";
    readonly trigger: "trigger";
    readonly delayMs: "delayMs";
    readonly active: "active";
    readonly startsAt: "startsAt";
    readonly endsAt: "endsAt";
    readonly createdAt: "createdAt";
};
export type PopupScalarFieldEnum = (typeof PopupScalarFieldEnum)[keyof typeof PopupScalarFieldEnum];
export declare const NewsletterSubscriberScalarFieldEnum: {
    readonly id: "id";
    readonly tenantId: "tenantId";
    readonly email: "email";
    readonly name: "name";
    readonly confirmed: "confirmed";
    readonly unsubscribed: "unsubscribed";
    readonly createdAt: "createdAt";
};
export type NewsletterSubscriberScalarFieldEnum = (typeof NewsletterSubscriberScalarFieldEnum)[keyof typeof NewsletterSubscriberScalarFieldEnum];
export declare const WidgetScalarFieldEnum: {
    readonly id: "id";
    readonly tenantId: "tenantId";
    readonly type: "type";
    readonly config: "config";
    readonly active: "active";
    readonly sortOrder: "sortOrder";
    readonly cache: "cache";
    readonly cachedAt: "cachedAt";
};
export type WidgetScalarFieldEnum = (typeof WidgetScalarFieldEnum)[keyof typeof WidgetScalarFieldEnum];
export declare const PageScalarFieldEnum: {
    readonly id: "id";
    readonly tenantId: "tenantId";
    readonly title: "title";
    readonly slug: "slug";
    readonly content: "content";
    readonly seoTitle: "seoTitle";
    readonly seoDesc: "seoDesc";
    readonly published: "published";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type PageScalarFieldEnum = (typeof PageScalarFieldEnum)[keyof typeof PageScalarFieldEnum];
export declare const AuditLogScalarFieldEnum: {
    readonly id: "id";
    readonly tenantId: "tenantId";
    readonly userId: "userId";
    readonly action: "action";
    readonly entity: "entity";
    readonly entityId: "entityId";
    readonly changes: "changes";
    readonly ipAddress: "ipAddress";
    readonly createdAt: "createdAt";
};
export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const JsonNullValueInput: {
    readonly JsonNull: runtime.JsonNullClass;
};
export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput];
export declare const NullableJsonNullValueInput: {
    readonly DbNull: runtime.DbNullClass;
    readonly JsonNull: runtime.JsonNullClass;
};
export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const JsonNullValueFilter: {
    readonly DbNull: runtime.DbNullClass;
    readonly JsonNull: runtime.JsonNullClass;
    readonly AnyNull: runtime.AnyNullClass;
};
export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>;
export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>;
export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>;
export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>;
export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>;
export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>;
export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>;
export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>;
export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole[]'>;
export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>;
export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>;
export type EnumArticleTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ArticleType'>;
export type ListEnumArticleTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ArticleType[]'>;
export type EnumArticleStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ArticleStatus'>;
export type ListEnumArticleStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ArticleStatus[]'>;
export type EnumMediaTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MediaType'>;
export type ListEnumMediaTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MediaType[]'>;
export type EnumCommentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CommentStatus'>;
export type ListEnumCommentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CommentStatus[]'>;
export type EnumAdPositionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AdPosition'>;
export type ListEnumAdPositionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AdPosition[]'>;
export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>;
export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>;
export type BatchPayload = {
    count: number;
};
export declare const defineExtension: runtime.Types.Extensions.ExtendsHook<"define", TypeMapCb, runtime.Types.Extensions.DefaultArgs>;
export type DefaultPrismaClient = PrismaClient;
export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
export interface PrismaClientBaseOptions {
    errorFormat?: ErrorFormat;
    log?: (LogLevel | LogDefinition)[];
    transactionOptions?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: TransactionIsolationLevel;
    };
    omit?: GlobalOmitConfig;
    comments?: runtime.SqlCommenterPlugin[];
    queryPlanCacheMaxSize?: number;
}
export interface PrismaClientOptionsWithAccelerateUrl extends PrismaClientBaseOptions {
    accelerateUrl: string;
    adapter?: never;
}
export interface PrismaClientOptionsWithAdapter extends PrismaClientBaseOptions {
    adapter: runtime.SqlDriverAdapterFactory;
    accelerateUrl?: never;
}
export type PrismaClientOptions = PrismaClientOptionsWithAccelerateUrl | PrismaClientOptionsWithAdapter;
export type GlobalOmitConfig = {
    tenant?: Prisma.TenantOmit;
    user?: Prisma.UserOmit;
    category?: Prisma.CategoryOmit;
    tag?: Prisma.TagOmit;
    author?: Prisma.AuthorOmit;
    article?: Prisma.ArticleOmit;
    articleCategory?: Prisma.ArticleCategoryOmit;
    articleTag?: Prisma.ArticleTagOmit;
    media?: Prisma.MediaOmit;
    articleMedia?: Prisma.ArticleMediaOmit;
    comment?: Prisma.CommentOmit;
    breakingNews?: Prisma.BreakingNewsOmit;
    ad?: Prisma.AdOmit;
    menu?: Prisma.MenuOmit;
    redirect?: Prisma.RedirectOmit;
    personProfile?: Prisma.PersonProfileOmit;
    articlePerson?: Prisma.ArticlePersonOmit;
    announcement?: Prisma.AnnouncementOmit;
    popup?: Prisma.PopupOmit;
    newsletterSubscriber?: Prisma.NewsletterSubscriberOmit;
    widget?: Prisma.WidgetOmit;
    page?: Prisma.PageOmit;
    auditLog?: Prisma.AuditLogOmit;
};
export type LogLevel = 'info' | 'query' | 'warn' | 'error';
export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
};
export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;
export type GetLogType<T> = CheckIsLogLevel<T extends LogDefinition ? T['level'] : T>;
export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;
export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
};
export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
};
export type PrismaAction = 'findUnique' | 'findUniqueOrThrow' | 'findMany' | 'findFirst' | 'findFirstOrThrow' | 'create' | 'createMany' | 'createManyAndReturn' | 'update' | 'updateMany' | 'updateManyAndReturn' | 'upsert' | 'delete' | 'deleteMany' | 'executeRaw' | 'queryRaw' | 'aggregate' | 'count' | 'runCommandRaw' | 'findRaw' | 'groupBy';
export type TransactionClient = Omit<DefaultPrismaClient, runtime.ITXClientDenyList>;
