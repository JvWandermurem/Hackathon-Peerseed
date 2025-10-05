import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { LoanInfoStep } from "@/components/loan/LoanInfoStep";
import { DocumentsStep } from "@/components/loan/DocumentsStep";
import { SimulationStep } from "@/components/loan/SimulationStep";
import { ContractStep } from "@/components/loan/ContractStep";
import { Save, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const NewLoan = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [loanData, setLoanData] = useState({
    category: "producao",
    amount: "",
    duration: "",
    purpose: "",
    captationPeriod: "",
    // Campos para eventos
    eventType: "",
    eventDate: "",
    eventDuration: "",
    expectedAttendees: "",
    eventLocation: "",
    eventBudget: "",
    projectedRevenue: "",
    documents: {
      rg: null,
      address: null,
      car: null,
      invoices: null,
    },
  });

  const { toast } = useToast();

  const steps = [
    { number: 1, title: "Informações do empréstimo", icon: "🌱" },
    { number: 2, title: "Documentos", icon: "📄" },
    { number: 3, title: "Simulação", icon: "📊" },
    { number: 4, title: "Contrato", icon: "✍️" },
  ];

  const progress = (currentStep / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = () => {
    toast({
      title: "Rascunho salvo",
      description: "Suas informações foram salvas com sucesso.",
    });
  };

  const handleSubmit = () => {
    toast({
      title: "Solicitação enviada!",
      description: "Sua solicitação de empréstimo está em análise.",
    });
  };

  const isStepComplete = (step: number) => {
    const isEventCategory = loanData.category === "evento";
    
    switch (step) {
      case 1:
        const basicFields = loanData.amount && loanData.duration && loanData.purpose && loanData.captationPeriod;
        if (!isEventCategory) return basicFields;
        
        // Para eventos, campos adicionais são obrigatórios
        return basicFields && 
               loanData.eventType && 
               loanData.eventDate && 
               loanData.eventDuration && 
               loanData.expectedAttendees &&
               loanData.eventLocation &&
               loanData.eventBudget &&
               loanData.projectedRevenue;
      case 2:
        return loanData.documents.rg && loanData.documents.address && loanData.documents.car;
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const canSubmit = isStepComplete(1) && isStepComplete(2);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userType="farmer" onExpandedChange={setIsSidebarExpanded} />
      <Header userType="farmer" isSidebarExpanded={isSidebarExpanded} />
      
      <main className={`pt-20 transition-all duration-500 ml-0 ${isSidebarExpanded ? 'md:ml-64' : 'md:ml-20'}`}>
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Solicitar novo empréstimo</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Preencha as informações abaixo para solicitar seu crédito rural
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6 md:mb-8">
            <Progress value={progress} className="h-2 mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className={`text-center ${
                    currentStep === step.number
                      ? "text-primary font-semibold"
                      : currentStep > step.number
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mx-auto mb-2 text-base md:text-lg ${
                      currentStep === step.number
                        ? "bg-primary text-primary-foreground"
                        : currentStep > step.number
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.icon}
                  </div>
                  <p className="text-[10px] md:text-xs">{step.title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-card rounded-lg border p-6 mb-6">
            {currentStep === 1 && (
              <LoanInfoStep loanData={loanData} setLoanData={setLoanData} />
            )}
            {currentStep === 2 && (
              <DocumentsStep loanData={loanData} setLoanData={setLoanData} />
            )}
            {currentStep === 3 && (
              <SimulationStep loanData={loanData} />
            )}
            {currentStep === 4 && (
              <ContractStep loanData={loanData} />
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              Salvar rascunho
            </Button>

            <div className="flex gap-3">
              {currentStep > 1 && (
                <Button variant="outline" onClick={handlePrevious}>
                  Voltar
                </Button>
              )}
              
              {currentStep < steps.length ? (
                <Button
                  onClick={handleNext}
                  disabled={!isStepComplete(currentStep)}
                >
                  Próximo
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="gap-2"
                >
                  <Send className="w-4 h-4" />
                  Enviar solicitação
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewLoan;
