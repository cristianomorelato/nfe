type SoapService = 'NFeAutorizacao4' | 'NFeConsultaProtocolo4';
export declare const SOAP_ACTIONS: Record<SoapService, string>;
/**
 * Monta envelope SOAP para envio sincrono de NFe (NFeAutorizacao4).
 */
export declare function buildAutorizacaoEnvelope(signedNFeXml: string, idLote?: string): string;
/**
 * Monta envelope SOAP para consulta de protocolo (NFeConsultaProtocolo4).
 */
export declare function buildConsultaEnvelope(chaveAcesso: string, tpAmb: '1' | '2'): string;
/**
 * Extrai o conteudo dentro de <soap12:Body> ou <soapenv:Body>.
 */
export declare function extractSoapBody(soapXml: string): string;
export type AutorizacaoResult = {
    readonly cStat: string;
    readonly xMotivo: string;
    readonly nProt?: string;
    readonly dhRecbto?: string;
    readonly chNFe?: string;
    readonly xmlProtocolado?: string;
};
/**
 * Parseia a resposta de NFeAutorizacao4.
 * Extrai campos do <protNFe> dentro de <retEnviNFe>.
 */
export declare function parseAutorizacaoResponse(body: string): AutorizacaoResult;
export type ConsultaResult = {
    readonly cStat: string;
    readonly xMotivo: string;
    readonly nProt?: string;
    readonly dhRecbto?: string;
};
/**
 * Parseia a resposta de NFeConsultaProtocolo4.
 * Extrai campos do <retConsSitNFe>.
 */
export declare function parseConsultaResponse(body: string): ConsultaResult;
export {};
//# sourceMappingURL=soap.d.ts.map