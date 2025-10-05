import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, TrendingUp, Clock, FileCheck, MapPin } from "lucide-react";

export const ScoreFactors = () => {
  const positiveFactors = [
    {
      icon: TrendingUp,
      label: "Produtividade por hectare acima da média",
      impact: "+45 pontos",
    },
    {
      icon: FileCheck,
      label: "Documentação completa e atualizada",
      impact: "+30 pontos",
    },
    {
      icon: MapPin,
      label: "CAR regularizado",
      impact: "+25 pontos",
    },
  ];

  const attentionPoints = [
    {
      icon: Clock,
      label: "Histórico de atrasos médios de 7 dias",
      impact: "-20 pontos",
    },
    {
      icon: AlertTriangle,
      label: "Ausência de certificações sustentáveis",
      impact: "-15 pontos",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalhamento do Score</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Positive Factors */}
        <div>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            Fatores positivos
          </h4>
          <div className="space-y-3">
            {positiveFactors.map((factor, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10"
              >
                <factor.icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{factor.label}</p>
                  <p className="text-xs text-primary font-medium mt-1">{factor.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attention Points */}
        <div>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            Pontos de atenção
          </h4>
          <div className="space-y-3">
            {attentionPoints.map((factor, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20"
              >
                <factor.icon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{factor.label}</p>
                  <p className="text-xs text-yellow-600 font-medium mt-1">{factor.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
