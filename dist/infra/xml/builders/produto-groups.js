"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildNve = buildNve;
exports.buildCest = buildCest;
exports.buildCreditosPresumidos = buildCreditosPresumidos;
exports.buildDeclaracoesImportacao = buildDeclaracoesImportacao;
exports.buildDetalhesExportacao = buildDetalhesExportacao;
exports.buildRastros = buildRastros;
exports.buildVeiculoNovo = buildVeiculoNovo;
exports.buildMedicamento = buildMedicamento;
exports.buildArmamentos = buildArmamentos;
exports.buildCombustivel = buildCombustivel;
exports.buildProdutoEspecifico = buildProdutoEspecifico;
exports.buildImpostoDevolvido = buildImpostoDevolvido;
exports.buildObservacaoItem = buildObservacaoItem;
exports.buildDFeReferenciado = buildDFeReferenciado;
const ibge_codes_1 = require("../../../shared/constants/ibge-codes");
const xml_helper_1 = require("../xml-helper");
/**
 * Subgrupos do item (`det/prod`) que so aparecem em operacoes especificas:
 * importacao, exportacao, rastreabilidade e os produtos com regra propria.
 */
/**
 * NVE — Nomenclatura de Valor Aduaneiro e Estatistica (ate 8 por item).
 */
function buildNve(nve) {
    if (!nve || nve.length === 0)
        return '';
    return nve
        .slice(0, 8)
        .map((codigo) => (0, xml_helper_1.tag)('NVE', codigo))
        .join('');
}
/**
 * CEST + indicador de escala + CNPJ do fabricante. Sequencia opcional: o CEST
 * abre o grupo, os outros dois so existem junto dele.
 */
function buildCest(prod) {
    if (!prod.cest)
        return '';
    return ((0, xml_helper_1.tag)('CEST', prod.cest) +
        (0, xml_helper_1.tag)('indEscala', prod.indicadorEscala) +
        (0, xml_helper_1.tag)('CNPJFab', prod.cnpjFabricante));
}
/**
 * Creditos presumidos do item (grupo `gCred`, ate 4).
 *
 * O `cCredPresumido` tem tamanho fixo de 8 ou 10 caracteres na tabela oficial.
 */
function buildCreditosPresumidos(creditos) {
    if (!creditos || creditos.length === 0)
        return '';
    return creditos
        .slice(0, 4)
        .map((c) => (0, xml_helper_1.tagGroup)('gCred', (0, xml_helper_1.tag)('cCredPresumido', c.codigo) +
        (0, xml_helper_1.tag)('pCredPresumido', (0, xml_helper_1.formatNumber)(c.percentual, 4)) +
        (0, xml_helper_1.tag)('vCredPresumido', (0, xml_helper_1.formatNumber)(c.valor, 2))))
        .join('');
}
/**
 * Declaracoes de importacao com suas adicoes (grupo `DI`).
 */
function buildDeclaracoesImportacao(dis) {
    if (!dis || dis.length === 0)
        return '';
    return dis
        .slice(0, 100)
        .map((di) => {
        const adicoes = di.adicoes
            .slice(0, 999)
            .map((adi) => (0, xml_helper_1.tagGroup)('adi', (0, xml_helper_1.tag)('nAdicao', adi.numero !== undefined ? String(adi.numero) : undefined) +
            (0, xml_helper_1.tag)('nSeqAdic', String(adi.sequencial)) +
            (0, xml_helper_1.tag)('cFabricante', adi.codigoFabricante) +
            (0, xml_helper_1.tag)('vDescDI', adi.desconto !== undefined ? (0, xml_helper_1.formatNumber)(adi.desconto, 2) : undefined) +
            (0, xml_helper_1.tag)('nDraw', adi.drawback)))
            .join('');
        return (0, xml_helper_1.tagGroup)('DI', (0, xml_helper_1.tag)('nDI', di.numero) +
            (0, xml_helper_1.tag)('dDI', (0, xml_helper_1.formatDateOnly)(di.dataRegistro)) +
            (0, xml_helper_1.tag)('xLocDesemb', di.localDesembaraco) +
            (0, xml_helper_1.tag)('UFDesemb', di.ufDesembaraco) +
            (0, xml_helper_1.tag)('dDesemb', (0, xml_helper_1.formatDateOnly)(di.dataDesembaraco)) +
            (0, xml_helper_1.tag)('tpViaTransp', String(di.viaTransporte)) +
            (0, xml_helper_1.tag)('vAFRMM', di.valorAfrmm !== undefined ? (0, xml_helper_1.formatNumber)(di.valorAfrmm, 2) : undefined) +
            (0, xml_helper_1.tag)('tpIntermedio', String(di.tipoIntermediacao)) +
            (di.cnpj ? (0, xml_helper_1.tag)('CNPJ', di.cnpj) : di.cpf ? (0, xml_helper_1.tag)('CPF', di.cpf) : '') +
            (0, xml_helper_1.tag)('UFTerceiro', di.ufTerceiro) +
            (0, xml_helper_1.tag)('cExportador', di.codigoExportador) +
            adicoes);
    })
        .join('');
}
/**
 * Detalhes de exportacao do item (grupo `detExport`).
 */
