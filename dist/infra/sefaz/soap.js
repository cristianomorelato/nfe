"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SOAP_ACTIONS = void 0;
exports.buildAutorizacaoEnvelope = buildAutorizacaoEnvelope;
exports.buildConsultaEnvelope = buildConsultaEnvelope;
exports.extractSoapBody = extractSoapBody;
exports.parseAutorizacaoResponse = parseAutorizacaoResponse;
exports.parseConsultaResponse = parseConsultaResponse;
const NFeError_1 = require("../../shared/errors/NFeError");
const NFE_NAMESPACE = 'http://www.portalfiscal.inf.br/nfe';
const WSDL_NAMESPACE = {
    NFeAutorizacao4: `${NFE_NAMESPACE}/wsdl/NFeAutorizacao4`,
    NFeConsultaProtocolo4: `${NFE_NAMESPACE}/wsdl/NFeConsultaProtocolo4`
};
exports.SOAP_ACTIONS = {
    NFeAutorizacao4: `${NFE_NAMESPACE}/wsdl/NFeAutorizacao4/nfeAutorizacaoLote`,
    NFeConsultaProtocolo4: `${NFE_NAMESPACE}/wsdl/NFeConsultaProtocolo4/nfeConsultaNF`
};
/**
 * Monta envelope SOAP para envio sincrono de NFe (NFeAutorizacao4).
 */
function buildAutorizacaoEnvelope(signedNFeXml, idLote = '1') {
    const innerXml = signedNFeXml.replace(/<\?xml[^?]*\?>\s*/g, '');
    return [
        '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">',
        '<soap:Body>',
        `<nfeDadosMsg xmlns="${WSDL_NAMESPACE.NFeAutorizacao4}">`,
        `<enviNFe versao="4.00" xmlns="${NFE_NAMESPACE}">`,
        `<idLote>${idLote}</idLote>`,
        '<indSinc>1</indSinc>',
        innerXml,
        '</enviNFe>',
        '</nfeDadosMsg>',
        '</soap:Body>',
        '</soap:Envelope>'
    ].join('');
}
/**
 * Monta envelope SOAP para consulta de protocolo (NFeConsultaProtocolo4).
 */
function buildConsultaEnvelope(chaveAcesso, tpAmb) {
    return [
        '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">',
        '<soap:Body>',
        `<nfeDadosMsg xmlns="${WSDL_NAMESPACE.NFeConsultaProtocolo4}">`,
        `<consSitNFe versao="4.00" xmlns="${NFE_NAMESPACE}">`,
        `<tpAmb>${tpAmb}</tpAmb>`,
        '<xServ>CONSULTAR</xServ>',
        `<chNFe>${chaveAcesso}</chNFe>`,
        '</consSitNFe>',
        '</nfeDadosMsg>',
        '</soap:Body>',
        '</soap:Envelope>'
    ].join('');
}
/**
 * Extrai o conteudo dentro de <soap12:Body> ou <soapenv:Body>.
 */
function extractSoapBody(soapXml) {
    const match = soapXml.match(/<(?:soap12|soapenv|soap):Body[^>]*>([\s\S]*?)<\/(?:soap12|soapenv|soap):Body>/i);
    if (!match) {
        throw new NFeError_1.NFeError('Resposta SOAP invalida: Body nao encontrado');
    }
    return match[1].trim();
}
/**
 * Parseia a resposta de NFeAutorizacao4.
 * Extrai campos do <protNFe> dentro de <retEnviNFe>.
 */
function parseAutorizacaoResponse(body) {
    const cStatLote = extractTag(body, 'cStat');
    if (!cStatLote) {
        throw new NFeError_1.NFeError('Resposta da SEFAZ sem cStat');
    }
    // cStat do lote (nivel retEnviNFe)
    // 104 = Lote processado — verificar protNFe individual
    if (cStatLote !== '104') {
        return {
            cStat: cStatLote,
            xMotivo: extractTag(body, 'xMotivo') ?? 'Motivo desconhecido'
        };
    }
    // Extrai protNFe
    const protNFe = body.match(/<protNFe[^>]*>([\s\S]*?)<\/protNFe>/);
    if (!protNFe) {
        throw new NFeError_1.NFeError('Resposta da SEFAZ sem protNFe');
    }
    const proto = protNFe[1];
    return {
        cStat: extractTag(proto, 'cStat') ?? cStatLote,
        xMotivo: extractTag(proto, 'xMotivo') ?? 'Motivo desconhecido',
        nProt: extractTag(proto, 'nProt') ?? undefined,
        dhRecbto: extractTag(proto, 'dhRecbto') ?? undefined,
        chNFe: extractTag(proto, 'chNFe') ?? undefined,
        xmlProtocolado: protNFe[0] ? `<protNFe versao="4.00">${proto}</protNFe>` : undefined
    };
}
/**
 * Parseia a resposta de NFeConsultaProtocolo4.
 * Extrai campos do <retConsSitNFe>.
 */
function parseConsultaResponse(body) {
    const protNFe = body.match(/<protNFe[^>]*>([\s\S]*?)<\/protNFe>/);
    const source = protNFe ? protNFe[1] : body;
    const cStat = extractTag(source, 'cStat');
    if (!cStat) {
        throw new NFeError_1.NFeError('Resposta de consulta sem cStat');
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
