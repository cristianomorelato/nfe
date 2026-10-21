"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagamentoSchema = exports.formaPagamentoSchema = void 0;
const v4_1 = require("zod/v4");
exports.formaPagamentoSchema = v4_1.z
    .object({
    formaPagamento: v4_1.z.string().length(2),
    valor: v4_1.z.number().min(0),
    indicadorPagamento: v4_1.z.literal(0).or(v4_1.z.literal(1)).optional(),
    descricao: v4_1.z.string().min(2).max(60).optional(),
    dataPagamento: v4_1.z.date().optional(),
    cnpjPagador: v4_1.z.string().length(14).optional(),
    ufPagador: v4_1.z.string().length(2).optional(),
    tipoIntegracao: v4_1.z.literal(1).or(v4_1.z.literal(2)).optional(),
    cnpjCredenciadora: v4_1.z.string().length(14).optional(),
    bandeira: v4_1.z.string().max(2).optional(),
    autorizacao: v4_1.z.string().max(20).optional(),
    cnpjRecebedor: v4_1.z.string().length(14).optional(),
    idTerminalPagamento: v4_1.z.string().min(1).max(40).optional()
})
    .refine((p) => Boolean(p.cnpjPagador) === Boolean(p.ufPagador), {
    message: 'CNPJPag e UFPag andam juntos: informe os dois ou nenhum'
});
exports.pagamentoSchema = v4_1.z.object({
    pagamentos: v4_1.z.array(exports.formaPagamentoSchema).min(1).max(100),
    troco: v4_1.z.number().min(0).optional()
});
