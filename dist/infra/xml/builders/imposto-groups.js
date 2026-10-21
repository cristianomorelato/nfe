"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildICMS = buildICMS;
exports.buildIPI = buildIPI;
exports.buildII = buildII;
exports.buildISSQN = buildISSQN;
exports.buildPIS = buildPIS;
exports.buildCOFINS = buildCOFINS;
exports.buildPISST = buildPISST;
exports.buildCOFINSST = buildCOFINSST;
exports.buildICMSUFDest = buildICMSUFDest;
exports.buildIS = buildIS;
exports.buildImpostos = buildImpostos;
const xml_helper_1 = require("../xml-helper");
const ibscbs_groups_1 = require("./ibscbs-groups");
/**
 * Grupos de imposto do item. Cada CST/CSOSN tem uma sequencia propria no XSD —
 * campo fora de ordem ou sequencia opcional pela metade derruba a validacao.
 */
/** pFCP + vFCP (sequencia opcional dos CST sem base de FCP separada). */
function fcpSemBase(icms) {
    if (icms.aliquotaFcp === undefined)
        return '';
    const base = icms.baseCalculoFcp ?? icms.baseCalculo ?? 0;
    return ((0, xml_helper_1.tag)('pFCP', (0, xml_helper_1.formatNumber)(icms.aliquotaFcp, 4)) +
        (0, xml_helper_1.tag)('vFCP', (0, xml_helper_1.formatNumber)(icms.valorFcp ?? (base * icms.aliquotaFcp) / 100, 2)));
}
/** vBCFCP + pFCP + vFCP. */
function fcpComBase(icms) {
    if (icms.aliquotaFcp === undefined)
        return '';
    const base = icms.baseCalculoFcp ?? icms.baseCalculo ?? 0;
    return ((0, xml_helper_1.tag)('vBCFCP', (0, xml_helper_1.formatNumber)(base, 2)) +
        (0, xml_helper_1.tag)('pFCP', (0, xml_helper_1.formatNumber)(icms.aliquotaFcp, 4)) +
        (0, xml_helper_1.tag)('vFCP', (0, xml_helper_1.formatNumber)(icms.valorFcp ?? (base * icms.aliquotaFcp) / 100, 2)));
}
/** vBCFCPST + pFCPST + vFCPST. */
function fcpST(icms) {
    if (icms.aliquotaFcpST === undefined)
        return '';
    const base = icms.baseCalculoFcpST ?? icms.baseCalculoST ?? 0;
    return ((0, xml_helper_1.tag)('vBCFCPST', (0, xml_helper_1.formatNumber)(base, 2)) +
        (0, xml_helper_1.tag)('pFCPST', (0, xml_helper_1.formatNumber)(icms.aliquotaFcpST, 4)) +
        (0, xml_helper_1.tag)('vFCPST', (0, xml_helper_1.formatNumber)(icms.valorFcpST ?? (base * icms.aliquotaFcpST) / 100, 2)));
}
/** vBCFCPSTRet + pFCPSTRet + vFCPSTRet. */
function fcpSTRetido(icms) {
    if (icms.aliquotaFcpSTRetido === undefined)
        return '';
    const base = icms.baseCalculoFcpSTRetido ?? icms.baseCalculoSTRetido ?? 0;
    return ((0, xml_helper_1.tag)('vBCFCPSTRet', (0, xml_helper_1.formatNumber)(base, 2)) +
        (0, xml_helper_1.tag)('pFCPSTRet', (0, xml_helper_1.formatNumber)(icms.aliquotaFcpSTRetido, 4)) +
        (0, xml_helper_1.tag)('vFCPSTRet', (0, xml_helper_1.formatNumber)(icms.valorFcpSTRetido ?? (base * icms.aliquotaFcpSTRetido) / 100, 2)));
}
/** modBCST ... vICMSST — substituicao tributaria propria. */
function substituicao(icms) {
    const baseST = icms.baseCalculoST ?? 0;
    const aliquotaST = icms.aliquotaST ?? 0;
    return ((0, xml_helper_1.tag)('modBCST', String(icms.modalidadeBaseCalculoST ?? 4)) +
        (0, xml_helper_1.tag)('pMVAST', icms.percentualMva !== undefined ? (0, xml_helper_1.formatNumber)(icms.percentualMva, 4) : undefined) +
        (0, xml_helper_1.tag)('pRedBCST', icms.percentualReducaoBaseST !== undefined
            ? (0, xml_helper_1.formatNumber)(icms.percentualReducaoBaseST, 4)
            : undefined) +
        (0, xml_helper_1.tag)('vBCST', (0, xml_helper_1.formatNumber)(baseST, 2)) +
        (0, xml_helper_1.tag)('pICMSST', (0, xml_helper_1.formatNumber)(aliquotaST, 4)) +
        (0, xml_helper_1.tag)('vICMSST', (0, xml_helper_1.formatNumber)(icms.valorST ?? (baseST * aliquotaST) / 100, 2)) +
        fcpST(icms));
}
/** vBCSTRet + pST + vICMSSubstituto? + vICMSSTRet — ST retido anteriormente. */
function stRetido(icms, obrigatorio = false) {
    const base = icms.baseCalculoSTRetido ?? icms.baseCalculo;
    const valor = icms.valorSTRetido ?? icms.valor;
    if (!obrigatorio && base === undefined && valor === undefined)
        return '';
    return ((0, xml_helper_1.tag)('vBCSTRet', (0, xml_helper_1.formatNumber)(base ?? 0, 2)) +
        (0, xml_helper_1.tag)('pST', (0, xml_helper_1.formatNumber)(icms.aliquotaSTConsumidorFinal ?? icms.aliquota ?? 0, 4)) +
        (0, xml_helper_1.tag)('vICMSSubstituto', icms.valorSubstituto !== undefined ? (0, xml_helper_1.formatNumber)(icms.valorSubstituto, 2) : undefined) +
        (0, xml_helper_1.tag)('vICMSSTRet', (0, xml_helper_1.formatNumber)(valor ?? 0, 2)));
}
/** pRedBCEfet + vBCEfet + pICMSEfet + vICMSEfet — ICMS efetivo. */
function efetivo(icms) {
    if (!icms.efetivo)
        return '';
    return ((0, xml_helper_1.tag)('pRedBCEfet', (0, xml_helper_1.formatNumber)(icms.efetivo.percentualReducaoBase, 4)) +
        (0, xml_helper_1.tag)('vBCEfet', (0, xml_helper_1.formatNumber)(icms.efetivo.baseCalculo, 2)) +
        (0, xml_helper_1.tag)('pICMSEfet', (0, xml_helper_1.formatNumber)(icms.efetivo.aliquota, 4)) +
        (0, xml_helper_1.tag)('vICMSEfet', (0, xml_helper_1.formatNumber)(icms.efetivo.valor, 2)));
}
/** vICMSDeson + motDesICMS + indDeduzDeson? — desoneracao. */
function desoneracao(icms) {
    if (icms.valorDesonerado === undefined || icms.motivoDesoneracao === undefined)
        return '';
    return ((0, xml_helper_1.tag)('vICMSDeson', (0, xml_helper_1.formatNumber)(icms.valorDesonerado, 2)) +
        (0, xml_helper_1.tag)('motDesICMS', String(icms.motivoDesoneracao)) +
        (0, xml_helper_1.tag)('indDeduzDeson', icms.indicadorDeducaoDesoneracao !== undefined
            ? String(icms.indicadorDeducaoDesoneracao)
            : undefined));
}
/** vICMSSTDeson + motDesICMSST — desoneracao do ST. */
function desoneracaoST(icms) {
    if (icms.valorStDesonerado === undefined || icms.motivoStDesoneracao === undefined)
        return '';
    return ((0, xml_helper_1.tag)('vICMSSTDeson', (0, xml_helper_1.formatNumber)(icms.valorStDesonerado, 2)) +
        (0, xml_helper_1.tag)('motDesICMSST', String(icms.motivoStDesoneracao)));
}
/**
 * Grupos monofasicos de combustivel (CST 02, 15, 53 e 61).
 */
