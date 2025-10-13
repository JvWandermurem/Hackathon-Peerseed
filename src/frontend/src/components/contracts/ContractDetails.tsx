import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, Clock, XCircle, Download, AlertTriangle, Users, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContractDetailsProps {
  contract: {
    id: string;
    amount: number;
    status: "ativo" | "quitado" | "em_atraso";
    rate: number;
    duration: number;
    progress: number;
    startDate: string;
    investorsCount: number;
    payments: Array<{
      date: string;
      amount: number;
      status: "pago" | "pendente" | "atrasado";
    }>;
  };
  open: boolean;
  onClose: () => void;
}

export const ContractDetails = ({ contract, open, onClose }: ContractDetailsProps) => {
  const { toast } = useToast();

  const handleRenegotiate = () => {
    toast({
      title: "Solicitação enviada",
      description: "Nossa equipe entrará em contato em até 48h para negociar.",
    });
    onClose();
  };

  const handleDownloadPDF = () => {
    toast({
      title: "Download iniciado",
      description: `Contrato #${contract.id} está sendo baixado...`,
    });
  };

  const paymentStatusConfig = {
    pago: {
      icon: CheckCircle2,
      label: "Pago",
      className: "text-primary",
    },
    pendente: {
      icon: Clock,
      label: "Pendente",
      className: "text-blue-600",
    },
    atrasado: {
      icon: XCircle,
      label: "Atrasado",
      className: "text-destructive",
    },
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Detalhes do Contrato #{contract.id}</span>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Valor total</p>
                <p className="text-lg font-bold">
                  R$ {contract.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Taxa</p>
                <p className="text-lg font-bold text-primary">{contract.rate}%</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Prazo</p>
                <p className="text-lg font-bold">{contract.duration} meses</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Data início</p>
                <p className="text-lg font-bold">{contract.startDate}</p>
              </div>
            </div>

            {/* Guarantee and Investors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <h4 className="font-semibold text-sm">Garantia</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  CPR registrada em cartório
                </p>
                <Badge className="mt-2 bg-primary/10 text-primary">
                  Documento válido
                </Badge>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-primary" />
                  <h4 className="font-semibold text-sm">Investidores</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Número de cotistas participantes
                </p>
                <p className="text-2xl font-bold text-primary mt-2">
                  {contract.investorsCount}
                </p>
              </div>
            </div>

            <Separator />

            {/* Payment History */}
            <div>
              <h4 className="font-semibold mb-4">Histórico de Pagamentos</h4>
              <div className="space-y-2">
                {contract.payments.map((payment, index) => {
                  const config = paymentStatusConfig[payment.status];
                  const Icon = config.icon;

                  return (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        payment.status === "atrasado"
                          ? "bg-destructive/5 border-destructive/20"
                          : payment.status === "pago"
                          ? "bg-primary/5 border-primary/20"
                          : "bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${config.className}`} />
                        <div>
                          <p className="text-sm font-medium">{payment.date}</p>
                          <p className="text-xs text-muted-foreground">
                            Parcela {index + 1} de {contract.duration}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">
                          R$ {payment.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <Badge
                          variant="outline"
                          className={`text-xs ${config.className} border-current`}
                        >
                          {config.label}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Renegotiation Option */}
            {contract.status === "em_atraso" && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">Contrato em atraso</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Você possui parcelas em atraso. Entre em contato para renegociar suas condições.
                    </p>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleRenegotiate}
                    >
                      Solicitar renegociação
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button variant="outline" className="flex-1 gap-2" onClick={handleDownloadPDF}>
            <Download className="w-4 h-4" />
            Baixar contrato PDF
          </Button>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
