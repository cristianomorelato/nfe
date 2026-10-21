export type SefazService = 'NFeAutorizacao' | 'NFeRetAutorizacao' | 'NFeConsultaProtocolo' | 'NFeStatusServico' | 'RecepcaoEvento' | 'NFeInutilizacao' | 'NFCeAutorizacao' | 'NFCeConsultaProtocolo';
export type SefazEnvironment = 'homologacao' | 'producao';
export type Autorizador = 'AM' | 'BA' | 'GO' | 'MG' | 'MS' | 'MT' | 'PE' | 'PR' | 'RS' | 'SP' | 'SVAN' | 'SVRS' | 'SVC-AN' | 'SVC-RS';
type ServiceUrls = {
    readonly [service in SefazService]: string;
} & {
    /**
     * Endpoint de RecepcaoEvento (cancelamento etc.) da NFC-e (mod65).
     * So' precisa ser preenchido nos autorizadores que hospedam a NFC-e em host
     * proprio (diferente do de NF-e). Quando ausente, cai no `RecepcaoEvento` (mod55).
     */
    readonly NFCeRecepcaoEvento?: string;
};
type AutorizadorUrls = {
    readonly [env in SefazEnvironment]: ServiceUrls;
};
/**
 * Mapeamento de UF para seu autorizador NF-e (mod55).
 * Fonte: Portal Nacional da NFe + nfephp-org/sped-nfe
 */
export declare const UF_AUTORIZADOR: Record<string, Autorizador>;
/**
 * Mapeamento de UF para seu autorizador NFC-e (mod65).
 * Fonte: https://github.com/nfephp-org/sped-nfe/blob/master/storage/autorizadores.json key "65"
 */
export declare const UF_AUTORIZADOR_NFCE: Record<string, string>;
/**
 * URLs dos webservices por autorizador e ambiente.
 * Fonte NF-e: https://github.com/nfephp-org/sped-nfe/blob/master/storage/wsnfe_4.00_mod55.xml
 * Fonte NFC-e: https://github.com/nfephp-org/sped-nfe/blob/master/storage/wsnfe_4.00_mod65.xml
 */
export declare const AUTORIZADOR_URLS: Record<Autorizador, AutorizadorUrls>;
/**
 * Retorna a URL do webservice da SEFAZ para a UF, ambiente e servico informados.
 */
export declare function getSefazUrl(uf: string, environment: SefazEnvironment, service: SefazService): string;
/**
 * Retorna a URL do webservice de RecepcaoEvento (cancelamento, CCe, manifestacao)
 * para a UF/ambiente, escolhendo o endpoint correto conforme o modelo do documento.
 *
 * NFC-e (mod65) em autorizador com host proprio (ex.: MT, SP, MG, PR, RS, MS, AM)
 * precisa ir para o webservice de NFC-e — enviar no endpoint de NF-e (mod55) gera
 * rejeicao 450 "Modelo da NF-e diferente de 55". Quando o autorizador nao tem host
 * proprio de NFC-e (compartilha com a NF-e), cai no `RecepcaoEvento`.
 */
export declare function getEventoUrl(uf: string, environment: SefazEnvironment, modelo: string): string;
/**
 * Converte codigo IBGE (2 digitos) para sigla da UF.
 */
export declare function ibgeToUf(codigoIbge: string): string;
export {};
//# sourceMappingURL=sefaz-urls.d.ts.map