function monofasico(icms, cst) {
    const mono = icms.monofasico ?? {};
    const q = (v) => (v !== undefined ? (0, xml_helper_1.formatNumber)(v, 4) : undefined);
    const v = (x) => (x !== undefined ? (0, xml_helper_1.formatNumber)(x, 2) : undefined);
    switch (cst) {
        case '02':
            return ((0, xml_helper_1.tag)('qBCMono', q(mono.quantidade)) +
                (0, xml_helper_1.tag)('adRemICMS', (0, xml_helper_1.formatNumber)(mono.aliquotaAdRem ?? 0, 4)) +
                (0, xml_helper_1.tag)('vICMSMono', (0, xml_helper_1.formatNumber)(mono.valor ?? 0, 2)));
        case '15':
            return ((0, xml_helper_1.tag)('qBCMono', q(mono.quantidade)) +
                (0, xml_helper_1.tag)('adRemICMS', (0, xml_helper_1.formatNumber)(mono.aliquotaAdRem ?? 0, 4)) +
                (0, xml_helper_1.tag)('vICMSMono', (0, xml_helper_1.formatNumber)(mono.valor ?? 0, 2)) +
                (0, xml_helper_1.tag)('qBCMonoReten', q(mono.quantidadeRetencao)) +
                (0, xml_helper_1.tag)('adRemICMSReten', (0, xml_helper_1.formatNumber)(mono.aliquotaAdRemRetencao ?? 0, 4)) +
                (0, xml_helper_1.tag)('vICMSMonoReten', (0, xml_helper_1.formatNumber)(mono.valorRetencao ?? 0, 2)) +
                (mono.percentualReducaoAdRem !== undefined && mono.motivoReducaoAdRem !== undefined
                    ? (0, xml_helper_1.tag)('pRedAdRem', (0, xml_helper_1.formatNumber)(mono.percentualReducaoAdRem, 2)) +
                        (0, xml_helper_1.tag)('motRedAdRem', String(mono.motivoReducaoAdRem))
                    : ''));
        case '53':
            return ((0, xml_helper_1.tag)('qBCMono', q(mono.quantidade)) +
                (0, xml_helper_1.tag)('adRemICMS', q(mono.aliquotaAdRem)) +
                (0, xml_helper_1.tag)('vICMSMonoOp', v(mono.valorOperacao)) +
                (0, xml_helper_1.tag)('pDif', mono.percentualDiferimento !== undefined
                    ? (0, xml_helper_1.formatNumber)(mono.percentualDiferimento, 4)
                    : undefined) +
                (0, xml_helper_1.tag)('vICMSMonoDif', v(mono.valorDiferido)) +
                (0, xml_helper_1.tag)('vICMSMono', v(mono.valor)) +
                (0, xml_helper_1.tag)('qBCMonoDif', q(mono.quantidadeDiferida)) +
                (0, xml_helper_1.tag)('adRemICMSDif', q(mono.aliquotaAdRemDiferida)));
        case '61':
            return ((0, xml_helper_1.tag)('qBCMonoRet', q(mono.quantidadeRetido)) +
                (0, xml_helper_1.tag)('adRemICMSRet', (0, xml_helper_1.formatNumber)(mono.aliquotaAdRemRetido ?? 0, 4)) +
                (0, xml_helper_1.tag)('vICMSMonoRet', (0, xml_helper_1.formatNumber)(mono.valorRetido ?? 0, 2)));
        default:
            return '';
    }
}
/**
 * Grupo `ICMS` do item, por CST (regime normal) ou CSOSN (Simples Nacional).
 */
