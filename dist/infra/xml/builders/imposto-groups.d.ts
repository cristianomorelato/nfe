import { ProdutoProps } from '../../../domain/entities/Produto';
/**
 * Grupo `ICMS` do item, por CST (regime normal) ou CSOSN (Simples Nacional).
 */
export declare function buildICMS(prod: ProdutoProps): string;
/**
 * IPI do item. Aceita tributacao por percentual (vBC + pIPI) ou por unidade
 * (qUnid + vUnid) — o XSD so permite um dos dois.
 */
export declare function buildIPI(prod: ProdutoProps): string;
/**
 * Imposto de Importacao do item (grupo `II`).
 */
export declare function buildII(prod: ProdutoProps): string;
/**
 * ISSQN do item, para nota mista de mercadoria e servico.
 */
export declare function buildISSQN(prod: ProdutoProps): string;
export declare function buildPIS(prod: ProdutoProps): string;
export declare function buildCOFINS(prod: ProdutoProps): string;
export declare function buildPISST(prod: ProdutoProps): string;
export declare function buildCOFINSST(prod: ProdutoProps): string;
/**
 * Partilha do ICMS com a UF de destino (EC 87/2015).
 */
export declare function buildICMSUFDest(prod: ProdutoProps): string;
/**
 * Imposto Seletivo do item (grupo `IS`, NT 2025.002).
 */
export declare function buildIS(prod: ProdutoProps): string;
/**
 * Bloco `imposto` do item.
 *
 * O leiaute traz uma escolha entre dois caminhos, e a ordem muda em cada um:
 * mercadoria e `ICMS, IPI?, II?`; servico e `IPI?, ISSQN`. Depois vem, em
 * sequencia, PIS, PISST, COFINS, COFINSST, ICMSUFDest, IS e IBSCBS.
 */
export declare function buildImpostos(prod: ProdutoProps): string;
//# sourceMappingURL=imposto-groups.d.ts.map