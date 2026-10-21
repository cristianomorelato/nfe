"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartaCorrecaoUseCase = void 0;
const NFeError_1 = require("../../shared/errors/NFeError");
const SefazRejectError_1 = require("../../shared/errors/SefazRejectError");
const sefaz_urls_1 = require("../../shared/constants/sefaz-urls");
const soap_1 = require("../../infra/sefaz/soap");
const xml_helper_1 = require("../../infra/xml/xml-helper");
const evento_soap_1 = require("../../infra/sefaz/evento-soap");
function toSefazEnv(env) {
    return env === 'homologation' ? 'homologacao' : 'producao';
}
class CartaCorrecaoUseCase {
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
        const nSeqEvento = input.sequencia ?? 1;
        const eventoXml = (0, evento_soap_1.buildCartaCorrecaoXml)(input.chaveAcesso, input.cnpj, cOrgao, tpAmb, input.correcao, nSeqEvento, dhEvento);
        const cert = await certificate.load();
        const signedXml = xmlSigner.sign(eventoXml, cert);
        const envelope = (0, evento_soap_1.wrapEventoSoapEnvelope)(signedXml);
        const sefazEnv = toSefazEnv(environment);
        const url = (0, sefaz_urls_1.getSefazUrl)(uf, sefazEnv, 'RecepcaoEvento');
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
        if (!input.correcao || input.correcao.length < 15) {
            throw new NFeError_1.NFeError('Texto da correcao deve ter no minimo 15 caracteres');
        }
        if (input.sequencia !== undefined && (input.sequencia < 1 || input.sequencia > 20)) {
            throw new NFeError_1.NFeError('Sequencia do evento deve ser entre 1 e 20');
        }
    }
}
exports.CartaCorrecaoUseCase = CartaCorrecaoUseCase;
