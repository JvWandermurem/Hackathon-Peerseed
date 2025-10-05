import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout } from "lucide-react";
import { AnaliseResponse, StatusCpr } from "@/models/Analise";
import analiseService from "@/services/analiseService";


export const ActiveFarmerCard = () => {
  const [analise, setAnalise] = useState<AnaliseResponse | null>(null);
  const [status, setStatus] = useState<StatusCpr>(StatusCpr.NENHUMA);

  useEffect(() => {
    const fetchAnalise = async () => {
      try {
        const data = await analiseService.getMeuScore();
        setAnalise(data);
        setStatus(data.status as StatusCpr);
      } catch (err: any) {
        console.error("Erro ao buscar análise:", err);
        setStatus(StatusCpr.NENHUMA);
      }
    };
    fetchAnalise();
  }, []);

  const getStatusColor = (status: StatusCpr) => {
    switch (status) {
      case StatusCpr.ANALISE:
        return "bg-status-pending animate-pulse";
      case StatusCpr.FINANCIADO:
      case StatusCpr.EM_PAGAMENTO:
        return "bg-status-ok";
      case StatusCpr.INADIMPLENTE:
        return "bg-status-error";
      case StatusCpr.QUITADO:
        return "bg-status-complete";
      case StatusCpr.NENHUMA:
      default:
        return "bg-gray-300";
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sprout className="w-5 h-5 text-primary" />
          Agricultor ativo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Última solicitação</p>
          <p className="text-lg font-semibold text-foreground inline-flex items-center gap-2">
            {status}
            <span className={`w-2 h-2 rounded-full ${getStatusColor(status)}`}></span>
          </p>
        </div>
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-1">Prazo da solicitação</p>
          <p className="text-2xl font-semibold text-foreground">
            {analise ? `${analise.prazo_meses} meses` : "-"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
