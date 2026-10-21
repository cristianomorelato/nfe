import { CertificateProvider } from '../../contracts/CertificateProvider';
import { SefazTransport } from '../../contracts/SefazTransport';
import { XmlSigner } from '../../contracts/XmlSigner';
import { NFeEnvironment } from '../../core/types';
import { ManifestacaoResult } from '../../infra/sefaz/manifestacao-soap';
export type { ManifestacaoResult } from '../../infra/sefaz/manifestacao-soap';
export type { TipoManifestacao } from '../../infra/sefaz/manifestacao-soap';
type ManifestacaoDeps = {
    readonly certificate: CertificateProvider;
    readonly transport: SefazTransport;
    readonly xmlSigner: XmlSigner;
    readonly environment: NFeEnvironment;
};
type ManifestacaoInput = {
    readonly chaveAcesso: string;
    readonly cnpj: string;
    readonly justificativa?: string;
};
export declare class ManifestacaoUseCase {
    private readonly deps;
    constructor(deps: ManifestacaoDeps);
    confirmar(input: ManifestacaoInput): Promise<ManifestacaoResult>;
    ciencia(input: ManifestacaoInput): Promise<ManifestacaoResult>;
    desconhecer(input: ManifestacaoInput): Promise<ManifestacaoResult>;
    naoRealizada(input: ManifestacaoInput): Promise<ManifestacaoResult>;
    private enviar;
    private validate;
}
//# sourceMappingURL=ManifestacaoUseCase.d.ts.map