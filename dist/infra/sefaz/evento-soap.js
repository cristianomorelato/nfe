"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INUTILIZACAO_SOAP_ACTION = exports.EVENTO_SOAP_ACTION = void 0;
exports.buildCancelamentoXml = buildCancelamentoXml;
exports.buildCartaCorrecaoXml = buildCartaCorrecaoXml;
exports.buildInutilizacaoXml = buildInutilizacaoXml;
exports.wrapEventoSoapEnvelope = wrapEventoSoapEnvelope;
exports.wrapInutilizacaoSoapEnvelope = wrapInutilizacaoSoapEnvelope;
exports.parseEventoResponse = parseEventoResponse;
exports.parseInutilizacaoResponse = parseInutilizacaoResponse;
const NFeError_1 = require("../../shared/errors/NFeError");
const NFE_NAMESPACE = 'http://www.portalfiscal.inf.br/nfe';
exports.EVENTO_SOAP_ACTION = `${NFE_NAMESPACE}/wsdl/NFeRecepcaoEvento4/nfeRecepcaoEvento`;
exports.INUTILIZACAO_SOAP_ACTION = `${NFE_NAMESPACE}/wsdl/NFeInutilizacao4/nfeInutilizacaoNF`;
const COND_USO_CCE = 'A Carta de Correcao e disciplinada pelo paragrafo 1o-A do art. 7o do Convenio S/N, ' +
    'de 15 de dezembro de 1970 e pode ser utilizada para regularizacao de erro ocorrido na ' +
    'emissao de documento fiscal, desde que o erro nao esteja relacionado com: I - as variaveis ' +
    'que determinam o valor do imposto tais como: base de calculo, aliquota, diferenca de preco, ' +
    'quantidade, valor da operacao ou da prestacao; II - a correcao de dados cadastrais que ' +
    'implique mudanca do remetente ou do destinatario; III - a data de emissao ou de saida.';
/**
 * Monta XML de evento de cancelamento (110111) — SEM envelope SOAP.
 * Precisa ser assinado antes de envolver no SOAP.
 */
function buildCancelamentoXml(chNFe, cnpj, cOrgao, tpAmb, nProt, xJust, dhEvento) {
    const id = `ID110111${chNFe}01`;
    return [
        `<evento versao="1.00" xmlns="${NFE_NAMESPACE}">`,
        `<infEvento Id="${id}">`,
        `<cOrgao>${cOrgao}</cOrgao>`,
        `<tpAmb>${tpAmb}</tpAmb>`,
        `<CNPJ>${cnpj}</CNPJ>`,
        `<chNFe>${chNFe}</chNFe>`,
        `<dhEvento>${dhEvento}</dhEvento>`,
        '<tpEvento>110111</tpEvento>',
        '<nSeqEvento>1</nSeqEvento>',
        '<verEvento>1.00</verEvento>',
        '<detEvento versao="1.00">',
        '<descEvento>Cancelamento</descEvento>',
        `<nProt>${nProt}</nProt>`,
        `<xJust>${xJust}</xJust>`,
        '</detEvento>',
        '</infEvento>',
        '</evento>'
    ].join('');
}
/**
 * Monta XML de Carta de Correcao (110110) — SEM envelope SOAP.
 * Precisa ser assinado antes de envolver no SOAP.
 */
function buildCartaCorrecaoXml(chNFe, cnpj, cOrgao, tpAmb, xCorrecao, nSeqEvento, dhEvento) {
    const seqStr = String(nSeqEvento).padStart(2, '0');
    const id = `ID110110${chNFe}${seqStr}`;
    return [
        `<evento versao="1.00" xmlns="${NFE_NAMESPACE}">`,
        `<infEvento Id="${id}">`,
        `<cOrgao>${cOrgao}</cOrgao>`,
        `<tpAmb>${tpAmb}</tpAmb>`,
        `<CNPJ>${cnpj}</CNPJ>`,
        `<chNFe>${chNFe}</chNFe>`,
        `<dhEvento>${dhEvento}</dhEvento>`,
        '<tpEvento>110110</tpEvento>',
        `<nSeqEvento>${nSeqEvento}</nSeqEvento>`,
        '<verEvento>1.00</verEvento>',
        '<detEvento versao="1.00">',
        '<descEvento>Carta de Correcao</descEvento>',
        `<xCorrecao>${xCorrecao}</xCorrecao>`,
        `<xCondUso>${COND_USO_CCE}</xCondUso>`,
        '</detEvento>',
        '</infEvento>',
        '</evento>'
    ].join('');
}
/**
 * Monta XML de inutilizacao — SEM envelope SOAP.
 * Precisa ser assinado antes de envolver no SOAP.
 */
