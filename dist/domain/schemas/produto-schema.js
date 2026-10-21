"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.produtoSchema = exports.ibsCbsSchema = exports.ipiSchema = exports.pisCofinsStSchema = exports.cofinsSchema = exports.pisSchema = exports.icmsUfDestSchema = exports.icmsSchema = void 0;
const v4_1 = require("zod/v4");
exports.icmsSchema = v4_1.z.object({
    origem: v4_1.z.int().min(0).max(8),
    cst: v4_1.z.string().length(2).optional(),
    csosn: v4_1.z.string().min(3).max(3).optional(),
    aliquota: v4_1.z.number().min(0).optional(),
    baseCalculo: v4_1.z.number().min(0).optional(),
    valor: v4_1.z.number().min(0).optional(),
    modalidadeBaseCalculo: v4_1.z.int().min(0).max(3).optional(),
    percentualReducaoBase: v4_1.z.number().min(0).max(100).optional(),
    baseCalculoFcp: v4_1.z.number().min(0).optional(),
    aliquotaFcp: v4_1.z.number().min(0).max(100).optional(),
    valorFcp: v4_1.z.number().min(0).optional(),
    modalidadeBaseCalculoST: v4_1.z.int().min(0).max(5).optional(),
    percentualMva: v4_1.z.number().min(0).optional(),
    percentualReducaoBaseST: v4_1.z.number().min(0).max(100).optional(),
    baseCalculoST: v4_1.z.number().min(0).optional(),
    aliquotaST: v4_1.z.number().min(0).max(100).optional(),
    valorST: v4_1.z.number().min(0).optional(),
    baseCalculoFcpST: v4_1.z.number().min(0).optional(),
    aliquotaFcpST: v4_1.z.number().min(0).max(100).optional(),
    valorFcpST: v4_1.z.number().min(0).optional(),
    baseCalculoSTRetido: v4_1.z.number().min(0).optional(),
    aliquotaSTConsumidorFinal: v4_1.z.number().min(0).max(100).optional(),
    valorSTRetido: v4_1.z.number().min(0).optional(),
    valorSubstituto: v4_1.z.number().min(0).optional(),
    baseCalculoFcpSTRetido: v4_1.z.number().min(0).optional(),
    aliquotaFcpSTRetido: v4_1.z.number().min(0).max(100).optional(),
    valorFcpSTRetido: v4_1.z.number().min(0).optional(),
    valorDesonerado: v4_1.z.number().min(0).optional(),
    motivoDesoneracao: v4_1.z.int().min(0).max(99).optional(),
    percentualDiferimento: v4_1.z.number().min(0).max(100).optional(),
    aliquotaCreditoSN: v4_1.z.number().min(0).max(100).optional(),
    valorCreditoSN: v4_1.z.number().min(0).optional(),
    percentualBaseOperacaoPropria: v4_1.z.number().min(0).max(100).optional(),
    ufSt: v4_1.z.string().length(2).optional(),
    codigoBeneficioReducaoBase: v4_1.z.string().min(8).max(10).optional(),
    valorOperacao: v4_1.z.number().min(0).optional(),
    percentualFcpDiferido: v4_1.z.number().min(0).max(100).optional(),
    valorFcpDiferido: v4_1.z.number().min(0).optional(),
    valorFcpEfetivo: v4_1.z.number().min(0).optional(),
    indicadorDeducaoDesoneracao: v4_1.z.literal(0).or(v4_1.z.literal(1)).optional(),
    valorStDesonerado: v4_1.z.number().min(0).optional(),
    motivoStDesoneracao: v4_1.z.int().min(0).max(99).optional(),
    baseCalculoSTDestino: v4_1.z.number().min(0).optional(),
    valorSTDestino: v4_1.z.number().min(0).optional(),
    efetivo: v4_1.z
        .object({
        percentualReducaoBase: v4_1.z.number().min(0).max(100),
        baseCalculo: v4_1.z.number().min(0),
        aliquota: v4_1.z.number().min(0).max(100),
        valor: v4_1.z.number().min(0)
    })
        .optional(),
    monofasico: v4_1.z
        .object({
        quantidade: v4_1.z.number().min(0).optional(),
        aliquotaAdRem: v4_1.z.number().min(0).optional(),
        valor: v4_1.z.number().min(0).optional(),
        quantidadeRetencao: v4_1.z.number().min(0).optional(),
        aliquotaAdRemRetencao: v4_1.z.number().min(0).optional(),
        valorRetencao: v4_1.z.number().min(0).optional(),
        percentualReducaoAdRem: v4_1.z.number().min(0).max(100).optional(),
        motivoReducaoAdRem: v4_1.z.int().min(0).max(9).optional(),
        quantidadeRetido: v4_1.z.number().min(0).optional(),
        aliquotaAdRemRetido: v4_1.z.number().min(0).optional(),
        valorRetido: v4_1.z.number().min(0).optional(),
        valorOperacao: v4_1.z.number().min(0).optional(),
        percentualDiferimento: v4_1.z.number().min(0).max(100).optional(),
        valorDiferido: v4_1.z.number().min(0).optional(),
        quantidadeDiferida: v4_1.z.number().min(0).optional(),
        aliquotaAdRemDiferida: v4_1.z.number().min(0).optional()
    })
        .optional()
});
exports.icmsUfDestSchema = v4_1.z.object({
    baseCalculo: v4_1.z.number().min(0).optional(),
    baseCalculoFcp: v4_1.z.number().min(0).optional(),
    aliquotaFcp: v4_1.z.number().min(0).max(100).optional(),
    aliquotaInterna: v4_1.z.number().min(0).max(100),
    aliquotaInterestadual: v4_1.z.literal(4).or(v4_1.z.literal(7)).or(v4_1.z.literal(12)),
    percentualPartilha: v4_1.z.number().min(0).max(100).optional()
});
exports.pisSchema = v4_1.z.object({
    cst: v4_1.z.string().length(2),
    baseCalculo: v4_1.z.number().min(0).optional(),
    aliquota: v4_1.z.number().min(0).optional(),
    valor: v4_1.z.number().min(0).optional(),
    quantidade: v4_1.z.number().min(0).optional(),
    aliquotaPorUnidade: v4_1.z.number().min(0).optional()
});
exports.cofinsSchema = v4_1.z.object({
    cst: v4_1.z.string().length(2),
    baseCalculo: v4_1.z.number().min(0).optional(),
    aliquota: v4_1.z.number().min(0).optional(),
    valor: v4_1.z.number().min(0).optional(),
    quantidade: v4_1.z.number().min(0).optional(),
    aliquotaPorUnidade: v4_1.z.number().min(0).optional()
});
exports.pisCofinsStSchema = v4_1.z
    .object({
    baseCalculo: v4_1.z.number().min(0).optional(),
    aliquota: v4_1.z.number().min(0).max(100).optional(),
    quantidade: v4_1.z.number().min(0).optional(),
    aliquotaPorUnidade: v4_1.z.number().min(0).optional(),
    valor: v4_1.z.number().min(0),
    compoeTotal: v4_1.z.literal(0).or(v4_1.z.literal(1)).optional()
})
    .refine((p) => (p.baseCalculo !== undefined && p.aliquota !== undefined) ||
    (p.quantidade !== undefined && p.aliquotaPorUnidade !== undefined), { message: 'Informe base + aliquota, ou quantidade + aliquota por unidade' });
