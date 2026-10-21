"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DISTRIBUICAO_SOAP_ACTION = void 0;
exports.buildDistNSUEnvelope = buildDistNSUEnvelope;
exports.buildConsChNFeEnvelope = buildConsChNFeEnvelope;
exports.parseDistribuicaoResponse = parseDistribuicaoResponse;
exports.decompressDocZip = decompressDocZip;
const node_zlib_1 = require("node:zlib");
const NFeError_1 = require("../../shared/errors/NFeError");
const NFE_NAMESPACE = 'http://www.portalfiscal.inf.br/nfe';
const WSDL_NAMESPACE = `${NFE_NAMESPACE}/wsdl/NFeDistribuicaoDFe`;
exports.DISTRIBUICAO_SOAP_ACTION = `${NFE_NAMESPACE}/wsdl/NFeDistribuicaoDFe/nfeDistDFeInteresse`;
/**
 * Monta envelope SOAP para consulta por ultimo NSU (distNSU).
 */
function buildDistNSUEnvelope(cnpj, cUFAutor, tpAmb, ultNSU) {
    const nsuPadded = ultNSU.padStart(15, '0');
    return [
        '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">',
        '<soap:Body>',
        `<nfeDistDFeInteresse xmlns="${WSDL_NAMESPACE}">`,
        '<nfeDadosMsg>',
        `<distDFeInt versao="1.01" xmlns="${NFE_NAMESPACE}">`,
        `<tpAmb>${tpAmb}</tpAmb>`,
        `<cUFAutor>${cUFAutor}</cUFAutor>`,
        `<CNPJ>${cnpj}</CNPJ>`,
        `<distNSU><ultNSU>${nsuPadded}</ultNSU></distNSU>`,
        '</distDFeInt>',
        '</nfeDadosMsg>',
        '</nfeDistDFeInteresse>',
        '</soap:Body>',
        '</soap:Envelope>'
    ].join('');
}
/**
 * Monta envelope SOAP para consulta por chave de acesso (consChNFe).
 */
function buildConsChNFeEnvelope(cnpj, cUFAutor, tpAmb, chNFe) {
    return [
        '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">',
        '<soap:Body>',
        `<nfeDistDFeInteresse xmlns="${WSDL_NAMESPACE}">`,
        '<nfeDadosMsg>',
        `<distDFeInt versao="1.01" xmlns="${NFE_NAMESPACE}">`,
        `<tpAmb>${tpAmb}</tpAmb>`,
        `<cUFAutor>${cUFAutor}</cUFAutor>`,
        `<CNPJ>${cnpj}</CNPJ>`,
        `<consChNFe><chNFe>${chNFe}</chNFe></consChNFe>`,
        '</distDFeInt>',
        '</nfeDadosMsg>',
        '</nfeDistDFeInteresse>',
        '</soap:Body>',
        '</soap:Envelope>'
    ].join('');
}
/**
 * Parseia a resposta do servico NFeDistribuicaoDFe.
 */
function parseDistribuicaoResponse(body) {
    const cStat = extractTag(body, 'cStat');
    if (!cStat) {
        throw new NFeError_1.NFeError('Resposta de distribuicao sem cStat');
    }
    const xMotivo = extractTag(body, 'xMotivo') ?? 'Motivo desconhecido';
    const ultNSU = extractTag(body, 'ultNSU') ?? '000000000000000';
    const maxNSU = extractTag(body, 'maxNSU') ?? '000000000000000';
    const documentos = [];
    const docZipRegex = /<docZip\s+NSU="(\d+)"\s+schema="([^"]+)"[^>]*>([^<]+)<\/docZip>/g;
    let match;
    while ((match = docZipRegex.exec(body)) !== null) {
        const nsu = match[1];
        const schema = match[2];
        const base64Content = match[3];
        try {
            const xml = decompressDocZip(base64Content);
            documentos.push({ nsu, schema, xml });
        }
        catch {
            documentos.push({
                nsu,
                schema,
                xml: `<erro>Falha ao descompactar documento NSU ${nsu}</erro>`
            });
        }
    }
    return { cStat, xMotivo, ultNSU, maxNSU, documentos };
}
/**
 * Descompacta um docZip (base64 + GZip) para XML.
 */
function decompressDocZip(base64Content) {
    const buffer = Buffer.from(base64Content, 'base64');
    const decompressed = (0, node_zlib_1.gunzipSync)(buffer);
    return decompressed.toString('utf-8');
}
function extractTag(xml, tag) {
    const match = xml.match(new RegExp(`<${tag}>([^<]*)</${tag}>`));
    return match ? match[1] : null;
}
