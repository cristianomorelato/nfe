"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildIBSCBS = buildIBSCBS;
exports.totaisIbsCbsDoItem = totaisIbsCbsDoItem;
const xml_helper_1 = require("../xml-helper");
/**
 * Grupo IBSCBS do item (NT 2025.002) com os regimes especiais.
 */
/**
 * Normaliza a forma antiga (`pIBSUF`/`pIBSMun`/`pCBS`) para os entes
 * tributantes, para nao quebrar quem ja usa a API anterior.
 */
function entes(ibs) {
    return {
        ibsUf: ibs.ibsUf ?? { aliquota: ibs.pIBSUF ?? 0 },
        ibsMun: ibs.ibsMun ?? { aliquota: ibs.pIBSMun ?? 0 },
        cbs: ibs.cbs ?? { aliquota: ibs.pCBS ?? 0 }
    };
}
/**
 * Subgrupos comuns a UF, municipio e CBS: diferimento, devolucao e reducao.
 * A ordem no XSD e gDif, gDevTrib, gRed — sempre entre a aliquota e o valor.
 */
function regimesDoEnte(ente) {
    const dif = ente.diferimento
        ? (0, xml_helper_1.tagGroup)('gDif', (0, xml_helper_1.tag)('pDif', (0, xml_helper_1.formatNumber)(ente.diferimento.percentual, 4)) +
            (0, xml_helper_1.tag)('vDif', (0, xml_helper_1.formatNumber)(ente.diferimento.valor, 2)))
        : '';
    const devTrib = ente.tributoDevolvido !== undefined
        ? (0, xml_helper_1.tagGroup)('gDevTrib', (0, xml_helper_1.tag)('vDevTrib', (0, xml_helper_1.formatNumber)(ente.tributoDevolvido, 2)))
        : '';
    const red = ente.reducao
        ? (0, xml_helper_1.tagGroup)('gRed', (0, xml_helper_1.tag)('pRedAliq', (0, xml_helper_1.formatNumber)(ente.reducao.percentualReducao, 4)) +
            (0, xml_helper_1.tag)('pAliqEfet', (0, xml_helper_1.formatNumber)(ente.reducao.aliquotaEfetiva, 4)))
        : '';
    return dif + devTrib + red;
}
/**
 * Valor do tributo do ente: o informado, ou base x aliquota efetiva (quando ha
 * reducao) ou base x aliquota.
 */
