"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTotais = buildTotais;
const xml_helper_1 = require("../xml-helper");
const ibscbs_groups_1 = require("./ibscbs-groups");
function acumular(nfe) {
    const a = {
        vProd: 0,
        vDesc: 0,
        vFrete: 0,
        vSeg: 0,
        vOutro: 0,
        vBC: 0,
        vICMS: 0,
        vIPI: 0,
        vPIS: 0,
        vCOFINS: 0,
        vBCST: 0,
        vST: 0,
        vFCP: 0,
        vFCPST: 0,
        vFCPSTRet: 0,
        vICMSDeson: 0,
        vFCPUFDest: 0,
        vICMSUFDest: 0,
        vICMSUFRemet: 0,
        vII: 0,
        vIPIDevol: 0,
        vTotTrib: 0,
        temTotTrib: false,
        qBCMono: 0,
        vICMSMono: 0,
        qBCMonoReten: 0,
        vICMSMonoReten: 0,
        qBCMonoRet: 0,
        vICMSMonoRet: 0,
        temMono: false,
        vIS: 0,
        temIS: false,
        vBCIBSCBS: 0,
        credPresIbs: 0,
        credPresCondSusIbs: 0,
        credPresCbs: 0,
        credPresCondSusCbs: 0,
        estornoIbs: 0,
        estornoCbs: 0,
        monoIbs: 0,
        monoCbs: 0,
        monoIbsReten: 0,
        monoCbsReten: 0,
        monoIbsRet: 0,
        monoCbsRet: 0,
        temMonoIbsCbs: false,
        temTribIbsCbs: false,
        vDifUF: 0,
        vDifMun: 0,
        vDifCBS: 0,
        vDevUF: 0,
        vDevMun: 0,
        vDevCBS: 0,
        vIBSUF: 0,
        vIBSMun: 0,
        vCBS: 0,
        temIbsCbs: false
    };
    for (const prod of nfe.produtos) {
        const icms = prod.icms;
        a.vProd += prod.valorTotal;
        a.vDesc += prod.valorDesconto || 0;
        a.vFrete += prod.valorFrete || 0;
        a.vSeg += prod.valorSeguro || 0;
        a.vOutro += prod.outrasDespesas || 0;
        a.vBC += icms.baseCalculo || 0;
        a.vICMS += icms.valor || 0;
        a.vIPI += prod.ipi?.valor || 0;
        a.vPIS += prod.pis.valor || 0;
        a.vCOFINS += prod.cofins.valor || 0;
        a.vII += prod.ii?.valor || 0;
        a.vIPIDevol += prod.impostoDevolvido?.valorIpiDevolvido || 0;
        if (prod.tributosAproximados !== undefined) {
            a.vTotTrib += prod.tributosAproximados;
            a.temTotTrib = true;
        }
        const baseST = icms.baseCalculoST ?? 0;
        a.vBCST += baseST;
        a.vST += icms.valorST ?? (baseST * (icms.aliquotaST ?? 0)) / 100;
        a.vICMSDeson += icms.valorDesonerado ?? 0;
        if (icms.aliquotaFcp !== undefined) {
            const base = icms.baseCalculoFcp ?? icms.baseCalculo ?? 0;
            a.vFCP += icms.valorFcp ?? (base * icms.aliquotaFcp) / 100;
        }
        if (icms.aliquotaFcpST !== undefined) {
            const base = icms.baseCalculoFcpST ?? baseST;
            a.vFCPST += icms.valorFcpST ?? (base * icms.aliquotaFcpST) / 100;
        }
        if (icms.aliquotaFcpSTRetido !== undefined) {
            const base = icms.baseCalculoFcpSTRetido ?? icms.baseCalculoSTRetido ?? 0;
            a.vFCPSTRet += icms.valorFcpSTRetido ?? (base * icms.aliquotaFcpSTRetido) / 100;
        }
        const mono = icms.monofasico;
        if (mono) {
            a.temMono = true;
            a.qBCMono += mono.quantidade ?? 0;
            a.vICMSMono += mono.valor ?? 0;
            a.qBCMonoReten += mono.quantidadeRetencao ?? 0;
            a.vICMSMonoReten += mono.valorRetencao ?? 0;
            a.qBCMonoRet += mono.quantidadeRetido ?? 0;
            a.vICMSMonoRet += mono.valorRetido ?? 0;
        }
        const dest = prod.icmsUfDest;
        if (dest) {
            const base = dest.baseCalculo ?? prod.valorTotal;
            const partilha = dest.percentualPartilha ?? 100;
            const diferencial = (base * (dest.aliquotaInterna - dest.aliquotaInterestadual)) / 100;
            a.vICMSUFDest += (diferencial * partilha) / 100;
            a.vICMSUFRemet += diferencial - (diferencial * partilha) / 100;
            if (dest.aliquotaFcp !== undefined) {
                a.vFCPUFDest += ((dest.baseCalculoFcp ?? base) * dest.aliquotaFcp) / 100;
            }
        }
        if (prod.impostoSeletivo) {
            a.temIS = true;
            a.vIS += prod.impostoSeletivo.valor;
        }
        const ibsCbs = (0, ibscbs_groups_1.totaisIbsCbsDoItem)(prod);
        if (ibsCbs) {
            a.temIbsCbs = true;
            a.vBCIBSCBS += ibsCbs.base;
            a.vIBSUF += ibsCbs.ibsUf;
            a.vIBSMun += ibsCbs.ibsMun;
            a.vCBS += ibsCbs.cbs;
            a.vDifUF += ibsCbs.difUf;
            a.vDifMun += ibsCbs.difMun;
            a.vDifCBS += ibsCbs.difCbs;
            a.vDevUF += ibsCbs.devUf;
            a.vDevMun += ibsCbs.devMun;
            a.vDevCBS += ibsCbs.devCbs;
            a.credPresIbs += ibsCbs.credPresIbs;
            a.credPresCondSusIbs += ibsCbs.credPresCondSusIbs;
            a.credPresCbs += ibsCbs.credPresCbs;
            a.credPresCondSusCbs += ibsCbs.credPresCondSusCbs;
            a.estornoIbs += ibsCbs.estornoIbs;
            a.estornoCbs += ibsCbs.estornoCbs;
            a.monoIbs += ibsCbs.monoIbs;
            a.monoCbs += ibsCbs.monoCbs;
            a.monoIbsReten += ibsCbs.monoIbsReten;
            a.monoCbsReten += ibsCbs.monoCbsReten;
            a.monoIbsRet += ibsCbs.monoIbsRet;
            a.monoCbsRet += ibsCbs.monoCbsRet;
            a.temMonoIbsCbs = a.temMonoIbsCbs || ibsCbs.temMono;
            a.temTribIbsCbs = a.temTribIbsCbs || ibsCbs.temTributacao;
        }
    }
    return a;
}
/** ISSQNtot — totais do ISS, quando a nota tem servico. */
function buildISSQNtot(nfe) {
    const tot = nfe.totaisServico;
    if (!tot)
        return '';
    const opcional = (v) => v !== undefined ? (0, xml_helper_1.formatNumber)(v, 2) : undefined;
    return (0, xml_helper_1.tagGroup)('ISSQNtot', (0, xml_helper_1.tag)('vServ', opcional(tot.valorServicos)) +
        (0, xml_helper_1.tag)('vBC', opcional(tot.baseCalculo)) +
        (0, xml_helper_1.tag)('vISS', opcional(tot.valorIss)) +
        (0, xml_helper_1.tag)('vPIS', opcional(tot.valorPis)) +
        (0, xml_helper_1.tag)('vCOFINS', opcional(tot.valorCofins)) +
        (0, xml_helper_1.tag)('dCompet', (0, xml_helper_1.formatDateOnly)(tot.dataCompetencia)) +
        (0, xml_helper_1.tag)('vDeducao', opcional(tot.valorDeducao)) +
        (0, xml_helper_1.tag)('vOutro', opcional(tot.outrasRetencoes)) +
        (0, xml_helper_1.tag)('vDescIncond', opcional(tot.descontoIncondicionado)) +
        (0, xml_helper_1.tag)('vDescCond', opcional(tot.descontoCondicionado)) +
        (0, xml_helper_1.tag)('vISSRet', opcional(tot.valorIssRetido)) +
        (0, xml_helper_1.tag)('cRegTrib', tot.regimeTributacao !== undefined ? String(tot.regimeTributacao) : undefined));
}
/** retTrib — retencoes de tributos federais. */
function buildRetTrib(nfe) {
    const ret = nfe.retencoesTributos;
    if (!ret)
        return '';
    const opcional = (v) => v !== undefined ? (0, xml_helper_1.formatNumber)(v, 2) : undefined;
    const conteudo = (0, xml_helper_1.tag)('vRetPIS', opcional(ret.valorRetidoPis)) +
        (0, xml_helper_1.tag)('vRetCOFINS', opcional(ret.valorRetidoCofins)) +
        (0, xml_helper_1.tag)('vRetCSLL', opcional(ret.valorRetidoCsll)) +
        (0, xml_helper_1.tag)('vBCIRRF', opcional(ret.baseCalculoIrrf)) +
        (0, xml_helper_1.tag)('vIRRF', opcional(ret.valorIrrf)) +
        (0, xml_helper_1.tag)('vBCRetPrev', opcional(ret.baseCalculoRetencaoPrevidencia)) +
        (0, xml_helper_1.tag)('vRetPrev', opcional(ret.valorRetencaoPrevidencia));
    return conteudo ? (0, xml_helper_1.tagGroup)('retTrib', conteudo) : '';
}
/**
 * Bloco `total` completo.
 */
