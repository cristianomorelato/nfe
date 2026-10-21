export declare const MANIFESTACAO_SOAP_ACTION = "http://www.portalfiscal.inf.br/nfe/wsdl/NFeRecepcaoEvento4/nfeRecepcaoEvento";
export type TipoManifestacao = 'confirmacao' | 'ciencia' | 'desconhecimento' | 'naoRealizada';
/**
 * Monta XML de manifestacao do destinatario — SEM envelope SOAP.
 * Precisa ser assinado antes de envolver no SOAP.
 */
export declare function buildManifestacaoXml(tipo: TipoManifestacao, chNFe: string, cnpj: string, cOrgao: string, tpAmb: '1' | '2', dhEvento: string, xJust?: string): string;
/**
 * Envolve XML de manifestacao assinado em envelope SOAP.
 * Usa o RecepcaoEvento4 do Ambiente Nacional.
 */
export declare function wrapManifestacaoSoapEnvelope(signedEventoXml: string): string;
export type ManifestacaoResult = {
    readonly cStat: string;
    readonly xMotivo: string;
    readonly chNFe?: string;
    readonly tpEvento?: string;
    readonly dhRegEvento?: string;
};
/**
 * Parseia resposta de manifestacao do destinatario.
 */
export declare function parseManifestacaoResponse(body: string): ManifestacaoResult;
/**
 * Retorna true se o tipo de manifestacao requer justificativa.
 */
export declare function requiresJustificativa(tipo: TipoManifestacao): boolean;
//# sourceMappingURL=manifestacao-soap.d.ts.map