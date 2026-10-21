"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransmitNFeUseCase = void 0;
const SefazRejectError_1 = require("../../shared/errors/SefazRejectError");
const sefaz_urls_1 = require("../../shared/constants/sefaz-urls");
const nfce_qrcode_1 = require("../../shared/helpers/nfce-qrcode");
const nfce_urls_1 = require("../../shared/constants/nfce-urls");
const soap_1 = require("../../infra/sefaz/soap");
const xml_helper_1 = require("../../infra/xml/xml-helper");
function toSefazEnv(env) {
    return env === 'homologation' ? 'homologacao' : 'producao';
}
class TransmitNFeUseCase {
    deps;
    constructor(deps) {
        this.deps = deps;
    }
    async execute(nfe) {
        const { xmlBuilder, xmlSigner, certificate, transport, environment, uf, cIdToken, csc } = this.deps;
        let xml = xmlBuilder.build(nfe);
        const cert = await certificate.load();
        const modelo = nfe.identificacao.modelo ?? '55';
        // NFC-e: remove acentos do XML antes de assinar.
        // Alguns endpoints NFC-e (ex: MT) rejeitam caracteres acentuados com erro 402.
        if (modelo === '65') {
            xml = (0, xml_helper_1.stripAccents)(xml);
        }
        let signedXml = xmlSigner.sign(xml, cert);
        const sefazEnv = toSefazEnv(environment);
        const service = modelo === '65' ? 'NFCeAutorizacao' : 'NFeAutorizacao';
        const url = (0, sefaz_urls_1.getSefazUrl)(uf, sefazEnv, service);
        // NFC-e: insere infNFeSupl ANTES do envio (apos Signature, antes de </NFe>)
        if (modelo === '65' && cIdToken && csc) {
            signedXml = this.insertInfNFeSuplBeforeSend(signedXml, nfe, sefazEnv, uf, cIdToken, csc);
        }
        const envelope = (0, soap_1.buildAutorizacaoEnvelope)(signedXml);
        const response = await transport.send({
            url,
            soapAction: soap_1.SOAP_ACTIONS.NFeAutorizacao4,
            xml: envelope,
            pfx: cert.pfx,
            password: cert.password
        });
        const body = (0, soap_1.extractSoapBody)(response.xml);
        const result = (0, soap_1.parseAutorizacaoResponse)(body);
        if (result.cStat === '100') {
            const nfeProc = this.buildNfeProc(signedXml, result.xmlProtocolado);
            return {
                autorizada: true,
                protocolo: result.nProt,
                chaveAcesso: result.chNFe ?? '',
                codigoStatus: result.cStat,
                motivo: result.xMotivo,
                xmlProtocolado: nfeProc,
                dataAutorizacao: result.dhRecbto ? new Date(result.dhRecbto) : undefined
            };
        }
        throw new SefazRejectError_1.SefazRejectError(result.cStat, result.xMotivo, uf);
    }
    buildNfeProc(signedNFe, protNFe) {
        if (!protNFe)
            return undefined;
        const nfeContent = signedNFe.replace(/<\?xml[^?]*\?>\s*/g, '');
        return ('<?xml version="1.0" encoding="UTF-8"?>' +
            '<nfeProc versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe">' +
            nfeContent +
            protNFe +
            '</nfeProc>');
    }
    insertInfNFeSuplBeforeSend(signedXml, nfe, sefazEnv, uf, cIdToken, csc) {
        const idMatch = signedXml.match(/Id="NFe(\d{44})"/);
        if (!idMatch)
            return signedXml;
        const chNFe = idMatch[1];
        const tpAmb = String(nfe.identificacao.ambiente ?? 2);
        const tpEmis = nfe.identificacao.tipoEmissao ?? 1;
        const urlQRCode = (0, nfce_urls_1.getNFCeQRCodeUrl)(uf, sefazEnv);
        const urlChave = (0, nfce_urls_1.getNFCeConsultaUrl)(uf, sefazEnv);
        const dest = nfe.destinatario;
        const cDest = dest?.cpf ?? dest?.cnpj ?? '';
        const digValMatch = signedXml.match(/<DigestValue>([^<]+)<\/DigestValue>/);
        const dhEmi = signedXml.match(/<dhEmi>([^<]+)<\/dhEmi>/)?.[1] ?? '';
        const vNF = signedXml.match(/<vNF>([^<]+)<\/vNF>/)?.[1] ?? '0.00';
        const vICMS = signedXml.match(/<vICMS>([^<]+)<\/vICMS>/)?.[1] ?? '0.00';
        const qrCodeUrl = (0, nfce_qrcode_1.buildNFCeQRCodeUrl)({
            urlQRCode,
            chNFe,
            tpAmb,
            cDest,
            cIdToken,
            csc,
            tpEmis,
            dhEmi,
            vNF,
            vICMS,
            digVal: digValMatch?.[1]
        });
        const infNFeSupl = (0, nfce_qrcode_1.buildInfNFeSupl)(qrCodeUrl, urlChave);
        // infNFeSupl deve ficar entre </infNFe> e <Signature> conforme schema NFe 4.00
        return signedXml.replace('<Signature', infNFeSupl + '<Signature');
    }
}
exports.TransmitNFeUseCase = TransmitNFeUseCase;