function valorDoEnte(ente, base) {
    if (ente.valor !== undefined)
        return ente.valor;
    const aliquota = ente.reducao?.aliquotaEfetiva ?? ente.aliquota;
    return (aliquota / 100) * base;
}
/** gIBSUF, gIBSMun ou gCBS. */
function grupoEnte(nome, tagAliquota, tagValor, ente, base) {
    return (0, xml_helper_1.tagGroup)(nome, (0, xml_helper_1.tag)(tagAliquota, (0, xml_helper_1.formatNumber)(ente.aliquota, 4)) +
        regimesDoEnte(ente) +
        (0, xml_helper_1.tag)(tagValor, (0, xml_helper_1.formatNumber)(valorDoEnte(ente, base), 2)));
}
/** gIBSCredPres / gCBSCredPres. */
function creditoPresumidoEnte(nome, credito) {
    if (!credito)
        return '';
    // vCredPres e vCredPresCondSus sao exclusivos no XSD.
    const valor = credito.valorCondicaoSuspensiva !== undefined
        ? (0, xml_helper_1.tag)('vCredPresCondSus', (0, xml_helper_1.formatNumber)(credito.valorCondicaoSuspensiva, 2))
        : (0, xml_helper_1.tag)('vCredPres', (0, xml_helper_1.formatNumber)(credito.valor ?? 0, 2));
    return (0, xml_helper_1.tagGroup)(nome, (0, xml_helper_1.tag)('pCredPres', (0, xml_helper_1.formatNumber)(credito.percentual, 4)) + valor);
}
/** gIBSCBSMono — tributacao monofasica. */
function monofasia(ibs) {
    const mono = ibs.monofasia;
    if (!mono)
        return '';
    const padrao = mono.padrao
        ? (0, xml_helper_1.tagGroup)('gMonoPadrao', (0, xml_helper_1.tag)('qBCMono', (0, xml_helper_1.formatNumber)(mono.padrao.quantidade, 4)) +
            (0, xml_helper_1.tag)('adRemIBS', (0, xml_helper_1.formatNumber)(mono.padrao.aliquotaIbs, 4)) +
            (0, xml_helper_1.tag)('adRemCBS', (0, xml_helper_1.formatNumber)(mono.padrao.aliquotaCbs, 4)) +
            (0, xml_helper_1.tag)('vIBSMono', (0, xml_helper_1.formatNumber)(mono.padrao.valorIbs, 2)) +
            (0, xml_helper_1.tag)('vCBSMono', (0, xml_helper_1.formatNumber)(mono.padrao.valorCbs, 2)))
        : '';
    const reten = mono.retencao
        ? (0, xml_helper_1.tagGroup)('gMonoReten', (0, xml_helper_1.tag)('qBCMonoReten', (0, xml_helper_1.formatNumber)(mono.retencao.quantidade, 4)) +
            (0, xml_helper_1.tag)('adRemIBSReten', (0, xml_helper_1.formatNumber)(mono.retencao.aliquotaIbs, 4)) +
            (0, xml_helper_1.tag)('vIBSMonoReten', (0, xml_helper_1.formatNumber)(mono.retencao.valorIbs, 2)) +
            (0, xml_helper_1.tag)('adRemCBSReten', (0, xml_helper_1.formatNumber)(mono.retencao.aliquotaCbs, 4)) +
            (0, xml_helper_1.tag)('vCBSMonoReten', (0, xml_helper_1.formatNumber)(mono.retencao.valorCbs, 2)))
        : '';
    const ret = mono.retidoAnteriormente
        ? (0, xml_helper_1.tagGroup)('gMonoRet', (0, xml_helper_1.tag)('qBCMonoRet', (0, xml_helper_1.formatNumber)(mono.retidoAnteriormente.quantidade, 4)) +
            (0, xml_helper_1.tag)('adRemIBSRet', (0, xml_helper_1.formatNumber)(mono.retidoAnteriormente.aliquotaIbs, 4)) +
            (0, xml_helper_1.tag)('vIBSMonoRet', (0, xml_helper_1.formatNumber)(mono.retidoAnteriormente.valorIbs, 2)) +
            (0, xml_helper_1.tag)('adRemCBSRet', (0, xml_helper_1.formatNumber)(mono.retidoAnteriormente.aliquotaCbs, 4)) +
            (0, xml_helper_1.tag)('vCBSMonoRet', (0, xml_helper_1.formatNumber)(mono.retidoAnteriormente.valorCbs, 2)))
        : '';
    const dif = mono.diferimento
        ? (0, xml_helper_1.tagGroup)('gMonoDif', (0, xml_helper_1.tag)('pDifIBS', (0, xml_helper_1.formatNumber)(mono.diferimento.percentualIbs, 4)) +
            (0, xml_helper_1.tag)('vIBSMonoDif', (0, xml_helper_1.formatNumber)(mono.diferimento.valorIbs, 2)) +
            (0, xml_helper_1.tag)('pDifCBS', (0, xml_helper_1.formatNumber)(mono.diferimento.percentualCbs, 4)) +
            (0, xml_helper_1.tag)('vCBSMonoDif', (0, xml_helper_1.formatNumber)(mono.diferimento.valorCbs, 2)))
        : '';
    return (0, xml_helper_1.tagGroup)('gIBSCBSMono', padrao +
        reten +
        ret +
        dif +
        (0, xml_helper_1.tag)('vTotIBSMonoItem', (0, xml_helper_1.formatNumber)(mono.totalIbs, 2)) +
        (0, xml_helper_1.tag)('vTotCBSMonoItem', (0, xml_helper_1.formatNumber)(mono.totalCbs, 2)));
}
/**
 * Indica se o item tem alguma informacao de tributacao (base, aliquotas ou
 * entes tributantes) a declarar. Quando o CST e de isencao/imunidade/nao
 * incidencia (ex: 400, 410, 500, 510) e o item nao traz nenhum desses dados,
 * o grupo `gIBSCBS` deve ser omitido por completo — so `CST`+`cClassTrib`.
 */
function temInfoTributacao(ibs) {
    return (ibs.baseCalculo !== undefined ||
        ibs.pIBSUF !== undefined ||
        ibs.pIBSMun !== undefined ||
        ibs.pCBS !== undefined ||
        ibs.ibsUf !== undefined ||
        ibs.ibsMun !== undefined ||
        ibs.cbs !== undefined);
}
/**
 * Grupo `IBSCBS` do item.
 */
