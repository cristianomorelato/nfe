export declare const DISTRIBUICAO_SOAP_ACTION = "http://www.portalfiscal.inf.br/nfe/wsdl/NFeDistribuicaoDFe/nfeDistDFeInteresse";
/**
 * Monta envelope SOAP para consulta por ultimo NSU (distNSU).
 */
export declare function buildDistNSUEnvelope(cnpj: string, cUFAutor: string, tpAmb: '1' | '2', ultNSU: string): string;
/**
 * Monta envelope SOAP para consulta por chave de acesso (consChNFe).
 */
export declare function buildConsChNFeEnvelope(cnpj: string, cUFAutor: string, tpAmb: '1' | '2', chNFe: string): string;
export type DFeDocument = {
    readonly nsu: string;
    readonly schema: string;
    readonly xml: string;
};
export type DistribuicaoResult = {
    readonly cStat: string;
    readonly xMotivo: string;
    readonly ultNSU: string;
    readonly maxNSU: string;
    readonly documentos: readonly DFeDocument[];
};
/**
 * Parseia a resposta do servico NFeDistribuicaoDFe.
 */
export declare function parseDistribuicaoResponse(body: string): DistribuicaoResult;
/**
 * Descompacta um docZip (base64 + GZip) para XML.
 */
export declare function decompressDocZip(base64Content: string): string;
//# sourceMappingURL=distribuicao-soap.d.ts.map