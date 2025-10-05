import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus, Calculator } from "lucide-react";

interface SimulationStepProps {
  loanData: any;
}

export const SimulationStep = ({ loanData }: SimulationStepProps) => {
  const creditScore = 720;
  const estimatedRate = 1.8;
  const amount = parseFloat(loanData.amount) || 50000;
  const duration = parseInt(loanData.duration) || 12;
  const monthlyPayment = (amount * (1 + (estimatedRate / 100))) / duration;

  const scoreLevel = creditScore >= 700 ? "Bom" : creditScore >= 600 ? "Médio" : "Baixo";
  const scoreColor = creditScore >= 700 ? "text-primary" : creditScore >= 600 ? "text-yellow-600" : "text-destructive";

  const factors = [
    { label: "Histórico de pagamentos", status: "positive", icon: TrendingUp },
    { label: "Tempo de atividade", status: "positive", icon: TrendingUp },
    { label: "Crédito disponível", status: "neutral", icon: Minus },
    { label: "Consultas recentes", status: "attention", icon: TrendingDown },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">Simulação de crédito</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Veja as condições estimadas para seu empréstimo
        </p>
      </div>

      {/* Credit Score Card */}
      <Card className="border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Seu score atual</p>
              <p className={`text-4xl font-bold ${scoreColor}`}>{creditScore}</p>
              <Badge className="mt-2 bg-primary/10 text-primary">
                {scoreLevel}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Taxa estimada</p>
              <p className="text-3xl font-bold text-primary">{estimatedRate}%</p>
              <p className="text-xs text-muted-foreground">ao mês</p>
            </div>
          </div>
          
          <Progress value={(creditScore / 850) * 100} className="h-2 mb-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>300</span>
            <span>850</span>
          </div>
        </CardContent>
      </Card>

      {/* Loan Simulation */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="w-5 h-5 text-primary" />
            <h4 className="font-semibold">Simulação do empréstimo</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">Valor solicitado</p>
              <p className="text-xl font-bold">R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">Prazo</p>
              <p className="text-xl font-bold">{duration} meses</p>
            </div>
            <div className="bg-primary/10 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">Parcela mensal</p>
              <p className="text-xl font-bold text-primary">
                R$ {monthlyPayment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Valor total a pagar:</strong> R$ {(monthlyPayment * duration).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Credit Factors */}
      <Card>
        <CardContent className="p-6">
          <h4 className="font-semibold mb-4">Fatores que influenciam seu score</h4>
          <div className="space-y-3">
            {factors.map((factor, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <factor.icon
                    className={`w-5 h-5 ${
                      factor.status === "positive"
                        ? "text-primary"
                        : factor.status === "attention"
                        ? "text-yellow-600"
                        : "text-muted-foreground"
                    }`}
                  />
                  <span className="text-sm">{factor.label}</span>
                </div>
                <Badge
                  className={
                    factor.status === "positive"
                      ? "bg-primary/10 text-primary"
                      : factor.status === "attention"
                      ? "bg-yellow-500/10 text-yellow-700 dark:text-yellow-500"
                      : "bg-muted text-muted-foreground"
                  }
                >
                  {factor.status === "positive"
                    ? "Positivo"
                    : factor.status === "attention"
                    ? "Atenção"
                    : "Neutro"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
