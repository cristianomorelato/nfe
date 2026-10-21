"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildAvulsa = buildAvulsa;
exports.buildLocal = buildLocal;
exports.buildIntermediador = buildIntermediador;
exports.buildExportacao = buildExportacao;
exports.buildCompra = buildCompra;
exports.buildCana = buildCana;
exports.buildAgropecuario = buildAgropecuario;
exports.buildObservacoes = buildObservacoes;
exports.buildProcessosReferenciados = buildProcessosReferenciados;
exports.buildInformacoesAdicionais = buildInformacoesAdicionais;
exports.buildTransporte = buildTransporte;
const xml_helper_1 = require("../xml-helper");
/**
 * Grupos de nivel de nota do leiaute 4.00 — os que ficam soltos dentro do
 * `infNFe`, fora de `det` e `imposto`.
 */
/**
 * Emissao avulsa pelo fisco (grupo `avulsa`).
 */
function buildAvulsa(avulsa) {
    if (!avulsa)
        return '';
    return (0, xml_helper_1.tagGroup)('avulsa', (0, xml_helper_1.tag)('CNPJ', avulsa.cnpj) +
        (0, xml_helper_1.tag)('xOrgao', avulsa.orgao) +
        (0, xml_helper_1.tag)('matr', avulsa.matricula) +
        (0, xml_helper_1.tag)('xAgente', avulsa.agente) +
        (0, xml_helper_1.tag)('fone', avulsa.telefone) +
        (0, xml_helper_1.tag)('UF', avulsa.uf) +
        (0, xml_helper_1.tag)('nDAR', avulsa.numeroDar) +
        (0, xml_helper_1.tag)('dEmi', avulsa.dataEmissaoDar ? (0, xml_helper_1.formatDateOnly)(avulsa.dataEmissaoDar) : undefined) +
        (0, xml_helper_1.tag)('vDAR', avulsa.valorDar !== undefined ? (0, xml_helper_1.formatNumber)(avulsa.valorDar, 2) : undefined) +
        (0, xml_helper_1.tag)('repEmi', avulsa.reparticaoEmitente) +
        (0, xml_helper_1.tag)('dPag', avulsa.dataPagamento ? (0, xml_helper_1.formatDateOnly)(avulsa.dataPagamento) : undefined));
}
/**
 * Local de retirada ou de entrega (tipo TLocal).
 */
function buildLocal(tagName, local) {
    if (!local)
        return '';
    return (0, xml_helper_1.tagGroup)(tagName, (local.cnpj ? (0, xml_helper_1.tag)('CNPJ', local.cnpj) : (0, xml_helper_1.tag)('CPF', local.cpf)) +
        (0, xml_helper_1.tag)('xNome', local.nome) +
        (0, xml_helper_1.tag)('xLgr', local.logradouro) +
        (0, xml_helper_1.tag)('nro', local.numero) +
        (0, xml_helper_1.tag)('xCpl', local.complemento) +
        (0, xml_helper_1.tag)('xBairro', local.bairro) +
        (0, xml_helper_1.tag)('cMun', local.codigoMunicipio) +
        (0, xml_helper_1.tag)('xMun', local.municipio) +
        (0, xml_helper_1.tag)('UF', local.uf) +
        (0, xml_helper_1.tag)('CEP', local.cep) +
        (0, xml_helper_1.tag)('cPais', local.codigoPais) +
        (0, xml_helper_1.tag)('xPais', local.pais) +
        (0, xml_helper_1.tag)('fone', local.telefone) +
        (0, xml_helper_1.tag)('email', local.email) +
        (0, xml_helper_1.tag)('IE', local.inscricaoEstadual));
}
/**
 * Intermediador da operacao (grupo `infIntermed`).
 */
function buildIntermediador(intermediador) {
    if (!intermediador)
        return '';
    return (0, xml_helper_1.tagGroup)('infIntermed', (0, xml_helper_1.tag)('CNPJ', intermediador.cnpj) + (0, xml_helper_1.tag)('idCadIntTran', intermediador.identificadorVendedor));
}
/**
 * Comercio exterior (grupo `exporta`).
 */
function buildExportacao(exportacao) {
    if (!exportacao)
        return '';
    return (0, xml_helper_1.tagGroup)('exporta', (0, xml_helper_1.tag)('UFSaidaPais', exportacao.ufSaida) +
        (0, xml_helper_1.tag)('xLocExporta', exportacao.localExportacao) +
        (0, xml_helper_1.tag)('xLocDespacho', exportacao.localDespacho));
}
/**
 * Compra publica (grupo `compra`).
 */
