"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DistribuicaoDFeUseCase = void 0;
const NFeError_1 = require("../../shared/errors/NFeError");
const SefazRejectError_1 = require("../../shared/errors/SefazRejectError");
const ibge_codes_1 = require("../../shared/constants/ibge-codes");
const sefaz_an_urls_1 = require("../../shared/constants/sefaz-an-urls");
const soap_1 = require("../../infra/sefaz/soap");
const distribuicao_soap_1 = require("../../infra/sefaz/distribuicao-soap");
function toAnEnv(env) {
    return env === 'homologation' ? 'homologacao' : 'producao';
}
function toTpAmb(env) {
    return env === 'production' ? '1' : '2';
}
class DistribuicaoDFeUseCase {
    deps;
    constructor(deps) {
        this.deps = deps;
    }
    /**
     * Consulta documentos fiscais a partir de um NSU.
     * Retorna ate 50 documentos por chamada. Use ultNSU do resultado para paginar.
     */
    async consultarPorNSU(cnpj, uf, ultNSU = '0') {
        this.validateCnpj(cnpj);
        const cUFAutor = this.getUfCode(uf);
        const anEnv = toAnEnv(this.deps.environment);
        const tpAmb = toTpAmb(this.deps.environment);
        const url = (0, sefaz_an_urls_1.getAnUrl)(anEnv, 'NFeDistribuicaoDFe');
        const envelope = (0, distribuicao_soap_1.buildDistNSUEnvelope)(cnpj, cUFAutor, tpAmb, ultNSU);
        return this.send(url, envelope, uf);
    }
    /**
     * Consulta um documento fiscal especifico pela chave de acesso.
     */
    async consultarPorChave(cnpj, uf, chaveAcesso) {
        this.validateCnpj(cnpj);
        this.validateChave(chaveAcesso);
        const cUFAutor = this.getUfCode(uf);
        const anEnv = toAnEnv(this.deps.environment);
        const tpAmb = toTpAmb(this.deps.environment);
        const url = (0, sefaz_an_urls_1.getAnUrl)(anEnv, 'NFeDistribuicaoDFe');
        const envelope = (0, distribuicao_soap_1.buildConsChNFeEnvelope)(cnpj, cUFAutor, tpAmb, chaveAcesso);
        return this.send(url, envelope, uf);
    }
    async send(url, envelope, uf) {
        const cert = await this.deps.certificate.load();
        const response = await this.deps.transport.send({
            url,
            soapAction: distribuicao_soap_1.DISTRIBUICAO_SOAP_ACTION,
            xml: envelope,
            pfx: cert.pfx,
            password: cert.password
        });
        const body = (0, soap_1.extractSoapBody)(response.xml);
        const result = (0, distribuicao_soap_1.parseDistribuicaoResponse)(body);
        // 137 = nenhum documento, 138 = documentos localizados
        if (result.cStat === '137' || result.cStat === '138') {
            return result;
        }
        throw new SefazRejectError_1.SefazRejectError(result.cStat, result.xMotivo, uf);
    }
    validateCnpj(cnpj) {
        if (!/^\d{14}$/.test(cnpj)) {
            throw new NFeError_1.NFeError(`CNPJ invalido: deve ter 14 digitos numericos, recebeu "${cnpj}"`);
        }
    }
    validateChave(chave) {
        if (!/^\d{44}$/.test(chave)) {
            throw new NFeError_1.NFeError(`Chave de acesso invalida: deve ter 44 digitos numericos, recebeu "${chave}"`);
        }
    }
    getUfCode(uf) {
        const code = ibge_codes_1.UF_CODES[uf];
        if (!code) {
            throw new NFeError_1.NFeError(`UF desconhecida: ${uf}`);
        }
        return code;
    }
}
exports.DistribuicaoDFeUseCase = DistribuicaoDFeUseCase;
