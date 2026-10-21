import type { CupomData } from '../../infra/danfe/CupomNFCeGenerator';
export type { CupomData };
export declare class GerarCupomUseCase {
    private readonly generator;
    constructor();
    /**
     * Gera PDF do cupom termico NFC-e a partir do XML autorizado.
     * Requer pdfkit e qrcode instalados.
     */
    execute(xml: string): Promise<Buffer>;
}
//# sourceMappingURL=GerarCupomUseCase.d.ts.map