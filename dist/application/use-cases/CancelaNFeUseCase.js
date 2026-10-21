"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelaNFeUseCase = void 0;
const NFeError_1 = require("../../shared/errors/NFeError");
const SefazRejectError_1 = require("../../shared/errors/SefazRejectError");
const sefaz_urls_1 = require("../../shared/constants/sefaz-urls");
const soap_1 = require("../../infra/sefaz/soap");
const xml_helper_1 = require("../../infra/xml/xml-helper");
const evento_soap_1 = require("../../infra/sefaz/evento-soap");
function toSefazEnv(env) {
    return env === 'homologation' ? 'homologacao' : 'producao';
}
class CancelaNFeUseCase {
    deps;
    constructor(deps) {
        this.deps = deps;
    }
    async execute(input) {
        this.validate(input);
        const { certificate, transport, xmlSigner, environment } = this.deps;
        const uf = (0, sefaz_urls_1.ibgeToUf)(input.chaveAcesso.substring(0, 2));
        const cOrgao = input.chaveAcesso.substring(0, 2);
        const tpAmb = environment === 'production' ? '1' : '2';
        const dhEvento = (0, xml_helper_1.formatDate)(new Date());
        const eventoXml = (0, evento_soap_1.buildCancelamentoXml)(input.chaveAcesso, input.cnpj, cOrgao, tpAmb, input.protocolo, input.justificativa, dhEvento);
        const cert = await certificate.load();
        const signedXml = xmlSigner.sign(eventoXml, cert);
        const envelope = (0, evento_soap_1.wrapEventoSoapEnvelope)(signedXml);
        const sefazEnv = toSefazEnv(environment);
        const modelo = input.chaveAcesso.substring(20, 22);
        const url = (0, sefaz_urls_1.getEventoUrl)(uf, sefazEnv, modelo);
        const response = await transport.send({
            url,
            soapAction: evento_soap_1.EVENTO_SOAP_ACTION,
            xml: envelope,
            pfx: cert.pfx,
            password: cert.password
        });
        const body = (0, soap_1.extractSoapBody)(response.xml);
        const result = (0, evento_soap_1.parseEventoResponse)(body);
        if (result.cStat === '135' || result.cStat === '136') {
            return result;
        }
        throw new SefazRejectError_1.SefazRejectError(result.cStat, result.xMotivo, uf);
    }
    validate(input) {
        if (!/^\d{44}$/.test(input.chaveAcesso)) {
            throw new NFeError_1.NFeError('Chave de acesso invalida: deve ter 44 digitos numericos');
        }
        if (!/^\d{14}$/.test(input.cnpj)) {
            throw new NFeError_1.NFeError('CNPJ invalido: deve ter 14 digitos numericos');
        }
        if (!input.protocolo) {
            throw new NFeError_1.NFeError('Protocolo de autorizacao eh obrigatorio para cancelamento');
        }
        if (!input.justificativa || input.justificativa.length < 15) {
            throw new NFeError_1.NFeError('Justificativa deve ter no minimo 15 caracteres');
        }
    }
}
exports.CancelaNFeUseCase = CancelaNFeUseCase;
