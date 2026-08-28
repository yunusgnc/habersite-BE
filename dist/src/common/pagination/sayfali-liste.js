"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sayfaliListe = sayfaliListe;
async function sayfaliListe(opts) {
    const { say, bul, limit } = opts;
    if (opts.page && opts.page > 0) {
        const page = opts.page;
        const [items, total] = await Promise.all([
            bul({ take: limit, skip: (page - 1) * limit }),
            say(),
        ]);
        const totalPages = Math.max(1, Math.ceil(total / limit));
        return { items, total, totalPages, page, hasMore: page < totalPages };
    }
    const [items, total] = await Promise.all([
        bul({
            take: limit + 1,
            ...(opts.cursor ? { cursor: { id: opts.cursor }, skip: 1 } : {}),
        }),
        say(),
    ]);
    const hasMore = items.length > limit;
    if (hasMore)
        items.pop();
    const nextCursor = hasMore ? items[items.length - 1]?.id : undefined;
    return {
        items,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
        hasMore,
        nextCursor,
    };
}
//# sourceMappingURL=sayfali-liste.js.map