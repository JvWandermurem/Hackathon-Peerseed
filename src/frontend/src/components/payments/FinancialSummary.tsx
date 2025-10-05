import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Wallet, Calendar, DollarSign } from "lucide-react";

interface FinancialSummaryProps {
  data: {
    totalLoan: number;
    outstandingBalance: number;
    accumulatedInterest: number;
    nextPayment: {
      date: string;
      amount: number;
    };
  };
}

export const FinancialSummary = ({ data }: FinancialSummaryProps) => {
  const paidPercentage = ((data.totalLoan - data.outstandingBalance) / data.totalLoan) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card className="border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Valor total</p>
          </div>
          <p className="text-2xl font-bold">
            R$ {data.totalLoan.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {paidPercentage.toFixed(0)}% pago
          </p>
        </CardContent>
      </Card>

      <Card className="border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm text-muted-foreground">Saldo devedor</p>
          </div>
          <p className="text-2xl font-bold text-blue-600">
            R$ {data.outstandingBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Valor restante
          </p>
        </CardContent>
      </Card>

      <Card className="border-yellow-500/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-sm text-muted-foreground">Juros acumulados</p>
          </div>
          <p className="text-2xl font-bold text-yellow-600">
            R$ {data.accumulatedInterest.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Até a data atual
          </p>
        </CardContent>
      </Card>

      <Card className="bg-primary/10 border-primary">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm text-foreground font-medium">Próxima parcela</p>
          </div>
          <p className="text-2xl font-bold text-primary">
            R$ {data.nextPayment.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-foreground mt-1">
            Vence em {data.nextPayment.date}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
