import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ScoreGaugeProps {
  score: number;
}

export const ScoreGauge = ({ score }: ScoreGaugeProps) => {
  const getScoreCategory = (score: number) => {
    if (score >= 800) return { letter: "A", label: "Excelente", color: "text-primary" };
    if (score >= 700) return { letter: "B", label: "Bom", color: "text-primary" };
    if (score >= 600) return { letter: "C", label: "Regular", color: "text-yellow-600" };
    if (score >= 500) return { letter: "D", label: "Abaixo da média", color: "text-orange-600" };
    return { letter: "E", label: "Crítico", color: "text-destructive" };
  };

  const category = getScoreCategory(score);
  const percentage = (score / 1000) * 100;

  // Calculate rotation for semicircle (from -90deg to 90deg)
  const rotation = -90 + (percentage / 100) * 180;

  return (
    <Card className="border-primary/20 mb-6">
      <CardContent className="p-8">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Semicircle Gauge */}
          <div className="relative w-64 h-32 flex-shrink-0">
            {/* Background arc */}
            <svg viewBox="0 0 200 100" className="w-full h-full">
              <path
                d="M 10 100 A 90 90 0 0 1 190 100"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="20"
                strokeLinecap="round"
              />
              {/* Colored segments */}
              <path
                d="M 10 100 A 90 90 0 0 1 60 20"
                fill="none"
                stroke="hsl(var(--destructive))"
                strokeWidth="20"
                strokeLinecap="round"
              />
              <path
                d="M 60 20 A 90 90 0 0 1 100 10"
                fill="none"
                stroke="hsl(45 93% 47%)"
                strokeWidth="20"
                strokeLinecap="round"
              />
              <path
                d="M 100 10 A 90 90 0 0 1 140 20"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="20"
                strokeLinecap="round"
              />
              <path
                d="M 140 20 A 90 90 0 0 1 190 100"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="20"
                strokeLinecap="round"
                opacity="0.6"
              />
              
              {/* Needle */}
              <line
                x1="100"
                y1="100"
                x2="100"
                y2="20"
                stroke="hsl(var(--foreground))"
                strokeWidth="3"
                strokeLinecap="round"
                style={{
                  transformOrigin: "100px 100px",
                  transform: `rotate(${rotation}deg)`,
                  transition: "transform 1s ease-out",
                }}
              />
              <circle cx="100" cy="100" r="8" fill="hsl(var(--foreground))" />
            </svg>

            {/* Score labels */}
            <div className="absolute bottom-0 left-0 text-xs text-muted-foreground">0</div>
            <div className="absolute bottom-0 right-0 text-xs text-muted-foreground">1000</div>
          </div>

          {/* Score Details */}
          <div className="flex-1 text-center lg:text-left">
            <p className="text-sm text-muted-foreground mb-2">Seu score atual</p>
            <div className="flex items-baseline justify-center lg:justify-start gap-3 mb-4">
              <span className={`text-6xl font-bold ${category.color}`}>{score}</span>
              <div className="flex flex-col">
                <Badge
                  className={`text-2xl font-bold px-4 py-1 ${
                    category.letter === "A" || category.letter === "B"
                      ? "bg-primary/10 text-primary"
                      : category.letter === "C"
                      ? "bg-yellow-500/10 text-yellow-700 dark:text-yellow-500"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {category.letter}
                </Badge>
                <span className="text-sm text-muted-foreground mt-1">{category.label}</span>
              </div>
            </div>

            {/* Score Range Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>E</span>
                <span>D</span>
                <span>C</span>
                <span>B</span>
                <span>A</span>
              </div>
              <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                <div className="absolute inset-0 flex">
                  <div className="h-full bg-destructive" style={{ width: "20%" }} />
                  <div className="h-full bg-orange-600" style={{ width: "20%" }} />
                  <div className="h-full bg-yellow-600" style={{ width: "20%" }} />
                  <div className="h-full bg-primary" style={{ width: "20%" }} />
                  <div className="h-full bg-primary opacity-60" style={{ width: "20%" }} />
                </div>
                <div
                  className="absolute top-0 bottom-0 w-1 bg-foreground"
                  style={{ left: `${percentage}%`, transform: "translateX(-50%)" }}
                >
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-foreground rounded-full" />
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mt-4">
              Seu score está na categoria <strong>{category.letter}</strong> ({category.label}).
              {category.letter === "A" || category.letter === "B"
                ? " Continue mantendo boas práticas!"
                : " Veja abaixo como melhorar."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