function buildCompra(compra) {
    if (!compra)
        return '';
    const conteudo = (0, xml_helper_1.tag)('xNEmp', compra.notaEmpenho) + (0, xml_helper_1.tag)('xPed', compra.pedido) + (0, xml_helper_1.tag)('xCont', compra.contrato);
    return conteudo ? (0, xml_helper_1.tagGroup)('compra', conteudo) : '';
}
/**
 * Aquisicao de cana-de-acucar (grupo `cana`).
 */
function buildCana(cana) {
    if (!cana)
        return '';
    const forDia = cana.fornecimentosDiarios
        .map((f) => (0, xml_helper_1.tagGroup)('forDia', (0, xml_helper_1.tag)('qtde', (0, xml_helper_1.formatNumber)(f.quantidade, 10)), `dia="${f.dia}"`))
        .join('');
    const deduc = (cana.deducoes ?? [])
        .map((d) => (0, xml_helper_1.tagGroup)('deduc', (0, xml_helper_1.tag)('xDed', d.descricao) + (0, xml_helper_1.tag)('vDed', (0, xml_helper_1.formatNumber)(d.valor, 2))))
        .join('');
    return (0, xml_helper_1.tagGroup)('cana', (0, xml_helper_1.tag)('safra', cana.safra) +
        (0, xml_helper_1.tag)('ref', cana.referencia) +
        forDia +
        (0, xml_helper_1.tag)('qTotMes', (0, xml_helper_1.formatNumber)(cana.totalMes, 10)) +
        (0, xml_helper_1.tag)('qTotAnt', (0, xml_helper_1.formatNumber)(cana.totalAnterior, 10)) +
        (0, xml_helper_1.tag)('qTotGer', (0, xml_helper_1.formatNumber)(cana.totalGeral, 10)) +
        deduc +
        (0, xml_helper_1.tag)('vFor', (0, xml_helper_1.formatNumber)(cana.valorFornecimento, 2)) +
        (0, xml_helper_1.tag)('vTotDed', (0, xml_helper_1.formatNumber)(cana.valorTotalDeducao, 2)) +
        (0, xml_helper_1.tag)('vLiqFor', (0, xml_helper_1.formatNumber)(cana.valorLiquido, 2)));
}
/**
 * Rastreabilidade agropecuaria (grupo `agropecuario`): defensivos OU guia de
 * transito, nunca os dois.
 */
function buildAgropecuario(agro) {
    if (!agro)
        return '';
    if (agro.defensivos) {
        const defensivos = agro.defensivos
            .slice(0, 20)
            .map((d) => (0, xml_helper_1.tagGroup)('defensivo', (0, xml_helper_1.tag)('nReceituario', d.receituario) + (0, xml_helper_1.tag)('CPFRespTec', d.cpfResponsavelTecnico)))
            .join('');
        return defensivos ? (0, xml_helper_1.tagGroup)('agropecuario', defensivos) : '';
    }
    const guia = agro.guiaTransito;
    return (0, xml_helper_1.tagGroup)('agropecuario', (0, xml_helper_1.tagGroup)('guiaTransito', (0, xml_helper_1.tag)('tpGuia', String(guia.tipo)) +
        (0, xml_helper_1.tag)('UFGuia', guia.uf) +
        (0, xml_helper_1.tag)('serieGuia', guia.serie) +
        (0, xml_helper_1.tag)('nGuia', guia.numero)));
}
/**
 * Observacoes de uso livre (`obsCont` do contribuinte, `obsFisco` do fisco).
 */
function buildObservacoes(tagName, observacoes) {
    if (!observacoes || observacoes.length === 0)
        return '';
    return observacoes
        .slice(0, 10)
        .map((obs) => (0, xml_helper_1.tagGroup)(tagName, (0, xml_helper_1.tag)('xTexto', obs.texto), `xCampo="${obs.campo}"`))
        .join('');
}
/**
 * Processos ou atos concessorios referenciados (grupo `procRef`).
 */
function buildProcessosReferenciados(processos) {
    if (!processos || processos.length === 0)
        return '';
    return processos
        .slice(0, 100)
        .map((p) => (0, xml_helper_1.tagGroup)('procRef', (0, xml_helper_1.tag)('nProc', p.numero) + (0, xml_helper_1.tag)('indProc', String(p.origem)) + (0, xml_helper_1.tag)('tpAto', p.tipoAto)))
        .join('');
}
/**
 * Bloco `infAdic` completo: textos livres, observacoes e processos referenciados.
 */
