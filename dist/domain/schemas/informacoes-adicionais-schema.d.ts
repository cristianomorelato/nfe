import { z } from 'zod/v4';
export declare const observacaoSchema: z.ZodObject<{
    campo: z.ZodString;
    texto: z.ZodString;
}, z.core.$strip>;
export declare const processoReferenciadoSchema: z.ZodObject<{
    numero: z.ZodString;
    origem: z.ZodUnion<[z.ZodUnion<[z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<0>, z.ZodLiteral<1>]>, z.ZodLiteral<2>]>, z.ZodLiteral<3>]>, z.ZodLiteral<9>]>;
    tipoAto: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const canaSchema: z.ZodObject<{
    safra: z.ZodString;
    referencia: z.ZodString;
    fornecimentosDiarios: z.ZodArray<z.ZodObject<{
        dia: z.ZodInt;
        quantidade: z.ZodNumber;
    }, z.core.$strip>>;
    totalMes: z.ZodNumber;
    totalAnterior: z.ZodNumber;
    totalGeral: z.ZodNumber;
    deducoes: z.ZodOptional<z.ZodArray<z.ZodObject<{
        descricao: z.ZodString;
        valor: z.ZodNumber;
    }, z.core.$strip>>>;
    valorFornecimento: z.ZodNumber;
    valorTotalDeducao: z.ZodNumber;
    valorLiquido: z.ZodNumber;
}, z.core.$strip>;
export declare const agropecuarioSchema: z.ZodUnion<readonly [z.ZodObject<{
    defensivos: z.ZodArray<z.ZodObject<{
        receituario: z.ZodString;
        cpfResponsavelTecnico: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
    guiaTransito: z.ZodObject<{
        tipo: z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<1>, z.ZodLiteral<2>]>, z.ZodLiteral<3>]>;
        uf: z.ZodString;
        serie: z.ZodOptional<z.ZodString>;
        numero: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>]>;
//# sourceMappingURL=informacoes-adicionais-schema.d.ts.map