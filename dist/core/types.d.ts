import { CertificateProvider } from '../contracts/CertificateProvider';
import { SefazTransport } from '../contracts/SefazTransport';
import { XmlBuilder } from '../contracts/XmlBuilder';
import { XmlSigner } from '../contracts/XmlSigner';
import { SchemaValidator } from '../contracts/SchemaValidator';
export type NFeEnvironment = 'homologation' | 'production';
export type NFeConfig = {
    readonly certificate: CertificateProvider;
    readonly transport: SefazTransport;
    readonly environment: NFeEnvironment;
    readonly xmlBuilder?: XmlBuilder;
    readonly xmlSigner?: XmlSigner;
    readonly schemaValidator?: SchemaValidator;
};
export type TransmitResult = {
    readonly autorizada: boolean;
    readonly protocolo?: string;
    readonly chaveAcesso: string;
    readonly codigoStatus: string;
    readonly motivo: string;
    readonly xmlProtocolado?: string;
    readonly dataAutorizacao?: Date;
};
export type ConsultResult = {
    readonly codigoStatus: string;
    readonly motivo: string;
    readonly protocolo?: string;
    readonly dataAutorizacao?: Date;
};
//# sourceMappingURL=types.d.ts.map