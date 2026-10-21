"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agropecuarioSchema = exports.canaSchema = exports.processoReferenciadoSchema = exports.observacaoSchema = void 0;
const v4_1 = require("zod/v4");
exports.observacaoSchema = v4_1.z.object({
    campo: v4_1.z.string().min(1).max(20),
    texto: v4_1.z.string().min(1).max(60)
});
exports.processoReferenciadoSchema = v4_1.z.object({
    numero: v4_1.z.string().min(1).max(60),
    origem: v4_1.z.literal(0).or(v4_1.z.literal(1)).or(v4_1.z.literal(2)).or(v4_1.z.literal(3)).or(v4_1.z.literal(9)),
    tipoAto: v4_1.z.string().min(1).max(15).optional()
});
exports.canaSchema = v4_1.z.object({
    safra: v4_1.z.string().min(4).max(9),
    referencia: v4_1.z.string().min(1).max(7),
    fornecimentosDiarios: v4_1.z
        .array(v4_1.z.object({
        dia: v4_1.z.int().min(1).max(31),
        quantidade: v4_1.z.number().min(0)
    }))
        .min(1)
        .max(31),
    totalMes: v4_1.z.number().min(0),
    totalAnterior: v4_1.z.number().min(0),
    totalGeral: v4_1.z.number().min(0),
    deducoes: v4_1.z
        .array(v4_1.z.object({ descricao: v4_1.z.string().min(1).max(60), valor: v4_1.z.number().min(0) }))
        .max(10)
        .optional(),
    valorFornecimento: v4_1.z.number().min(0),
    valorTotalDeducao: v4_1.z.number().min(0),
    valorLiquido: v4_1.z.number().min(0)
});
exports.agropecuarioSchema = v4_1.z.union([
    v4_1.z.object({
        defensivos: v4_1.z
            .array(v4_1.z.object({
            receituario: v4_1.z.string().min(1).max(60),
            cpfResponsavelTecnico: v4_1.z.string().length(11)
        }))
            .min(1)
            .max(20)
    }),
    v4_1.z.object({
        guiaTransito: v4_1.z.object({
            tipo: v4_1.z.literal(1).or(v4_1.z.literal(2)).or(v4_1.z.literal(3)),
            uf: v4_1.z.string().length(2),
            serie: v4_1.z.string().min(1).max(3).optional(),
            numero: v4_1.z.string().min(1).max(20)
        })
    })
]);