function buildDetalhesExportacao(detalhes) {
    if (!detalhes || detalhes.length === 0)
        return '';
    return detalhes
        .slice(0, 500)
        .map((d) => {
        const ind = d.exportacaoIndireta;
        return (0, xml_helper_1.tagGroup)('detExport', (0, xml_helper_1.tag)('nDraw', d.drawback) +
            (ind
                ? (0, xml_helper_1.tagGroup)('exportInd', (0, xml_helper_1.tag)('nRE', ind.registroExportacao) +
                    (0, xml_helper_1.tag)('chNFe', ind.chaveAcesso) +
                    (0, xml_helper_1.tag)('qExport', (0, xml_helper_1.formatNumber)(ind.quantidade, 4)))
                : ''));
    })
        .join('');
}
/**
 * Rastreabilidade por lote (grupo `rastro`).
 */
function buildRastros(rastros) {
    if (!rastros || rastros.length === 0)
        return '';
    return rastros
        .slice(0, 500)
        .map((r) => (0, xml_helper_1.tagGroup)('rastro', (0, xml_helper_1.tag)('nLote', r.lote) +
        (0, xml_helper_1.tag)('qLote', (0, xml_helper_1.formatNumber)(r.quantidade, 3)) +
        (0, xml_helper_1.tag)('dFab', (0, xml_helper_1.formatDateOnly)(r.dataFabricacao)) +
        (0, xml_helper_1.tag)('dVal', (0, xml_helper_1.formatDateOnly)(r.dataValidade)) +
        (0, xml_helper_1.tag)('cAgreg', r.codigoAgregacao)))
        .join('');
}
/**
 * Veiculo novo (grupo `veicProd`).
 */
function buildVeiculoNovo(veiculo) {
    if (!veiculo)
        return '';
    return (0, xml_helper_1.tagGroup)('veicProd', (0, xml_helper_1.tag)('tpOp', String(veiculo.tipoOperacao)) +
        (0, xml_helper_1.tag)('chassi', veiculo.chassi) +
        (0, xml_helper_1.tag)('cCor', veiculo.codigoCor) +
        (0, xml_helper_1.tag)('xCor', veiculo.cor) +
        (0, xml_helper_1.tag)('pot', veiculo.potencia) +
        (0, xml_helper_1.tag)('cilin', veiculo.cilindrada) +
        (0, xml_helper_1.tag)('pesoL', veiculo.pesoLiquido) +
        (0, xml_helper_1.tag)('pesoB', veiculo.pesoBruto) +
        (0, xml_helper_1.tag)('nSerie', veiculo.numeroSerie) +
        (0, xml_helper_1.tag)('tpComb', veiculo.tipoCombustivel) +
        (0, xml_helper_1.tag)('nMotor', veiculo.numeroMotor) +
        (0, xml_helper_1.tag)('CMT', veiculo.capacidadeMaximaTracao) +
        (0, xml_helper_1.tag)('dist', veiculo.distanciaEixos) +
        (0, xml_helper_1.tag)('anoMod', String(veiculo.anoModelo)) +
        (0, xml_helper_1.tag)('anoFab', String(veiculo.anoFabricacao)) +
        (0, xml_helper_1.tag)('tpPint', veiculo.tipoPintura) +
        (0, xml_helper_1.tag)('tpVeic', String(veiculo.tipoVeiculo)) +
        (0, xml_helper_1.tag)('espVeic', String(veiculo.especieVeiculo)) +
        (0, xml_helper_1.tag)('VIN', veiculo.vin) +
        (0, xml_helper_1.tag)('condVeic', String(veiculo.condicaoVeiculo)) +
        (0, xml_helper_1.tag)('cMod', veiculo.codigoModelo) +
        (0, xml_helper_1.tag)('cCorDENATRAN', veiculo.codigoCorDenatran) +
        (0, xml_helper_1.tag)('lota', String(veiculo.lotacao)) +
        (0, xml_helper_1.tag)('tpRest', String(veiculo.tipoRestricao)));
}
/**
 * Medicamento (grupo `med`).
 */