exports.ipiSchema = v4_1.z.object({
    cst: v4_1.z.string().length(2),
    baseCalculo: v4_1.z.number().min(0).optional(),
    aliquota: v4_1.z.number().min(0).optional(),
    valor: v4_1.z.number().min(0).optional(),
    cEnq: v4_1.z.string().max(3).optional(),
    cnpjProdutor: v4_1.z.string().length(14).optional(),
    codigoSelo: v4_1.z.string().min(1).max(60).optional(),
    quantidadeSelo: v4_1.z.number().int().min(0).optional(),
    quantidade: v4_1.z.number().min(0).optional(),
    valorPorUnidade: v4_1.z.number().min(0).optional()
});
const enteTributanteSchema = v4_1.z.object({
    aliquota: v4_1.z.number().min(0).max(100),
    diferimento: v4_1.z
        .object({ percentual: v4_1.z.number().min(0).max(100), valor: v4_1.z.number().min(0) })
        .optional(),
    tributoDevolvido: v4_1.z.number().min(0).optional(),
    reducao: v4_1.z
        .object({
        percentualReducao: v4_1.z.number().min(0).max(100),
        aliquotaEfetiva: v4_1.z.number().min(0).max(100)
    })
        .optional(),
    valor: v4_1.z.number().min(0).optional()
});
const creditoPresumidoEnteSchema = v4_1.z
    .object({
    percentual: v4_1.z.number().min(0).max(100),
    valor: v4_1.z.number().min(0).optional(),
    valorCondicaoSuspensiva: v4_1.z.number().min(0).optional()
})
    .refine((c) => c.valor !== undefined || c.valorCondicaoSuspensiva !== undefined, {
    message: 'Informe vCredPres ou vCredPresCondSus no credito presumido'
});
exports.ibsCbsSchema = v4_1.z.object({
    cst: v4_1.z.string().min(1).max(3),
    cClassTrib: v4_1.z.string().min(1).max(6),
    doacao: v4_1.z.boolean().optional(),
    baseCalculo: v4_1.z.number().min(0).optional(),
    pIBSUF: v4_1.z.number().min(0).optional(),
    pIBSMun: v4_1.z.number().min(0).optional(),
    pCBS: v4_1.z.number().min(0).optional(),
    ibsUf: enteTributanteSchema.optional(),
    ibsMun: enteTributanteSchema.optional(),
    cbs: enteTributanteSchema.optional(),
    tributacaoRegular: v4_1.z
        .object({
        cst: v4_1.z.string().min(1).max(3),
        cClassTrib: v4_1.z.string().min(1).max(6),
        aliquotaEfetivaIbsUf: v4_1.z.number().min(0),
        valorIbsUf: v4_1.z.number().min(0),
        aliquotaEfetivaIbsMun: v4_1.z.number().min(0),
        valorIbsMun: v4_1.z.number().min(0),
        aliquotaEfetivaCbs: v4_1.z.number().min(0),
        valorCbs: v4_1.z.number().min(0)
    })
        .optional(),
    tributacaoCompraGov: v4_1.z
        .object({
        aliquotaIbsUf: v4_1.z.number().min(0),
        valorIbsUf: v4_1.z.number().min(0),
        aliquotaIbsMun: v4_1.z.number().min(0),
        valorIbsMun: v4_1.z.number().min(0),
        aliquotaCbs: v4_1.z.number().min(0),
        valorCbs: v4_1.z.number().min(0)
    })
        .optional(),
    monofasia: v4_1.z
        .object({
        padrao: v4_1.z
            .object({
            quantidade: v4_1.z.number().min(0),
            aliquotaIbs: v4_1.z.number().min(0),
            aliquotaCbs: v4_1.z.number().min(0),
            valorIbs: v4_1.z.number().min(0),
            valorCbs: v4_1.z.number().min(0)
        })
            .optional(),
        retencao: v4_1.z
            .object({
            quantidade: v4_1.z.number().min(0),
            aliquotaIbs: v4_1.z.number().min(0),
            valorIbs: v4_1.z.number().min(0),
            aliquotaCbs: v4_1.z.number().min(0),
            valorCbs: v4_1.z.number().min(0)
        })
            .optional(),
        retidoAnteriormente: v4_1.z
            .object({
            quantidade: v4_1.z.number().min(0),
            aliquotaIbs: v4_1.z.number().min(0),
            valorIbs: v4_1.z.number().min(0),
            aliquotaCbs: v4_1.z.number().min(0),
            valorCbs: v4_1.z.number().min(0)
        })
            .optional(),
        diferimento: v4_1.z
            .object({
            percentualIbs: v4_1.z.number().min(0).max(100),
            valorIbs: v4_1.z.number().min(0),
            percentualCbs: v4_1.z.number().min(0).max(100),
            valorCbs: v4_1.z.number().min(0)
        })
            .optional(),
        totalIbs: v4_1.z.number().min(0),
        totalCbs: v4_1.z.number().min(0)
    })
        .optional(),
    transferenciaCredito: v4_1.z
        .object({ valorIbs: v4_1.z.number().min(0), valorCbs: v4_1.z.number().min(0) })
        .optional(),
    ajusteCompetencia: v4_1.z
        .object({
        competencia: v4_1.z.string().regex(/^\d{4}-\d{2}$/, 'Use o formato AAAA-MM'),
        valorIbs: v4_1.z.number().min(0),
        valorCbs: v4_1.z.number().min(0)
    })
        .optional(),
    estornoCredito: v4_1.z
        .object({ valorIbs: v4_1.z.number().min(0), valorCbs: v4_1.z.number().min(0) })
        .optional(),
    creditoPresumido: v4_1.z
        .object({
        baseCalculo: v4_1.z.number().min(0),
        codigo: v4_1.z.string().min(1).max(10),
        ibs: creditoPresumidoEnteSchema.optional(),
        cbs: creditoPresumidoEnteSchema.optional()
    })
        .optional(),
    creditoPresumidoZfm: v4_1.z
        .object({
        competencia: v4_1.z.string().regex(/^\d{4}-\d{2}$/, 'Use o formato AAAA-MM'),
        tipo: v4_1.z.string().min(1).max(2),
        valor: v4_1.z.number().min(0)
    })
        .optional()
});
exports.produtoSchema = v4_1.z.object({
    numero: v4_1.z.int().min(1),
    codigo: v4_1.z.string().min(1).max(60),
    descricao: v4_1.z.string().min(1).max(120),
    ncm: v4_1.z.string().length(8),
    cest: v4_1.z.string().length(7).optional(),
    codigoBeneficioFiscal: v4_1.z.string().min(8).max(10).optional(),
    cfop: v4_1.z.string().length(4),
    unidade: v4_1.z.string().min(1).max(6),
    quantidade: v4_1.z.number().positive(),
    valorUnitario: v4_1.z.number().min(0),
    valorTotal: v4_1.z.number().min(0),
    valorDesconto: v4_1.z.number().min(0).optional(),
    valorFrete: v4_1.z.number().min(0).optional(),
    valorSeguro: v4_1.z.number().min(0).optional(),
    outrasDespesas: v4_1.z.number().min(0).optional(),
    ean: v4_1.z.string().max(14).optional(),
    eanTributavel: v4_1.z.string().max(14).optional(),
    icms: exports.icmsSchema,
    pis: exports.pisSchema,
    cofins: exports.cofinsSchema,
    ipi: exports.ipiSchema.optional(),
    icmsUfDest: exports.icmsUfDestSchema.optional(),
    ibsCbs: exports.ibsCbsSchema.optional(),
    impostoSeletivo: v4_1.z
        .object({
        cst: v4_1.z.string().min(1).max(3),
        cClassTrib: v4_1.z.string().min(1).max(6),
        baseCalculo: v4_1.z.number().min(0),
        aliquota: v4_1.z.number().min(0).max(100),
        aliquotaEspecifica: v4_1.z.number().min(0).optional(),
        unidadeTributavel: v4_1.z.string().min(1).max(6),
        quantidadeTributavel: v4_1.z.number().min(0),
        valor: v4_1.z.number().min(0)
    })
        .optional(),
    ii: v4_1.z
        .object({
        baseCalculo: v4_1.z.number().min(0),
        despesasAduaneiras: v4_1.z.number().min(0),
        valor: v4_1.z.number().min(0),
        valorIof: v4_1.z.number().min(0)
    })
        .optional(),
    issqn: v4_1.z
        .object({
        baseCalculo: v4_1.z.number().min(0),
        aliquota: v4_1.z.number().min(0).max(100),
        valor: v4_1.z.number().min(0),
        codigoMunicipioFatoGerador: v4_1.z.string().length(7),
        itemListaServicos: v4_1.z.string().min(4).max(5),
        valorDeducao: v4_1.z.number().min(0).optional(),
        outrasRetencoes: v4_1.z.number().min(0).optional(),
        descontoIncondicionado: v4_1.z.number().min(0).optional(),
        descontoCondicionado: v4_1.z.number().min(0).optional(),
        valorRetido: v4_1.z.number().min(0).optional(),
        exigibilidade: v4_1.z.int().min(1).max(7),
        codigoServico: v4_1.z.string().min(1).max(20).optional(),
        codigoMunicipio: v4_1.z.string().length(7).optional(),
        codigoPais: v4_1.z.string().min(1).max(4).optional(),
        numeroProcesso: v4_1.z.string().min(1).max(30).optional(),
        incentivoFiscal: v4_1.z.literal(1).or(v4_1.z.literal(2))
    })
        .optional(),
    pisSt: exports.pisCofinsStSchema.optional(),
    cofinsSt: exports.pisCofinsStSchema.optional(),
    tributosAproximados: v4_1.z.number().min(0).optional(),
    impostoDevolvido: v4_1.z
        .object({
        percentualDevolvido: v4_1.z.number().min(0).max(100),
        valorIpiDevolvido: v4_1.z.number().min(0)
    })
        .optional(),
    informacoesAdicionais: v4_1.z.string().max(500).optional(),
    valorItem: v4_1.z.number().min(0).optional()
});
