"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compraSchema = exports.exportacaoSchema = exports.intermediadorSchema = exports.avulsaSchema = exports.localSchema = void 0;
const v4_1 = require("zod/v4");
exports.localSchema = v4_1.z
    .object({
    cnpj: v4_1.z.string().length(14).optional(),
    cpf: v4_1.z.string().length(11).optional(),
    nome: v4_1.z.string().min(2).max(60).optional(),
    logradouro: v4_1.z.string().min(2).max(60),
    numero: v4_1.z.string().min(1).max(60),
    complemento: v4_1.z.string().min(1).max(60).optional(),
    bairro: v4_1.z.string().min(2).max(60),
    codigoMunicipio: v4_1.z.string().length(7),
    municipio: v4_1.z.string().min(2).max(60),
    uf: v4_1.z.string().length(2),
    cep: v4_1.z.string().length(8).optional(),
    codigoPais: v4_1.z.string().min(1).max(4).optional(),
    pais: v4_1.z.string().min(2).max(60).optional(),
    telefone: v4_1.z.string().min(6).max(14).optional(),
    email: v4_1.z.email().max(60).optional(),
    inscricaoEstadual: v4_1.z.string().min(2).max(14).optional()
})
    .refine((l) => Boolean(l.cnpj) !== Boolean(l.cpf), {
    message: 'Informe CNPJ ou CPF no local de retirada/entrega'
});
exports.avulsaSchema = v4_1.z.object({
    cnpj: v4_1.z.string().length(14),
    orgao: v4_1.z.string().min(1).max(60),
    matricula: v4_1.z.string().min(1).max(60),
    agente: v4_1.z.string().min(1).max(60),
    telefone: v4_1.z.string().min(6).max(14).optional(),
    uf: v4_1.z.string().length(2),
    numeroDar: v4_1.z.string().min(1).max(60).optional(),
    dataEmissaoDar: v4_1.z.date().optional(),
    valorDar: v4_1.z.number().min(0).optional(),
    reparticaoEmitente: v4_1.z.string().min(1).max(60),
    dataPagamento: v4_1.z.date().optional()
});
exports.intermediadorSchema = v4_1.z.object({
    cnpj: v4_1.z.string().length(14),
    identificadorVendedor: v4_1.z.string().min(2).max(60)
});
exports.exportacaoSchema = v4_1.z.object({
    ufSaida: v4_1.z.string().length(2),
    localExportacao: v4_1.z.string().min(1).max(60),
    localDespacho: v4_1.z.string().min(1).max(60).optional()
});
exports.compraSchema = v4_1.z.object({
    notaEmpenho: v4_1.z.string().min(1).max(22).optional(),
    pedido: v4_1.z.string().min(1).max(60).optional(),
    contrato: v4_1.z.string().min(1).max(60).optional()
});
