import { CertificateProvider } from '../../contracts/CertificateProvider';
import { SefazTransport } from '../../contracts/SefazTransport';
import { XmlSigner } from '../../contracts/XmlSigner';
import { NFeEnvironment } from '../../core/types';
import { EventoResult } from '../../infra/sefaz/evento-soap';
export type { EventoResult } from '../../infra/sefaz/evento-soap';
type CartaCorrecaoDeps = {
    readonly certificate: CertificateProvider;
    readonly transport: SefazTransport;
    readonly xmlSigner: XmlSigner;
    readonly environment: NFeEnvironment;
};
type CartaCorrecaoInput = {
    readonly chaveAcesso: string;
    readonly cnpj: string;
    readonly correcao: string;
    readonly sequencia?: number;
};
export declare class CartaCorrecaoUseCase {
    private readonly deps;
    constructor(deps: CartaCorrecaoDeps);
    execute(input: CartaCorrecaoInput): Promise<EventoResult>;
    private validate;
}
//# sourceMappingURL=CartaCorrecaoUseCase.d.ts.map