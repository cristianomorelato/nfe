"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseNFeXml = parseNFeXml;
const NFeError_1 = require("../../shared/errors/NFeError");
const MODALIDADE_FRETE = {
    '0': '0-CIF',
    '1': '1-FOB',
    '2': '2-Terceiros',
    '3': '3-Rem. Proprio',
    '4': '4-Dest. Proprio',
    '9': '9-Sem Frete'
};
const FORMA_PAGAMENTO = {
    '01': 'Dinheiro',
    '02': 'Cheque',
    '03': 'Cartao de Credito',
    '04': 'Cartao de Debito',
    '05': 'Credito Loja',
    '10': 'Vale Alimentacao',
    '11': 'Vale Refeicao',
    '12': 'Vale Presente',
    '13': 'Vale Combustivel',
    '14': 'Duplicata Mercantil',
    '15': 'Boleto Bancario',
    '16': 'Deposito Bancario',
    '17': 'PIX',
    '18': 'Transferencia',
    '19': 'Fidelidade/Cashback',
    '90': 'Sem Pagamento',
    '99': 'Outros'
};
function parseNFeXml(xml) {
    const chaveAcesso = extractAttr(xml, 'infNFe', 'Id')?.replace('NFe', '') ?? '';
    if (!chaveAcesso || chaveAcesso.length !== 44) {
        throw new NFeError_1.NFeError('XML invalido: chave de acesso nao encontrada em infNFe[@Id]');
    }
    const ide = extractBlock(xml, 'ide');
    const emit = extractBlock(xml, 'emit');
    const dest = extractBlock(xml, 'dest');
    const total = extractBlock(xml, 'total');
    const transp = extractBlock(xml, 'transp');
    const cobr = extractBlock(xml, 'cobr');
    const pag = extractBlock(xml, 'pag');
    const infAdic = extractBlock(xml, 'infAdic');
    const protNFe = extractBlock(xml, 'protNFe');
    const emitEnder = extractBlock(emit, 'enderEmit');
    const destEnder = extractBlock(dest, 'enderDest');
    const modalidadeFrete = xmlTag(transp, 'modFrete') ?? '9';
    const transporta = extractBlock(transp, 'transporta');
    const veicTransp = extractBlock(transp, 'veicTransp');
    const vol = extractBlock(transp, 'vol');
    return {
        chaveAcesso,
        naturezaOperacao: xmlTag(ide, 'natOp') ?? '',
        numero: xmlTag(ide, 'nNF') ?? '',
        serie: xmlTag(ide, 'serie') ?? '',
        dataEmissao: formatDate(xmlTag(ide, 'dhEmi') ?? ''),
        dataSaida: xmlTag(ide, 'dhSaiEnt') ? formatDate(xmlTag(ide, 'dhSaiEnt')) : undefined,
        tipoOperacao: xmlTag(ide, 'tpNF') === '0' ? 'ENTRADA' : 'SAIDA',
        emitente: {
            nome: xmlTag(emit, 'xNome') ?? '',
            fantasia: xmlTag(emit, 'xFant') ?? undefined,
            cnpj: xmlTag(emit, 'CNPJ') ?? '',
            ie: xmlTag(emit, 'IE') ?? '',
            im: xmlTag(emit, 'IM') ?? undefined,
            ieSt: undefined,
            endereco: [
                `${xmlTag(emitEnder, 'xLgr') ?? ''}, ${xmlTag(emitEnder, 'nro') ?? ''}`,
                xmlTag(emitEnder, 'xCpl')
            ].filter(Boolean).join(', '),
            bairro: xmlTag(emitEnder, 'xBairro') ?? '',
            cidade: xmlTag(emitEnder, 'xMun') ?? '',
            uf: xmlTag(emitEnder, 'UF') ?? '',
            cep: xmlTag(emitEnder, 'CEP') ?? '',
            fone: xmlTag(emitEnder, 'fone') ?? undefined
        },
        destinatario: {
            nome: xmlTag(dest, 'xNome') ?? '',
            cnpjCpf: xmlTag(dest, 'CNPJ') ?? xmlTag(dest, 'CPF') ?? '',
            ie: xmlTag(dest, 'IE') ?? undefined,
            endereco: `${xmlTag(destEnder, 'xLgr') ?? ''}, ${xmlTag(destEnder, 'nro') ?? ''}`,
            bairro: xmlTag(destEnder, 'xBairro') ?? '',
            cidade: xmlTag(destEnder, 'xMun') ?? '',
            uf: xmlTag(destEnder, 'UF') ?? '',
            cep: xmlTag(destEnder, 'CEP') ?? '',
            fone: xmlTag(destEnder, 'fone') ?? undefined
        },
        produtos: parseProdutos(xml),
        totais: {
            bcIcms: xmlTag(total, 'vBC') ?? '0.00',
            valorIcms: xmlTag(total, 'vICMS') ?? '0.00',
            bcIcmsSt: xmlTag(total, 'vBCST') ?? '0.00',
            valorIcmsSt: xmlTag(total, 'vST') ?? '0.00',
            valorImportacao: xmlTag(total, 'vII') ?? '0.00',
            valorProdutos: xmlTag(total, 'vProd') ?? '0.00',
            valorFrete: xmlTag(total, 'vFrete') ?? '0.00',
            valorSeguro: xmlTag(total, 'vSeg') ?? '0.00',
            desconto: xmlTag(total, 'vDesc') ?? '0.00',
            outrasDespesas: xmlTag(total, 'vOutro') ?? '0.00',
            valorIpi: xmlTag(total, 'vIPI') ?? '0.00',
            valorNfe: xmlTag(total, 'vNF') ?? '0.00'
        },
        issqn: {
            valorServicos: xmlTag(extractBlock(total, 'ISSQNtot'), 'vServ') ?? '0.00',
            bcIssqn: xmlTag(extractBlock(total, 'ISSQNtot'), 'vBC') ?? '0.00',
            valorIssqn: xmlTag(extractBlock(total, 'ISSQNtot'), 'vISS') ?? '0.00'
        },
        transporte: {
            modalidade: modalidadeFrete,
            freteTexto: MODALIDADE_FRETE[modalidadeFrete] ?? modalidadeFrete,
            nome: xmlTag(transporta, 'xNome') ?? undefined,
            cnpjCpf: xmlTag(transporta, 'CNPJ') ?? xmlTag(transporta, 'CPF') ?? undefined,
            ie: xmlTag(transporta, 'IE') ?? undefined,
            endereco: xmlTag(transporta, 'xEnder') ?? undefined,
            cidade: xmlTag(transporta, 'xMun') ?? undefined,
            uf: xmlTag(transporta, 'UF') ?? undefined,
            codigoAntt: xmlTag(veicTransp, 'RNTC') ?? undefined,
            placa: xmlTag(veicTransp, 'placa') ?? undefined,
            ufVeiculo: xmlTag(veicTransp, 'UF') ?? undefined,
            quantidade: xmlTag(vol, 'qVol') ?? undefined,
            especie: xmlTag(vol, 'esp') ?? undefined,
            marca: xmlTag(vol, 'marca') ?? undefined,
            numeracao: xmlTag(vol, 'nVol') ?? undefined,
            pesoLiquido: xmlTag(vol, 'pesoL') ?? undefined,
            pesoBruto: xmlTag(vol, 'pesoB') ?? undefined
        },
        fatura: parseFatura(cobr),
        duplicatas: parseDuplicatas(cobr),
        pagamentos: parsePagamentos(pag),
        protocolo: xmlTag(protNFe, 'nProt') ?? '',
        dataAutorizacao: formatDate(xmlTag(protNFe, 'dhRecbto') ?? ''),
        informacoesComplementares: xmlTag(infAdic, 'infCpl') ?? undefined,
        informacoesFisco: xmlTag(infAdic, 'infAdFisco') ?? undefined
    };
}
function parseProdutos(xml) {
    const produtos = [];
    const detRegex = /<det\s[^>]*>([\s\S]*?)<\/det>/g;
    let match;
    while ((match = detRegex.exec(xml)) !== null) {
        const det = match[1];
        const prod = extractBlock(det, 'prod');
        const icmsBlock = extractBlock(det, 'ICMS');
        const ipiBlock = extractBlock(det, 'IPI');
        const icmsInner = icmsBlock.match(/<ICMS\w*>([\s\S]*?)<\/ICMS\w*>/)?.[1] ?? icmsBlock;
        const origem = xmlTag(icmsInner, 'orig') ?? '0';
        const cst = xmlTag(icmsInner, 'CST');
        const csosn = xmlTag(icmsInner, 'CSOSN');
        const origemCsosn = csosn ? `${origem}/${csosn}` : cst ? `${origem}/${cst}` : origem;
        const ipiInner = ipiBlock.match(/<IPITrib>([\s\S]*?)<\/IPITrib>/)?.[1] ?? '';
        produtos.push({
            codigo: xmlTag(prod, 'cProd') ?? '',
            descricao: xmlTag(prod, 'xProd') ?? '',
            ncm: xmlTag(prod, 'NCM') ?? '',
            origemCsosn,
            cfop: xmlTag(prod, 'CFOP') ?? '',
            unidade: xmlTag(prod, 'uCom') ?? '',
            quantidade: xmlTag(prod, 'qCom') ?? '',
            valorUnitario: xmlTag(prod, 'vUnCom') ?? '',
            valorTotal: xmlTag(prod, 'vProd') ?? '',
            valorDesconto: xmlTag(prod, 'vDesc') ?? '0.00',
            bcIcms: xmlTag(icmsInner, 'vBC') ?? '0.00',
            valorIcms: xmlTag(icmsInner, 'vICMS') ?? '0.00',
            valorIpi: xmlTag(ipiInner, 'vIPI') ?? '0.00',
            aliqIcms: xmlTag(icmsInner, 'pICMS') ?? '0.00',
            aliqIpi: xmlTag(ipiInner, 'pIPI') ?? '0.00'
        });
    }
    return produtos;
}
function parseFatura(cobr) {
    if (!cobr)
        return undefined;
    const fat = extractBlock(cobr, 'fat');
    if (!fat)
        return undefined;
    return {
        numero: xmlTag(fat, 'nFat') ?? '',
        valorOriginal: xmlTag(fat, 'vOrig') ?? '0.00',
        valorDesconto: xmlTag(fat, 'vDesc') ?? '0.00',
        valorLiquido: xmlTag(fat, 'vLiq') ?? '0.00'
    };
}
function parseDuplicatas(cobr) {
    if (!cobr)
        return undefined;
    const dups = [];
    const dupRegex = /<dup>([\s\S]*?)<\/dup>/g;
    let match;
    while ((match = dupRegex.exec(cobr)) !== null) {
        const d = match[1];
        dups.push({
            numero: xmlTag(d, 'nDup') ?? '',
            vencimento: formatDateShort(xmlTag(d, 'dVenc') ?? ''),
            valor: xmlTag(d, 'vDup') ?? '0.00'
        });
    }
    return dups.length > 0 ? dups : undefined;
}
function parsePagamentos(pag) {
    const pagamentos = [];
    const detPagRegex = /<detPag>([\s\S]*?)<\/detPag>/g;
    let match;
    while ((match = detPagRegex.exec(pag)) !== null) {
        const d = match[1];
        const tPag = xmlTag(d, 'tPag') ?? '99';
        pagamentos.push({
            forma: FORMA_PAGAMENTO[tPag] ?? `Outros (${tPag})`,
            valor: xmlTag(d, 'vPag') ?? '0.00'
        });
    }
    return pagamentos;
}
function xmlTag(xml, tagName) {
    const match = xml.match(new RegExp(`<${tagName}>([^<]*)</${tagName}>`));
    return match ? unescapeXml(match[1]) : null;
}
function unescapeXml(value) {
    return value
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'");
}
function extractBlock(xml, tagName) {
    const match = xml.match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)</${tagName}>`));
    return match ? match[0] : '';
}
function extractAttr(xml, tagName, attr) {
    const match = xml.match(new RegExp(`<${tagName}[^>]*${attr}="([^"]+)"`));
    return match ? match[1] : null;
}
function formatDate(isoDate) {
    if (!isoDate)
        return '';
    try {
        const d = new Date(isoDate);
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();
        const hh = String(d.getHours()).padStart(2, '0');
        const min = String(d.getMinutes()).padStart(2, '0');
        const ss = String(d.getSeconds()).padStart(2, '0');
        return `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss}`;
    }
    catch {
        return isoDate;
    }
}
function formatDateShort(dateStr) {
    if (!dateStr || dateStr.length < 10)
        return dateStr;
    const [yyyy, mm, dd] = dateStr.split('-');
    return `${dd}/${mm}/${yyyy}`;
}