function buildMedicamento(med) {
    if (!med)
        return '';
    return (0, xml_helper_1.tagGroup)('med', (0, xml_helper_1.tag)('cProdANVISA', med.codigoAnvisa) +
        (0, xml_helper_1.tag)('xMotivoIsencao', med.motivoIsencao) +
        (0, xml_helper_1.tag)('vPMC', (0, xml_helper_1.formatNumber)(med.precoMaximoConsumidor, 2)));
}
/**
 * Armamentos do item (grupo `arma`, ate 500).
 */
function buildArmamentos(armas) {
    if (!armas || armas.length === 0)
        return '';
    return armas
        .slice(0, 500)
        .map((arma) => (0, xml_helper_1.tagGroup)('arma', (0, xml_helper_1.tag)('tpArma', String(arma.tipo)) +
        (0, xml_helper_1.tag)('nSerie', arma.numeroSerie) +
        (0, xml_helper_1.tag)('nCano', arma.numeroSerieCano) +
        (0, xml_helper_1.tag)('descr', arma.descricao)))
        .join('');
}
/**
 * Combustivel (grupo `comb`), com CIDE, encerrante e origem do biocombustivel.
 */
function buildCombustivel(comb) {
    if (!comb)
        return '';
    const cide = comb.cide
        ? (0, xml_helper_1.tagGroup)('CIDE', (0, xml_helper_1.tag)('qBCProd', (0, xml_helper_1.formatNumber)(comb.cide.quantidade, 4)) +
            (0, xml_helper_1.tag)('vAliqProd', (0, xml_helper_1.formatNumber)(comb.cide.aliquota, 4)) +
            (0, xml_helper_1.tag)('vCIDE', (0, xml_helper_1.formatNumber)(comb.cide.valor, 2)))
        : '';
    const enc = comb.encerrante;
    const encerrante = enc
        ? (0, xml_helper_1.tagGroup)('encerrante', (0, xml_helper_1.tag)('nBico', String(enc.bico)) +
            (0, xml_helper_1.tag)('nBomba', enc.bomba !== undefined ? String(enc.bomba) : undefined) +
            (0, xml_helper_1.tag)('nTanque', String(enc.tanque)) +
            (0, xml_helper_1.tag)('vEncIni', (0, xml_helper_1.formatNumber)(enc.valorInicial, 3)) +
            (0, xml_helper_1.tag)('vEncFin', (0, xml_helper_1.formatNumber)(enc.valorFinal, 3)))
        : '';
    const origens = (comb.origens ?? [])
        .slice(0, 30)
        .map((o) => (0, xml_helper_1.tagGroup)('origComb', (0, xml_helper_1.tag)('indImport', String(o.indicadorImportacao)) +
        (0, xml_helper_1.tag)('cUFOrig', ibge_codes_1.UF_CODES[o.uf] || o.uf) +
        (0, xml_helper_1.tag)('pOrig', (0, xml_helper_1.formatNumber)(o.percentual, 4))))
        .join('');
    return (0, xml_helper_1.tagGroup)('comb', (0, xml_helper_1.tag)('cProdANP', comb.codigoAnp) +
        (0, xml_helper_1.tag)('descANP', comb.descricaoAnp) +
        (0, xml_helper_1.tag)('pGLP', comb.percentualGlp !== undefined ? (0, xml_helper_1.formatNumber)(comb.percentualGlp, 4) : undefined) +
        (0, xml_helper_1.tag)('pGNn', comb.percentualGasNacional !== undefined
            ? (0, xml_helper_1.formatNumber)(comb.percentualGasNacional, 4)
            : undefined) +
        (0, xml_helper_1.tag)('pGNi', comb.percentualGasImportado !== undefined
            ? (0, xml_helper_1.formatNumber)(comb.percentualGasImportado, 4)
            : undefined) +
        (0, xml_helper_1.tag)('vPart', comb.valorPartida !== undefined ? (0, xml_helper_1.formatNumber)(comb.valorPartida, 2) : undefined) +
        (0, xml_helper_1.tag)('CODIF', comb.codif) +
        (0, xml_helper_1.tag)('qTemp', comb.quantidadeTemperaturaAmbiente !== undefined
            ? (0, xml_helper_1.formatNumber)(comb.quantidadeTemperaturaAmbiente, 4)
            : undefined) +
        (0, xml_helper_1.tag)('UFCons', comb.ufConsumo) +
        cide +
        encerrante +
        (0, xml_helper_1.tag)('pBio', comb.percentualBiocombustivel !== undefined
            ? (0, xml_helper_1.formatNumber)(comb.percentualBiocombustivel, 4)
            : undefined) +
        origens);
}
/**
 * Grupo exclusivo do item: veiculo, medicamento, arma, combustivel ou RECOPI.
 * O leiaute permite apenas um deles.
 */
