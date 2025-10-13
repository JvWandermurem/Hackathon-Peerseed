import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { AnaliseResponse } from "@/models/Analise";
import analiseService from "@/services/analiseService";

export const CreditScoreCard = () => {
  const [analise, setAnalise] = useState<AnaliseResponse | null>(null);

  useEffect(() => {
    const fetchAnalise = async () => {
      try {
        const data = await analiseService.getMeuScore();
        setAnalise(data);
      } catch (err: any) {
        if (err.response?.status === 404) {
          console.warn("Nenhuma análise de crédito encontrada.");
          setAnalise({
            status: "NENHUMA_SOLICITACAO",
            prazo_meses: 0,
            score_risco: null,
            taxa_juros_anual: 0,
            valor_solicitado: 0,
            cultura: "",
            pontos_positivos: [],
            sugestoes_melhora: [],
          });
        } else {
          console.error("Erro ao buscar análise:", err);
        }
      }
    };
    fetchAnalise();
  }, []);

  if (!analise) return <p>Carregando...</p>; // ou skeleton

  const score = analise.score_risco
    ? scoreEnumToNumber(analise.score_risco)
    : 0;
  const maxScore = 1000;
  const percentage = (score / maxScore) * 100;

  function scoreEnumToNumber(risco: string) {
    switch (risco) {
      case "A":
        return 900;
      case "B":
        return 800;
      case "C":
        return 650;
      case "D":
        return 550;
      case "E":
        return 400;
      default:
        return 0;
    }
  }

  const getScoreLabel = (score: number) => {
    if (score < 500) return "RUIM";
    if (score < 600) return "REGULAR";
    if (score < 700) return "BOM";
    if (score < 800) return "MUITO BOM";
    return "EXCELENTE";
  };

  return (
    <Card className="p-6 bg-muted border-border shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg text-foreground">Score de crédito</h3>
        <span className="text-2xl font-bold text-primary">{getScoreLabel(score)}</span>
      </div>

      <div className="mb-2">
        <div className="flex items-end justify-between mb-2">
          <span className="text-3xl font-bold text-foreground">{score}</span>
          <span className="text-sm text-muted-foreground">/ {maxScore}</span>
        </div>
      </div>

      {/* Score bar */}
      <div className="relative h-3 bg-background rounded-full overflow-hidden mb-3">
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-destructive via-status-pending to-primary rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      {/* Scale markers */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0</span>
        <span>500</span>
        <span>700</span>
        <span>1000</span>
      </div>
    </Card>
  );
};
