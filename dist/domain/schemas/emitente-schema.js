"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitenteSchema = void 0;
const v4_1 = require("zod/v4");
const endereco_schema_1 = require("./endereco-schema");
exports.emitenteSchema = v4_1.z.object({
    cnpj: v4_1.z.string().length(14),
    razaoSocial: v4_1.z.string().min(1).max(60),
    nomeFantasia: v4_1.z.string().max(60).optional(),
    inscricaoEstadual: v4_1.z.string().min(2).max(14),
    inscricaoEstadualST: v4_1.z.string().min(2).max(14).optional(),
    inscricaoMunicipal: v4_1.z.string().max(15).optional(),
    regimeTributario: v4_1.z.literal(1).or(v4_1.z.literal(2)).or(v4_1.z.literal(3)),
    cnae: v4_1.z.string().length(7).optional(),
    endereco: endereco_schema_1.enderecoSchema
});
