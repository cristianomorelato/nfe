"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.destinatarioSchema = void 0;
const v4_1 = require("zod/v4");
const endereco_schema_1 = require("./endereco-schema");
exports.destinatarioSchema = v4_1.z
    .object({
    cpf: v4_1.z.string().length(11).optional(),
    cnpj: v4_1.z.string().length(14).optional(),
    idEstrangeiro: v4_1.z.string().min(2).max(20).optional(),
    nome: v4_1.z.string().min(1).max(60),
    email: v4_1.z.email().max(60).optional(),
    inscricaoEstadual: v4_1.z.string().max(14).optional(),
    inscricaoSuframa: v4_1.z.string().min(8).max(9).optional(),
    inscricaoMunicipal: v4_1.z.string().min(1).max(15).optional(),
    indicadorIE: v4_1.z.literal(1).or(v4_1.z.literal(2)).or(v4_1.z.literal(9)),
    endereco: endereco_schema_1.enderecoSchema
})
    .refine((data) => data.cpf || data.cnpj || data.idEstrangeiro, {
    message: 'Destinatario deve ter CPF, CNPJ ou idEstrangeiro'
});
