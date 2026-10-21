export declare const EVENTO_SOAP_ACTION = "http://www.portalfiscal.inf.br/nfe/wsdl/NFeRecepcaoEvento4/nfeRecepcaoEvento";
export declare const INUTILIZACAO_SOAP_ACTION = "http://www.portalfiscal.inf.br/nfe/wsdl/NFeInutilizacao4/nfeInutilizacaoNF";
/**
 * Monta XML de evento de cancelamento (110111) — SEM envelope SOAP.
 * Precisa ser assinado antes de envolver no SOAP.
 */
export declare function buildCancelamentoXml(chNFe: string, cnpj: string, cOrgao: string, tpAmb: '1' | '2', nProt: string, xJust: string, dhEvento: string): string;
/**
 * Monta XML de Carta de Correcao (110110) — SEM envelope SOAP.
 * Precisa ser assinado antes de envolver no SOAP.
 */
export declare function buildCartaCorrecaoXml(chNFe: string, cnpj: string, cOrgao: string, tpAmb: '1' | '2', xCorrecao: string, nSeqEvento: number, dhEvento: string): string;
/**
 * Monta XML de inutilizacao — SEM envelope SOAP.
 * Precisa ser assinado antes de envolver no SOAP.
 */
export declare function buildInutilizacaoXml(cnpj: string, cUF: string, tpAmb: '1' | '2', ano: string, serie: string, nNFIni: string, nNFFin: string, xJust: string): string;
/**
 * Envolve XML de evento assinado em envelope SOAP para RecepcaoEvento4.
 */
export declare function wrapEventoSoapEnvelope(signedEventoXml: string): string;
/**
 * Envolve XML de inutilizacao assinado em envelope SOAP para NFeInutilizacao4.
 */
export declare function wrapInutilizacaoSoapEnvelope(signedInutXml: string): string;
export type EventoResult = {
    readonly cStat: string;
    readonly xMotivo: string;
    readonly nProt?: string;
    readonly chNFe?: string;
    readonly tpEvento?: string;
    readonly dhRegEvento?: string;
};
export type InutilizacaoResult = {
    readonly cStat: string;
    readonly xMotivo: string;
    readonly nProt?: string;
    readonly dhRecbto?: string;
};
/**
 * Parseia resposta de RecepcaoEvento4.
 */
export declare function parseEventoResponse(body: string): EventoResult;
/**
 * Parseia resposta de NFeInutilizacao4.
 */
export declare function parseInutilizacaoResponse(body: string): InutilizacaoResult;
//# sourceMappingURL=evento-soap.d.ts.map