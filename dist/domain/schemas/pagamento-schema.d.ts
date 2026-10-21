import { z } from 'zod/v4';
export declare const formaPagamentoSchema: z.ZodObject<{
    formaPagamento: z.ZodString;
    valor: z.ZodNumber;
    indicadorPagamento: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<0>, z.ZodLiteral<1>]>>;
    descricao: z.ZodOptional<z.ZodString>;
    dataPagamento: z.ZodOptional<z.ZodDate>;
    cnpjPagador: z.ZodOptional<z.ZodString>;
    ufPagador: z.ZodOptional<z.ZodString>;
    tipoIntegracao: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<1>, z.ZodLiteral<2>]>>;
    cnpjCredenciadora: z.ZodOptional<z.ZodString>;
    bandeira: z.ZodOptional<z.ZodString>;
    autorizacao: z.ZodOptional<z.ZodString>;
    cnpjRecebedor: z.ZodOptional<z.ZodString>;
    idTerminalPagamento: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const pagamentoSchema: z.ZodObject<{
    pagamentos: z.ZodArray<z.ZodObject<{
        formaPagamento: z.ZodString;
        valor: z.ZodNumber;
        indicadorPagamento: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<0>, z.ZodLiteral<1>]>>;
        descricao: z.ZodOptional<z.ZodString>;
        dataPagamento: z.ZodOptional<z.ZodDate>;
        cnpjPagador: z.ZodOptional<z.ZodString>;
        ufPagador: z.ZodOptional<z.ZodString>;
        tipoIntegracao: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<1>, z.ZodLiteral<2>]>>;
        cnpjCredenciadora: z.ZodOptional<z.ZodString>;
        bandeira: z.ZodOptional<z.ZodString>;
        autorizacao: z.ZodOptional<z.ZodString>;
        cnpjRecebedor: z.ZodOptional<z.ZodString>;
        idTerminalPagamento: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    troco: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
//# sourceMappingURL=pagamento-schema.d.ts.map