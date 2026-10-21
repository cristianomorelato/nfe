/**
 * Code128C encoding para chave de acesso da NFe (44 digitos numericos).
 * Code128C codifica pares de digitos — ideal para strings numericas.
 * Retorna array de larguras de barras (1 = barra fina, etc).
 */
export type BarcodeBar = {
    readonly x: number;
    readonly width: number;
    readonly isBar: boolean;
};
/**
 * Codifica uma string numerica (deve ter comprimento par) em Code128C.
 * Retorna array de barras com posicao x e largura.
 */
export declare function encodeCode128C(digits: string): readonly BarcodeBar[];
/**
 * Retorna a largura total do barcode em unidades.
 */
export declare function getBarcodeWidth(bars: readonly BarcodeBar[]): number;
//# sourceMappingURL=barcode128.d.ts.map