function buildICMS(prod) {
    const icms = prod.icms;
    const orig = (0, xml_helper_1.tag)('orig', String(icms.origem));
    if (icms.csosn)
        return (0, xml_helper_1.tagGroup)('ICMS', buildICMSSN(icms, orig));
    const cst = icms.cst || '00';
    const modBC = (0, xml_helper_1.tag)('modBC', String(icms.modalidadeBaseCalculo ?? 3));
    const vBC = (0, xml_helper_1.tag)('vBC', (0, xml_helper_1.formatNumber)(icms.baseCalculo ?? 0, 2));
    const pICMS = (0, xml_helper_1.tag)('pICMS', (0, xml_helper_1.formatNumber)(icms.aliquota ?? 0, 4));
    const vICMS = (0, xml_helper_1.tag)('vICMS', (0, xml_helper_1.formatNumber)(icms.valor ?? 0, 2));
    const pRedBC = icms.percentualReducaoBase !== undefined
        ? (0, xml_helper_1.tag)('pRedBC', (0, xml_helper_1.formatNumber)(icms.percentualReducaoBase, 4))
        : '';
    // ICMSPart e ICMSST substituem o grupo do CST quando pedidos explicitamente.
    if (icms.percentualBaseOperacaoPropria !== undefined && icms.ufSt) {
        return (0, xml_helper_1.tagGroup)('ICMS', (0, xml_helper_1.tagGroup)('ICMSPart', orig +
            (0, xml_helper_1.tag)('CST', cst) +
            modBC +
            vBC +
            pRedBC +
            pICMS +
            vICMS +
            substituicao(icms) +
            (0, xml_helper_1.tag)('pBCOp', (0, xml_helper_1.formatNumber)(icms.percentualBaseOperacaoPropria, 4)) +
            (0, xml_helper_1.tag)('UFST', icms.ufSt)));
    }
    if (icms.baseCalculoSTDestino !== undefined && icms.valorSTDestino !== undefined) {
        return (0, xml_helper_1.tagGroup)('ICMS', (0, xml_helper_1.tagGroup)('ICMSST', orig +
            (0, xml_helper_1.tag)('CST', cst) +
            stRetido(icms, true) +
            fcpSTRetido(icms) +
            (0, xml_helper_1.tag)('vBCSTDest', (0, xml_helper_1.formatNumber)(icms.baseCalculoSTDestino, 2)) +
            (0, xml_helper_1.tag)('vICMSSTDest', (0, xml_helper_1.formatNumber)(icms.valorSTDestino, 2)) +
            efetivo(icms)));
    }
    const grupo = (conteudo, nomeGrupo = 'ICMS' + cst) => (0, xml_helper_1.tagGroup)('ICMS', (0, xml_helper_1.tagGroup)(nomeGrupo, orig + (0, xml_helper_1.tag)('CST', cst) + conteudo));
    switch (cst) {
        case '00':
            return grupo(modBC + vBC + pICMS + vICMS + fcpSemBase(icms));
        case '02':
        case '15':
        case '53':
        case '61':
            return grupo(monofasico(icms, cst));
        case '10':
            return grupo(modBC + vBC + pICMS + vICMS + fcpComBase(icms) + substituicao(icms) + desoneracaoST(icms));
        case '20':
            return grupo(modBC +
                (pRedBC || (0, xml_helper_1.tag)('pRedBC', '0.0000')) +
                vBC +
                pICMS +
                vICMS +
                fcpComBase(icms) +
                desoneracao(icms));
        case '30':
            return grupo(substituicao(icms) + desoneracao(icms));
        case '40':
        case '41':
        case '50':
            // XSD exige o nome fixo <ICMS40> pros 3 CSTs, mesmo com CST 41/50 dentro.
            return grupo(desoneracao(icms), 'ICMS40');
        case '51':
            return grupo(modBC +
                pRedBC +
                (0, xml_helper_1.tag)('cBenefRBC', icms.codigoBeneficioReducaoBase) +
                vBC +
                pICMS +
                (0, xml_helper_1.tag)('vICMSOp', icms.valorOperacao !== undefined ? (0, xml_helper_1.formatNumber)(icms.valorOperacao, 2) : undefined) +
                (icms.percentualDiferimento !== undefined
                    ? (0, xml_helper_1.tag)('pDif', (0, xml_helper_1.formatNumber)(icms.percentualDiferimento, 4)) +
                        (0, xml_helper_1.tag)('vICMSDif', (0, xml_helper_1.formatNumber)(((icms.baseCalculo ?? 0) * (icms.aliquota ?? 0) * icms.percentualDiferimento) /
                            10000, 2))
                    : '') +
                vICMS +
                fcpComBase(icms) +
                (icms.percentualFcpDiferido !== undefined && icms.valorFcpDiferido !== undefined
                    ? (0, xml_helper_1.tag)('pFCPDif', (0, xml_helper_1.formatNumber)(icms.percentualFcpDiferido, 4)) +
                        (0, xml_helper_1.tag)('vFCPDif', (0, xml_helper_1.formatNumber)(icms.valorFcpDiferido, 2)) +
                        (0, xml_helper_1.tag)('vFCPEfet', icms.valorFcpEfetivo !== undefined
                            ? (0, xml_helper_1.formatNumber)(icms.valorFcpEfetivo, 2)
                            : undefined)
                    : ''));
        case '60':
            return grupo(stRetido(icms) + fcpSTRetido(icms) + efetivo(icms));
        case '70':
            return grupo(modBC +
                (pRedBC || (0, xml_helper_1.tag)('pRedBC', '0.0000')) +
                vBC +
                pICMS +
                vICMS +
                fcpComBase(icms) +
                substituicao(icms) +
                desoneracao(icms) +
                desoneracaoST(icms));
        case '90':
            return grupo(modBC +
                vBC +
                pRedBC +
                pICMS +
                vICMS +
                fcpComBase(icms) +
                (icms.baseCalculoST !== undefined ? substituicao(icms) : '') +
                desoneracao(icms) +
                desoneracaoST(icms));
        default:
            return grupo(modBC + vBC + pICMS + vICMS);
    }
}
/**
 * Grupo `ICMS` do Simples Nacional, por CSOSN.
 */
