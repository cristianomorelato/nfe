"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NFe = void 0;
class NFe {
    identificacao;
    emitente;
    destinatario;
    produtos;
    transporte;
    cobranca;
    pagamento;
    informacoesComplementares;
    informacoesFisco;
    autorizadosXml;
    responsavelTecnico;
    constructor(props) {
        this.identificacao = {
            ...props.identificacao,
            dataEmissao: props.identificacao.dataEmissao ?? new Date(),
            tipoEmissao: props.identificacao.tipoEmissao ?? 1,
            tipoImpressao: props.identificacao.tipoImpressao ?? 1
        };
        this.emitente = props.emitente;
        this.destinatario = props.destinatario;
        this.produtos = Object.freeze([...props.produtos]);
        this.transporte = props.transporte;
        this.cobranca = props.cobranca;
        this.pagamento = props.pagamento;
        this.informacoesComplementares = props.informacoesComplementares;
        this.informacoesFisco = props.informacoesFisco;
        this.autorizadosXml = props.autorizadosXml
            ? Object.freeze([...props.autorizadosXml])
            : undefined;
        this.responsavelTecnico = props.responsavelTecnico;
    }
}
exports.NFe = NFe;
