import { Card } from "@/components/ui/card";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoanStatusCardProps {
  loanNumber: string;
  currentStep: number;
}

const steps = [
  { id: 1, label: "Solicitação" },
  { id: 2, label: "Em análise" },
  { id: 3, label: "Documentação" },
  { id: 4, label: "Aprovação" },
];

export const LoanStatusCard = ({ loanNumber, currentStep }: LoanStatusCardProps) => {
  return (
    <Card className="p-6 border-border bg-card shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-foreground">Empréstimo {loanNumber}</h4>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </div>

      {/* Progress bar */}
      <div className="relative">
        {/* Background line */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-border"></div>
        
        {/* Active line */}
        <div
          className="absolute top-5 left-0 h-1 bg-primary transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        ></div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                  step.id <= currentStep
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {step.id < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>
              <span
                className={cn(
                  "text-xs text-center max-w-[70px]",
                  step.id <= currentStep ? "text-foreground font-medium" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
