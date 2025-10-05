import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { QrCode, Barcode, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  payment: any;
}

export const PaymentModal = ({ open, onClose, payment }: PaymentModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "boleto" | null>(null);
  const [pixCopied, setPixCopied] = useState(false);
  const { toast } = useToast();

  if (!payment) return null;

  const pixCode = "00020126580014br.gov.bcb.pix0136a1234567-89ab-cdef-0123-456789abcdef5204000053039865802BR5925REEVO LTDA6009SAO PAULO62070503***6304ABCD";
  const boletoCode = "23793.12345 67890.123456 78901.234567 8 90120000052000";

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixCode);
    setPixCopied(true);
    toast({
      title: "Código copiado!",
      description: "Cole no seu app de pagamentos para finalizar.",
    });
    setTimeout(() => setPixCopied(false), 2000);
  };

  const handleGenerateBoleto = () => {
    toast({
      title: "Boleto gerado",
      description: "O boleto está sendo baixado...",
    });
    setTimeout(() => onClose(), 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Pagar Parcela #{payment.number}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payment info */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Valor da parcela</span>
              <span className="text-2xl font-bold text-primary">
                R$ {payment.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Vencimento</span>
              <span className="font-medium">{payment.dueDate}</span>
            </div>
          </div>

          <Separator />

          {/* Payment method selection */}
          {!paymentMethod ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground text-center mb-4">
                Escolha a forma de pagamento
              </p>
              <Button
                variant="outline"
                size="lg"
                className="w-full h-auto py-4 gap-3"
                onClick={() => setPaymentMethod("pix")}
              >
                <QrCode className="w-6 h-6" />
                <div className="text-left flex-1">
                  <div className="font-semibold">Pix</div>
                  <div className="text-xs text-muted-foreground">Pagamento instantâneo</div>
                </div>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full h-auto py-4 gap-3"
                onClick={() => setPaymentMethod("boleto")}
              >
                <Barcode className="w-6 h-6" />
                <div className="text-left flex-1">
                  <div className="font-semibold">Boleto Bancário</div>
                  <div className="text-xs text-muted-foreground">Compensação em 1-2 dias úteis</div>
                </div>
              </Button>
            </div>
          ) : paymentMethod === "pix" ? (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Escaneie o QR Code ou copie o código Pix
                </p>
                <div className="bg-white p-6 rounded-lg inline-block mb-4">
                  <div className="w-48 h-48 bg-muted flex items-center justify-center">
                    <QrCode className="w-32 h-32 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Código Pix Copia e Cola:</p>
                <div className="flex gap-2">
                  <code className="flex-1 text-xs bg-muted p-3 rounded-lg overflow-x-auto">
                    {pixCode.slice(0, 50)}...
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyPix}
                    className="flex-shrink-0"
                  >
                    {pixCopied ? (
                      <Check className="w-4 h-4 text-primary" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="bg-primary/10 rounded-lg p-3">
                <p className="text-xs text-center text-muted-foreground">
                  Após o pagamento, a confirmação será processada em até 1 hora
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <Barcode className="w-24 h-24 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  Código de barras do boleto
                </p>
                <code className="text-sm bg-muted p-3 rounded-lg block">
                  {boletoCode}
                </code>
              </div>

              <Button className="w-full" onClick={handleGenerateBoleto}>
                <Barcode className="w-4 h-4 mr-2" />
                Baixar Boleto PDF
              </Button>

              <div className="bg-blue-500/10 rounded-lg p-3">
                <p className="text-xs text-center text-muted-foreground">
                  O boleto pode ser pago em qualquer banco ou lotérica até a data de vencimento
                </p>
              </div>
            </div>
          )}

          {paymentMethod && (
            <Button variant="outline" onClick={() => setPaymentMethod(null)}>
              Voltar para métodos de pagamento
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
