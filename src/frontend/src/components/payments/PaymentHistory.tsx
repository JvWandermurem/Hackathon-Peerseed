import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, AlertCircle } from "lucide-react";

interface PaymentHistoryProps {
  payments: any[];
}

export const PaymentHistory = ({ payments }: PaymentHistoryProps) => {
  // Prepare data for chart
  const chartData = payments
    .filter(p => p.status === "pago" || p.status === "em_atraso" || p.status === "pendente")
    .map(p => ({
      parcela: p.number,
      status: p.status === "pago" ? 1 : 0,
      label: p.status === "pago" ? "Pago" : p.status === "em_atraso" ? "Atrasado" : "Pendente",
    }));

  const totalPayments = payments.length;
  const paidPayments = payments.filter(p => p.status === "pago").length;
  const overduePayments = payments.filter(p => p.status === "em_atraso");
  const totalDaysLate = overduePayments.reduce((sum, p) => sum + (p.daysLate || 0), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Histórico Consolidado
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-primary/10 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Parcelas pagas</p>
            <p className="text-3xl font-bold text-primary">
              {paidPayments}/{totalPayments}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {((paidPayments / totalPayments) * 100).toFixed(0)}% concluído
            </p>
          </div>

          <div className="bg-blue-500/10 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Próximas parcelas</p>
            <p className="text-3xl font-bold text-blue-600">
              {payments.filter(p => p.status === "futuro" || p.status === "pendente").length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              A vencer
            </p>
          </div>

          {overduePayments.length > 0 ? (
            <div className="bg-destructive/10 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">Indicador de inadimplência</p>
              <p className="text-3xl font-bold text-destructive">
                {totalDaysLate}
              </p>
              <p className="text-xs text-destructive mt-1">
                dias de atraso total
              </p>
            </div>
          ) : (
            <div className="bg-primary/10 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">Status de pagamento</p>
              <p className="text-xl font-bold text-primary flex items-center justify-center gap-2">
                <span>✓</span> Em dia
              </p>
              <p className="text-xs text-primary mt-1">
                Sem atrasos
              </p>
            </div>
          )}
        </div>

        {/* Chart */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold mb-4">Evolução dos pagamentos</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="parcela"
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
                ticks={[0, 1]}
                tickFormatter={(value) => value === 1 ? "Pago" : "Pendente"}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-card p-3 rounded-lg border shadow-lg">
                        <p className="text-sm font-semibold mb-1">Parcela #{data.parcela}</p>
                        <p className={`text-sm ${
                          data.label === "Pago" ? "text-primary" : 
                          data.label === "Atrasado" ? "text-destructive" : 
                          "text-blue-600"
                        }`}>
                          Status: {data.label}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="stepAfter"
                dataKey="status"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Warning if overdue */}
        {overduePayments.length > 0 && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm mb-1 text-destructive">
                  Atenção: Parcelas em atraso
                </h4>
                <p className="text-sm text-muted-foreground">
                  Você possui {overduePayments.length} parcela{overduePayments.length > 1 ? "s" : ""} em atraso,
                  totalizando {totalDaysLate} dias. Regularize sua situação o quanto antes para evitar
                  impactos no seu score de crédito.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
