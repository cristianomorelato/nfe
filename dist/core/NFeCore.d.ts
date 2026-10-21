import { CertificateProvider, CertificateInfo } from '../contracts/CertificateProvider';
import { XmlBuilder } from '../contracts/XmlBuilder';
import { XmlSigner } from '../contracts/XmlSigner';
import { SefazTransport } from '../contracts/SefazTransport';
import { GerarDanfeOptions } from '../application/use-cases/GerarDanfeUseCase';
import { TransmitResult, ConsultResult } from '../core/types';
import { NFeProps } from '../domain/entities/NFe';
import type { EventoResult } from '../application/use-cases/CancelaNFeUseCase';
import type { InutilizacaoResult } from '../application/use-cases/InutilizaNFeUseCase';
import type { DistribuicaoResult } from '../application/use-cases/DistribuicaoDFeUseCase';
import type { ManifestacaoResult } from '../application/use-cases/ManifestacaoUseCase';
export type NFeAmbiente = 'homologacao' | 'producao';
export type NFeCoreConfig = {
    readonly pfx: Buffer;
    readonly senha: string;
    readonly ambiente: NFeAmbiente;
    readonly uf: string;
    readonly xmlBuilder?: XmlBuilder;
    readonly xmlSigner?: XmlSigner;
    readonly transport?: SefazTransport;
    readonly certificate?: CertificateProvider;
    readonly cIdToken?: string;
    readonly csc?: string;
};
export type CancelaInput = {
    readonly chaveAcesso: string;
    readonly cnpj: string;
    readonly protocolo: string;
    readonly justificativa: string;
};
export type CartaCorrecaoInput = {
    readonly chaveAcesso: string;
    readonly cnpj: string;
    readonly correcao: string;
    readonly sequencia?: number;
};
export type InutilizaInput = {
    readonly cnpj: string;
    readonly uf?: string;
    readonly ano: number;
    readonly serie: number;
    readonly numeroInicial: number;
    readonly numeroFinal: number;
    readonly justificativa: string;
};
export type ManifestacaoInput = {
    readonly chaveAcesso: string;
    readonly cnpj: string;
    readonly justificativa?: string;
};
type Manifestar = {
    confirmar(input: ManifestacaoInput): Promise<ManifestacaoResult>;
    ciencia(input: ManifestacaoInput): Promise<ManifestacaoResult>;
    desconhecer(input: ManifestacaoInput): Promise<ManifestacaoResult>;
    naoRealizada(input: ManifestacaoInput): Promise<ManifestacaoResult>;
};
export declare class NFeCore {
    private readonly certificate;
    private readonly xmlBuilder;
    private readonly xmlSigner;
    private readonly transport;
    private readonly environment;
    private readonly uf;
    private readonly cIdToken?;
    private readonly csc?;
    readonly manifestar: Manifestar;
    private constructor();
    static create(config: NFeCoreConfig): NFeCore;
    /**
     * Dados do certificado configurado: titular, CNPJ/CPF, emissor, validade e
     * quantos dias faltam para vencer.
     */
    certificado(): Promise<CertificateInfo>;
    transmitir(nfe: NFeProps): Promise<TransmitResult>;
    consultarProtocolo(chaveAcesso: string): Promise<ConsultResult>;
    cancelar(input: CancelaInput): Promise<EventoResult>;
    cartaCorrecao(input: CartaCorrecaoInput): Promise<EventoResult>;
    inutilizar(input: InutilizaInput): Promise<InutilizacaoResult>;
    distribuicaoPorNSU(cnpj: string, ultNSU?: string): Promise<DistribuicaoResult>;
    distribuicaoPorChave(cnpj: string, chaveAcesso: string): Promise<DistribuicaoResult>;
    danfe(xmlAutorizado: string, options?: GerarDanfeOptions): Promise<Buffer>;
}
export {};
//# sourceMappingURL=NFeCore.d.ts.map