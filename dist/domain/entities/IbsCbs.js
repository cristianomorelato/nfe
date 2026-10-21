"use strict";
/**
 * Grupo IBS/CBS do item (tipo TTribNFe), da reforma tributaria do consumo
 * (EC 132/2023, LC 214/2025, NT 2025.002).
 *
 * A tributacao normal usa `gIBSCBS`. Os regimes especiais entram como
 * subgrupos: diferimento (`gDif`), reducao de aliquota (`gRed`), devolucao de
 * tributo (`gDevTrib`), tributacao regular de comparacao (`gTribRegular`) e
 * compra governamental (`gTribCompraGov`).
 *
 * Alternativas ao `gIBSCBS`, mutuamente exclusivas: monofasia
 * (`gIBSCBSMono`), transferencia de credito (`gTransfCred`) e ajuste de
 * competencia (`gAjusteCompet`).
 */
Object.defineProperty(exports, "__esModule", { value: true });
