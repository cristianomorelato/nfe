"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GerarDanfeUseCase = void 0;
const NFeError_1 = require("../../shared/errors/NFeError");
const xml_parser_1 = require("../../infra/danfe/xml-parser");
const DanfeGenerator_1 = require("../../infra/danfe/DanfeGenerator");
class GerarDanfeUseCase {
    generator;
    constructor() {
        this.generator = new DanfeGenerator_1.DanfeGenerator();
    }
    /**
     * Gera PDF do DANFE a partir do XML autorizado.
     * Requer pdfkit instalado como dependencia.
     */
    async execute(xml, options) {
        if (!xml || !xml.includes('<infNFe')) {
            throw new NFeError_1.NFeError('XML invalido: deve conter elemento <infNFe>');
        }
        const data = (0, xml_parser_1.parseNFeXml)(xml);
        return this.generator.generate({
            ...data,
            logo: options?.logo,
            emitente: { ...data.emitente, email: options?.email }
        });
    }
}
exports.GerarDanfeUseCase = GerarDanfeUseCase;
