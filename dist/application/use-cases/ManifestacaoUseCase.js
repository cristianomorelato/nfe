"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManifestacaoUseCase = void 0;
const NFeError_1 = require("../../shared/errors/NFeError");
const SefazRejectError_1 = require("../../shared/errors/SefazRejectError");
const sefaz_an_urls_1 = require("../../shared/constants/sefaz-an-urls");
const soap_1 = require("../../infra/sefaz/soap");
const xml_helper_1 = require("../../infra/xml/xml-helper");
const manifestacao_soap_1 = require("../../infra/sefaz/manifestacao-soap");
function toAnEnv(env) {
    return env === 'homologation' ? 'homologacao' : 'producao';
}
class ManifestacaoUseCase {
    deps;
    constructor(deps) {
        this.deps = deps;
    }
    async confirmar(input) {
        return this.enviar('confirmacao', input);
    }
    async ciencia(input) {
        return this.enviar('ciencia', input);
    }
    async desconhecer(input) {
        return this.enviar('desconhecimento', input);
    }
    async naoRealizada(input) {
        return this.enviar('naoRealizada', input);
    }
    async enviar(tipo, input) {
        this.validate(tipo, input);
        const { certificate, transport, xmlSigner, environment } = this.deps;
        const cOrgao = '91'; // Codigo do orgao AN para manifestacao
        const tpAmb = environment === 'production' ? '1' : '2';
        const dhEvento = (0, xml_helper_1.formatDate)(new Date());
        const eventoXml = (0, manifestacao_soap_1.buildManifestacaoXml)(tipo, input.chaveAcesso, input.cnpj, cOrgao, tpAmb, dhEvento, input.justificativa);
        const cert = await certificate.load();
        const signedXml = xmlSigner.sign(eventoXml, cert);
        const envelope = (0, manifestacao_soap_1.wrapManifestacaoSoapEnvelope)(signedXml);
        const anEnv = toAnEnv(environment);
        const url = (0, sefaz_an_urls_1.getAnUrl)(anEnv, 'RecepcaoEvento');
        const response = await transport.send({
            url,
            soapAction: manifestacao_soap_1.MANIFESTACAO_SOAP_ACTION,
            xml: envelope,
            pfx: cert.pfx,
            password: cert.password
        });
        const body = (0, soap_1.extractSoapBody)(response.xml);
        const result = (0, manifestacao_soap_1.parseManifestacaoResponse)(body);
        if (result.cStat === '135' || result.cStat === '136') {
            return result;
        }
        throw new SefazRejectError_1.SefazRejectError(result.cStat, result.xMotivo);
    }
    validate(tipo, input) {
        if (!/^\d{44}$/.test(input.chaveAcesso)) {
            throw new NFeError_1.NFeError('Chave de acesso invalida: deve ter 44 digitos numericos');
        }
        if (!/^\d{14}$/.test(input.cnpj)) {
            throw new NFeError_1.NFeError('CNPJ invalido: deve ter 14 digitos numericos');
        }
        if ((0, manifestacao_soap_1.requiresJustificativa)(tipo) && (!input.justificativa || input.justificativa.length < 15)) {
            throw new NFeError_1.NFeError('Justificativa deve ter no minimo 15 caracteres para este tipo de manifestacao');
        }
    }
}
exports.ManifestacaoUseCase = ManifestacaoUseCase;
