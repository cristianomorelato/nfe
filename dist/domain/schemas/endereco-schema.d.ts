import { z } from 'zod/v4';
export declare const enderecoSchema: z.ZodObject<{
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
//# sourceMappingURL=endereco-schema.d.ts.map