function buildICMSSN(icms, orig) {
    const csosn = icms.csosn;
    const cson = (0, xml_helper_1.tag)('CSOSN', csosn);
    const creditoSN = (0, xml_helper_1.tag)('pCredSN', (0, xml_helper_1.formatNumber)(icms.aliquotaCreditoSN ?? 0, 4)) +
        (0, xml_helper_1.tag)('vCredICMSSN', (0, xml_helper_1.formatNumber)(icms.valorCreditoSN ?? ((icms.baseCalculo ?? 0) * (icms.aliquotaCreditoSN ?? 0)) / 100, 2));
    switch (csosn) {
        case '101':
            return (0, xml_helper_1.tagGroup)('ICMSSN101', orig + cson + creditoSN);
        case '201':
            return (0, xml_helper_1.tagGroup)('ICMSSN201', orig + cson + substituicao(icms) + creditoSN);
        case '202':
        case '203':
            return (0, xml_helper_1.tagGroup)('ICMSSN202', orig + cson + substituicao(icms));
        case '500':
            return (0, xml_helper_1.tagGroup)('ICMSSN500', orig + cson + stRetido(icms) + fcpSTRetido(icms) + efetivo(icms));
        case '900':
            return (0, xml_helper_1.tagGroup)('ICMSSN900', orig +
                cson +
                (icms.baseCalculo !== undefined
                    ? (0, xml_helper_1.tag)('modBC', String(icms.modalidadeBaseCalculo ?? 3)) +
                        (0, xml_helper_1.tag)('vBC', (0, xml_helper_1.formatNumber)(icms.baseCalculo, 2)) +
                        (icms.percentualReducaoBase !== undefined
                            ? (0, xml_helper_1.tag)('pRedBC', (0, xml_helper_1.formatNumber)(icms.percentualReducaoBase, 4))
                            : '') +
                        (0, xml_helper_1.tag)('pICMS', (0, xml_helper_1.formatNumber)(icms.aliquota ?? 0, 4)) +
                        (0, xml_helper_1.tag)('vICMS', (0, xml_helper_1.formatNumber)(icms.valor ?? 0, 2))
                    : '') +
                (icms.baseCalculoST !== undefined ? substituicao(icms) : '') +
                (icms.aliquotaCreditoSN !== undefined ? creditoSN : ''));
        default:
            return (0, xml_helper_1.tagGroup)('ICMSSN102', orig + cson);
    }
}
/**
 * IPI do item. Aceita tributacao por percentual (vBC + pIPI) ou por unidade
 * (qUnid + vUnid) — o XSD so permite um dos dois.
 */
