import { z } from 'zod/v4';
export declare const faturaSchema: z.ZodObject<{
    nFat: z.ZodOptional<z.ZodString>;
    vOrig: z.ZodOptional<z.ZodNumber>;
    vDesc: z.ZodOptional<z.ZodNumber>;
    vLiq: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const duplicataSchema: z.ZodObject<{
    nDup: z.ZodString;
    dVenc: z.ZodString;
    vDup: z.ZodNumber;
}, z.core.$strip>;
export declare const cobrancaSchema: z.ZodObject<{
    fatura: z.ZodOptional<z.ZodObject<{
        nFat: z.ZodOptional<z.ZodString>;
        vOrig: z.ZodOptional<z.ZodNumber>;
        vDesc: z.ZodOptional<z.ZodNumber>;
        vLiq: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    duplicatas: z.ZodOptional<z.ZodArray<z.ZodObject<{
        nDup: z.ZodString;
        dVenc: z.ZodString;
        vDup: z.ZodNumber;
    }, z.core.$strip>>>;
}, z.core.$strip>;
//# sourceMappingURL=cobranca-schema.d.ts.map