"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporteSchema = exports.retencaoTransporteSchema = exports.veiculoTranspSchema = exports.volumeSchema = void 0;
const v4_1 = require("zod/v4");
exports.volumeSchema = v4_1.z.object({
    quantidade: v4_1.z.number().int().min(0).optional(),
    especie: v4_1.z.string().max(60).optional(),
    marca: v4_1.z.string().max(60).optional(),
    numeracao: v4_1.z.string().max(60).optional(),
    pesoLiquido: v4_1.z.number().min(0).optional(),
    pesoBruto: v4_1.z.number().min(0).optional(),
    lacres: v4_1.z.array(v4_1.z.string().min(1).max(60)).optional()
});
exports.veiculoTranspSchema = v4_1.z.object({
    placa: v4_1.z.string().max(7).optional(),
    uf: v4_1.z.string().length(2).optional(),
    rntc: v4_1.z.string().max(20).optional()
});
exports.retencaoTransporteSchema = v4_1.z.object({
    valorServico: v4_1.z.number().min(0),
    baseCalculoRetencao: v4_1.z.number().min(0),
    aliquotaRetencao: v4_1.z.number().min(0).max(100),
    valorRetencao: v4_1.z.number().min(0),
    cfop: v4_1.z.string().length(4),
    codigoMunicipio: v4_1.z.string().length(7)
});
exports.transporteSchema = v4_1.z
    .object({
    modalidadeFrete: v4_1.z
        .literal(0)
        .or(v4_1.z.literal(1))
        .or(v4_1.z.literal(2))
        .or(v4_1.z.literal(3))
        .or(v4_1.z.literal(4))
        .or(v4_1.z.literal(9)),
    cnpjTransportadora: v4_1.z.string().length(14).optional(),
    cpfTransportadora: v4_1.z.string().length(11).optional(),
    nomeTransportadora: v4_1.z.string().max(60).optional(),
    inscricaoEstadual: v4_1.z.string().max(14).optional(),
    endereco: v4_1.z.string().max(60).optional(),
    municipio: v4_1.z.string().max(60).optional(),
    uf: v4_1.z.string().length(2).optional(),
    retencao: exports.retencaoTransporteSchema.optional(),
    veiculo: exports.veiculoTranspSchema.optional(),
    reboques: v4_1.z.array(exports.veiculoTranspSchema).max(5).optional(),
    vagao: v4_1.z.string().max(20).optional(),
    balsa: v4_1.z.string().max(20).optional(),
    volumes: v4_1.z.array(exports.volumeSchema).max(5000).optional()
})
    .refine((t) => !(t.vagao && t.balsa), {
    message: 'Informe apenas um modal: vagao ou balsa'
})
    .refine((t) => !((t.vagao || t.balsa) && (t.veiculo || t.reboques?.length)), {
    message: 'Vagao/balsa nao convivem com veiculo rodoviario no mesmo transporte'
});
