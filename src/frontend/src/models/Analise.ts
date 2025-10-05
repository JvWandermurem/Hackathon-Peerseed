// src/models/Analise.ts
export type StatusCpr = "ANALISE" | "CAPTAÇÃO" | "FINANCIADO" | "EM_PAGAMENTO" | "QUITADO" | "INADIMPLENTE";
export type Risco = "A" | "B" | "C" | "D" | "E";

export interface AnaliseResponse {
  id: string;
  agricultor_id: string;
  valor_solicitado: number;
  prazo_meses: number;
  taxa_juros_anual: number | null;
  cultura: string;
  finalidade?: string;
  hectares?: number;
  possui_car?: boolean;
  possui_certificacao?: boolean;
  status: StatusCpr;
  score_risco?: Risco;
  data_emissao?: string;
  data_criacao: string;
  // Campos calculados pelo scoring
  pontos_positivos?: string[];
  sugestoes_melhora?: string[];
}

export enum StatusCpr {
  ANALISE = "ANALISE",
  CAPTACAO = "CAPTAÇÃO",
  FINANCIADO = "FINANCIADO",
  EM_PAGAMENTO = "EM_PAGAMENTO",
  QUITADO = "QUITADO",
  INADIMPLENTE = "INADIMPLENTE",
  NENHUMA = "NENHUMA_SOLICITACAO", // para casos sem análise
}
