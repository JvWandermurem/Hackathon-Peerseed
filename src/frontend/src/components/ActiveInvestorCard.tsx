import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingUp } from "lucide-react";

export const ActiveInvestorCard = () => {
  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          Investidor ativo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Saldo disponível</p>
          <p className="text-3xl font-bold text-foreground">R$ 1.200,00</p>
        </div>
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Retorno acumulado
          </p>
          <p className="text-2xl font-semibold text-primary">+R$ 350,00</p>
        </div>
      </CardContent>
    </Card>
  );
};
