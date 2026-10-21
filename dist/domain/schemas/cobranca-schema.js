"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cobrancaSchema = exports.duplicataSchema = exports.faturaSchema = void 0;
const v4_1 = require("zod/v4");
exports.faturaSchema = v4_1.z.object({
    nFat: v4_1.z.string().max(60).optional(),
    vOrig: v4_1.z.number().min(0).optional(),
    vDesc: v4_1.z.number().min(0).optional(),
    vLiq: v4_1.z.number().min(0).optional()
});
exports.duplicataSchema = v4_1.z.object({
    nDup: v4_1.z.string().min(1).max(60),
    /** dVenc — data de vencimento da parcela, no formato AAAA-MM-DD. */
    dVenc: v4_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use o formato AAAA-MM-DD'),
    vDup: v4_1.z.number().min(0)
});
exports.cobrancaSchema = v4_1.z.object({
    fatura: exports.faturaSchema.optional(),
    /** O leiaute aceita ate 120 parcelas por nota. */
    duplicatas: v4_1.z.array(exports.duplicataSchema).max(120).optional()
});
