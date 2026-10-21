import { XmlBuilder } from '../../contracts/XmlBuilder';
import { XmlSigner } from '../../contracts/XmlSigner';
import { CertificateProvider } from '../../contracts/CertificateProvider';
import { SefazTransport } from '../../contracts/SefazTransport';
import { NFeProps } from '../../domain/entities/NFe';
import { TransmitResult, NFeEnvironment } from '../../core/types';
type TransmitDeps = {
    readonly xmlBuilder: XmlBuilder;
    readonly xmlSigner: XmlSigner;
    readonly certificate: CertificateProvider;
    readonly transport: SefazTransport;
    readonly environment: NFeEnvironment;
    readonly uf: string;
    readonly cIdToken?: string;
    readonly csc?: string;
};
export declare class TransmitNFeUseCase {
    private readonly deps;
    constructor(deps: TransmitDeps);
    execute(nfe: NFeProps): Promise<TransmitResult>;
    private buildNfeProc;
    private insertInfNFeSuplBeforeSend;
}
export {};
//# sourceMappingURL=TransmitNFeUseCase.d.ts.map