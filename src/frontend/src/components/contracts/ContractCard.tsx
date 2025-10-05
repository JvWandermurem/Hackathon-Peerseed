import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText, Download, Eye, Calendar, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContractCardProps {
  contract: {
    id: string;
    amount: number;
    status: "ativo" | "quitado" | "em_atraso";
    rate: number;
    duration: number;
    progress: number;
    nextPayment: { date: string; amount: number } | null;
  };
  onViewDetails: () => void;
}

export const ContractCard = ({ contract, onViewDetails }: ContractCardProps) => {
  const { toast } = useToast();

  const statusConfig = {
    ativo: {
      label: "Em andamento",
      className: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    },
    quitado: {
      label: "Quitado",
      className: "bg-primary/10 text-primary",
    },
    em_atraso: {
      label: "Em atraso",
      className: "bg-destructive/10 text-destructive",
    },
  };

  const handleDownloadPDF = () => {
    toast({
      title: "Download iniciado",
      description: `Contrato #${contract.id} está sendo baixado...`,
    });
  };

  return (
    <Card className={`hover:shadow-lg transition-all ${
      contract.status === "em_atraso" ? "border-destructive/50" : ""
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Contrato #{contract.id}</h3>
              <p className="text-sm text-muted-foreground">
                {contract.duration} meses
              </p>
            </div>
          </div>
          <Badge className={statusConfig[contract.status].className}>
            {statusConfig[contract.status].label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Amount and Rate */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Valor total</p>
            <p className="text-xl font-bold">
              R$ {contract.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Taxa de juros
            </p>
            <p className="text-xl font-bold text-primary">{contract.rate}% a.m.</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">Progresso do pagamento</p>
            <p className="text-xs font-semibold">{contract.progress}%</p>
          </div>
          <Progress value={contract.progress} className="h-2" />
        </div>

        {/* Next Payment */}
        {contract.nextPayment && (
          <div className={`p-3 rounded-lg ${
            contract.status === "em_atraso" 
              ? "bg-destructive/10 border border-destructive/20" 
              : "bg-muted/50"
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Próximo pagamento
                </p>
                <p className="text-sm font-semibold">{contract.nextPayment.date}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground mb-1">Valor</p>
                <p className="text-sm font-bold text-primary">
                  R$ {contract.nextPayment.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        )}

        {contract.status === "quitado" && (
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm text-primary font-medium text-center">
              ✓ Contrato quitado com sucesso
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={onViewDetails}>
            <Eye className="w-4 h-4" />
            Ver detalhes
          </Button>
          <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={handleDownloadPDF}>
            <Download className="w-4 h-4" />
            Baixar PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
