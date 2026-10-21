export type { DanfeData } from '../../infra/danfe/xml-parser';
export type GerarDanfeOptions = {
    readonly logo?: Buffer;
    readonly email?: string;
};
export declare class GerarDanfeUseCase {
    private readonly generator;
    constructor();
    /**
     * Gera PDF do DANFE a partir do XML autorizado.
     * Requer pdfkit instalado como dependencia.
     */
    execute(xml: string, options?: GerarDanfeOptions): Promise<Buffer>;
}
//# sourceMappingURL=GerarDanfeUseCase.d.ts.map