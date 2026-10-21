"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GerarCupomUseCase = void 0;
const NFeError_1 = require("../../shared/errors/NFeError");
const xml_parser_1 = require("../../infra/danfe/xml-parser");
const CupomNFCeGenerator_1 = require("../../infra/danfe/CupomNFCeGenerator");
class GerarCupomUseCase {
    generator;
    constructor() {
        this.generator = new CupomNFCeGenerator_1.CupomNFCeGenerator();
    }
    /**
     * Gera PDF do cupom termico NFC-e a partir do XML autorizado.
     * Requer pdfkit e qrcode instalados.
     */
    async execute(xml) {
        if (!xml || !xml.includes('<infNFe')) {
            throw new NFeError_1.NFeError('XML invalido: esperado XML de NFC-e autorizada com <infNFe>');
        }
        const danfeData = (0, xml_parser_1.parseNFeXml)(xml);
        const { qrCodeUrl, urlChave } = (0, CupomNFCeGenerator_1.extractInfNFeSupl)(xml);
        const cupomData = {
            ...danfeData,
            qrCodeUrl,
            urlChave
        };
        return this.generator.generate(cupomData);
    }
}
exports.GerarCupomUseCase = GerarCupomUseCase;
