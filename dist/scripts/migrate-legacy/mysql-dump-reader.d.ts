export type Row = Record<string, string | number | null>;
export declare function readColumnOrder(dumpPath: string): Promise<Map<string, string[]>>;
export declare function readRows(dumpPath: string, tables: Set<string>, columnOrder: Map<string, string[]>): AsyncGenerator<{
    table: string;
    row: Row;
}>;
export declare const asStr: (v: unknown) => string;
export declare const asInt: (v: unknown) => number;
export declare const asBool: (v: unknown) => boolean;
export declare const asDate: (v: unknown) => Date | null;
