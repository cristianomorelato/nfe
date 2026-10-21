"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MT_MUNICIPIOS = exports.CODIGO_PAIS_BRASIL = exports.PAISES = exports.MUNICIPIOS = exports.UF_CODES = void 0;
exports.getMunicipio = getMunicipio;
exports.getUfDoMunicipio = getUfDoMunicipio;
exports.findCodigoMunicipio = findCodigoMunicipio;
exports.getMunicipiosDaUf = getMunicipiosDaUf;
exports.getPais = getPais;
const core_1 = require("@brasil-fiscal/core");
const municipios_1 = require("./municipios");
const paises_1 = require("./paises");
var core_2 = require("@brasil-fiscal/core");
Object.defineProperty(exports, "UF_CODES", { enumerable: true, get: function () { return core_2.UF_CODES; } });
var municipios_2 = require("./municipios");
Object.defineProperty(exports, "MUNICIPIOS", { enumerable: true, get: function () { return municipios_2.MUNICIPIOS; } });
var paises_2 = require("./paises");
Object.defineProperty(exports, "PAISES", { enumerable: true, get: function () { return paises_2.PAISES; } });
/**
 * Codigo do Brasil na tabela de paises (campo cPais). Padrao para enderecos nacionais.
 */
exports.CODIGO_PAIS_BRASIL = '1058';
const UF_BY_CODE = Object.fromEntries(Object.entries(core_1.UF_CODES).map(([uf, codigo]) => [codigo, uf]));
/**
 * Normaliza um nome de municipio para comparacao: sem acentos, sem pontuacao,
 * caixa alta e espacos colapsados. 'Sao Jose dos Quatro Marcos' e
 * 'SÃO JOSÉ DOS  QUATRO MARCOS' viram a mesma chave.
 */
function normalizeNome(nome) {
    return (0, core_1.stripAccents)(nome)
        .toUpperCase()
        .replace(/[^A-Z0-9 ]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}
let nomeIndex = null;
/**
 * Indice `UF|NOME_NORMALIZADO` -> codigo IBGE, construido na primeira busca por
 * nome. Municipios homonimos existem entre UFs diferentes (Bom Jesus, por
 * exemplo), por isso a UF faz parte da chave.
 */
function getNomeIndex() {
    if (nomeIndex)
        return nomeIndex;
    const index = new Map();
    for (const [codigo, nome] of Object.entries(municipios_1.MUNICIPIOS)) {
        const uf = UF_BY_CODE[codigo.slice(0, 2)];
        if (!uf)
            continue;
        index.set(`${uf}|${normalizeNome(nome)}`, codigo);
    }
    nomeIndex = index;
    return index;
}
/**
 * Nome do municipio a partir do codigo IBGE de 7 digitos.
 */
function getMunicipio(codigo) {
    return municipios_1.MUNICIPIOS[codigo];
}
/**
 * UF do municipio, derivada dos dois primeiros digitos do codigo IBGE.
 * Retorna undefined se o codigo nao existir na tabela.
 */
function getUfDoMunicipio(codigo) {
    if (!municipios_1.MUNICIPIOS[codigo])
        return undefined;
    return UF_BY_CODE[codigo.slice(0, 2)];
}
/**
 * Codigo IBGE a partir da UF e do nome do municipio. A comparacao ignora
 * acentos, caixa e pontuacao.
 */
function findCodigoMunicipio(uf, nome) {
    return getNomeIndex().get(`${uf.toUpperCase()}|${normalizeNome(nome)}`);
}
/**
 * Lista os municipios de uma UF, em ordem de codigo IBGE.
 */
function getMunicipiosDaUf(uf) {
    const codigoUf = core_1.UF_CODES[uf.toUpperCase()];
    if (!codigoUf)
        return [];
    return Object.entries(municipios_1.MUNICIPIOS)
        .filter(([codigo]) => codigo.startsWith(codigoUf))
        .map(([codigo, nome]) => ({ codigo, nome }));
}
/**
 * Nome do pais a partir do codigo da tabela BACEN (campo cPais).
 */
function getPais(codigo) {
    return paises_1.PAISES[codigo];
}
/**
 * Municipios do Mato Grosso.
 *
 * @deprecated Use `MUNICIPIOS` (tabela nacional completa) ou `getMunicipiosDaUf('MT')`.
 */
exports.MT_MUNICIPIOS = Object.fromEntries(Object.entries(municipios_1.MUNICIPIOS).filter(([codigo]) => codigo.startsWith('51')));