function buildInformacoesAdicionais(params) {
    const conteudo = (0, xml_helper_1.tag)('infAdFisco', params.fisco) +
        (0, xml_helper_1.tag)('infCpl', params.complementar) +
        buildObservacoes('obsCont', params.observacoesContribuinte) +
        buildObservacoes('obsFisco', params.observacoesFisco) +
        buildProcessosReferenciados(params.processosReferenciados);
    return conteudo ? (0, xml_helper_1.tagGroup)('infAdic', conteudo) : '';
}
function buildVeiculo(tagName, veiculo) {
    return (0, xml_helper_1.tagGroup)(tagName, (0, xml_helper_1.tag)('placa', veiculo.placa) + (0, xml_helper_1.tag)('UF', veiculo.uf) + (0, xml_helper_1.tag)('RNTC', veiculo.rntc));
}
/**
 * Bloco `transp` completo: transportadora, retencao de ICMS sobre o frete,
 * modal (veiculo + reboques, vagao ou balsa) e volumes com lacres.
 */
function buildTransporte(transp) {
    const documento = transp.cnpjTransportadora
        ? (0, xml_helper_1.tag)('CNPJ', transp.cnpjTransportadora)
        : transp.cpfTransportadora
            ? (0, xml_helper_1.tag)('CPF', transp.cpfTransportadora)
            : '';
    const dadosTransportadora = documento +
        (0, xml_helper_1.tag)('xNome', transp.nomeTransportadora) +
        (0, xml_helper_1.tag)('IE', transp.inscricaoEstadual) +
        (0, xml_helper_1.tag)('xEnder', transp.endereco) +
        (0, xml_helper_1.tag)('xMun', transp.municipio) +
        (0, xml_helper_1.tag)('UF', transp.uf);
    const transportadora = dadosTransportadora ? (0, xml_helper_1.tagGroup)('transporta', dadosTransportadora) : '';
    const ret = transp.retencao;
    const retTransp = !ret
        ? ''
        : (0, xml_helper_1.tagGroup)('retTransp', (0, xml_helper_1.tag)('vServ', (0, xml_helper_1.formatNumber)(ret.valorServico, 2)) +
            (0, xml_helper_1.tag)('vBCRet', (0, xml_helper_1.formatNumber)(ret.baseCalculoRetencao, 2)) +
            (0, xml_helper_1.tag)('pICMSRet', (0, xml_helper_1.formatNumber)(ret.aliquotaRetencao, 4)) +
            (0, xml_helper_1.tag)('vICMSRet', (0, xml_helper_1.formatNumber)(ret.valorRetencao, 2)) +
            (0, xml_helper_1.tag)('CFOP', ret.cfop) +
            (0, xml_helper_1.tag)('cMunFG', ret.codigoMunicipio));
    // O leiaute permite um unico modal: rodoviario (veiculo + reboques),
    // ferroviario (vagao) ou aquaviario (balsa).
    let modal = '';
    if (transp.vagao) {
        modal = (0, xml_helper_1.tag)('vagao', transp.vagao);
    }
    else if (transp.balsa) {
        modal = (0, xml_helper_1.tag)('balsa', transp.balsa);
    }
    else {
        modal =
            (transp.veiculo ? buildVeiculo('veicTransp', transp.veiculo) : '') +
                (transp.reboques ?? [])
                    .slice(0, 5)
                    .map((reboque) => buildVeiculo('reboque', reboque))
                    .join('');
    }
    const volumes = (transp.volumes ?? [])
        .map((vol) => {
        const lacres = (vol.lacres ?? [])
            .map((nLacre) => (0, xml_helper_1.tagGroup)('lacres', (0, xml_helper_1.tag)('nLacre', nLacre)))
            .join('');
        return (0, xml_helper_1.tagGroup)('vol', (0, xml_helper_1.tag)('qVol', vol.quantidade !== undefined ? String(vol.quantidade) : undefined) +
            (0, xml_helper_1.tag)('esp', vol.especie) +
            (0, xml_helper_1.tag)('marca', vol.marca) +
            (0, xml_helper_1.tag)('nVol', vol.numeracao) +
            (0, xml_helper_1.tag)('pesoL', vol.pesoLiquido !== undefined ? (0, xml_helper_1.formatNumber)(vol.pesoLiquido, 3) : undefined) +
            (0, xml_helper_1.tag)('pesoB', vol.pesoBruto !== undefined ? (0, xml_helper_1.formatNumber)(vol.pesoBruto, 3) : undefined) +
            lacres);
    })
        .join('');
    return (0, xml_helper_1.tagGroup)('transp', (0, xml_helper_1.tag)('modFrete', String(transp.modalidadeFrete)) + transportadora + retTransp + modal + volumes);
}