function buildIPI(prod) {
    const ipi = prod.ipi;
    if (!ipi)
        return '';
    const cabecalho = (0, xml_helper_1.tag)('CNPJProd', ipi.cnpjProdutor) +
        (0, xml_helper_1.tag)('cSelo', ipi.codigoSelo) +
        (0, xml_helper_1.tag)('qSelo', ipi.quantidadeSelo !== undefined ? String(ipi.quantidadeSelo) : undefined) +
        (0, xml_helper_1.tag)('cEnq', ipi.cEnq || '999');
    const naoTributado = ['01', '02', '03', '04', '05', '51', '52', '53', '54', '55'];
    if (naoTributado.includes(ipi.cst)) {
        return (0, xml_helper_1.tagGroup)('IPI', cabecalho + (0, xml_helper_1.tagGroup)('IPINT', (0, xml_helper_1.tag)('CST', ipi.cst)));
    }
    const porUnidade = ipi.quantidade !== undefined && ipi.valorPorUnidade !== undefined
        ? (0, xml_helper_1.tag)('qUnid', (0, xml_helper_1.formatNumber)(ipi.quantidade, 4)) +
            (0, xml_helper_1.tag)('vUnid', (0, xml_helper_1.formatNumber)(ipi.valorPorUnidade, 4))
        : '';
    const porPercentual = (0, xml_helper_1.tag)('vBC', (0, xml_helper_1.formatNumber)(ipi.baseCalculo || 0, 2)) +
        (0, xml_helper_1.tag)('pIPI', (0, xml_helper_1.formatNumber)(ipi.aliquota || 0, 4));
    return (0, xml_helper_1.tagGroup)('IPI', cabecalho +
        (0, xml_helper_1.tagGroup)('IPITrib', (0, xml_helper_1.tag)('CST', ipi.cst) +
            (porUnidade || porPercentual) +
            (0, xml_helper_1.tag)('vIPI', (0, xml_helper_1.formatNumber)(ipi.valor || 0, 2))));
}
/**
 * Imposto de Importacao do item (grupo `II`).
 */
