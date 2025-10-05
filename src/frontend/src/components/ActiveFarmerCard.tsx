import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout } from "lucide-react";

export const ActiveFarmerCard = () => {
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
            Em análise
            <span className="w-2 h-2 bg-status-pending rounded-full animate-pulse"></span>
          </p>
        </div>
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-1">Próximo pagamento</p>
          <p className="text-2xl font-semibold text-foreground">15/11/2025</p>
        </div>
      </CardContent>
    </Card>
  );
};
