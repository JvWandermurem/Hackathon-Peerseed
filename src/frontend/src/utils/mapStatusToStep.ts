// utils/mapStatusToStep.ts
import { StatusCpr } from "@/models/Analise";

export const mapStatusToStep = (status: StatusCpr): number => {
  switch (status) {
    case StatusCpr.ANALISE:
      return 2; // "Em análise"
    case StatusCpr.CAPTACAO:
      return 1; // "Solicitação"
    case StatusCpr.FINANCIADO:
      return 4; // "Aprovação"
    case StatusCpr.EM_PAGAMENTO:
      return 4; // ainda aprovada, mas em pagamento
    case StatusCpr.QUITADO:
      return 4; // finalizado
    case StatusCpr.INADIMPLENTE:
      return 3; // documentação aprovada, mas problema de pagamento
    default:
      return 1; // fallback
  }
};
