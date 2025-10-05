import { useState, useEffect } from "react";
// Imports Corrigidos: Restaurando o alias '@/'
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { ActiveFarmerCard } from "@/components/ActiveFarmerCard";
import { CreditScoreCard } from "@/components/CreditScoreCard";
import { LoanStatusCard } from "@/components/LoanStatusCard";
import { AnaliseResponse } from "@/models/Analise"; 

// 🛑 IMPORT CRÍTICO: Serviço para buscar os empréstimos
import loanService from "@/services/loanService"; 

/**
 * Função utilitária para mapear o status da CPR para o número do passo
 * para visualização no LoanStatusCard (1 a 4).
 * O fluxo é: 1. Informações -> 2. Documentos -> 3. Análise (ANALISE) -> 4. Captação (CAPTAÇÃO)
 */
const mapStatusToStep = (status: string): number => {
  switch (status) {
    case "ANALISE":
      return 3; // Análise concluída, pronto para Contrato/Simulação
    case "CAPTAÇÃO":
    case "LIQUIDADO":
      return 4; // Contrato assinado, no Marketplace ou finalizado
    default:
      return 1; // Para qualquer outro status (Rascunho/Pendente inicial)
  }
};

const Index = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [loans, setLoans] = useState<AnaliseResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchLoans = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Usa o método getMinhasAnalises, conforme o seu código
        const data = await loanService.getMinhasAnalises();
        setLoans(data);
      } catch (err: any) {
        console.error("Erro ao buscar empréstimos:", err);
        // Exibir erro para o usuário pode ser útil
        setError(err.message || "Falha ao carregar a lista de empréstimos. Verifique a consola.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLoans();
  }, []); // [] garante que só roda uma vez na montagem

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userType="farmer" onExpandedChange={setIsSidebarExpanded} />
      <Header userType="farmer" isSidebarExpanded={isSidebarExpanded} />
      
      <main className={`pt-20 transition-all duration-500 ml-0 ${isSidebarExpanded ? 'md:ml-64' : 'md:ml-20'}`}>
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {/* Welcome message */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Olá, Agricultor!</h1>
            <p className="text-muted-foreground">Bem-vindo ao seu painel de agricultor</p>
          </div>

          {/* Top cards grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
            <ActiveFarmerCard />
            <CreditScoreCard />
          </div>

          {/* Loan status section */}
          <div className="mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">Status dos empréstimos</h2>
          </div>

          {/* Loading and Error States */}
          {isLoading && (
            <div className="p-4 text-center text-muted-foreground">
              Carregando seus empréstimos...
            </div>
          )}

          {error && (
            <div className="p-4 text-center text-destructive border border-destructive/50 rounded-lg">
              {error}
            </div>
          )}

          {/* Lista de Empréstimos */}
          {!isLoading && !error && loans.length === 0 && (
             <div className="p-4 text-center text-muted-foreground">
               Você não tem empréstimos ativos. Comece um novo na barra lateral!
             </div>
          )}

          <div className="space-y-4">
            {loans.map((loan, index) => (
              <LoanStatusCard
                key={loan.id}
                loanId={loan.id} // Passa o ID para referência
                loanNumber={`CPR #${loan.id.slice(0, 8)}`}
                currentStep={mapStatusToStep(loan.status)} // Agora a função existe
                status={loan.status}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
