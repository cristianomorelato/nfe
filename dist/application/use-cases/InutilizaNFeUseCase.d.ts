import { CertificateProvider } from '../../contracts/CertificateProvider';
import { SefazTransport } from '../../contracts/SefazTransport';
import { XmlSigner } from '../../contracts/XmlSigner';
import { NFeEnvironment } from '../../core/types';
import { InutilizacaoResult } from '../../infra/sefaz/evento-soap';
export type { InutilizacaoResult } from '../../infra/sefaz/evento-soap';
type InutilizaDeps = {
    readonly certificate: CertificateProvider;
    readonly transport: SefazTransport;
    readonly xmlSigner: XmlSigner;
    readonly environment: NFeEnvironment;
};
type InutilizaInput = {
    readonly cnpj: string;
    readonly uf: string;
    readonly ano: number;
    readonly serie: number;
    readonly numeroInicial: number;
    readonly numeroFinal: number;
    readonly justificativa: string;
};
export declare class InutilizaNFeUseCase {
    private readonly deps;
    constructor(deps: InutilizaDeps);
    execute(input: InutilizaInput): Promise<InutilizacaoResult>;
    private validate;
}
//# sourceMappingURL=InutilizaNFeUseCase.d.ts.map