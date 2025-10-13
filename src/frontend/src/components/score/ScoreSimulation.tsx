import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, ArrowRight, Upload } from "lucide-react";

interface ScoreSimulationProps {
  currentScore: number;
}

export const ScoreSimulation = ({ currentScore }: ScoreSimulationProps) => {
  const improvements = [
    {
      action: "Adicionar certificação de práticas sustentáveis",
      scoreIncrease: 50,
      rateReduction: 1.2,
      newCategory: "B",
    },
    {
      action: "Regularizar pagamentos nos próximos 3 meses",
      scoreIncrease: 35,
      rateReduction: 0.8,
      newCategory: "B",
    },
    {
      action: "Enviar comprovantes de produtividade recente",
      scoreIncrease: 25,
      rateReduction: 0.5,
      newCategory: "B",
    },
  ];

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          Como melhorar seu score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Veja ações que você pode tomar agora para aumentar seu score e obter melhores taxas
        </p>

        <div className="space-y-3">
          {improvements.map((improvement, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-muted/50 border border-border hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm font-medium pr-2">{improvement.action}</p>
                <Badge className="bg-primary/10 text-primary flex-shrink-0">
                  +{improvement.scoreIncrease}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <span>Score previsto:</span>
                  <span className="font-semibold text-primary">
                    {currentScore + improvement.scoreIncrease}
                  </span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <span>Nova categoria:</span>
                  <span className="font-semibold text-primary">{improvement.newCategory}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs">
                  <span className="text-muted-foreground">Redução de taxa:</span>{" "}
                  <span className="font-semibold text-primary">
                    -{improvement.rateReduction}% a.m.
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-primary" />
              </div>
            </div>
          ))}
        </div>

        <Button className="w-full gap-2">
          <Upload className="w-4 h-4" />
          Adicionar documentação agora
        </Button>
      </CardContent>
    </Card>
  );
};
