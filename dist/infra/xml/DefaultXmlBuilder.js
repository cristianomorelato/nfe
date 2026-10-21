"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultXmlBuilder = void 0;
const node_crypto_1 = require("node:crypto");
const ibge_codes_1 = require("../../shared/constants/ibge-codes");
const access_key_1 = require("../../shared/helpers/access-key");
const xml_helper_1 = require("./xml-helper");
const nota_groups_1 = require("./builders/nota-groups");
const produto_groups_1 = require("./builders/produto-groups");
const imposto_groups_1 = require("./builders/imposto-groups");
const total_groups_1 = require("./builders/total-groups");
const NFE_VERSION = '4.00';
const NFE_NAMESPACE = 'http://www.portalfiscal.inf.br/nfe';
class DefaultXmlBuilder {
    build(nfe) {
        const uf = nfe.identificacao.uf;
        const cUF = ibge_codes_1.UF_CODES[uf] || uf;
        const dataEmissao = nfe.identificacao.dataEmissao ?? new Date();
        const tipoEmissao = nfe.identificacao.tipoEmissao ?? 1;
        const codigoNumerico = (0, access_key_1.generateNumericCode)();
        const modelo = nfe.identificacao.modelo ?? '55';
        const chaveAcesso = (0, access_key_1.generateAccessKey)({
            uf: cUF,
            dataEmissao,
            cnpj: nfe.emitente.cnpj,
            modelo,
            serie: nfe.identificacao.serie,
            numero: nfe.identificacao.numero,
            tipoEmissao,
            codigoNumerico
        });
        const cDV = chaveAcesso.slice(-1);
        const ide = this.buildIde(nfe, cUF, dataEmissao, tipoEmissao, codigoNumerico, cDV, modelo);
        const emit = this.buildEmitente(nfe.emitente);
        const ambiente = (nfe.identificacao.ambiente ?? 2);
        const dest = this.buildDestinatario(nfe.destinatario, ambiente);
        const det = this.buildProdutos(nfe.produtos);
        const total = (0, total_groups_1.buildTotais)(nfe);
        const transp = (0, nota_groups_1.buildTransporte)(nfe.transporte);
        const cobr = this.buildCobranca(nfe.cobranca);
        const pag = this.buildPagamento(nfe.pagamento);
        const infAdic = (0, nota_groups_1.buildInformacoesAdicionais)({
            complementar: nfe.informacoesComplementares,
            fisco: nfe.informacoesFisco,
            observacoesContribuinte: nfe.observacoesContribuinte,
            observacoesFisco: nfe.observacoesFisco,
            processosReferenciados: nfe.processosReferenciados
        });
        const autXml = this.buildAutXml(nfe.autorizadosXml);
        const infRespTec = this.buildInfRespTec(nfe.responsavelTecnico, chaveAcesso);
        const infNFe = `<infNFe versao="${NFE_VERSION}" Id="NFe${chaveAcesso}">` +
            ide +
            emit +
            (0, nota_groups_1.buildAvulsa)(nfe.avulsa) +
            dest +
            (0, nota_groups_1.buildLocal)('retirada', nfe.retirada) +
            (0, nota_groups_1.buildLocal)('entrega', nfe.entrega) +
            autXml +
            det +
            total +
            transp +
            cobr +
            pag +
            (0, nota_groups_1.buildIntermediador)(nfe.intermediador) +
            infAdic +
            (0, nota_groups_1.buildExportacao)(nfe.exportacao) +
            (0, nota_groups_1.buildCompra)(nfe.compra) +
            (0, nota_groups_1.buildCana)(nfe.cana) +
            infRespTec +
            (nfe.solicitacaoNFF ? (0, xml_helper_1.tagGroup)('infSolicNFF', (0, xml_helper_1.tag)('xSolic', nfe.solicitacaoNFF)) : '') +
            (0, nota_groups_1.buildAgropecuario)(nfe.agropecuario) +
            '</infNFe>';
        return (`<?xml version="1.0" encoding="UTF-8"?>` +
            `<NFe xmlns="${NFE_NAMESPACE}">` +
            infNFe +
            '</NFe>');
    }
    buildIde(nfe, cUF, dataEmissao, tipoEmissao, codigoNumerico, cDV, modelo) {
        const id = nfe.identificacao;
        const tipoImpressao = id.tipoImpressao ?? 1;
        const tpAmb = String(id.ambiente ?? 2);
        return (0, xml_helper_1.tagGroup)('ide', (0, xml_helper_1.tag)('cUF', cUF) +
            (0, xml_helper_1.tag)('cNF', codigoNumerico) +
            (0, xml_helper_1.tag)('natOp', id.naturezaOperacao) +
            (0, xml_helper_1.tag)('mod', modelo) +
            (0, xml_helper_1.tag)('serie', String(id.serie)) +
            (0, xml_helper_1.tag)('nNF', String(id.numero)) +
            (0, xml_helper_1.tag)('dhEmi', (0, xml_helper_1.formatDate)(dataEmissao)) +
            (0, xml_helper_1.tag)('dhSaiEnt', id.dataSaidaEntrada ? (0, xml_helper_1.formatDate)(id.dataSaidaEntrada) : undefined) +
            (0, xml_helper_1.tag)('dPrevEntrega', id.dataPrevistaEntrega ? (0, xml_helper_1.formatDateOnly)(id.dataPrevistaEntrega) : undefined) +
            (0, xml_helper_1.tag)('tpNF', String(id.tipoOperacao)) +
            (0, xml_helper_1.tag)('idDest', String(id.destinoOperacao)) +
            (0, xml_helper_1.tag)('cMunFG', id.municipio) +
            (0, xml_helper_1.tag)('cMunFGIBS', id.municipioFatoGeradorIbs) +
            (0, xml_helper_1.tag)('tpImp', String(tipoImpressao)) +
            (0, xml_helper_1.tag)('tpEmis', String(tipoEmissao)) +
            (0, xml_helper_1.tag)('cDV', cDV) +
            (0, xml_helper_1.tag)('tpAmb', tpAmb) +
            (0, xml_helper_1.tag)('finNFe', String(id.finalidade)) +
            (0, xml_helper_1.tag)('tpNFDebito', id.tipoNotaDebito) +
            (0, xml_helper_1.tag)('tpNFCredito', id.tipoNotaCredito) +
            (0, xml_helper_1.tag)('indFinal', String(id.consumidorFinal)) +
            (0, xml_helper_1.tag)('indPres', String(id.presencaComprador)) +
            (0, xml_helper_1.tag)('indIntermed', String(id.indicadorIntermediador ?? 0)) +
            (0, xml_helper_1.tag)('procEmi', '0') +
            (0, xml_helper_1.tag)('verProc', 'brasil-fiscal-nfe') +
            this.buildContingencia(id) +
            this.buildNFref(id.notasReferenciadas) +
            this.buildCompraGovernamental(id.compraGovernamental) +
            this.buildPagAntecipado(id.pagamentosAntecipados));
    }
    /**
     * Entrada em contingencia (dhCont + xJust). Sequencia opcional: os dois campos
     * andam juntos, e sao exigidos quando `tipoEmissao` indica contingencia.
     */
    buildContingencia(id) {
        if (!id.dataHoraContingencia || !id.justificativaContingencia)
            return '';
        return ((0, xml_helper_1.tag)('dhCont', (0, xml_helper_1.formatDate)(id.dataHoraContingencia)) +
            (0, xml_helper_1.tag)('xJust', id.justificativaContingencia));
    }
    /**
     * Compra governamental (gCompraGov), com o redutor de IBS/CBS do ente publico.
     */
    buildCompraGovernamental(compra) {
        if (!compra)
            return '';
        return (0, xml_helper_1.tagGroup)('gCompraGov', (0, xml_helper_1.tag)('tpEnteGov', String(compra.tipoEnte)) +
            (0, xml_helper_1.tag)('pRedutor', (0, xml_helper_1.formatNumber)(compra.percentualRedutor, 4)) +
            (0, xml_helper_1.tag)('tpOperGov', String(compra.tipoOperacao)));
    }
    /**
     * NFe de antecipacao de pagamento liquidadas por esta nota (gPagAntecipado).
     * Fica depois do NFref, no fim do `ide`.
     */
    buildPagAntecipado(chaves) {
        if (!chaves || chaves.length === 0)
            return '';
        return (0, xml_helper_1.tagGroup)('gPagAntecipado', chaves
            .slice(0, 99)
            .map((chave) => (0, xml_helper_1.tag)('refNFe', chave))
            .join(''));
    }
    /**
     * Documentos referenciados (grupo NFref). Fica no fim do `ide`, conforme a
     * sequencia do leiaute 4.00.
     */
    buildNFref(refs) {
        if (!refs || refs.length === 0)
            return '';
        return refs
            .map((ref) => {
            switch (ref.tipo) {
                case 'nfe':
                    return (0, xml_helper_1.tagGroup)('NFref', (0, xml_helper_1.tag)('refNFe', ref.chaveAcesso));
                case 'nfeSigilosa':
                    return (0, xml_helper_1.tagGroup)('NFref', (0, xml_helper_1.tag)('refNFeSig', ref.chaveAcesso));
                case 'cte':
                    return (0, xml_helper_1.tagGroup)('NFref', (0, xml_helper_1.tag)('refCTe', ref.chaveAcesso));
                case 'nf':
                    return (0, xml_helper_1.tagGroup)('NFref', (0, xml_helper_1.tagGroup)('refNF', (0, xml_helper_1.tag)('cUF', ibge_codes_1.UF_CODES[ref.uf] || ref.uf) +
                        (0, xml_helper_1.tag)('AAMM', ref.anoMes) +
                        (0, xml_helper_1.tag)('CNPJ', ref.cnpj) +
                        (0, xml_helper_1.tag)('mod', ref.modelo) +
                        (0, xml_helper_1.tag)('serie', String(ref.serie)) +
                        (0, xml_helper_1.tag)('nNF', String(ref.numero))));
                case 'produtorRural':
                    return (0, xml_helper_1.tagGroup)('NFref', (0, xml_helper_1.tagGroup)('refNFP', (0, xml_helper_1.tag)('cUF', ibge_codes_1.UF_CODES[ref.uf] || ref.uf) +
                        (0, xml_helper_1.tag)('AAMM', ref.anoMes) +
                        (ref.cnpj ? (0, xml_helper_1.tag)('CNPJ', ref.cnpj) : (0, xml_helper_1.tag)('CPF', ref.cpf)) +
                        (0, xml_helper_1.tag)('IE', ref.inscricaoEstadual) +
                        (0, xml_helper_1.tag)('mod', ref.modelo) +
                        (0, xml_helper_1.tag)('serie', String(ref.serie)) +
                        (0, xml_helper_1.tag)('nNF', String(ref.numero))));
                case 'ecf':
                    return (0, xml_helper_1.tagGroup)('NFref', (0, xml_helper_1.tagGroup)('refECF', (0, xml_helper_1.tag)('mod', ref.modelo) +
                        (0, xml_helper_1.tag)('nECF', ref.numeroEcf) +
                        (0, xml_helper_1.tag)('nCOO', ref.numeroContadorOrdem)));
            }
        })
            .join('');
    }
    /**
     * Pessoas autorizadas a baixar o XML (grupo autXML), limitado a 10 pelo leiaute.
     */
    buildAutXml(autorizados) {
        if (!autorizados || autorizados.length === 0)
            return '';
        return autorizados
            .slice(0, 10)
            .map((aut) => aut.cnpj
            ? (0, xml_helper_1.tagGroup)('autXML', (0, xml_helper_1.tag)('CNPJ', aut.cnpj))
            : (0, xml_helper_1.tagGroup)('autXML', (0, xml_helper_1.tag)('CPF', aut.cpf)))
            .join('');
    }
    /**
     * Responsavel tecnico (grupo infRespTec). Quando o CSRT e informado, o
     * `hashCSRT` e o SHA-1 de `CSRT + chave de acesso`, em base64.
     */
    buildInfRespTec(resp, chaveAcesso) {
        if (!resp)
            return '';
        const csrt = resp.csrt && resp.idCSRT
            ? (0, xml_helper_1.tag)('idCSRT', resp.idCSRT) +
                (0, xml_helper_1.tag)('hashCSRT', (0, node_crypto_1.createHash)('sha1')
                    .update(resp.csrt + chaveAcesso, 'utf8')
                    .digest('base64'))
            : '';
        return (0, xml_helper_1.tagGroup)('infRespTec', (0, xml_helper_1.tag)('CNPJ', resp.cnpj) +
            (0, xml_helper_1.tag)('xContato', resp.contato) +
            (0, xml_helper_1.tag)('email', resp.email) +
            (0, xml_helper_1.tag)('fone', resp.telefone) +
            csrt);
    }
    buildEmitente(emit) {
        const endereco = this.buildEndereco('enderEmit', emit.endereco);
        return (0, xml_helper_1.tagGroup)('emit', (0, xml_helper_1.tag)('CNPJ', emit.cnpj) +
            (0, xml_helper_1.tag)('xNome', emit.razaoSocial) +
            (0, xml_helper_1.tag)('xFant', emit.nomeFantasia) +
            endereco +
            (0, xml_helper_1.tag)('IE', emit.inscricaoEstadual) +
            (0, xml_helper_1.tag)('IEST', emit.inscricaoEstadualST) +
            (0, xml_helper_1.tag)('IM', emit.inscricaoMunicipal) +
            (0, xml_helper_1.tag)('CNAE', emit.cnae) +
            (0, xml_helper_1.tag)('CRT', String(emit.regimeTributario)));
    }
    buildDestinatario(dest, tpAmb) {
        if (!dest)
            return '';
        const doc = dest.cnpj
            ? (0, xml_helper_1.tag)('CNPJ', dest.cnpj)
            : dest.cpf
                ? (0, xml_helper_1.tag)('CPF', dest.cpf)
                : dest.idEstrangeiro
                    ? (0, xml_helper_1.tag)('idEstrangeiro', dest.idEstrangeiro)
                    : '';
        if (!doc)
            return '';
        const endereco = dest.endereco ? this.buildEndereco('enderDest', dest.endereco) : '';
        const xNome = tpAmb === 2
            ? 'NF-E EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL'
            : dest.nome;
        return (0, xml_helper_1.tagGroup)('dest', doc +
            (0, xml_helper_1.tag)('xNome', xNome) +
            endereco +
            (0, xml_helper_1.tag)('indIEDest', String(dest.indicadorIE)) +
            (0, xml_helper_1.tag)('IE', dest.inscricaoEstadual) +
            (0, xml_helper_1.tag)('ISUF', dest.inscricaoSuframa) +
            (0, xml_helper_1.tag)('IM', dest.inscricaoMunicipal) +
            (0, xml_helper_1.tag)('email', dest.email));
    }
    buildEndereco(tagName, end) {
        return (0, xml_helper_1.tagGroup)(tagName, (0, xml_helper_1.tag)('xLgr', end.logradouro) +
            (0, xml_helper_1.tag)('nro', end.numero) +
            (0, xml_helper_1.tag)('xCpl', end.complemento) +
            (0, xml_helper_1.tag)('xBairro', end.bairro) +
            (0, xml_helper_1.tag)('cMun', end.codigoMunicipio) +
            (0, xml_helper_1.tag)('xMun', end.municipio) +
            (0, xml_helper_1.tag)('UF', end.uf) +
            (0, xml_helper_1.tag)('CEP', end.cep) +
            (0, xml_helper_1.tag)('cPais', end.codigoPais || '1058') +
            (0, xml_helper_1.tag)('xPais', end.pais || 'Brasil') +
            (0, xml_helper_1.tag)('fone', end.telefone));
    }
    buildProdutos(produtos) {
        return produtos.map((prod, index) => this.buildProduto(prod, index + 1)).join('');
    }
    buildProduto(prod, nItem) {
        // A ordem dos campos segue a sequencia do leiaute 4.00 — o XSD rejeita
        // qualquer elemento fora de posicao.
        const prodTag = (0, xml_helper_1.tagGroup)('prod', (0, xml_helper_1.tag)('cProd', prod.codigo) +
            (0, xml_helper_1.tag)('cEAN', prod.ean || 'SEM GTIN') +
            (0, xml_helper_1.tag)('cBarra', prod.codigoBarras) +
            (0, xml_helper_1.tag)('xProd', prod.descricao) +
            (0, xml_helper_1.tag)('NCM', prod.ncm) +
            (0, produto_groups_1.buildNve)(prod.nve) +
            (0, produto_groups_1.buildCest)(prod) +
            (0, xml_helper_1.tag)('cBenef', prod.codigoBeneficioFiscal) +
            (0, produto_groups_1.buildCreditosPresumidos)(prod.creditosPresumidos) +
            (0, xml_helper_1.tag)('tpCredPresIBSZFM', prod.tipoCreditoPresumidoIbsZfm) +
            (0, xml_helper_1.tag)('EXTIPI', prod.extipi) +
            (0, xml_helper_1.tag)('CFOP', prod.cfop) +
            (0, xml_helper_1.tag)('uCom', prod.unidade) +
            (0, xml_helper_1.tag)('qCom', (0, xml_helper_1.formatNumber)(prod.quantidade, 4)) +
            (0, xml_helper_1.tag)('vUnCom', (0, xml_helper_1.formatNumber)(prod.valorUnitario, 10)) +
            (0, xml_helper_1.tag)('vProd', (0, xml_helper_1.formatNumber)(prod.valorTotal, 2)) +
            (0, xml_helper_1.tag)('cEANTrib', prod.eanTributavel || 'SEM GTIN') +
            (0, xml_helper_1.tag)('cBarraTrib', prod.codigoBarrasTributavel) +
            (0, xml_helper_1.tag)('uTrib', prod.unidade) +
            (0, xml_helper_1.tag)('qTrib', (0, xml_helper_1.formatNumber)(prod.quantidade, 4)) +
            (0, xml_helper_1.tag)('vUnTrib', (0, xml_helper_1.formatNumber)(prod.valorUnitario, 10)) +
            (0, xml_helper_1.tag)('vFrete', prod.valorFrete ? (0, xml_helper_1.formatNumber)(prod.valorFrete, 2) : undefined) +
            (0, xml_helper_1.tag)('vSeg', prod.valorSeguro ? (0, xml_helper_1.formatNumber)(prod.valorSeguro, 2) : undefined) +
            (0, xml_helper_1.tag)('vDesc', prod.valorDesconto ? (0, xml_helper_1.formatNumber)(prod.valorDesconto, 2) : undefined) +
            (0, xml_helper_1.tag)('vOutro', prod.outrasDespesas ? (0, xml_helper_1.formatNumber)(prod.outrasDespesas, 2) : undefined) +
            (0, xml_helper_1.tag)('indTot', '1') +
            (0, xml_helper_1.tag)('indBemMovelUsado', prod.bemMovelUsado ? '1' : undefined) +
            (0, produto_groups_1.buildDeclaracoesImportacao)(prod.declaracoesImportacao) +
            (0, produto_groups_1.buildDetalhesExportacao)(prod.detalhesExportacao) +
            (0, xml_helper_1.tag)('xPed', prod.pedido) +
            (0, xml_helper_1.tag)('nItemPed', prod.itemPedido !== undefined ? String(prod.itemPedido) : undefined) +
            (0, xml_helper_1.tag)('nFCI', prod.fci) +
            (0, produto_groups_1.buildRastros)(prod.rastros) +
            (prod.produtoNFF
                ? (0, xml_helper_1.tagGroup)('infProdNFF', (0, xml_helper_1.tag)('cProdFisco', prod.produtoNFF.codigoFisco) +
                    (0, xml_helper_1.tag)('cOperNFF', prod.produtoNFF.codigoOperacao))
                : '') +
            (prod.embalagem
                ? (0, xml_helper_1.tagGroup)('infProdEmb', (0, xml_helper_1.tag)('xEmb', prod.embalagem.identificacao) +
                    (0, xml_helper_1.tag)('qVolEmb', (0, xml_helper_1.formatNumber)(prod.embalagem.volume, 3)) +
                    (0, xml_helper_1.tag)('uEmb', prod.embalagem.unidade))
                : '') +
            (0, produto_groups_1.buildProdutoEspecifico)(prod));
        const imposto = (0, imposto_groups_1.buildImpostos)(prod);
        return (0, xml_helper_1.tagGroup)('det', prodTag +
            imposto +
            (0, produto_groups_1.buildImpostoDevolvido)(prod.impostoDevolvido) +
            (0, xml_helper_1.tag)('infAdProd', prod.informacoesAdicionais) +
            (0, produto_groups_1.buildObservacaoItem)(prod.observacaoItem) +
            (0, xml_helper_1.tag)('vItem', prod.valorItem !== undefined ? (0, xml_helper_1.formatNumber)(prod.valorItem, 2) : undefined) +
            (0, produto_groups_1.buildDFeReferenciado)(prod.dfeReferenciado), `nItem="${nItem}"`);
    }
    buildCobranca(cobr) {
        if (!cobr)
            return '';
        let fat = '';
        if (cobr.fatura) {
            fat = (0, xml_helper_1.tagGroup)('fat', (0, xml_helper_1.tag)('nFat', cobr.fatura.nFat) +
                (0, xml_helper_1.tag)('vOrig', cobr.fatura.vOrig !== undefined ? (0, xml_helper_1.formatNumber)(cobr.fatura.vOrig, 2) : undefined) +
                (0, xml_helper_1.tag)('vDesc', cobr.fatura.vDesc !== undefined ? (0, xml_helper_1.formatNumber)(cobr.fatura.vDesc, 2) : undefined) +
                (0, xml_helper_1.tag)('vLiq', cobr.fatura.vLiq !== undefined ? (0, xml_helper_1.formatNumber)(cobr.fatura.vLiq, 2) : undefined));
        }
        let dups = '';
        if (cobr.duplicatas) {
            dups = cobr.duplicatas
                .map((dup) => (0, xml_helper_1.tagGroup)('dup', (0, xml_helper_1.tag)('nDup', dup.nDup) +
                (0, xml_helper_1.tag)('dVenc', dup.dVenc) +
                (0, xml_helper_1.tag)('vDup', (0, xml_helper_1.formatNumber)(dup.vDup, 2))))
                .join('');
        }
        return (0, xml_helper_1.tagGroup)('cobr', fat + dups);
    }
    buildPagamento(pag) {
        const detPag = pag.pagamentos
            .map((p) => {
            // Ordem exigida pelo leiaute: indPag, tPag, xPag, vPag, dPag,
            // (CNPJPag + UFPag), card.
            let content = (0, xml_helper_1.tag)('indPag', p.indicadorPagamento !== undefined ? String(p.indicadorPagamento) : undefined) +
                (0, xml_helper_1.tag)('tPag', p.formaPagamento) +
                (0, xml_helper_1.tag)('xPag', p.descricao) +
                (0, xml_helper_1.tag)('vPag', (0, xml_helper_1.formatNumber)(p.valor, 2)) +
                (0, xml_helper_1.tag)('dPag', p.dataPagamento ? (0, xml_helper_1.formatDateOnly)(p.dataPagamento) : undefined);
            // CNPJPag e UFPag formam uma sequencia opcional: ou os dois, ou nenhum.
            if (p.cnpjPagador && p.ufPagador) {
                content += (0, xml_helper_1.tag)('CNPJPag', p.cnpjPagador) + (0, xml_helper_1.tag)('UFPag', p.ufPagador);
            }
            if (p.tipoIntegracao !== undefined) {
                let cardContent = (0, xml_helper_1.tag)('tpIntegra', String(p.tipoIntegracao));
                if (p.cnpjCredenciadora)
                    cardContent += (0, xml_helper_1.tag)('CNPJ', p.cnpjCredenciadora);
                if (p.bandeira)
                    cardContent += (0, xml_helper_1.tag)('tBand', p.bandeira);
                if (p.autorizacao)
                    cardContent += (0, xml_helper_1.tag)('cAut', p.autorizacao);
                if (p.cnpjRecebedor)
                    cardContent += (0, xml_helper_1.tag)('CNPJReceb', p.cnpjRecebedor);
                if (p.idTerminalPagamento)
                    cardContent += (0, xml_helper_1.tag)('idTermPag', p.idTerminalPagamento);
                content += (0, xml_helper_1.tagGroup)('card', cardContent);
            }
            return (0, xml_helper_1.tagGroup)('detPag', content);
        })
            .join('');
        let troco = '';
        if (pag.troco && pag.troco > 0) {
            troco = (0, xml_helper_1.tag)('vTroco', (0, xml_helper_1.formatNumber)(pag.troco, 2));
        }
        return (0, xml_helper_1.tagGroup)('pag', detPag + troco);
    }
}
exports.DefaultXmlBuilder = DefaultXmlBuilder;
