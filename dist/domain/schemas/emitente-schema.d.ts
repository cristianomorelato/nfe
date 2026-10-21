import { z } from 'zod/v4';
export declare const emitenteSchema: z.ZodObject<{
    cnpj: z.ZodString;
    razaoSocial: z.ZodString;
    nomeFantasia: z.ZodOptional<z.ZodString>;
    inscricaoEstadual: z.ZodString;
    inscricaoEstadualST: z.ZodOptional<z.ZodString>;
    inscricaoMunicipal: z.ZodOptional<z.ZodString>;
    regimeTributario: z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<1>, z.ZodLiteral<2>]>, z.ZodLiteral<3>]>;
    cnae: z.ZodOptional<z.ZodString>;
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
//# sourceMappingURL=emitente-schema.d.ts.map