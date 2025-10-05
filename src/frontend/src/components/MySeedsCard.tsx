import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar } from "lucide-react";

interface MySeedsCardProps {
  seed: {
    id: number;
    farmer: string;
    invested: number;
    returns: number;
    status: "Ativo" | "Concluído";
    nextPayment: string;
  };
}

export const MySeedsCard = ({ seed }: MySeedsCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-lg font-semibold">{seed.farmer}</h3>
              <Badge className="bg-primary/10 text-primary">
                {seed.status}
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Investido</p>
                <p className="text-sm font-semibold">R$ {seed.invested.toLocaleString('pt-BR')}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Retorno
                </p>
                <p className="text-sm font-semibold text-primary">+R$ {seed.returns.toLocaleString('pt-BR')}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Próximo pagamento
                </p>
                <p className="text-sm font-semibold">{seed.nextPayment}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
