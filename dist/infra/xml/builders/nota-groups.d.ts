import { LocalProps, AvulsaProps, IntermediadorProps, ExportacaoProps, CompraProps } from '../../../domain/entities/Local';
import { ObservacaoProps, ProcessoReferenciadoProps, CanaProps, AgropecuarioProps } from '../../../domain/entities/InformacoesAdicionais';
import { TransporteProps } from '../../../domain/entities/Transporte';
/**
 * Grupos de nivel de nota do leiaute 4.00 — os que ficam soltos dentro do
 * `infNFe`, fora de `det` e `imposto`.
 */
/**
 * Emissao avulsa pelo fisco (grupo `avulsa`).
 */
export declare function buildAvulsa(avulsa?: AvulsaProps): string;
/**
 * Local de retirada ou de entrega (tipo TLocal).
 */
export declare function buildLocal(tagName: 'retirada' | 'entrega', local?: LocalProps): string;
/**
 * Intermediador da operacao (grupo `infIntermed`).
 */
export declare function buildIntermediador(intermediador?: IntermediadorProps): string;
/**
 * Comercio exterior (grupo `exporta`).
 */
export declare function buildExportacao(exportacao?: ExportacaoProps): string;
/**
 * Compra publica (grupo `compra`).
 */
export declare function buildCompra(compra?: CompraProps): string;
/**
 * Aquisicao de cana-de-acucar (grupo `cana`).
 */
export declare function buildCana(cana?: CanaProps): string;
/**
 * Rastreabilidade agropecuaria (grupo `agropecuario`): defensivos OU guia de
 * transito, nunca os dois.
 */
export declare function buildAgropecuario(agro?: AgropecuarioProps): string;
/**
 * Observacoes de uso livre (`obsCont` do contribuinte, `obsFisco` do fisco).
 */
export declare function buildObservacoes(tagName: 'obsCont' | 'obsFisco', observacoes?: readonly ObservacaoProps[]): string;
/**
 * Processos ou atos concessorios referenciados (grupo `procRef`).
 */
export declare function buildProcessosReferenciados(processos?: readonly ProcessoReferenciadoProps[]): string;
/**
 * Bloco `infAdic` completo: textos livres, observacoes e processos referenciados.
 */
export declare function buildInformacoesAdicionais(params: {
    readonly complementar?: string;
    readonly fisco?: string;
    readonly observacoesContribuinte?: readonly ObservacaoProps[];
    readonly observacoesFisco?: readonly ObservacaoProps[];
    readonly processosReferenciados?: readonly ProcessoReferenciadoProps[];
}): string;
/**
 * Bloco `transp` completo: transportadora, retencao de ICMS sobre o frete,
 * modal (veiculo + reboques, vagao ou balsa) e volumes com lacres.
 */
export declare function buildTransporte(transp: TransporteProps): string;
//# sourceMappingURL=nota-groups.d.ts.map