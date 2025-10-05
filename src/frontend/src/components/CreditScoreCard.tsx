import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export const CreditScoreCard = () => {
  const score = 774;
  const maxScore = 1000;
  const percentage = (score / maxScore) * 100;

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