function buildIBSCBS(prod) {
    const ibs = prod.ibsCbs;
    if (!ibs)
        return '';
    const base = ibs.baseCalculo ?? prod.valorTotal;
    const { ibsUf, ibsMun, cbs } = entes(ibs);
    // gIBSCBS, gIBSCBSMono, gTransfCred e gAjusteCompet sao alternativos.
    let principal;
    if (ibs.monofasia) {
        principal = monofasia(ibs);
    }
    else if (ibs.transferenciaCredito) {
        principal = (0, xml_helper_1.tagGroup)('gTransfCred', (0, xml_helper_1.tag)('vIBS', (0, xml_helper_1.formatNumber)(ibs.transferenciaCredito.valorIbs, 2)) +
            (0, xml_helper_1.tag)('vCBS', (0, xml_helper_1.formatNumber)(ibs.transferenciaCredito.valorCbs, 2)));
    }
    else if (ibs.ajusteCompetencia) {
        principal = (0, xml_helper_1.tagGroup)('gAjusteCompet', (0, xml_helper_1.tag)('competApur', ibs.ajusteCompetencia.competencia) +
            (0, xml_helper_1.tag)('vIBS', (0, xml_helper_1.formatNumber)(ibs.ajusteCompetencia.valorIbs, 2)) +
            (0, xml_helper_1.tag)('vCBS', (0, xml_helper_1.formatNumber)(ibs.ajusteCompetencia.valorCbs, 2)));
    }
    else if (!temInfoTributacao(ibs)) {
        // Isencao/imunidade/nao incidencia sem nenhum dado de tributacao: so CST+cClassTrib.
        principal = '';
    }
    else {
        const vIbsUf = valorDoEnte(ibsUf, base);
        const vIbsMun = valorDoEnte(ibsMun, base);
        const tribRegular = ibs.tributacaoRegular
            ? (0, xml_helper_1.tagGroup)('gTribRegular', (0, xml_helper_1.tag)('CSTReg', ibs.tributacaoRegular.cst) +
                (0, xml_helper_1.tag)('cClassTribReg', ibs.tributacaoRegular.cClassTrib) +
                (0, xml_helper_1.tag)('pAliqEfetRegIBSUF', (0, xml_helper_1.formatNumber)(ibs.tributacaoRegular.aliquotaEfetivaIbsUf, 4)) +
                (0, xml_helper_1.tag)('vTribRegIBSUF', (0, xml_helper_1.formatNumber)(ibs.tributacaoRegular.valorIbsUf, 2)) +
                (0, xml_helper_1.tag)('pAliqEfetRegIBSMun', (0, xml_helper_1.formatNumber)(ibs.tributacaoRegular.aliquotaEfetivaIbsMun, 4)) +
                (0, xml_helper_1.tag)('vTribRegIBSMun', (0, xml_helper_1.formatNumber)(ibs.tributacaoRegular.valorIbsMun, 2)) +
                (0, xml_helper_1.tag)('pAliqEfetRegCBS', (0, xml_helper_1.formatNumber)(ibs.tributacaoRegular.aliquotaEfetivaCbs, 4)) +
                (0, xml_helper_1.tag)('vTribRegCBS', (0, xml_helper_1.formatNumber)(ibs.tributacaoRegular.valorCbs, 2)))
            : '';
        const tribCompraGov = ibs.tributacaoCompraGov
            ? (0, xml_helper_1.tagGroup)('gTribCompraGov', (0, xml_helper_1.tag)('pAliqIBSUF', (0, xml_helper_1.formatNumber)(ibs.tributacaoCompraGov.aliquotaIbsUf, 4)) +
                (0, xml_helper_1.tag)('vTribIBSUF', (0, xml_helper_1.formatNumber)(ibs.tributacaoCompraGov.valorIbsUf, 2)) +
                (0, xml_helper_1.tag)('pAliqIBSMun', (0, xml_helper_1.formatNumber)(ibs.tributacaoCompraGov.aliquotaIbsMun, 4)) +
                (0, xml_helper_1.tag)('vTribIBSMun', (0, xml_helper_1.formatNumber)(ibs.tributacaoCompraGov.valorIbsMun, 2)) +
                (0, xml_helper_1.tag)('pAliqCBS', (0, xml_helper_1.formatNumber)(ibs.tributacaoCompraGov.aliquotaCbs, 4)) +
                (0, xml_helper_1.tag)('vTribCBS', (0, xml_helper_1.formatNumber)(ibs.tributacaoCompraGov.valorCbs, 2)))
            : '';
        principal = (0, xml_helper_1.tagGroup)('gIBSCBS', (0, xml_helper_1.tag)('vBC', (0, xml_helper_1.formatNumber)(base, 2)) +
            grupoEnte('gIBSUF', 'pIBSUF', 'vIBSUF', ibsUf, base) +
            grupoEnte('gIBSMun', 'pIBSMun', 'vIBSMun', ibsMun, base) +
            (0, xml_helper_1.tag)('vIBS', (0, xml_helper_1.formatNumber)(vIbsUf + vIbsMun, 2)) +
            grupoEnte('gCBS', 'pCBS', 'vCBS', cbs, base) +
            tribRegular +
            tribCompraGov);
    }
    const estorno = ibs.estornoCredito
        ? (0, xml_helper_1.tagGroup)('gEstornoCred', (0, xml_helper_1.tag)('vIBSEstCred', (0, xml_helper_1.formatNumber)(ibs.estornoCredito.valorIbs, 2)) +
            (0, xml_helper_1.tag)('vCBSEstCred', (0, xml_helper_1.formatNumber)(ibs.estornoCredito.valorCbs, 2)))
        : '';
    // gCredPresOper e gCredPresIBSZFM sao alternativos.
    const credito = ibs.creditoPresumido
        ? (0, xml_helper_1.tagGroup)('gCredPresOper', (0, xml_helper_1.tag)('vBCCredPres', (0, xml_helper_1.formatNumber)(ibs.creditoPresumido.baseCalculo, 2)) +
            (0, xml_helper_1.tag)('cCredPres', ibs.creditoPresumido.codigo) +
            creditoPresumidoEnte('gIBSCredPres', ibs.creditoPresumido.ibs) +
            creditoPresumidoEnte('gCBSCredPres', ibs.creditoPresumido.cbs))
        : ibs.creditoPresumidoZfm
            ? (0, xml_helper_1.tagGroup)('gCredPresIBSZFM', (0, xml_helper_1.tag)('competApur', ibs.creditoPresumidoZfm.competencia) +
                (0, xml_helper_1.tag)('tpCredPresIBSZFM', ibs.creditoPresumidoZfm.tipo) +
                (0, xml_helper_1.tag)('vCredPresIBSZFM', (0, xml_helper_1.formatNumber)(ibs.creditoPresumidoZfm.valor, 2)))
            : '';
    return (0, xml_helper_1.tagGroup)('IBSCBS', (0, xml_helper_1.tag)('CST', ibs.cst) +
        (0, xml_helper_1.tag)('cClassTrib', ibs.cClassTrib) +
        (0, xml_helper_1.tag)('indDoacao', ibs.doacao ? '1' : undefined) +
        principal +
        estorno +
        credito);
}
function totaisIbsCbsDoItem(prod) {
    const ibs = prod.ibsCbs;
    if (!ibs)
        return null;
    const base = ibs.baseCalculo ?? prod.valorTotal;
    const { ibsUf, ibsMun, cbs } = entes(ibs);
    const mono = ibs.monofasia;
    const cred = ibs.creditoPresumido;
    // gTransfCred, gAjusteCompet e itens sem nenhum dado de tributacao
    // (isencao/imunidade/nao incidencia) nao entram nos totais de tributacao.
    const temTributacao = !mono && !ibs.transferenciaCredito && !ibs.ajusteCompetencia && temInfoTributacao(ibs);
    return {
        base: temTributacao ? base : 0,
        ibsUf: temTributacao ? valorDoEnte(ibsUf, base) : 0,
        ibsMun: temTributacao ? valorDoEnte(ibsMun, base) : 0,
        cbs: temTributacao ? valorDoEnte(cbs, base) : 0,
        difUf: temTributacao ? (ibsUf.diferimento?.valor ?? 0) : 0,
        difMun: temTributacao ? (ibsMun.diferimento?.valor ?? 0) : 0,
        difCbs: temTributacao ? (cbs.diferimento?.valor ?? 0) : 0,
        devUf: temTributacao ? (ibsUf.tributoDevolvido ?? 0) : 0,
        devMun: temTributacao ? (ibsMun.tributoDevolvido ?? 0) : 0,
        devCbs: temTributacao ? (cbs.tributoDevolvido ?? 0) : 0,
        credPresIbs: cred?.ibs?.valor ?? 0,
        credPresCondSusIbs: cred?.ibs?.valorCondicaoSuspensiva ?? 0,
        credPresCbs: cred?.cbs?.valor ?? 0,
        credPresCondSusCbs: cred?.cbs?.valorCondicaoSuspensiva ?? 0,
        estornoIbs: ibs.estornoCredito?.valorIbs ?? 0,
        estornoCbs: ibs.estornoCredito?.valorCbs ?? 0,
        monoIbs: mono?.padrao?.valorIbs ?? 0,
        monoCbs: mono?.padrao?.valorCbs ?? 0,
        monoIbsReten: mono?.retencao?.valorIbs ?? 0,
        monoCbsReten: mono?.retencao?.valorCbs ?? 0,
        monoIbsRet: mono?.retidoAnteriormente?.valorIbs ?? 0,
        monoCbsRet: mono?.retidoAnteriormente?.valorCbs ?? 0,
        temMono: Boolean(mono),
        temTributacao
    };
}
