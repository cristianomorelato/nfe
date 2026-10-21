"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nfeSchema = exports.nfeIdentificacaoSchema = exports.responsavelTecnicoSchema = exports.autorizadoXmlSchema = exports.notaReferenciadaSchema = void 0;
const v4_1 = require("zod/v4");
const emitente_schema_1 = require("./emitente-schema");
const destinatario_schema_1 = require("./destinatario-schema");
const produto_schema_1 = require("./produto-schema");
const transporte_schema_1 = require("./transporte-schema");
const pagamento_schema_1 = require("./pagamento-schema");
const cobranca_schema_1 = require("./cobranca-schema");
const local_schema_1 = require("./local-schema");
const informacoes_adicionais_schema_1 = require("./informacoes-adicionais-schema");
exports.notaReferenciadaSchema = v4_1.z.discriminatedUnion('tipo', [
    v4_1.z.object({ tipo: v4_1.z.literal('nfe'), chaveAcesso: v4_1.z.string().length(44) }),
    v4_1.z.object({ tipo: v4_1.z.literal('cte'), chaveAcesso: v4_1.z.string().length(44) }),
    v4_1.z.object({
        tipo: v4_1.z.literal('nf'),
        uf: v4_1.z.string().length(2),
        anoMes: v4_1.z.string().length(4),
        cnpj: v4_1.z.string().length(14),
        modelo: v4_1.z.literal('01').or(v4_1.z.literal('02')),
        serie: v4_1.z.int().min(0).max(999),
        numero: v4_1.z.int().min(1).max(999999999)
    }),
    v4_1.z.object({
        tipo: v4_1.z.literal('produtorRural'),
        uf: v4_1.z.string().length(2),
        anoMes: v4_1.z.string().length(4),
        cnpj: v4_1.z.string().length(14).optional(),
        cpf: v4_1.z.string().length(11).optional(),
        inscricaoEstadual: v4_1.z.string().min(2).max(14),
        modelo: v4_1.z.literal('01').or(v4_1.z.literal('04')),
        serie: v4_1.z.int().min(0).max(999),
        numero: v4_1.z.int().min(1).max(999999999)
    }),
    v4_1.z.object({
        tipo: v4_1.z.literal('ecf'),
        modelo: v4_1.z.literal('2B').or(v4_1.z.literal('2C')).or(v4_1.z.literal('2D')),
        numeroEcf: v4_1.z.string().min(1).max(3),
        numeroContadorOrdem: v4_1.z.string().min(1).max(6)
    })
]);
exports.autorizadoXmlSchema = v4_1.z
    .object({
    cnpj: v4_1.z.string().length(14).optional(),
    cpf: v4_1.z.string().length(11).optional()
})
    .refine((a) => Boolean(a.cnpj) !== Boolean(a.cpf), {
    message: 'Informe CNPJ ou CPF no autorizado a baixar o XML'
});
exports.responsavelTecnicoSchema = v4_1.z.object({
    cnpj: v4_1.z.string().length(14),
    contato: v4_1.z.string().min(2).max(60),
    email: v4_1.z.email().max(60),
    telefone: v4_1.z.string().min(7).max(12),
    idCSRT: v4_1.z.string().length(2).optional(),
    csrt: v4_1.z.string().min(1).optional()
});
exports.nfeIdentificacaoSchema = v4_1.z.object({
    naturezaOperacao: v4_1.z.string().min(1).max(60),
    tipoOperacao: v4_1.z.literal(0).or(v4_1.z.literal(1)),
    destinoOperacao: v4_1.z.literal(1).or(v4_1.z.literal(2)).or(v4_1.z.literal(3)),
    finalidade: v4_1.z.literal(1).or(v4_1.z.literal(2)).or(v4_1.z.literal(3)).or(v4_1.z.literal(4)),
    consumidorFinal: v4_1.z.literal(0).or(v4_1.z.literal(1)),
    presencaComprador: v4_1.z
        .literal(0)
        .or(v4_1.z.literal(1))
        .or(v4_1.z.literal(2))
        .or(v4_1.z.literal(3))
        .or(v4_1.z.literal(4))
        .or(v4_1.z.literal(5))
        .or(v4_1.z.literal(9)),
    uf: v4_1.z.string().length(2),
    municipio: v4_1.z.string().length(7),
    serie: v4_1.z.int().min(0).max(999),
    numero: v4_1.z.int().min(1).max(999999999),
    dataEmissao: v4_1.z.date().optional(),
    tipoEmissao: v4_1.z
        .literal(1)
        .or(v4_1.z.literal(2))
        .or(v4_1.z.literal(3))
        .or(v4_1.z.literal(4))
        .or(v4_1.z.literal(5))
        .or(v4_1.z.literal(6))
        .or(v4_1.z.literal(7))
        .or(v4_1.z.literal(9))
        .optional(),
    tipoImpressao: v4_1.z
        .literal(0)
        .or(v4_1.z.literal(1))
        .or(v4_1.z.literal(2))
        .or(v4_1.z.literal(3))
        .or(v4_1.z.literal(4))
        .or(v4_1.z.literal(5))
        .optional(),
    modelo: v4_1.z.literal('55').or(v4_1.z.literal('65')).optional(),
    dataSaidaEntrada: v4_1.z.date().optional(),
    dataPrevistaEntrega: v4_1.z.date().optional(),
    municipioFatoGeradorIbs: v4_1.z.string().length(7).optional(),
    indicadorIntermediador: v4_1.z.literal(0).or(v4_1.z.literal(1)).optional(),
    dataHoraContingencia: v4_1.z.date().optional(),
    justificativaContingencia: v4_1.z.string().min(15).max(256).optional(),
    notasReferenciadas: v4_1.z.array(exports.notaReferenciadaSchema).max(500).optional(),
    pagamentosAntecipados: v4_1.z.array(v4_1.z.string().length(44)).max(99).optional()
});
exports.nfeSchema = v4_1.z.object({
    identificacao: exports.nfeIdentificacaoSchema,
    emitente: emitente_schema_1.emitenteSchema,
    destinatario: destinatario_schema_1.destinatarioSchema.optional(),
    produtos: v4_1.z.array(produto_schema_1.produtoSchema).min(1),
    transporte: transporte_schema_1.transporteSchema,
    cobranca: cobranca_schema_1.cobrancaSchema.optional(),
    pagamento: pagamento_schema_1.pagamentoSchema,
    informacoesComplementares: v4_1.z.string().max(5000).optional(),
    informacoesFisco: v4_1.z.string().max(2000).optional(),
    autorizadosXml: v4_1.z.array(exports.autorizadoXmlSchema).max(10).optional(),
    responsavelTecnico: exports.responsavelTecnicoSchema.optional(),
    avulsa: local_schema_1.avulsaSchema.optional(),
    retirada: local_schema_1.localSchema.optional(),
    entrega: local_schema_1.localSchema.optional(),
    intermediador: local_schema_1.intermediadorSchema.optional(),
    exportacao: local_schema_1.exportacaoSchema.optional(),
    compra: local_schema_1.compraSchema.optional(),
    cana: informacoes_adicionais_schema_1.canaSchema.optional(),
    observacoesContribuinte: v4_1.z.array(informacoes_adicionais_schema_1.observacaoSchema).max(10).optional(),
    observacoesFisco: v4_1.z.array(informacoes_adicionais_schema_1.observacaoSchema).max(10).optional(),
    processosReferenciados: v4_1.z.array(informacoes_adicionais_schema_1.processoReferenciadoSchema).max(100).optional(),
    solicitacaoNFF: v4_1.z.string().min(1).max(5000).optional(),
    agropecuario: informacoes_adicionais_schema_1.agropecuarioSchema.optional()
});
