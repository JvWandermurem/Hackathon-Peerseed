import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertTriangle, Calendar, CreditCard, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Payment {
  id: number;
  number: string;
  amount: number;
  status: "pago" | "pendente" | "em_atraso" | "futuro";
  dueDate: string;
  paymentMethod: string | null;
  paidDate: string | null;
  daysLate?: number;
}

interface PaymentsListProps {
  payments: Payment[];
  onPayNow: (payment: Payment) => void;
}

export const PaymentsList = ({ payments, onPayNow }: PaymentsListProps) => {
  const { toast } = useToast();

  const statusConfig = {
    pago: {
      icon: CheckCircle2,
      label: "Pago",
      className: "bg-primary/10 text-primary border-primary/20",
      iconColor: "text-primary",
    },
    pendente: {
      icon: Clock,
      label: "Pendente",
      className: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
      iconColor: "text-blue-600",
    },
    em_atraso: {
      icon: AlertTriangle,
      label: "Em atraso",
      className: "bg-destructive/10 text-destructive border-destructive/20",
      iconColor: "text-destructive",
    },
    futuro: {
      icon: Calendar,
      label: "Futuro",
      className: "bg-muted/50 text-muted-foreground border-muted",
      iconColor: "text-muted-foreground",
    },
  };

  const handleGenerateProof = (payment: Payment) => {
    toast({
      title: "Comprovante gerado",
      description: `Comprovante da parcela ${payment.number} está sendo baixado...`,
    });
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Histórico de Parcelas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {payments.map((payment) => {
            const config = statusConfig[payment.status];
            const Icon = config.icon;

            return (
              <div
                key={payment.id}
                className={`flex flex-col md:flex-row md:items-center gap-3 md:gap-4 p-4 rounded-lg border ${
                  payment.status === "em_atraso"
                    ? "bg-destructive/5 border-destructive/20"
                    : payment.status === "pendente"
                    ? "bg-blue-500/5 border-blue-500/20"
                    : "bg-muted/30"
                }`}
              >
                <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    payment.status === "pago" ? "bg-primary/10" :
                    payment.status === "em_atraso" ? "bg-destructive/10" :
                    payment.status === "pendente" ? "bg-blue-500/10" :
                    "bg-muted"
                  }`}>
                    <Icon className={`w-5 h-5 md:w-6 md:h-6 ${config.iconColor}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-semibold text-sm md:text-base">Parcela #{payment.number}</p>
                      <Badge variant="outline" className={`${config.className} text-xs`}>
                        {config.label}
                      </Badge>
                      {payment.status === "em_atraso" && payment.daysLate && (
                        <Badge variant="destructive" className="text-xs">
                          {payment.daysLate} dias de atraso
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 text-xs md:text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Vencimento: {payment.dueDate}</span>
                      </div>
                      {payment.paymentMethod && (
                        <div className="flex items-center gap-1">
                          <CreditCard className="w-3 h-3" />
                          <span>{payment.paymentMethod}</span>
                        </div>
                      )}
                      {payment.paidDate && (
                        <span className="text-primary">Pago em: {payment.paidDate}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-3 md:gap-4">
                  <div className="text-left md:text-right">
                    <p className="text-lg md:text-xl font-bold">
                      R$ {payment.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {payment.status === "pago" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerateProof(payment)}
                        className="text-xs"
                      >
                        Comprovante
                      </Button>
                    ) : payment.status === "pendente" || payment.status === "em_atraso" ? (
                      <Button
                        size="sm"
                        onClick={() => onPayNow(payment)}
                        variant={payment.status === "em_atraso" ? "destructive" : "default"}
                        className="text-xs md:text-sm"
                      >
                        Pagar agora
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
