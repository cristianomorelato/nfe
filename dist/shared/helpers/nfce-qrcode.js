"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildNFCeQRCodeUrl = buildNFCeQRCodeUrl;
exports.buildInfNFeSupl = buildInfNFeSupl;
const node_crypto_1 = require("node:crypto");
/**
 * Gera a URL do QR Code v2 da NFC-e.
 *
 * Online (tpEmis != 9):
 *   ?p={chNFe}|2|{tpAmb}|{cDest}|{cHashQRCode}
 *   cHashQRCode = SHA1({chNFe}|2|{tpAmb}|{cIdToken}{CSC})
 *
 * Offline (tpEmis = 9):
 *   ?p={chNFe}|2|{tpAmb}|{dhEmi_hex}|{vNF}|{digVal_hex}|{cIdToken}|{cHashQRCode}
 *   cHashQRCode = SHA1({chNFe}|2|{tpAmb}|{dhEmi_hex}|{vNF}|{digVal_hex}|{cIdToken}{CSC})
 */
function buildNFCeQRCodeUrl(params) {
    const nVersao = '2';
    const isOffline = params.tpEmis === 9;
    if (isOffline) {
        return buildOfflineQRCode(params, nVersao);
    }
    return buildOnlineQRCode(params, nVersao);
}
function buildOnlineQRCode(params, nVersao) {
    const cIdTokenNum = String(Number(params.cIdToken));
    const payload = params.chNFe + '|' +
        nVersao + '|' +
        params.tpAmb + '|' +
        cIdTokenNum;
    const hashInput = payload + params.csc;
    const cHashQRCode = (0, node_crypto_1.createHash)('sha1').update(hashInput).digest('hex').toUpperCase();
    return params.urlQRCode + '?p=' + payload + '|' + cHashQRCode;
}
function buildOfflineQRCode(params, nVersao) {
    const dhEmiHex = toHex(params.dhEmi ?? '');
    const digValHex = toHex(params.digVal ?? '');
    const payload = params.chNFe + '|' +
        nVersao + '|' +
        params.tpAmb + '|' +
        dhEmiHex + '|' +
        params.vNF + '|' +
        digValHex + '|' +
        params.cIdToken;
    const hashInput = payload + params.csc;
    const cHashQRCode = (0, node_crypto_1.createHash)('sha1').update(hashInput).digest('hex').toUpperCase();
    return params.urlQRCode + '?p=' + payload + '|' + cHashQRCode;
}
/**
 * Monta o bloco <infNFeSupl> com qrCode e urlChave.
 * Inserido apos </infNFe> e antes de <Signature>.
 */
function buildInfNFeSupl(qrCodeUrl, urlChave) {
    return ('<infNFeSupl>' +
        `<qrCode>${qrCodeUrl}</qrCode>` +
        `<urlChave>${urlChave}</urlChave>` +
        '</infNFeSupl>');
}
function toHex(value) {
    return Buffer.from(value, 'utf-8').toString('hex');
}
