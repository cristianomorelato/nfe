"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XsdSchemaValidator = void 0;
const node_child_process_1 = require("node:child_process");
const node_path_1 = require("node:path");
const DEFAULT_SCHEMAS_DIR = (0, node_path_1.resolve)(__dirname, '..', '..', '..', 'schemas');
const SCHEMA_FILES = {
    nfe: 'nfe_v4.00.xsd',
    enviNFe: 'enviNFe_v4.00.xsd',
    procNFe: 'procNFe_v4.00.xsd',
    inutilizacao: 'inutNFe_v4.00.xsd',
    procInutNFe: 'procInutNFe_v4.00.xsd',
    evento: 'envEvento_v1.00.xsd',
    procEvento: 'procEventoNFe_v1.00.xsd',
    cancelamento: 'envEventoCancNFe_v1.00.xsd',
    cancelamentoSubstituicao: 'envEventoCancSubst_v1.00.xsd',
    cartaCorrecao: 'envCCe_v1.00.xsd',
    manifestacao: 'envConfRecebto_v1.00.xsd',
    epec: 'envEPEC_v1.00.xsd',
    comprovanteEntrega: 'envEventoEntregaNFe_v1.00.xsd',
    insucessoEntrega: 'envEventoInsucessoNFe_v1.00.xsd',
    atorInteressado: 'envEventoAtorInteressado_v1.00.xsd',
    consultaProtocolo: 'consSitNFe_v4.00.xsd',
    consultaStatus: 'consStatServ_v4.00.xsd',
    consultaCadastro: 'consCad_v2.00.xsd',
    consultaGTIN: 'consGTIN_v1.00.xsd',
    distribuicaoDFe: 'distDFeInt_v1.01.xsd',
    downloadNFe: 'downloadNFe_v1.00.xsd'
};
class XsdSchemaValidator {
    schemasDir;
    document;
    /**
     * @param options Diretorio dos schemas e documento padrao. Por compatibilidade,
     *   tambem aceita apenas o diretorio como string.
     */
    constructor(options) {
        const opts = typeof options === 'string' ? { schemasDir: options } : (options ?? {});
        this.schemasDir = opts.schemasDir ?? DEFAULT_SCHEMAS_DIR;
        this.document = opts.document ?? 'nfe';
    }
    /**
     * Caminho do XSD raiz de um documento.
     */
    schemaPathFor(document) {
        const file = SCHEMA_FILES[document];
        if (!file) {
            throw new Error(`Documento sem schema mapeado: ${document}`);
        }
        return (0, node_path_1.resolve)(this.schemasDir, file);
    }
    /**
     * @param document Sobrescreve o documento padrao do validador.
     */
    validate(xml, document) {
        const schemaPath = this.schemaPathFor(document ?? this.document);
        try {
            (0, node_child_process_1.execFileSync)('xmllint', ['--noout', '--schema', schemaPath, '-'], {
                input: xml,
                stdio: ['pipe', 'pipe', 'pipe'],
                encoding: 'utf-8'
            });
            return { valid: true, errors: [] };
        }
        catch (error) {
            const stderr = this.extractStderr(error);
            if (!stderr) {
                throw error;
            }
            const errors = this.parseErrors(stderr);
            if (errors.length === 0 && !stderr.includes('validates')) {
                throw error;
            }
            return { valid: false, errors };
        }
    }
    extractStderr(error) {
        if (error !== null &&
            typeof error === 'object' &&
            'stderr' in error &&
            typeof error.stderr === 'string') {
            return error.stderr;
        }
        return null;
    }
    parseErrors(stderr) {
        const errors = [];
        const lines = stderr.split('\n');
        for (const line of lines) {
            const match = line.match(/^-:(\d+):\s*element\s+(\S+):\s*Schemas validity error\s*:\s*(.+)$/);
            if (match) {
                errors.push({
                    field: match[2],
                    message: match[3].trim()
                });
            }
        }
        return errors;
    }
}
exports.XsdSchemaValidator = XsdSchemaValidator;
