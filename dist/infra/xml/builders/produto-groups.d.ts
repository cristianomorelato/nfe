import { ProdutoProps } from '../../../domain/entities/Produto';
import { DeclaracaoImportacaoProps, DetalheExportacaoProps, RastroProps, CreditoPresumidoProps, VeiculoNovoProps, MedicamentoProps, ArmamentoProps, CombustivelProps, ImpostoDevolvidoProps, ObservacaoItemProps, DFeReferenciadoProps } from '../../../domain/entities/ProdutoDetalhes';
/**
 * Subgrupos do item (`det/prod`) que so aparecem em operacoes especificas:
 * importacao, exportacao, rastreabilidade e os produtos com regra propria.
 */
/**
 * NVE — Nomenclatura de Valor Aduaneiro e Estatistica (ate 8 por item).
 */
export declare function buildNve(nve?: readonly string[]): string;
/**
 * CEST + indicador de escala + CNPJ do fabricante. Sequencia opcional: o CEST
 * abre o grupo, os outros dois so existem junto dele.
 */
export declare function buildCest(prod: ProdutoProps): string;
/**
 * Creditos presumidos do item (grupo `gCred`, ate 4).
 *
 * O `cCredPresumido` tem tamanho fixo de 8 ou 10 caracteres na tabela oficial.
 */
export declare function buildCreditosPresumidos(creditos?: readonly CreditoPresumidoProps[]): string;
/**
 * Declaracoes de importacao com suas adicoes (grupo `DI`).
 */
export declare function buildDeclaracoesImportacao(dis?: readonly DeclaracaoImportacaoProps[]): string;
/**
 * Detalhes de exportacao do item (grupo `detExport`).
 */
export declare function buildDetalhesExportacao(detalhes?: readonly DetalheExportacaoProps[]): string;
/**
 * Rastreabilidade por lote (grupo `rastro`).
 */
export declare function buildRastros(rastros?: readonly RastroProps[]): string;
/**
 * Veiculo novo (grupo `veicProd`).
 */
export declare function buildVeiculoNovo(veiculo?: VeiculoNovoProps): string;
/**
 * Medicamento (grupo `med`).
 */
export declare function buildMedicamento(med?: MedicamentoProps): string;
/**
 * Armamentos do item (grupo `arma`, ate 500).
 */
export declare function buildArmamentos(armas?: readonly ArmamentoProps[]): string;
/**
 * Combustivel (grupo `comb`), com CIDE, encerrante e origem do biocombustivel.
 */
export declare function buildCombustivel(comb?: CombustivelProps): string;
/**
 * Grupo exclusivo do item: veiculo, medicamento, arma, combustivel ou RECOPI.
 * O leiaute permite apenas um deles.
 */
export declare function buildProdutoEspecifico(prod: ProdutoProps): string;
/**
 * Devolucao de imposto no item (grupo `impostoDevol`).
 */
export declare function buildImpostoDevolvido(devolucao?: ImpostoDevolvidoProps): string;
/**
 * Observacoes do item (grupo `obsItem`): ate uma do contribuinte e uma do fisco.
 */
export declare function buildObservacaoItem(obs?: ObservacaoItemProps): string;
/**
 * DFe referenciado pelo item (grupo `DFeReferenciado`).
 */
export declare function buildDFeReferenciado(dfe?: DFeReferenciadoProps): string;
//# sourceMappingURL=produto-groups.d.ts.map