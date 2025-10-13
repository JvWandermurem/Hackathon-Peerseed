import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TrendingDown, Calculator } from "lucide-react";

interface EarlyPaymentModalProps {
  open: boolean;
  onClose: () => void;
  outstandingBalance: number;
  remainingPayments: number;
}

export const EarlyPaymentModal = ({
  open,
  onClose,
  outstandingBalance,
  remainingPayments,
}: EarlyPaymentModalProps) => {
  const estimatedInterest = outstandingBalance * 0.15; // 15% estimated future interest
  const discountedAmount = outstandingBalance - (estimatedInterest * 0.6); // 60% discount on interest
  const savings = outstandingBalance + estimatedInterest - discountedAmount;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-primary" />
            Pagamento Antecipado
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center">
            <Calculator className="w-16 h-16 text-primary mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">
              Ao quitar antecipadamente, você economiza em juros futuros
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Saldo devedor atual</span>
              <span className="font-semibold">
                R$ {outstandingBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Juros futuros estimados</span>
              <span className="font-semibold text-yellow-600">
                + R$ {estimatedInterest.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total sem desconto</span>
              <span className="font-semibold line-through text-muted-foreground">
                R$ {(outstandingBalance + estimatedInterest).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Valor para quitação</span>
              <span className="text-2xl font-bold text-primary">
                R$ {discountedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2 border-t border-primary/20">
              <TrendingDown className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-semibold">
                Economia de R$ {savings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="bg-blue-500/10 rounded-lg p-4">
            <p className="text-sm text-muted-foreground text-center">
              Este valor considera o desconto de <strong>60%</strong> sobre os juros futuros
              das {remainingPayments} parcelas restantes
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Voltar
            </Button>
            <Button className="flex-1">
              Quitar agora
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
