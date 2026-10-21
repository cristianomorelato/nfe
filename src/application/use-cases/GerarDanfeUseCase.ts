import { NFeError } from '@nfe/shared/errors/NFeError';
import { parseNFeXml } from '@nfe/infra/danfe/xml-parser';
import { DanfeGenerator } from '@nfe/infra/danfe/DanfeGenerator';

export type { DanfeData } from '@nfe/infra/danfe/xml-parser';

export type GerarDanfeOptions = {
  readonly logo?: Buffer;
  readonly email?: string;
};

export class GerarDanfeUseCase {
  private readonly generator: DanfeGenerator;

  constructor() {
    this.generator = new DanfeGenerator();
  }

  /**
   * Gera PDF do DANFE a partir do XML autorizado.
   * Requer pdfkit instalado como dependencia.
   */
  async execute(xml: string, options?: GerarDanfeOptions): Promise<Buffer> {
    if (!xml || !xml.includes('<infNFe')) {
      throw new NFeError('XML invalido: deve conter elemento <infNFe>');
    }

    const data = parseNFeXml(xml);
    return this.generator.generate({
      ...data,
      logo: options?.logo,
      emitente: { ...data.emitente, email: options?.email }
    });
  }
}
