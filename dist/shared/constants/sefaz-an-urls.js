"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnUrl = getAnUrl;
const NFeError_1 = require("../../shared/errors/NFeError");
/**
 * URLs do Ambiente Nacional (AN) para servicos nacionais da NFe.
 * Esses servicos nao seguem o modelo UF → Autorizador — sao centralizados.
 * Fonte: https://github.com/nfephp-org/sped-nfe/blob/master/storage/wsnfe_4.00_mod55.xml
 */
const AN_URLS = {
    homologacao: {
        NFeDistribuicaoDFe: 'https://hom1.nfe.fazenda.gov.br/NFeDistribuicaoDFe/NFeDistribuicaoDFe.asmx',
        RecepcaoEvento: 'https://hom1.nfe.fazenda.gov.br/NFeRecepcaoEvento4/NFeRecepcaoEvento4.asmx'
    },
    producao: {
        NFeDistribuicaoDFe: 'https://www1.nfe.fazenda.gov.br/NFeDistribuicaoDFe/NFeDistribuicaoDFe.asmx',
        RecepcaoEvento: 'https://www.nfe.fazenda.gov.br/NFeRecepcaoEvento4/NFeRecepcaoEvento4.asmx'
    }
};
/**
 * Retorna a URL do servico nacional (AN) para o ambiente informado.
 */
function getAnUrl(environment, service) {
    const url = AN_URLS[environment][service];
    if (!url) {
        throw new NFeError_1.NFeError(`Servico ${service} nao configurado para ambiente ${environment}`);
    }
    return url;
}