function buildProdutoEspecifico(prod) {
    if (prod.veiculoNovo)
        return buildVeiculoNovo(prod.veiculoNovo);
    if (prod.medicamento)
        return buildMedicamento(prod.medicamento);
    if (prod.armamentos?.length)
        return buildArmamentos(prod.armamentos);
    if (prod.combustivel)
        return buildCombustivel(prod.combustivel);
    if (prod.recopi)
        return (0, xml_helper_1.tag)('nRECOPI', prod.recopi);
    return '';
}
/**
 * Devolucao de imposto no item (grupo `impostoDevol`).
 */
function buildImpostoDevolvido(devolucao) {
    if (!devolucao)
        return '';
    return (0, xml_helper_1.tagGroup)('impostoDevol', (0, xml_helper_1.tag)('pDevol', (0, xml_helper_1.formatNumber)(devolucao.percentualDevolvido, 2)) +
        (0, xml_helper_1.tagGroup)('IPI', (0, xml_helper_1.tag)('vIPIDevol', (0, xml_helper_1.formatNumber)(devolucao.valorIpiDevolvido, 2))));
}
/**
 * Observacoes do item (grupo `obsItem`): ate uma do contribuinte e uma do fisco.
 */
function buildObservacaoItem(obs) {
    if (!obs || (!obs.contribuinte && !obs.fisco))
        return '';
    const contribuinte = obs.contribuinte
        ? (0, xml_helper_1.tagGroup)('obsCont', (0, xml_helper_1.tag)('xTexto', obs.contribuinte.texto), `xCampo="${obs.contribuinte.campo}"`)
        : '';
    const fisco = obs.fisco
        ? (0, xml_helper_1.tagGroup)('obsFisco', (0, xml_helper_1.tag)('xTexto', obs.fisco.texto), `xCampo="${obs.fisco.campo}"`)
        : '';
    return (0, xml_helper_1.tagGroup)('obsItem', contribuinte + fisco);
}
/**
 * DFe referenciado pelo item (grupo `DFeReferenciado`).
 */
function buildDFeReferenciado(dfe) {
    if (!dfe)
        return '';
    return (0, xml_helper_1.tagGroup)('DFeReferenciado', (0, xml_helper_1.tag)('chaveAcesso', dfe.chaveAcesso) +
        (0, xml_helper_1.tag)('nItem', dfe.numeroItem !== undefined ? String(dfe.numeroItem) : undefined));
}