function buildTotais(nfe) {
    const a = acumular(nfe);
    // O ST e o FCP entram no total da nota; a desoneracao e deduzida.
    const vNF = a.vProd -
        a.vDesc +
        a.vFrete +
        a.vSeg +
        a.vIPI +
        a.vOutro +
        a.vST +
        a.vFCP +
        a.vFCPST +
        a.vII -
        a.vICMSDeson;
    const monofasico = !a.temMono
        ? ''
        : (0, xml_helper_1.tag)('qBCMono', (0, xml_helper_1.formatNumber)(a.qBCMono, 2)) +
            (0, xml_helper_1.tag)('vICMSMono', (0, xml_helper_1.formatNumber)(a.vICMSMono, 2)) +
            (0, xml_helper_1.tag)('qBCMonoReten', (0, xml_helper_1.formatNumber)(a.qBCMonoReten, 2)) +
            (0, xml_helper_1.tag)('vICMSMonoReten', (0, xml_helper_1.formatNumber)(a.vICMSMonoReten, 2)) +
            (0, xml_helper_1.tag)('qBCMonoRet', (0, xml_helper_1.formatNumber)(a.qBCMonoRet, 2)) +
            (0, xml_helper_1.tag)('vICMSMonoRet', (0, xml_helper_1.formatNumber)(a.vICMSMonoRet, 2));
    const icmsTot = (0, xml_helper_1.tagGroup)('ICMSTot', (0, xml_helper_1.tag)('vBC', (0, xml_helper_1.formatNumber)(a.vBC, 2)) +
        (0, xml_helper_1.tag)('vICMS', (0, xml_helper_1.formatNumber)(a.vICMS, 2)) +
        (0, xml_helper_1.tag)('vICMSDeson', (0, xml_helper_1.formatNumber)(a.vICMSDeson, 2)) +
        (0, xml_helper_1.tag)('vFCPUFDest', (0, xml_helper_1.formatNumber)(a.vFCPUFDest, 2)) +
        (0, xml_helper_1.tag)('vICMSUFDest', (0, xml_helper_1.formatNumber)(a.vICMSUFDest, 2)) +
        (0, xml_helper_1.tag)('vICMSUFRemet', (0, xml_helper_1.formatNumber)(a.vICMSUFRemet, 2)) +
        (0, xml_helper_1.tag)('vFCP', (0, xml_helper_1.formatNumber)(a.vFCP, 2)) +
        (0, xml_helper_1.tag)('vBCST', (0, xml_helper_1.formatNumber)(a.vBCST, 2)) +
        (0, xml_helper_1.tag)('vST', (0, xml_helper_1.formatNumber)(a.vST, 2)) +
        (0, xml_helper_1.tag)('vFCPST', (0, xml_helper_1.formatNumber)(a.vFCPST, 2)) +
        (0, xml_helper_1.tag)('vFCPSTRet', (0, xml_helper_1.formatNumber)(a.vFCPSTRet, 2)) +
        monofasico +
        (0, xml_helper_1.tag)('vProd', (0, xml_helper_1.formatNumber)(a.vProd, 2)) +
        (0, xml_helper_1.tag)('vFrete', (0, xml_helper_1.formatNumber)(a.vFrete, 2)) +
        (0, xml_helper_1.tag)('vSeg', (0, xml_helper_1.formatNumber)(a.vSeg, 2)) +
        (0, xml_helper_1.tag)('vDesc', (0, xml_helper_1.formatNumber)(a.vDesc, 2)) +
        (0, xml_helper_1.tag)('vII', (0, xml_helper_1.formatNumber)(a.vII, 2)) +
        (0, xml_helper_1.tag)('vIPI', (0, xml_helper_1.formatNumber)(a.vIPI, 2)) +
        (0, xml_helper_1.tag)('vIPIDevol', (0, xml_helper_1.formatNumber)(a.vIPIDevol, 2)) +
        (0, xml_helper_1.tag)('vPIS', (0, xml_helper_1.formatNumber)(a.vPIS, 2)) +
        (0, xml_helper_1.tag)('vCOFINS', (0, xml_helper_1.formatNumber)(a.vCOFINS, 2)) +
        (0, xml_helper_1.tag)('vOutro', (0, xml_helper_1.formatNumber)(a.vOutro, 2)) +
        (0, xml_helper_1.tag)('vNF', (0, xml_helper_1.formatNumber)(vNF, 2)) +
        (a.temTotTrib ? (0, xml_helper_1.tag)('vTotTrib', (0, xml_helper_1.formatNumber)(a.vTotTrib, 2)) : ''));
    // IBSCBSTot: gIBS e gCBS so aparecem quando ha item tributado pelo gIBSCBS;
    // gMono quando ha monofasia; gEstornoCred quando ha estorno.
    const gIBS = !a.temTribIbsCbs
        ? ''
        : (0, xml_helper_1.tagGroup)('gIBS', (0, xml_helper_1.tagGroup)('gIBSUF', (0, xml_helper_1.tag)('vDif', (0, xml_helper_1.formatNumber)(a.vDifUF, 2)) +
            (0, xml_helper_1.tag)('vDevTrib', (0, xml_helper_1.formatNumber)(a.vDevUF, 2)) +
            (0, xml_helper_1.tag)('vIBSUF', (0, xml_helper_1.formatNumber)(a.vIBSUF, 2))) +
            (0, xml_helper_1.tagGroup)('gIBSMun', (0, xml_helper_1.tag)('vDif', (0, xml_helper_1.formatNumber)(a.vDifMun, 2)) +
                (0, xml_helper_1.tag)('vDevTrib', (0, xml_helper_1.formatNumber)(a.vDevMun, 2)) +
                (0, xml_helper_1.tag)('vIBSMun', (0, xml_helper_1.formatNumber)(a.vIBSMun, 2))) +
            (0, xml_helper_1.tag)('vIBS', (0, xml_helper_1.formatNumber)(a.vIBSUF + a.vIBSMun, 2)) +
            (0, xml_helper_1.tag)('vCredPres', (0, xml_helper_1.formatNumber)(a.credPresIbs, 2)) +
            (0, xml_helper_1.tag)('vCredPresCondSus', (0, xml_helper_1.formatNumber)(a.credPresCondSusIbs, 2)));
    const gCBS = !a.temTribIbsCbs
        ? ''
        : (0, xml_helper_1.tagGroup)('gCBS', (0, xml_helper_1.tag)('vDif', (0, xml_helper_1.formatNumber)(a.vDifCBS, 2)) +
            (0, xml_helper_1.tag)('vDevTrib', (0, xml_helper_1.formatNumber)(a.vDevCBS, 2)) +
            (0, xml_helper_1.tag)('vCBS', (0, xml_helper_1.formatNumber)(a.vCBS, 2)) +
            (0, xml_helper_1.tag)('vCredPres', (0, xml_helper_1.formatNumber)(a.credPresCbs, 2)) +
            (0, xml_helper_1.tag)('vCredPresCondSus', (0, xml_helper_1.formatNumber)(a.credPresCondSusCbs, 2)));
    const gMono = !a.temMonoIbsCbs
        ? ''
        : (0, xml_helper_1.tagGroup)('gMono', (0, xml_helper_1.tag)('vIBSMono', (0, xml_helper_1.formatNumber)(a.monoIbs, 2)) +
            (0, xml_helper_1.tag)('vCBSMono', (0, xml_helper_1.formatNumber)(a.monoCbs, 2)) +
            (0, xml_helper_1.tag)('vIBSMonoReten', (0, xml_helper_1.formatNumber)(a.monoIbsReten, 2)) +
            (0, xml_helper_1.tag)('vCBSMonoReten', (0, xml_helper_1.formatNumber)(a.monoCbsReten, 2)) +
            (0, xml_helper_1.tag)('vIBSMonoRet', (0, xml_helper_1.formatNumber)(a.monoIbsRet, 2)) +
            (0, xml_helper_1.tag)('vCBSMonoRet', (0, xml_helper_1.formatNumber)(a.monoCbsRet, 2)));
    const gEstorno = a.estornoIbs === 0 && a.estornoCbs === 0
        ? ''
        : (0, xml_helper_1.tagGroup)('gEstornoCred', (0, xml_helper_1.tag)('vIBSEstCred', (0, xml_helper_1.formatNumber)(a.estornoIbs, 2)) +
            (0, xml_helper_1.tag)('vCBSEstCred', (0, xml_helper_1.formatNumber)(a.estornoCbs, 2)));
    const ibsCbsTot = !a.temIbsCbs
        ? ''
        : (0, xml_helper_1.tagGroup)('IBSCBSTot', (0, xml_helper_1.tag)('vBCIBSCBS', (0, xml_helper_1.formatNumber)(a.vBCIBSCBS, 2)) + gIBS + gCBS + gMono + gEstorno);
    const isTot = a.temIS ? (0, xml_helper_1.tagGroup)('ISTot', (0, xml_helper_1.tag)('vIS', (0, xml_helper_1.formatNumber)(a.vIS, 2))) : '';
    const vNFTot = nfe.valorTotalNota !== undefined ? (0, xml_helper_1.tag)('vNFTot', (0, xml_helper_1.formatNumber)(nfe.valorTotalNota, 2)) : '';
    return (0, xml_helper_1.tagGroup)('total', icmsTot + buildISSQNtot(nfe) + buildRetTrib(nfe) + isTot + ibsCbsTot + vNFTot);
}
