"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.asDate = exports.asBool = exports.asInt = exports.asStr = void 0;
exports.readColumnOrder = readColumnOrder;
exports.readRows = readRows;
const fs = __importStar(require("fs"));
const string_decoder_1 = require("string_decoder");
async function* readLines(dumpPath) {
    const stream = fs.createReadStream(dumpPath);
    const decoder = new string_decoder_1.StringDecoder('utf8');
    let rest = '';
    for await (const chunk of stream) {
        rest += decoder.write(chunk);
        let nl;
        while ((nl = rest.indexOf('\n')) !== -1) {
            const line = rest.slice(0, nl);
            rest = rest.slice(nl + 1);
            yield line.endsWith('\r') ? line.slice(0, -1) : line;
        }
    }
    rest += decoder.end();
    if (rest.length)
        yield rest.endsWith('\r') ? rest.slice(0, -1) : rest;
}
async function readColumnOrder(dumpPath) {
    const result = new Map();
    let current = null;
    let cols = [];
    for await (const line of readLines(dumpPath)) {
        const create = line.match(/^CREATE TABLE `([^`]+)`/);
        if (create) {
            current = create[1];
            cols = [];
            continue;
        }
        if (!current)
            continue;
        if (line.startsWith(')')) {
            result.set(current, cols);
            current = null;
            continue;
        }
        const col = line.match(/^\s*`([^`]+)`\s+\S/);
        if (col)
            cols.push(col[1]);
    }
    return result;
}
function parseValueGroups(segment) {
    const groups = [];
    let i = 0;
    const n = segment.length;
    while (i < n) {
        while (i < n && segment[i] !== '(')
            i++;
        if (i >= n)
            break;
        i++;
        const row = [];
        let buf = '';
        let inQuote = false;
        let wasQuoted = false;
        let done = false;
        const push = () => {
            row.push(wasQuoted ? buf : finalizeUnquoted(buf));
            buf = '';
            wasQuoted = false;
        };
        while (i < n && !done) {
            const ch = segment[i];
            if (inQuote) {
                if (ch === '\\') {
                    const next = segment[i + 1];
                    switch (next) {
                        case 'n':
                            buf += '\n';
                            break;
                        case 'r':
                            buf += '\r';
                            break;
                        case 't':
                            buf += '\t';
                            break;
                        case '0':
                            buf += '\0';
                            break;
                        case 'b':
                            buf += '\b';
                            break;
                        case 'Z':
                            buf += '\x1a';
                            break;
                        default:
                            buf += next;
                    }
                    i += 2;
                    continue;
                }
                if (ch === "'") {
                    if (segment[i + 1] === "'") {
                        buf += "'";
                        i += 2;
                        continue;
                    }
                    inQuote = false;
                    i++;
                    continue;
                }
                buf += ch;
                i++;
                continue;
            }
            if (ch === "'") {
                inQuote = true;
                wasQuoted = true;
                i++;
                continue;
            }
            if (ch === ',') {
                push();
                i++;
                continue;
            }
            if (ch === ')') {
                push();
                done = true;
                i++;
                continue;
            }
            buf += ch;
            i++;
        }
        if (row.length)
            groups.push(row);
    }
    return groups;
}
function finalizeUnquoted(raw) {
    const t = raw.trim();
    if (t === '')
        return null;
    if (t.toUpperCase() === 'NULL')
        return null;
    const num = Number(t);
    return Number.isFinite(num) ? num : t;
}
async function* readRows(dumpPath, tables, columnOrder) {
    for await (const line of readLines(dumpPath)) {
        if (!line.startsWith('INSERT INTO'))
            continue;
        const m = line.match(/^INSERT INTO `([^`]+)` VALUES /);
        if (!m)
            continue;
        const table = m[1];
        if (!tables.has(table))
            continue;
        const cols = columnOrder.get(table);
        if (!cols)
            continue;
        const segment = line.slice(m[0].length);
        for (const values of parseValueGroups(segment)) {
            const row = {};
            for (let c = 0; c < cols.length && c < values.length; c++) {
                row[cols[c]] = values[c];
            }
            yield { table, row };
        }
    }
}
const asStr = (v) => v === null || v === undefined ? '' : String(v);
exports.asStr = asStr;
const asInt = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? Math.trunc(n) : 0;
};
exports.asInt = asInt;
const asBool = (v) => (0, exports.asInt)(v) === 1;
exports.asBool = asBool;
const asDate = (v) => {
    const s = (0, exports.asStr)(v).trim();
    if (!s || s.startsWith('0000-00-00'))
        return null;
    const d = new Date(s.replace(' ', 'T') + 'Z');
    return Number.isNaN(d.getTime()) ? null : d;
};
exports.asDate = asDate;
//# sourceMappingURL=mysql-dump-reader.js.map