import { z } from 'zod/v4';
export declare const destinatarioSchema: z.ZodObject<{
    cpf: z.ZodOptional<z.ZodString>;
    cnpj: z.ZodOptional<z.ZodString>;
    idEstrangeiro: z.ZodOptional<z.ZodString>;
    nome: z.ZodString;
    email: z.ZodOptional<z.ZodEmail>;
    inscricaoEstadual: z.ZodOptional<z.ZodString>;
    inscricaoSuframa: z.ZodOptional<z.ZodString>;
    inscricaoMunicipal: z.ZodOptional<z.ZodString>;
    indicadorIE: z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<1>, z.ZodLiteral<2>]>, z.ZodLiteral<9>]>;
    endereco: z.ZodObject<{
        logradouro: z.ZodString;
        numero: z.ZodString;
        complemento: z.ZodOptional<z.ZodString>;
        bairro: z.ZodString;
        codigoMunicipio: z.ZodString;
        municipio: z.ZodString;
        uf: z.ZodString;
        cep: z.ZodString;
        codigoPais: z.ZodDefault<z.ZodString>;
        pais: z.ZodDefault<z.ZodString>;
        telefone: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=destinatario-schema.d.ts.map