import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from "recharts";
import { TrendingUp, FileCheck } from "lucide-react";

const data = [
  { month: "Jan", score: 650, event: null },
  { month: "Fev", score: 660, event: null },
  { month: "Mar", score: 680, event: "Documentos atualizados" },
  { month: "Abr", score: 685, event: null },
  { month: "Mai", score: 695, event: null },
  { month: "Jun", score: 720, event: "CAR regularizado" },
];

export const ScoreHistory = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Histórico de alterações
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="month"
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: "12px" }}
            />
            <YAxis
              domain={[600, 750]}
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: "12px" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-card p-3 rounded-lg border shadow-lg">
                      <p className="text-sm font-semibold mb-1">{data.month}</p>
                      <p className="text-lg font-bold text-primary">Score: {data.score}</p>
                      {data.event && (
                        <div className="mt-2 pt-2 border-t">
                          <div className="flex items-center gap-2">
                            <FileCheck className="w-3 h-3 text-primary" />
                            <p className="text-xs text-muted-foreground">{data.event}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={(props) => {
                const { cx, cy, payload } = props;
                if (payload.event) {
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={6}
                      fill="hsl(var(--primary))"
                      stroke="hsl(var(--background))"
                      strokeWidth={2}
                    />
                  );
                }
                return <circle cx={cx} cy={cy} r={4} fill="hsl(var(--primary))" />;
              }}
            />
            {data.map((entry, index) => {
              if (entry.event) {
                return (
                  <ReferenceDot
                    key={`dot-${index}`}
                    x={entry.month}
                    y={entry.score}
                    r={8}
                    fill="hsl(var(--primary))"
                    stroke="hsl(var(--background))"
                    strokeWidth={3}
                  />
                );
              }
              return null;
            })}
          </LineChart>
        </ResponsiveContainer>

        {/* Timeline of events */}
        <div className="mt-6 space-y-3">
          {data
            .filter((item) => item.event)
            .reverse()
            .map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10"
              >
                <FileCheck className="w-4 h-4 text-primary flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.event}</p>
                  <p className="text-xs text-muted-foreground">{item.month}</p>
                </div>
                <Badge className="bg-primary/10 text-primary">
                  Score: {item.score}
                </Badge>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};
