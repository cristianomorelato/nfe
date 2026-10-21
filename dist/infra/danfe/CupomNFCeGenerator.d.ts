import { DanfeData } from './xml-parser';
export type CupomData = DanfeData & {
    readonly qrCodeUrl?: string;
    readonly urlChave?: string;
};
/**
 * Extrai dados do infNFeSupl do XML (qrCode e urlChave).
 */
export declare function extractInfNFeSupl(xml: string): {
    qrCodeUrl?: string;
    urlChave?: string;
};
export declare class CupomNFCeGenerator {
    generate(data: CupomData): Promise<Buffer>;
    private render;
    private header;
    private separator;
    private produtos;
    private totais;
    private pagamento;
    private infoFiscal;
    private qrCode;
    private rodape;
    private lineKeyValue;
    private estimateHeight;
    private fmtDoc;
    private fmtNum;
    private trunc;
}
//# sourceMappingURL=CupomNFCeGenerator.d.ts.map