function buildII(prod) {
    const ii = prod.ii;
    if (!ii)
        return '';
    return (0, xml_helper_1.tagGroup)('II', (0, xml_helper_1.tag)('vBC', (0, xml_helper_1.formatNumber)(ii.baseCalculo, 2)) +
        (0, xml_helper_1.tag)('vDespAdu', (0, xml_helper_1.formatNumber)(ii.despesasAduaneiras, 2)) +
        (0, xml_helper_1.tag)('vII', (0, xml_helper_1.formatNumber)(ii.valor, 2)) +
        (0, xml_helper_1.tag)('vIOF', (0, xml_helper_1.formatNumber)(ii.valorIof, 2)));
}
/**
 * ISSQN do item, para nota mista de mercadoria e servico.
 */
function buildISSQN(prod) {
    const iss = prod.issqn;
    if (!iss)
        return '';
    const opcional = (v) => v !== undefined ? (0, xml_helper_1.formatNumber)(v, 2) : undefined;
    return (0, xml_helper_1.tagGroup)('ISSQN', (0, xml_helper_1.tag)('vBC', (0, xml_helper_1.formatNumber)(iss.baseCalculo, 2)) +
        (0, xml_helper_1.tag)('vAliq', (0, xml_helper_1.formatNumber)(iss.aliquota, 4)) +
        (0, xml_helper_1.tag)('vISSQN', (0, xml_helper_1.formatNumber)(iss.valor, 2)) +
        (0, xml_helper_1.tag)('cMunFG', iss.codigoMunicipioFatoGerador) +
        (0, xml_helper_1.tag)('cListServ', iss.itemListaServicos) +
        (0, xml_helper_1.tag)('vDeducao', opcional(iss.valorDeducao)) +
        (0, xml_helper_1.tag)('vOutro', opcional(iss.outrasRetencoes)) +
        (0, xml_helper_1.tag)('vDescIncond', opcional(iss.descontoIncondicionado)) +
        (0, xml_helper_1.tag)('vDescCond', opcional(iss.descontoCondicionado)) +
        (0, xml_helper_1.tag)('vISSRet', opcional(iss.valorRetido)) +
        (0, xml_helper_1.tag)('indISS', String(iss.exigibilidade)) +
        (0, xml_helper_1.tag)('cServico', iss.codigoServico) +
        (0, xml_helper_1.tag)('cMun', iss.codigoMunicipio) +
        (0, xml_helper_1.tag)('cPais', iss.codigoPais) +
        (0, xml_helper_1.tag)('nProcesso', iss.numeroProcesso) +
        (0, xml_helper_1.tag)('indIncentivo', String(iss.incentivoFiscal)));
}
const CST_PIS_COFINS_NT = ['04', '05', '06', '07', '08', '09'];
const CST_PIS_COFINS_OUTR = [
    '49',
    '50',
    '51',
    '52',
    '53',
    '54',
    '55',
    '56',
    '60',
    '61',
    '62',
    '63',
    '64',
    '65',
    '66',
    '67',
    '70',
    '71',
    '72',
    '73',
    '74',
    '75',
    '98',
    '99'
];
/**
 * PIS ou COFINS do item. `imposto` escolhe as tags (`pPIS`/`vPIS` ou
 * `pCOFINS`/`vCOFINS`) e o grupo (`PISAliq`/`COFINSAliq` etc.).
 */
