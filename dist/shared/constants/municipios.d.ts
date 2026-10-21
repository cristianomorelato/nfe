/**
 * Municipios brasileiros com seus codigos IBGE de 7 digitos (campo cMun do XML).
 *
 * Os dois primeiros digitos do codigo sao o codigo IBGE da UF, entao a UF de um
 * municipio pode ser derivada do proprio codigo — veja `getUfDoMunicipio`.
 *
 * Fonte: IBGE — https://servicodados.ibge.gov.br/api/v1/localidades/municipios
 * Total: 5571 municipios.
 *
 * Os nomes estao acentuados, como na tabela oficial. O XmlBuilder remove os
 * acentos na hora de montar o XML.
 */
export declare const MUNICIPIOS: Record<string, string>;
//# sourceMappingURL=municipios.d.ts.map