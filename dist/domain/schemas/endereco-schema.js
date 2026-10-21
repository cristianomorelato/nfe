"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enderecoSchema = void 0;
const v4_1 = require("zod/v4");
exports.enderecoSchema = v4_1.z.object({
    logradouro: v4_1.z.string().min(1).max(60),
    numero: v4_1.z.string().min(1).max(60),
    complemento: v4_1.z.string().max(60).optional(),
    bairro: v4_1.z.string().min(1).max(60),
    codigoMunicipio: v4_1.z.string().length(7),
    municipio: v4_1.z.string().min(1).max(60),
    uf: v4_1.z.string().length(2),
    cep: v4_1.z.string().length(8),
    codigoPais: v4_1.z.string().default('1058'),
    pais: v4_1.z.string().default('Brasil'),
    telefone: v4_1.z.string().max(14).optional()
});