function buildPisCofins(imposto, dados) {
    const tagAliquota = imposto === 'PIS' ? 'pPIS' : 'pCOFINS';
    const tagValor = imposto === 'PIS' ? 'vPIS' : 'vCOFINS';
    const valor = (0, xml_helper_1.tag)(tagValor, (0, xml_helper_1.formatNumber)(dados.valor || 0, 2));
    if (CST_PIS_COFINS_NT.includes(dados.cst)) {
        return (0, xml_helper_1.tagGroup)(imposto, (0, xml_helper_1.tagGroup)(`${imposto}NT`, (0, xml_helper_1.tag)('CST', dados.cst)));
    }
    // Tributacao por quantidade (CST 03 e afins): qBCProd + vAliqProd.
    const porQuantidade = dados.quantidade !== undefined && dados.aliquotaPorUnidade !== undefined
        ? (0, xml_helper_1.tag)('qBCProd', (0, xml_helper_1.formatNumber)(dados.quantidade, 4)) +
            (0, xml_helper_1.tag)('vAliqProd', (0, xml_helper_1.formatNumber)(dados.aliquotaPorUnidade, 4))
        : '';
    if (porQuantidade && !CST_PIS_COFINS_OUTR.includes(dados.cst)) {
        return (0, xml_helper_1.tagGroup)(imposto, (0, xml_helper_1.tagGroup)(`${imposto}Qtde`, (0, xml_helper_1.tag)('CST', dados.cst) + porQuantidade + valor));
    }
    const porValor = (0, xml_helper_1.tag)('vBC', (0, xml_helper_1.formatNumber)(dados.baseCalculo || 0, 2)) +
        (0, xml_helper_1.tag)(tagAliquota, (0, xml_helper_1.formatNumber)(dados.aliquota || 0, 4));
    const grupo = CST_PIS_COFINS_OUTR.includes(dados.cst) ? `${imposto}Outr` : `${imposto}Aliq`;
    return (0, xml_helper_1.tagGroup)(imposto, (0, xml_helper_1.tagGroup)(grupo, (0, xml_helper_1.tag)('CST', dados.cst) + (porQuantidade || porValor) + valor));
}
function buildPIS(prod) {
    return buildPisCofins('PIS', prod.pis);
}
function buildCOFINS(prod) {
    return buildPisCofins('COFINS', prod.cofins);
}
/**
 * PIS ST ou COFINS ST do item.
 */
function buildPisCofinsST(imposto, dados) {
    if (!dados)
        return '';
    const ehPis = imposto === 'PISST';
    const base = dados.quantidade !== undefined && dados.aliquotaPorUnidade !== undefined
        ? (0, xml_helper_1.tag)('qBCProd', (0, xml_helper_1.formatNumber)(dados.quantidade, 4)) +
            (0, xml_helper_1.tag)('vAliqProd', (0, xml_helper_1.formatNumber)(dados.aliquotaPorUnidade, 4))
        : (0, xml_helper_1.tag)('vBC', (0, xml_helper_1.formatNumber)(dados.baseCalculo ?? 0, 2)) +
            (0, xml_helper_1.tag)(ehPis ? 'pPIS' : 'pCOFINS', (0, xml_helper_1.formatNumber)(dados.aliquota ?? 0, 4));
    return (0, xml_helper_1.tagGroup)(imposto, base +
        (0, xml_helper_1.tag)(ehPis ? 'vPIS' : 'vCOFINS', (0, xml_helper_1.formatNumber)(dados.valor, 2)) +
        (0, xml_helper_1.tag)(ehPis ? 'indSomaPISST' : 'indSomaCOFINSST', dados.compoeTotal !== undefined ? String(dados.compoeTotal) : undefined));
}
function buildPISST(prod) {
    return buildPisCofinsST('PISST', prod.pisSt);
}
function buildCOFINSST(prod) {
    return buildPisCofinsST('COFINSST', prod.cofinsSt);
}
/**
 * Partilha do ICMS com a UF de destino (EC 87/2015).
 */
