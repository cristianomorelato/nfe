import { z } from 'zod/v4';
export declare const localSchema: z.ZodObject<{
    cnpj: z.ZodOptional<z.ZodString>;
    cpf: z.ZodOptional<z.ZodString>;
    nome: z.ZodOptional<z.ZodString>;
    logradouro: z.ZodString;
    numero: z.ZodString;
    complemento: z.ZodOptional<z.ZodString>;
    bairro: z.ZodString;
    codigoMunicipio: z.ZodString;
    municipio: z.ZodString;
    uf: z.ZodString;
    cep: z.ZodOptional<z.ZodString>;
    codigoPais: z.ZodOptional<z.ZodString>;
    pais: z.ZodOptional<z.ZodString>;
    telefone: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodEmail>;
    inscricaoEstadual: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const avulsaSchema: z.ZodObject<{
    cnpj: z.ZodString;
    orgao: z.ZodString;
    matricula: z.ZodString;
    agente: z.ZodString;
    telefone: z.ZodOptional<z.ZodString>;
    uf: z.ZodString;
    numeroDar: z.ZodOptional<z.ZodString>;
    dataEmissaoDar: z.ZodOptional<z.ZodDate>;
    valorDar: z.ZodOptional<z.ZodNumber>;
    reparticaoEmitente: z.ZodString;
    dataPagamento: z.ZodOptional<z.ZodDate>;
}, z.core.$strip>;
export declare const intermediadorSchema: z.ZodObject<{
    cnpj: z.ZodString;
    identificadorVendedor: z.ZodString;
}, z.core.$strip>;
export declare const exportacaoSchema: z.ZodObject<{
    ufSaida: z.ZodString;
    localExportacao: z.ZodString;
    localDespacho: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const compraSchema: z.ZodObject<{
    notaEmpenho: z.ZodOptional<z.ZodString>;
    pedido: z.ZodOptional<z.ZodString>;
    contrato: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=local-schema.d.ts.map