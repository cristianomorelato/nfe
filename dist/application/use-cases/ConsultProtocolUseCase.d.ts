import { CertificateProvider } from '../../contracts/CertificateProvider';
import { SefazTransport } from '../../contracts/SefazTransport';
import { ConsultResult, NFeEnvironment } from '../../core/types';
type ConsultDeps = {
    readonly certificate: CertificateProvider;
    readonly transport: SefazTransport;
    readonly environment: NFeEnvironment;
};
export declare class ConsultProtocolUseCase {
    private readonly deps;
    constructor(deps: ConsultDeps);
    execute(chaveAcesso: string): Promise<ConsultResult>;
    private validateChave;
}
export {};
//# sourceMappingURL=ConsultProtocolUseCase.d.ts.map