import { XmlBuilder } from '../../contracts/XmlBuilder';
import { NFeProps } from '../../domain/entities/NFe';
export declare class DefaultXmlBuilder implements XmlBuilder {
    build(nfe: NFeProps): string;
    private buildIde;
    /**
     * Entrada em contingencia (dhCont + xJust). Sequencia opcional: os dois campos
     * andam juntos, e sao exigidos quando `tipoEmissao` indica contingencia.
     */
    private buildContingencia;
    /**
     * Compra governamental (gCompraGov), com o redutor de IBS/CBS do ente publico.
     */
    private buildCompraGovernamental;
    /**
     * NFe de antecipacao de pagamento liquidadas por esta nota (gPagAntecipado).
     * Fica depois do NFref, no fim do `ide`.
     */
    private buildPagAntecipado;
    /**
     * Documentos referenciados (grupo NFref). Fica no fim do `ide`, conforme a
     * sequencia do leiaute 4.00.
     */
    private buildNFref;
    /**
     * Pessoas autorizadas a baixar o XML (grupo autXML), limitado a 10 pelo leiaute.
     */
    private buildAutXml;
    /**
     * Responsavel tecnico (grupo infRespTec). Quando o CSRT e informado, o
     * `hashCSRT` e o SHA-1 de `CSRT + chave de acesso`, em base64.
     */
    private buildInfRespTec;
    private buildEmitente;
    private buildDestinatario;
    private buildEndereco;
    private buildProdutos;
    private buildProduto;
    private buildCobranca;
    private buildPagamento;
}
//# sourceMappingURL=DefaultXmlBuilder.d.ts.map