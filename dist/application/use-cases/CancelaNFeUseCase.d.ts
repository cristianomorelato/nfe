import { CertificateProvider } from '../../contracts/CertificateProvider';
import { SefazTransport } from '../../contracts/SefazTransport';
import { XmlSigner } from '../../contracts/XmlSigner';
import { NFeEnvironment } from '../../core/types';
import { EventoResult } from '../../infra/sefaz/evento-soap';
export type { EventoResult } from '../../infra/sefaz/evento-soap';
type CancelaNFeDeps = {
    readonly certificate: CertificateProvider;
    readonly transport: SefazTransport;
    readonly xmlSigner: XmlSigner;
    readonly environment: NFeEnvironment;
};
type CancelaInput = {
    readonly chaveAcesso: string;
    readonly cnpj: string;
    readonly protocolo: string;
    readonly justificativa: string;
};
export declare class CancelaNFeUseCase {
    private readonly deps;
    constructor(deps: CancelaNFeDeps);
    execute(input: CancelaInput): Promise<EventoResult>;
    private validate;
}
//# sourceMappingURL=CancelaNFeUseCase.d.ts.map