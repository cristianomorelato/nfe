import { CertificateProvider } from '../../contracts/CertificateProvider';
import { SefazTransport } from '../../contracts/SefazTransport';
import { NFeEnvironment } from '../../core/types';
import { DistribuicaoResult } from '../../infra/sefaz/distribuicao-soap';
export type { DistribuicaoResult } from '../../infra/sefaz/distribuicao-soap';
export type { DFeDocument } from '../../infra/sefaz/distribuicao-soap';
type DistribuicaoDeps = {
    readonly certificate: CertificateProvider;
    readonly transport: SefazTransport;
    readonly environment: NFeEnvironment;
};
export declare class DistribuicaoDFeUseCase {
    private readonly deps;
    constructor(deps: DistribuicaoDeps);
    /**
     * Consulta documentos fiscais a partir de um NSU.
     * Retorna ate 50 documentos por chamada. Use ultNSU do resultado para paginar.
     */
    consultarPorNSU(cnpj: string, uf: string, ultNSU?: string): Promise<DistribuicaoResult>;
    /**
     * Consulta um documento fiscal especifico pela chave de acesso.
     */
    consultarPorChave(cnpj: string, uf: string, chaveAcesso: string): Promise<DistribuicaoResult>;
    private send;
    private validateCnpj;
    private validateChave;
    private getUfCode;
}
//# sourceMappingURL=DistribuicaoDFeUseCase.d.ts.map