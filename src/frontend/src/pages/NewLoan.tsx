import { useState } from "react";
import { Sidebar } from "../components/Sidebar"; // Caminho Corrigido
import { Header } from "../components/Header"; // Caminho Corrigido
import { Progress } from "../components/ui/progress"; // Caminho Corrigido
import { Button } from "../components/ui/button"; // Caminho Corrigido
import { LoanInfoStep } from "../components/loan/LoanInfoStep"; // Caminho Corrigido
import { DocumentsStep } from "../components/loan/DocumentsStep"; // Caminho Corrigido
import { SimulationStep } from "../components/loan/SimulationStep"; // Caminho Corrigido
import { ContractStep } from "../components/loan/ContractStep"; // Caminho Corrigido
import { Save, Send } from "lucide-react";
import { useToast } from "../hooks/use-toast"; // Caminho Corrigido
import loanService, { NewLoanRequest } from "../services/loanService"; // Serviço 8002 - Caminho Corrigido
import contractService from "../services/contractService"; // Serviço 8003 - Caminho Corrigido
import { AnaliseResponse } from "../models/Analise"; // Caminho Corrigido
import { useNavigate } from "react-router-dom"; 

const NewLoan = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false); 
  const { toast } = useToast();
  const navigate = useNavigate();

  // Armazena o resultado da análise (Score, Taxa, ID da CPR)
  const [analiseResult, setAnaliseResult] = useState<AnaliseResponse | null>(null);

  // Estado que armazena todos os dados do formulário
  const [loanData, setLoanData] = useState({
    // Campos da API de Análise (8002) - OBRIGATÓRIOS
    valor_solicitado: 50000,
    prazo_meses: 12,
    cultura: "Soja",
    finalidade: "Custeio de Safra",
    hectares: 100,
    possui_car: false, 
    possui_certificacao: false, 
    
    // Campos adicionais do formulário (manter para compatibilidade com os steps)
    category: "producao", 
    amount: "50000",
    duration: "12",
    purpose: "Custeio de Safra",
    captationPeriod: "90",
    
    // Documentos - Usado para determinar 'possui_car' e validação do passo 2
    documents: {
      rg: true, // Simula um arquivo enviado
      address: true,
      car: true, 
      invoices: null,
    },
  });

  // Array de passos (Resolvendo ReferenceError: steps is not defined)
  const steps = [ 
    { number: 1, title: "Informações do empréstimo", icon: "🌱" },
    { number: 2, title: "Documentos", icon: "📄" },
    { number: 3, title: "Simulação", icon: "📊" },
    { number: 4, title: "Contrato", icon: "✍️" },
  ];

  const progress = (currentStep / steps.length) * 100;

  // Mapeia os dados do estado para o formato da API (NewLoanRequest)
  const getApiRequestData = (): NewLoanRequest | null => {
      // Garante que os valores numéricos sejam floats/ints
      return {
          valor_solicitado: parseFloat(String(loanData.valor_solicitado)),
          prazo_meses: parseInt(String(loanData.prazo_meses)),
          cultura: loanData.cultura, 
          finalidade: loanData.finalidade,
          hectares: parseInt(String(loanData.hectares)), 
          possui_car: loanData.possui_car, 
          possui_certificacao: loanData.possui_certificacao,
      } as NewLoanRequest;
  };


  const isStepComplete = (step: number) => {
    const { valor_solicitado, prazo_meses, cultura, finalidade, hectares } = loanData;
    
    switch (step) {
      case 1:
        // Verifica se os campos principais da API estão preenchidos
        return !!valor_solicitado && !!prazo_meses && !!cultura && !!finalidade && !!hectares;
      case 2:
        // Verifica se os documentos cruciais (ou campos booleanos) estão OK
        return loanData.documents.rg && loanData.documents.address && loanData.documents.car;
      case 3:
        // O passo 3 só é completo se a análise tiver sido feita (analiseResult existe)
        return !!analiseResult; 
      case 4:
        // O passo 4 está pronto para assinatura se a análise foi feita e o status for ANALISE
        return !!analiseResult && analiseResult.status === "ANALISE";
      default:
        return false;
    }
  };
  
  const handleNext = async () => {
    // Validação de Preenchimento Básico
    if (!isStepComplete(currentStep)) {
        toast({ variant: "destructive", title: "Atenção", description: "Por favor, preencha ou complete as informações do passo atual." });
        return;
    }
    
    // AÇÃO NO PASSO 2: CHAMA A API DE ANÁLISE ANTES DE SIMULAR
    if (currentStep === 2) {
        
        const requestData = getApiRequestData();
        if (!requestData) return; 
        
        setIsLoading(true);
        try {
            // Chama a API de Análise de Crédito (porta 8002)
            const result = await loanService.solicitarAnalise(requestData);
            setAnaliseResult(result); // Armazena o score, taxa e ID (ID é crucial!)
            
            toast({
                title: "Análise Concluída!",
                description: `Seu score de risco é ${result.score_risco} e o ID da CPR é ${result.id.slice(0, 8)}...`,
            });

            setCurrentStep(currentStep + 1); // Avança para o passo 3 (Simulação)
            
        } catch (error: any) {
            console.error("Erro na API de Análise:", error);
            toast({
                variant: "destructive",
                title: "Falha na Análise de Crédito",
                description: error.message || "Não foi possível gerar o AgroScore. Verifique o perfil do usuário.",
            });
        } finally {
            setIsLoading(false);
        }
        
    } else if (currentStep < steps.length) {
        // Ação padrão para outros passos (1 -> 2 e 3 -> 4)
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

  // AÇÃO DE SUBMISSÃO FINAL: CHAMA A API DE CONTRATOS (Porta 8003)
  const handleSignContract = async () => {
    if (!analiseResult || !analiseResult.id || analiseResult.status !== "ANALISE") {
        toast({ variant: "destructive", title: "Erro", description: "Análise não finalizada ou contrato já assinado." });
        return;
    }
    
    setIsLoading(true);
    try {
        // Chama a API de Contratos (porta 8003) para assinar
        const updatedCpr = await contractService.signContract(analiseResult.id);
        
        toast({
            title: "Contrato Assinado com Sucesso!",
            description: `A CPR #${updatedCpr.id.slice(0, 8)} está agora no Marketplace (CAPTAÇÃO).`,
        });
        
        // Redireciona o usuário para a lista de contratos ou dashboard
        navigate("/agricultor/contratos"); 

    } catch (error: any) {
        console.error("Erro na Assinatura:", error);
        toast({
            variant: "destructive",
            title: "Falha na Assinatura do Contrato",
            description: error.message || "Não foi possível assinar. Verifique se o status está correto.",
        });
    } finally {
        setIsLoading(false);
    }
  };
  
  // canSubmit só é verdadeiro no Passo 4 se o contrato puder ser assinado
  const canSubmit = currentStep === 4 && isStepComplete(4);

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

          {/* Progress Bar e Mapeamento dos passos */}
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
              <SimulationStep loanData={loanData} analiseResult={analiseResult} />
            )}
            {currentStep === 4 && (
              <ContractStep loanData={loanData} analiseResult={analiseResult} onSign={handleSignContract} isLoading={isLoading}/>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              className="gap-2"
              disabled={isLoading}
            >
              <Save className="w-4 h-4" />
              Salvar rascunho
            </Button>

            <div className="flex gap-3">
              {currentStep > 1 && (
                <Button variant="outline" onClick={handlePrevious} disabled={isLoading}>
                  Voltar
                </Button>
              )}
              
              {/* Botão de Próximo Passo */}
              {currentStep < steps.length && (
                <Button
                  onClick={handleNext}
                  disabled={isLoading || !isStepComplete(currentStep)}
                >
                  {isLoading && currentStep === 2 ? "Analisando..." : "Próximo"}
                </Button>
              )}
              
              {/* Botão de Assinatura (Apenas no Passo 4) */}
              {currentStep === steps.length && (
                <Button
                  onClick={handleSignContract}
                  disabled={isLoading || !canSubmit}
                  className="gap-2"
                >
                  <Send className="w-4 h-4" />
                  {isLoading ? "Assinando..." : "Assinar Contrato e Enviar"}
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
