import { z } from 'zod/v4';
export declare const volumeSchema: z.ZodObject<{
    quantidade: z.ZodOptional<z.ZodNumber>;
    especie: z.ZodOptional<z.ZodString>;
    marca: z.ZodOptional<z.ZodString>;
    numeracao: z.ZodOptional<z.ZodString>;
    pesoLiquido: z.ZodOptional<z.ZodNumber>;
    pesoBruto: z.ZodOptional<z.ZodNumber>;
    lacres: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export declare const veiculoTranspSchema: z.ZodObject<{
    placa: z.ZodOptional<z.ZodString>;
    uf: z.ZodOptional<z.ZodString>;
    rntc: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const retencaoTransporteSchema: z.ZodObject<{
    valorServico: z.ZodNumber;
    baseCalculoRetencao: z.ZodNumber;
    aliquotaRetencao: z.ZodNumber;
    valorRetencao: z.ZodNumber;
    cfop: z.ZodString;
    codigoMunicipio: z.ZodString;
}, z.core.$strip>;
export declare const transporteSchema: z.ZodObject<{
    modalidadeFrete: z.ZodUnion<[z.ZodUnion<[z.ZodUnion<[z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<0>, z.ZodLiteral<1>]>, z.ZodLiteral<2>]>, z.ZodLiteral<3>]>, z.ZodLiteral<4>]>, z.ZodLiteral<9>]>;
    cnpjTransportadora: z.ZodOptional<z.ZodString>;
    cpfTransportadora: z.ZodOptional<z.ZodString>;
    nomeTransportadora: z.ZodOptional<z.ZodString>;
    inscricaoEstadual: z.ZodOptional<z.ZodString>;
    endereco: z.ZodOptional<z.ZodString>;
    municipio: z.ZodOptional<z.ZodString>;
    uf: z.ZodOptional<z.ZodString>;
    retencao: z.ZodOptional<z.ZodObject<{
        valorServico: z.ZodNumber;
        baseCalculoRetencao: z.ZodNumber;
        aliquotaRetencao: z.ZodNumber;
        valorRetencao: z.ZodNumber;
        cfop: z.ZodString;
        codigoMunicipio: z.ZodString;
    }, z.core.$strip>>;
    veiculo: z.ZodOptional<z.ZodObject<{
        placa: z.ZodOptional<z.ZodString>;
        uf: z.ZodOptional<z.ZodString>;
        rntc: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    reboques: z.ZodOptional<z.ZodArray<z.ZodObject<{
        placa: z.ZodOptional<z.ZodString>;
        uf: z.ZodOptional<z.ZodString>;
        rntc: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    vagao: z.ZodOptional<z.ZodString>;
    balsa: z.ZodOptional<z.ZodString>;
    volumes: z.ZodOptional<z.ZodArray<z.ZodObject<{
        quantidade: z.ZodOptional<z.ZodNumber>;
        especie: z.ZodOptional<z.ZodString>;
        marca: z.ZodOptional<z.ZodString>;
        numeracao: z.ZodOptional<z.ZodString>;
        pesoLiquido: z.ZodOptional<z.ZodNumber>;
        pesoBruto: z.ZodOptional<z.ZodNumber>;
        lacres: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
//# sourceMappingURL=transporte-schema.d.ts.map