function buildInutilizacaoXml(cnpj, cUF, tpAmb, ano, serie, nNFIni, nNFFin, xJust) {
    const id = `ID${cUF}${ano}${cnpj}55${serie.padStart(3, '0')}${nNFIni.padStart(9, '0')}${nNFFin.padStart(9, '0')}`;
    return [
        `<inutNFe versao="4.00" xmlns="${NFE_NAMESPACE}">`,
        `<infInut Id="${id}">`,
        `<tpAmb>${tpAmb}</tpAmb>`,
        '<xServ>INUTILIZAR</xServ>',
        `<cUF>${cUF}</cUF>`,
        `<ano>${ano}</ano>`,
        `<CNPJ>${cnpj}</CNPJ>`,
        '<mod>55</mod>',
        `<serie>${serie}</serie>`,
        `<nNFIni>${nNFIni}</nNFIni>`,
        `<nNFFin>${nNFFin}</nNFFin>`,
        `<xJust>${xJust}</xJust>`,
        '</infInut>',
        '</inutNFe>'
    ].join('');
}
/**
 * Envolve XML de evento assinado em envelope SOAP para RecepcaoEvento4.
 */
function wrapEventoSoapEnvelope(signedEventoXml) {
    const inner = signedEventoXml.replace(/<\?xml[^?]*\?>\s*/g, '');
    return [
        '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">',
        '<soap:Body>',
        `<nfeDadosMsg xmlns="${NFE_NAMESPACE}/wsdl/NFeRecepcaoEvento4">`,
        `<envEvento versao="1.00" xmlns="${NFE_NAMESPACE}">`,
        '<idLote>1</idLote>',
        inner,
        '</envEvento>',
        '</nfeDadosMsg>',
        '</soap:Body>',
        '</soap:Envelope>'
    ].join('');
}
/**
 * Envolve XML de inutilizacao assinado em envelope SOAP para NFeInutilizacao4.
 */
function wrapInutilizacaoSoapEnvelope(signedInutXml) {
    const inner = signedInutXml.replace(/<\?xml[^?]*\?>\s*/g, '');
    return [
        '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">',
        '<soap:Body>',
        `<nfeDadosMsg xmlns="${NFE_NAMESPACE}/wsdl/NFeInutilizacao4">`,
        inner,
        '</nfeDadosMsg>',
        '</soap:Body>',
        '</soap:Envelope>'
    ].join('');
}
/**
 * Parseia resposta de RecepcaoEvento4.
 */
function parseEventoResponse(body) {
    const retEvento = body.match(/<retEvento[^>]*>([\s\S]*?)<\/retEvento>/);
    const source = retEvento ? retEvento[1] : body;
    const cStat = extractTag(source, 'cStat');
    if (!cStat) {
        throw new NFeError_1.NFeError('Resposta de evento sem cStat');
    }
    return {
        cStat,
        xMotivo: extractTag(source, 'xMotivo') ?? 'Motivo desconhecido',
        nProt: extractTag(source, 'nProt') ?? undefined,
        chNFe: extractTag(source, 'chNFe') ?? undefined,
        tpEvento: extractTag(source, 'tpEvento') ?? undefined,
        dhRegEvento: extractTag(source, 'dhRegEvento') ?? undefined
    };
}
/**
 * Parseia resposta de NFeInutilizacao4.
 */
function parseInutilizacaoResponse(body) {
    const infInut = body.match(/<infInut[^>]*>([\s\S]*?)<\/infInut>/);
    const source = infInut ? infInut[1] : body;
    const cStat = extractTag(source, 'cStat');
    if (!cStat) {
        throw new NFeError_1.NFeError('Resposta de inutilizacao sem cStat');
    }
    return {
        cStat,
        xMotivo: extractTag(source, 'xMotivo') ?? 'Motivo desconhecido',
        nProt: extractTag(source, 'nProt') ?? undefined,
        dhRecbto: extractTag(source, 'dhRecbto') ?? undefined
    };
}
function extractTag(xml, tag) {
    const match = xml.match(new RegExp(`<${tag}>([^<]*)</${tag}>`));
    return match ? match[1] : null;
}
