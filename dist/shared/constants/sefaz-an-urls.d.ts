export type AnService = 'NFeDistribuicaoDFe' | 'RecepcaoEvento';
export type AnEnvironment = 'homologacao' | 'producao';
/**
 * Retorna a URL do servico nacional (AN) para o ambiente informado.
 */
export declare function getAnUrl(environment: AnEnvironment, service: AnService): string;
//# sourceMappingURL=sefaz-an-urls.d.ts.map