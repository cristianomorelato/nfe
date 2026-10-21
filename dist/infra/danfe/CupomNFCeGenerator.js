"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CupomNFCeGenerator = void 0;
exports.extractInfNFeSupl = extractInfNFeSupl;
const NFeError_1 = require("../../shared/errors/NFeError");
// 80mm = 226.77pt, margins 5pt each side
const PAGE_W = 226.77;
const M = 5;
const W = PAGE_W - M * 2;
const F = 7;
const FS = 6;
const FL = 9;
const LH = 9;
const LHS = 7;
async function loadPdfKit() {
    try {
        const mod = await Promise.resolve().then(() => __importStar(require('pdfkit')));
        return mod.default ?? mod;
    }
    catch {
        throw new NFeError_1.NFeError('pdfkit nao esta instalado. Instale com: npm install pdfkit');
    }
}
async function loadQRCode() {
    try {
        const mod = await Promise.resolve().then(() => __importStar(require('qrcode')));
        return mod.default ?? mod;
    }
    catch {
        throw new NFeError_1.NFeError('qrcode nao esta instalado. Instale com: npm install qrcode');
    }
}
/**
 * Extrai dados do infNFeSupl do XML (qrCode e urlChave).
 */
function extractInfNFeSupl(xml) {
    const suplBlock = xml.match(/<infNFeSupl>([\s\S]*?)<\/infNFeSupl>/);
    if (!suplBlock)
        return {};
    // qrCode pode estar em CDATA
    const qrMatch = suplBlock[1].match(/<qrCode>\s*(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?\s*<\/qrCode>/);
    const urlMatch = suplBlock[1].match(/<urlChave>\s*(.*?)\s*<\/urlChave>/);
    return {
        qrCodeUrl: qrMatch?.[1],
        urlChave: urlMatch?.[1]
    };
}
class CupomNFCeGenerator {
    async generate(data) {
        const PdfDocument = await loadPdfKit();
        const estimatedHeight = this.estimateHeight(data);
        const doc = new PdfDocument({
            size: [PAGE_W, estimatedHeight],
            margin: M,
            bufferPages: true
        });
        return new Promise((resolve, reject) => {
            const chunks = [];
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);
            this.render(doc, data).then(() => doc.end()).catch(reject);
        });
    }
    async render(doc, d) {
        let y = M;
        y = this.header(doc, d, y);
        y = this.separator(doc, y);
        y = this.produtos(doc, d, y);
        y = this.totais(doc, d, y);
        y = this.separator(doc, y);
        y = this.pagamento(doc, d, y);
        y = this.separator(doc, y);
        y = this.infoFiscal(doc, d, y);
        y = await this.qrCode(doc, d, y);
        this.rodape(doc, d, y);
    }
    header(doc, d, y) {
        doc.font('Helvetica-Bold').fontSize(FL).fillColor('black');
        doc.text('DOCUMENTO AUXILIAR DA NFC-e', M, y, { width: W, align: 'center' });
        y += LH + 2;
        doc.font('Helvetica-Bold').fontSize(FS);
        doc.text('DANFE NFC-e', M, y, { width: W, align: 'center' });
        y += LHS + 4;
        // Emitente
        doc.font('Helvetica-Bold').fontSize(F);
        doc.text(d.emitente.nome, M, y, { width: W, align: 'center' });
        y += LH;
        doc.font('Helvetica').fontSize(FS);
        const cnpjFormatado = this.fmtDoc(d.emitente.cnpj);
        doc.text(`CNPJ: ${cnpjFormatado}`, M, y, { width: W, align: 'center' });
        y += LHS;
        if (d.emitente.ie) {
            doc.text(`IE: ${d.emitente.ie}`, M, y, { width: W, align: 'center' });
            y += LHS;
        }
        const endereco = [
            d.emitente.endereco,
            d.emitente.bairro,
            `${d.emitente.cidade}-${d.emitente.uf}`,
            d.emitente.cep ? `CEP: ${d.emitente.cep}` : ''
        ].filter(Boolean).join(', ');
        doc.text(endereco, M, y, { width: W, align: 'center' });
        y += LHS * 2;
        if (d.emitente.fone) {
            doc.text(`Fone: ${d.emitente.fone}`, M, y, { width: W, align: 'center' });
            y += LHS;
        }
        return y + 2;
    }
    separator(doc, y) {
        doc.strokeColor('#000000').lineWidth(0.5);
        doc.dash(2, { space: 2 });
        doc.moveTo(M, y).lineTo(M + W, y).stroke();
        doc.undash();
        return y + 4;
    }
    produtos(doc, d, y) {
        doc.font('Helvetica-Bold').fontSize(FS).fillColor('black');
        doc.text('#', M, y, { width: 15 });
        doc.text('Descricao', M + 15, y, { width: W - 70 });
        doc.text('Vl.Total', M + W - 55, y, { width: 55, align: 'right' });
        y += LHS;
        doc.font('Helvetica').fontSize(FS);
        for (let i = 0; i < d.produtos.length; i++) {
            const p = d.produtos[i];
            const num = String(i + 1);
            const desc = this.trunc(p.descricao, 25);
            doc.text(num, M, y, { width: 15 });
            doc.text(desc, M + 15, y, { width: W - 70 });
            doc.text(this.fmtNum(p.valorTotal), M + W - 55, y, { width: 55, align: 'right' });
            y += LHS;
            // Linha 2: qtd x valor unitario
            doc.fillColor('#666666');
            doc.text(`${p.quantidade} ${p.unidade} x ${this.fmtNum(p.valorUnitario)}`, M + 15, y, { width: W - 15 });
            doc.fillColor('black');
            y += LHS;
        }
        return y + 2;
    }
    totais(doc, d, y) {
        doc.font('Helvetica').fontSize(F);
        y = this.lineKeyValue(doc, 'Qtd. Itens', String(d.produtos.length), y);
        y = this.lineKeyValue(doc, 'Subtotal', this.fmtNum(d.totais.valorProdutos), y);
        if (d.totais.desconto && d.totais.desconto !== '0.00') {
            y = this.lineKeyValue(doc, 'Desconto', `- ${this.fmtNum(d.totais.desconto)}`, y);
        }
        if (d.totais.valorFrete && d.totais.valorFrete !== '0.00') {
            y = this.lineKeyValue(doc, 'Frete', this.fmtNum(d.totais.valorFrete), y);
        }
        if (d.totais.outrasDespesas && d.totais.outrasDespesas !== '0.00') {
            y = this.lineKeyValue(doc, 'Outras despesas', this.fmtNum(d.totais.outrasDespesas), y);
        }
        // Total
        doc.font('Helvetica-Bold').fontSize(FL);
        y = this.lineKeyValue(doc, 'TOTAL', `R$ ${this.fmtNum(d.totais.valorNfe)}`, y);
        doc.font('Helvetica').fontSize(F);
        return y + 2;
    }
    pagamento(doc, d, y) {
        doc.font('Helvetica-Bold').fontSize(FS);
        doc.text('FORMA DE PAGAMENTO', M, y, { width: W, align: 'center' });
        y += LHS + 2;
        doc.font('Helvetica').fontSize(FS);
        for (const pag of d.pagamentos) {
            y = this.lineKeyValue(doc, pag.forma, `R$ ${this.fmtNum(pag.valor)}`, y);
        }
        // Troco
        const total = parseFloat(d.totais.valorNfe) || 0;
        const totalPago = d.pagamentos.reduce((sum, p) => sum + (parseFloat(p.valor) || 0), 0);
        const troco = totalPago - total;
        if (troco > 0.01) {
            y = this.lineKeyValue(doc, 'Troco', `R$ ${this.fmtNum(troco.toFixed(2))}`, y);
        }
        return y + 2;
    }
    infoFiscal(doc, d, y) {
        doc.font('Helvetica').fontSize(FS).fillColor('black');
        // Chave de acesso
        doc.font('Helvetica-Bold').fontSize(FS);
        doc.text('Consulte pela Chave de Acesso em', M, y, { width: W, align: 'center' });
        y += LHS;
        if (d.urlChave) {
            doc.font('Helvetica').fontSize(5);
            doc.text(d.urlChave, M, y, { width: W, align: 'center' });
            y += LHS;
        }
        doc.font('Helvetica').fontSize(5);
        const chaveFormatada = (d.chaveAcesso || '').replace(/(\d{4})/g, '$1 ').trim();
        doc.text(chaveFormatada, M, y, { width: W, align: 'center' });
        y += LHS + 2;
        // Destinatario / Consumidor
        if (d.destinatario && d.destinatario.nome) {
            doc.font('Helvetica-Bold').fontSize(FS);
            doc.text('CONSUMIDOR', M, y, { width: W, align: 'center' });
            y += LHS;
            doc.font('Helvetica').fontSize(FS);
            const docConsumidor = d.destinatario.cnpjCpf
                ? `CPF/CNPJ: ${this.fmtDoc(d.destinatario.cnpjCpf)}`
                : '';
            if (docConsumidor) {
                doc.text(docConsumidor, M, y, { width: W, align: 'center' });
                y += LHS;
            }
            doc.text(d.destinatario.nome, M, y, { width: W, align: 'center' });
            y += LHS;
        }
        else {
            doc.font('Helvetica').fontSize(FS);
            doc.text('CONSUMIDOR NAO IDENTIFICADO', M, y, { width: W, align: 'center' });
            y += LHS;
        }
        y += 2;
        // Numero e serie
        doc.font('Helvetica-Bold').fontSize(FS);
        doc.text(`NFC-e no ${d.numero} Serie ${d.serie}`, M, y, {
            width: W, align: 'center'
        });
        y += LHS;
        // Data emissao
        doc.font('Helvetica').fontSize(FS);
        doc.text(`Emissao: ${d.dataEmissao}`, M, y, { width: W, align: 'center' });
        y += LHS;
        // Protocolo
        if (d.protocolo) {
            doc.text(`Protocolo: ${d.protocolo}`, M, y, { width: W, align: 'center' });
            y += LHS;
        }
        if (d.dataAutorizacao) {
            doc.text(`Autorizacao: ${d.dataAutorizacao}`, M, y, { width: W, align: 'center' });
            y += LHS;
        }
        return y + 4;
    }
    async qrCode(doc, d, y) {
        if (!d.qrCodeUrl)
            return y;
        try {
            const qrLib = await loadQRCode();
            const qrBuffer = await qrLib.toBuffer(d.qrCodeUrl, {
                type: 'png',
                width: 150,
                margin: 1,
                errorCorrectionLevel: 'M'
            });
            const qrSize = 130;
            const x = M + (W - qrSize) / 2;
            doc.image(qrBuffer, x, y, { width: qrSize, height: qrSize });
            y += qrSize + 4;
        }
        catch {
            // Se qrcode nao esta instalado, mostra URL como texto
            doc.font('Helvetica').fontSize(4);
            doc.text(d.qrCodeUrl, M, y, { width: W, align: 'center' });
            y += 10;
        }
        return y;
    }
    rodape(doc, d, y) {
        doc.font('Helvetica').fontSize(5).fillColor('#666666');
        if (d.informacoesComplementares) {
            const info = d.informacoesComplementares.substring(0, 200);
            doc.text(info, M, y, { width: W, align: 'center' });
            y += Math.ceil(info.length / 40) * 6 + 2;
        }
    }
    lineKeyValue(doc, key, value, y) {
        doc.text(key, M, y, { width: W / 2 });
        doc.text(value, M + W / 2, y, { width: W / 2, align: 'right' });
        return y + LH;
    }
    estimateHeight(d) {
        let h = 0;
        h += 80; // header
        h += d.produtos.length * 20; // products (2 lines each)
        h += 60; // totals
        h += (d.pagamentos?.length ?? 1) * 12; // payments
        h += 120; // fiscal info
        h += d.qrCodeUrl ? 150 : 0; // qr code
        h += 60; // footer
        h += 40; // margins/padding
        return Math.max(h, 300);
    }
    fmtDoc(doc) {
        if (doc.length === 14) {
            return doc.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
        }
        if (doc.length === 11) {
            return doc.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
        }
        return doc;
    }
    fmtNum(value) {
        const num = typeof value === 'string' ? parseFloat(value) : value;
        if (isNaN(num))
            return '0,00';
        return num.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
    trunc(text, maxChars) {
        if (text.length <= maxChars)
            return text;
        return text.substring(0, maxChars - 1) + '.';
    }
}
exports.CupomNFCeGenerator = CupomNFCeGenerator;
