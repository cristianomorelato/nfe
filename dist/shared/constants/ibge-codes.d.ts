export { UF_CODES } from '@brasil-fiscal/core';
export { MUNICIPIOS } from './municipios';
export { PAISES } from './paises';
/**
 * Codigo do Brasil na tabela de paises (campo cPais). Padrao para enderecos nacionais.
 */
export declare const CODIGO_PAIS_BRASIL = "1058";
/**
 * Nome do municipio a partir do codigo IBGE de 7 digitos.
 */
export declare function getMunicipio(codigo: string): string | undefined;
/**
 * UF do municipio, derivada dos dois primeiros digitos do codigo IBGE.
 * Retorna undefined se o codigo nao existir na tabela.
 */
export declare function getUfDoMunicipio(codigo: string): string | undefined;
/**
 * Codigo IBGE a partir da UF e do nome do municipio. A comparacao ignora
 * acentos, caixa e pontuacao.
 */
export declare function findCodigoMunicipio(uf: string, nome: string): string | undefined;
/**
 * Lista os municipios de uma UF, em ordem de codigo IBGE.
 */
export declare function getMunicipiosDaUf(uf: string): Array<{
    codigo: string;
    nome: string;
}>;
/**
 * Nome do pais a partir do codigo da tabela BACEN (campo cPais).
 */
export declare function getPais(codigo: string): string | undefined;
/**
 * Municipios do Mato Grosso.
 *
 * @deprecated Use `MUNICIPIOS` (tabela nacional completa) ou `getMunicipiosDaUf('MT')`.
 */
export declare const MT_MUNICIPIOS: Record<string, string>;
//# sourceMappingURL=ibge-codes.d.ts.map