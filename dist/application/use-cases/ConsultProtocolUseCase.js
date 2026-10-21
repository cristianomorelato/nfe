"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultProtocolUseCase = void 0;
const NFeError_1 = require("../../shared/errors/NFeError");
const SefazRejectError_1 = require("../../shared/errors/SefazRejectError");
const sefaz_urls_1 = require("../../shared/constants/sefaz-urls");
const soap_1 = require("../../infra/sefaz/soap");
function toSefazEnv(env) {
    return env === 'homologation' ? 'homologacao' : 'producao';
}
class ConsultProtocolUseCase {
    deps;
    constructor(deps) {
        this.deps = deps;
    }
    async execute(chaveAcesso) {
        this.validateChave(chaveAcesso);
        const { certificate, transport, environment } = this.deps;
        const uf = (0, sefaz_urls_1.ibgeToUf)(chaveAcesso.substring(0, 2));
        const sefazEnv = toSefazEnv(environment);
        const tpAmb = environment === 'production' ? '1' : '2';
        const url = (0, sefaz_urls_1.getSefazUrl)(uf, sefazEnv, 'NFeConsultaProtocolo');
        const envelope = (0, soap_1.buildConsultaEnvelope)(chaveAcesso, tpAmb);
        const cert = await certificate.load();
        const response = await transport.send({
            url,
            soapAction: soap_1.SOAP_ACTIONS.NFeConsultaProtocolo4,
            xml: envelope,
            pfx: cert.pfx,
            password: cert.password
        });
        const body = (0, soap_1.extractSoapBody)(response.xml);
        const result = (0, soap_1.parseConsultaResponse)(body);
        if (result.cStat === '100' || result.cStat === '101') {
            return {
                codigoStatus: result.cStat,
                motivo: result.xMotivo,
                protocolo: result.nProt,
                dataAutorizacao: result.dhRecbto ? new Date(result.dhRecbto) : undefined
            };
        }
        throw new SefazRejectError_1.SefazRejectError(result.cStat, result.xMotivo, uf);
    }
    validateChave(chave) {
        if (!/^\d{44}$/.test(chave)) {
            throw new NFeError_1.NFeError(`Chave de acesso invalida: deve ter 44 digitos numericos, recebeu "${chave}"`);
        }
    }
}
exports.ConsultProtocolUseCase = ConsultProtocolUseCase;
