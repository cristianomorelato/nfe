"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NFeCore = void 0;
const A1CertificateProvider_1 = require("../infra/certificate/A1CertificateProvider");
const DefaultXmlBuilder_1 = require("../infra/xml/DefaultXmlBuilder");
const DefaultXmlSigner_1 = require("../infra/xml/DefaultXmlSigner");
const NodeHttpSefazTransport_1 = require("../infra/sefaz/NodeHttpSefazTransport");
const core_1 = require("@brasil-fiscal/core");
const TransmitNFeUseCase_1 = require("../application/use-cases/TransmitNFeUseCase");
const ConsultProtocolUseCase_1 = require("../application/use-cases/ConsultProtocolUseCase");
const CancelaNFeUseCase_1 = require("../application/use-cases/CancelaNFeUseCase");
const CartaCorrecaoUseCase_1 = require("../application/use-cases/CartaCorrecaoUseCase");
const InutilizaNFeUseCase_1 = require("../application/use-cases/InutilizaNFeUseCase");
const DistribuicaoDFeUseCase_1 = require("../application/use-cases/DistribuicaoDFeUseCase");
const ManifestacaoUseCase_1 = require("../application/use-cases/ManifestacaoUseCase");
const GerarDanfeUseCase_1 = require("../application/use-cases/GerarDanfeUseCase");
const NFeError_1 = require("../shared/errors/NFeError");
function toEnvironment(ambiente) {
    return ambiente === 'homologacao' ? 'homologation' : 'production';
}
class NFeCore {
    certificate;
    xmlBuilder;
    xmlSigner;
    transport;
    environment;
    uf;
    cIdToken;
    csc;
    manifestar;
    constructor(config) {
        this.certificate = config.certificate ?? new A1CertificateProvider_1.A1CertificateProvider(config.pfx, config.senha);
        this.xmlBuilder = config.xmlBuilder ?? new DefaultXmlBuilder_1.DefaultXmlBuilder();
        this.xmlSigner = config.xmlSigner ?? new DefaultXmlSigner_1.DefaultXmlSigner();
        this.transport = config.transport ?? new NodeHttpSefazTransport_1.NodeHttpSefazTransport();
        this.environment = toEnvironment(config.ambiente);
        this.uf = config.uf;
        this.cIdToken = config.cIdToken;
        this.csc = config.csc;
        const manifestacaoUseCase = new ManifestacaoUseCase_1.ManifestacaoUseCase({
            certificate: this.certificate,
            transport: this.transport,
            xmlSigner: this.xmlSigner,
            environment: this.environment
        });
        this.manifestar = {
            confirmar: (input) => manifestacaoUseCase.confirmar(input),
            ciencia: (input) => manifestacaoUseCase.ciencia(input),
            desconhecer: (input) => manifestacaoUseCase.desconhecer(input),
            naoRealizada: (input) => manifestacaoUseCase.naoRealizada(input)
        };
    }
    static create(config) {
        return new NFeCore(config);
    }
    /**
     * Dados do certificado configurado: titular, CNPJ/CPF, emissor, validade e
     * quantos dias faltam para vencer.
     */
    async certificado() {
        const cert = await this.certificate.load();
        return cert.info ?? (0, core_1.parseCertificateInfo)(cert.certPem);
    }
    async transmitir(nfe) {
        const ambiente = (nfe.identificacao?.ambiente ?? (this.environment === 'production' ? 1 : 2));
        const modelo = nfe.identificacao.modelo ?? '55';
        if (modelo === '65' && (!this.cIdToken || !this.csc)) {
            throw new NFeError_1.NFeError('cIdToken e csc sao obrigatorios para NFC-e (modelo 65)');
        }
        const nfeComAmbiente = {
            ...nfe,
            identificacao: {
                ...nfe.identificacao,
                ambiente
            }
        };
        const useCase = new TransmitNFeUseCase_1.TransmitNFeUseCase({
            xmlBuilder: this.xmlBuilder,
            xmlSigner: this.xmlSigner,
            certificate: this.certificate,
            transport: this.transport,
            environment: this.environment,
            uf: this.uf,
            cIdToken: this.cIdToken,
            csc: this.csc
        });
        return useCase.execute(nfeComAmbiente);
    }
    async consultarProtocolo(chaveAcesso) {
        const useCase = new ConsultProtocolUseCase_1.ConsultProtocolUseCase({
            certificate: this.certificate,
            transport: this.transport,
            environment: this.environment
        });
        return useCase.execute(chaveAcesso);
    }
    async cancelar(input) {
        const useCase = new CancelaNFeUseCase_1.CancelaNFeUseCase({
            certificate: this.certificate,
            transport: this.transport,
            xmlSigner: this.xmlSigner,
            environment: this.environment
        });
        return useCase.execute(input);
    }
    async cartaCorrecao(input) {
        const useCase = new CartaCorrecaoUseCase_1.CartaCorrecaoUseCase({
            certificate: this.certificate,
            transport: this.transport,
            xmlSigner: this.xmlSigner,
            environment: this.environment
        });
        return useCase.execute(input);
    }
    async inutilizar(input) {
        const useCase = new InutilizaNFeUseCase_1.InutilizaNFeUseCase({
            certificate: this.certificate,
            transport: this.transport,
            xmlSigner: this.xmlSigner,
            environment: this.environment
        });
        return useCase.execute({
            ...input,
            uf: input.uf ?? this.uf
        });
    }
    async distribuicaoPorNSU(cnpj, ultNSU) {
        const useCase = new DistribuicaoDFeUseCase_1.DistribuicaoDFeUseCase({
            certificate: this.certificate,
            transport: this.transport,
            environment: this.environment
        });
        return useCase.consultarPorNSU(cnpj, this.uf, ultNSU);
    }
    async distribuicaoPorChave(cnpj, chaveAcesso) {
        const useCase = new DistribuicaoDFeUseCase_1.DistribuicaoDFeUseCase({
            certificate: this.certificate,
            transport: this.transport,
            environment: this.environment
        });
        return useCase.consultarPorChave(cnpj, this.uf, chaveAcesso);
    }
    async danfe(xmlAutorizado, options) {
        const useCase = new GerarDanfeUseCase_1.GerarDanfeUseCase();
        return useCase.execute(xmlAutorizado, options);
    }
}
exports.NFeCore = NFeCore;
