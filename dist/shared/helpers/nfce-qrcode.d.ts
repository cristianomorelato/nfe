export type NFCeQRCodeParams = {
    readonly urlQRCode: string;
    readonly chNFe: string;
    readonly tpAmb: '1' | '2';
    readonly cDest: string;
    readonly cIdToken: string;
    readonly csc: string;
    /** Campos obrigatorios apenas para contingencia offline (tpEmis=9) */
    readonly dhEmi?: string;
    readonly vNF?: string;
    readonly vICMS?: string;
    readonly digVal?: string;
    readonly tpEmis?: number;
};
/**
 * Gera a URL do QR Code v2 da NFC-e.
 *
 * Online (tpEmis != 9):
 *   ?p={chNFe}|2|{tpAmb}|{cDest}|{cHashQRCode}
 *   cHashQRCode = SHA1({chNFe}|2|{tpAmb}|{cIdToken}{CSC})
 *
 * Offline (tpEmis = 9):
 *   ?p={chNFe}|2|{tpAmb}|{dhEmi_hex}|{vNF}|{digVal_hex}|{cIdToken}|{cHashQRCode}
 *   cHashQRCode = SHA1({chNFe}|2|{tpAmb}|{dhEmi_hex}|{vNF}|{digVal_hex}|{cIdToken}{CSC})
 */
export declare function buildNFCeQRCodeUrl(params: NFCeQRCodeParams): string;
/**
 * Monta o bloco <infNFeSupl> com qrCode e urlChave.
 * Inserido apos </infNFe> e antes de <Signature>.
 */
export declare function buildInfNFeSupl(qrCodeUrl: string, urlChave: string): string;
//# sourceMappingURL=nfce-qrcode.d.ts.map