function buildICMSUFDest(prod) {
    const dest = prod.icmsUfDest;
    if (!dest)
        return '';
    const vBC = dest.baseCalculo ?? prod.valorTotal;
    const partilha = dest.percentualPartilha ?? 100;
    const diferencial = (vBC * (dest.aliquotaInterna - dest.aliquotaInterestadual)) / 100;
    const vICMSUFDest = (diferencial * partilha) / 100;
    const baseFcp = dest.baseCalculoFcp ?? vBC;
    const temFcp = dest.aliquotaFcp !== undefined;
    return (0, xml_helper_1.tagGroup)('ICMSUFDest', (0, xml_helper_1.tag)('vBCUFDest', (0, xml_helper_1.formatNumber)(vBC, 2)) +
        (temFcp
            ? (0, xml_helper_1.tag)('vBCFCPUFDest', (0, xml_helper_1.formatNumber)(baseFcp, 2)) +
                (0, xml_helper_1.tag)('pFCPUFDest', (0, xml_helper_1.formatNumber)(dest.aliquotaFcp, 4))
            : '') +
        (0, xml_helper_1.tag)('pICMSUFDest', (0, xml_helper_1.formatNumber)(dest.aliquotaInterna, 4)) +
        (0, xml_helper_1.tag)('pICMSInter', (0, xml_helper_1.formatNumber)(dest.aliquotaInterestadual, 2)) +
        (0, xml_helper_1.tag)('pICMSInterPart', (0, xml_helper_1.formatNumber)(partilha, 4)) +
        (temFcp
            ? (0, xml_helper_1.tag)('vFCPUFDest', (0, xml_helper_1.formatNumber)((baseFcp * dest.aliquotaFcp) / 100, 2))
            : '') +
        (0, xml_helper_1.tag)('vICMSUFDest', (0, xml_helper_1.formatNumber)(vICMSUFDest, 2)) +
        (0, xml_helper_1.tag)('vICMSUFRemet', (0, xml_helper_1.formatNumber)(diferencial - vICMSUFDest, 2)));
}
/**
 * Imposto Seletivo do item (grupo `IS`, NT 2025.002).
 */
function buildIS(prod) {
    const is = prod.impostoSeletivo;
    if (!is)
        return '';
    return (0, xml_helper_1.tagGroup)('IS', (0, xml_helper_1.tag)('CSTIS', is.cst) +
        (0, xml_helper_1.tag)('cClassTribIS', is.cClassTrib) +
        (0, xml_helper_1.tag)('vBCIS', (0, xml_helper_1.formatNumber)(is.baseCalculo, 2)) +
        (0, xml_helper_1.tag)('pIS', (0, xml_helper_1.formatNumber)(is.aliquota, 4)) +
        (0, xml_helper_1.tag)('pISEspec', is.aliquotaEspecifica !== undefined ? (0, xml_helper_1.formatNumber)(is.aliquotaEspecifica, 4) : undefined) +
        (0, xml_helper_1.tag)('uTrib', is.unidadeTributavel) +
        (0, xml_helper_1.tag)('qTrib', (0, xml_helper_1.formatNumber)(is.quantidadeTributavel, 4)) +
        (0, xml_helper_1.tag)('vIS', (0, xml_helper_1.formatNumber)(is.valor, 2)));
}
/**
 * Bloco `imposto` do item.
 *
 * O leiaute traz uma escolha entre dois caminhos, e a ordem muda em cada um:
 * mercadoria e `ICMS, IPI?, II?`; servico e `IPI?, ISSQN`. Depois vem, em
 * sequencia, PIS, PISST, COFINS, COFINSST, ICMSUFDest, IS e IBSCBS.
 */
function buildImpostos(prod) {
    const tributos = prod.tributosAproximados !== undefined
        ? (0, xml_helper_1.tag)('vTotTrib', (0, xml_helper_1.formatNumber)(prod.tributosAproximados, 2))
        : '';
    const principal = prod.issqn
        ? buildIPI(prod) + buildISSQN(prod)
        : buildICMS(prod) + buildIPI(prod) + buildII(prod);
    return (0, xml_helper_1.tagGroup)('imposto', tributos +
        principal +
        buildPIS(prod) +
        buildPISST(prod) +
        buildCOFINS(prod) +
        buildCOFINSST(prod) +
        buildICMSUFDest(prod) +
        buildIS(prod) +
        (0, ibscbs_groups_1.buildIBSCBS)(prod));
}
