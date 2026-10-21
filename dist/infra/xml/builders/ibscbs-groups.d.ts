import { ProdutoProps } from '../../../domain/entities/Produto';
/**
 * Grupo `IBSCBS` do item.
 */
export declare function buildIBSCBS(prod: ProdutoProps): string;
/**
 * Numeros de IBS/CBS de um item, para compor o `IBSCBSTot` da nota.
 */
export type TotaisIbsCbsItem = {
    base: number;
    ibsUf: number;
    ibsMun: number;
    cbs: number;
    difUf: number;
    difMun: number;
    difCbs: number;
    devUf: number;
    devMun: number;
    devCbs: number;
    credPresIbs: number;
    credPresCondSusIbs: number;
    credPresCbs: number;
    credPresCondSusCbs: number;
    estornoIbs: number;
    estornoCbs: number;
    monoIbs: number;
    monoCbs: number;
    monoIbsReten: number;
    monoCbsReten: number;
    monoIbsRet: number;
    monoCbsRet: number;
    temMono: boolean;
    /** O grupo gIBS/gCBS do total so existe quando o item usa o gIBSCBS. */
    temTributacao: boolean;
};
export declare function totaisIbsCbsDoItem(prod: ProdutoProps): TotaisIbsCbsItem | null;
//# sourceMappingURL=ibscbs-groups.d.ts.map