"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InutilizaNFeUseCase = void 0;
const NFeError_1 = require("../../shared/errors/NFeError");
const SefazRejectError_1 = require("../../shared/errors/SefazRejectError");
const sefaz_urls_1 = require("../../shared/constants/sefaz-urls");
const ibge_codes_1 = require("../../shared/constants/ibge-codes");
const soap_1 = require("../../infra/sefaz/soap");
const evento_soap_1 = require("../../infra/sefaz/evento-soap");
function toSefazEnv(env) {
    return env === 'homologation' ? 'homologacao' : 'producao';
}
class InutilizaNFeUseCase {
    deps;
    constructor(deps) {
        this.deps = deps;
    }
    async execute(input) {
        this.validate(input);
        const { certificate, transport, xmlSigner, environment } = this.deps;
        const cUF = ibge_codes_1.UF_CODES[input.uf];
        if (!cUF) {
            throw new NFeError_1.NFeError(`UF desconhecida: ${input.uf}`);
        }
        const tpAmb = environment === 'production' ? '1' : '2';
        const ano = String(input.ano).slice(-2);
        const inutXml = (0, evento_soap_1.buildInutilizacaoXml)(input.cnpj, cUF, tpAmb, ano, String(input.serie), String(input.numeroInicial), String(input.numeroFinal), input.justificativa);
        const cert = await certificate.load();
        const signedXml = xmlSigner.sign(inutXml, cert);
        const envelope = (0, evento_soap_1.wrapInutilizacaoSoapEnvelope)(signedXml);
        const sefazEnv = toSefazEnv(environment);
        const url = (0, sefaz_urls_1.getSefazUrl)(input.uf, sefazEnv, 'NFeInutilizacao');
        const response = await transport.send({
            url,
            soapAction: evento_soap_1.INUTILIZACAO_SOAP_ACTION,
            xml: envelope,
            pfx: cert.pfx,
            password: cert.password
        });
        const body = (0, soap_1.extractSoapBody)(response.xml);
        const result = (0, evento_soap_1.parseInutilizacaoResponse)(body);
        if (result.cStat === '102') {
            return result;
        }
        throw new SefazRejectError_1.SefazRejectError(result.cStat, result.xMotivo, input.uf);
    }
    validate(input) {
        if (!/^\d{14}$/.test(input.cnpj)) {
            throw new NFeError_1.NFeError('CNPJ invalido: deve ter 14 digitos numericos');
        }
        if (!input.justificativa || input.justificativa.length < 15) {
            throw new NFeError_1.NFeError('Justificativa deve ter no minimo 15 caracteres');
        }
        if (input.numeroInicial > input.numeroFinal) {
            throw new NFeError_1.NFeError('Numero inicial deve ser menor ou igual ao numero final');
        }
        if (input.numeroInicial < 1) {
            throw new NFeError_1.NFeError('Numero inicial deve ser maior que zero');
        }
    }
}
exports.InutilizaNFeUseCase = InutilizaNFeUseCase;
