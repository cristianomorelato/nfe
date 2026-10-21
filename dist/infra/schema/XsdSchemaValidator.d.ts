import { SchemaValidator, ValidationResult } from '../../contracts/SchemaValidator';
/**
 * Documentos da NFe que podem ser validados contra o XSD oficial.
 *
 * Cada tipo aponta para o schema raiz correspondente no pacote da SEFAZ. Os
 * eventos com envelope proprio (cancelamento, CC-e, manifestacao, EPEC) tem o
 * mesmo elemento raiz `envEvento`, mas schemas diferentes para o `detEvento`.
 */
export type SchemaDocument = 'nfe' | 'enviNFe' | 'procNFe' | 'inutilizacao' | 'procInutNFe' | 'evento' | 'procEvento' | 'cancelamento' | 'cancelamentoSubstituicao' | 'cartaCorrecao' | 'manifestacao' | 'epec' | 'comprovanteEntrega' | 'insucessoEntrega' | 'atorInteressado' | 'consultaProtocolo' | 'consultaStatus' | 'consultaCadastro' | 'consultaGTIN' | 'distribuicaoDFe' | 'downloadNFe';
export type XsdSchemaValidatorOptions = {
    readonly schemasDir?: string;
    readonly document?: SchemaDocument;
};
export declare class XsdSchemaValidator implements SchemaValidator {
    private readonly schemasDir;
    private readonly document;
    /**
     * @param options Diretorio dos schemas e documento padrao. Por compatibilidade,
     *   tambem aceita apenas o diretorio como string.
     */
    constructor(options?: string | XsdSchemaValidatorOptions);
    /**
     * Caminho do XSD raiz de um documento.
     */
    schemaPathFor(document: SchemaDocument): string;
    /**
     * @param document Sobrescreve o documento padrao do validador.
     */
    validate(xml: string, document?: SchemaDocument): ValidationResult;
    private extractStderr;
    private parseErrors;
}
//# sourceMappingURL=XsdSchemaValidator.d.ts.map