import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Clock, Target, Shield, Leaf } from "lucide-react";

interface OpportunityCardProps {
  opportunity: {
    id: number;
    farmer: string;
    amount: number;
    rate: number;
    duration: number;
    purpose: string;
    risk: "Baixo" | "Médio" | "Alto";
    category?: "producao" | "evento";
    score?: string;
    funded?: number;
    impact?: string[];
  };
}

export const OpportunityCard = ({ opportunity }: OpportunityCardProps) => {
  const riskColors = {
    Baixo: "bg-primary/10 text-primary",
    Médio: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-500",
    Alto: "bg-destructive/10 text-destructive",
  };

  const scoreColors: Record<string, string> = {
    A: "bg-primary/10 text-primary",
    B: "bg-primary/10 text-primary",
    C: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-500",
    D: "bg-orange-500/10 text-orange-700 dark:text-orange-500",
    E: "bg-destructive/10 text-destructive",
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <CardTitle className="text-lg">{opportunity.farmer}</CardTitle>
          {opportunity.score && (
            <Badge className={`${scoreColors[opportunity.score]} whitespace-nowrap flex-shrink-0`}>
              <Shield className="w-3 h-3 mr-1" />
              Score {opportunity.score}
            </Badge>
          )}
          {!opportunity.score && (
            <Badge className={`${riskColors[opportunity.risk]} whitespace-nowrap flex-shrink-0`}>{opportunity.risk}</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={opportunity.category === "evento" ? "border-purple-500 text-purple-700 dark:text-purple-400" : "border-primary text-primary"}>
            {opportunity.category === "evento" ? "🎪 Evento do Agro" : "🌱 Produção Rural"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Valor</span>
            <span className="font-semibold">R$ {opportunity.amount.toLocaleString('pt-BR')}</span>
          </div>
          {opportunity.funded !== undefined && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Captado</span>
                <span className="font-semibold text-primary">{opportunity.funded}%</span>
              </div>
              <Progress value={opportunity.funded} className="h-2" />
            </div>
          )}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Taxa
            </span>
            <span className="font-semibold text-primary">{opportunity.rate}% a.a.</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Prazo
            </span>
            <span className="font-semibold">{opportunity.duration} meses</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Target className="w-3 h-3" />
              Cultura
            </span>
            <span className="font-semibold">{opportunity.purpose}</span>
          </div>
        </div>
        {opportunity.impact && opportunity.impact.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {opportunity.impact.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs whitespace-nowrap">
                <Leaf className="w-3 h-3 mr-1 flex-shrink-0" />
                {tag}
              </Badge>
            ))}
          </div>
        )}
        <Button className="w-full">Investir</Button>
      </CardContent>
    </Card>
  );
};
