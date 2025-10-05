import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { ActiveInvestorCard } from "@/components/ActiveInvestorCard";
import { PerformanceCard } from "@/components/PerformanceCard";
import { OpportunityCard } from "@/components/OpportunityCard";
import { MySeedsCard } from "@/components/MySeedsCard";

const InvestorIndex = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  
  const opportunities = [
    {
      id: 1,
      farmer: "José Silva",
      amount: 50000,
      rate: 12.5,
      duration: 12,
      purpose: "Irrigação",
      risk: "Baixo" as const,
    },
    {
      id: 2,
      farmer: "Maria Santos",
      amount: 75000,
      rate: 14.0,
      duration: 18,
      purpose: "Equipamentos",
      risk: "Médio" as const,
    },
    {
      id: 3,
      farmer: "Carlos Oliveira",
      amount: 30000,
      rate: 11.0,
      duration: 6,
      purpose: "Sementes",
      risk: "Baixo" as const,
    },
  ];

  const mySeeds = [
    {
      id: 1,
      farmer: "João Pedro",
      invested: 10000,
      returns: 1250,
      status: "Ativo" as const,
      nextPayment: "20/12/2025",
    },
    {
      id: 2,
      farmer: "Ana Clara",
      invested: 5000,
      returns: 625,
      status: "Ativo" as const,
      nextPayment: "05/01/2026",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userType="investor" onExpandedChange={setIsSidebarExpanded} />
      <Header userType="investor" isSidebarExpanded={isSidebarExpanded} />
      
      <main className={`pt-20 transition-all duration-500 ml-0 ${isSidebarExpanded ? 'md:ml-64' : 'md:ml-20'}`}>
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {/* Welcome message */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Olá, Marina! 👋</h1>
            <p className="text-muted-foreground">Bem-vindo ao seu painel de investidor</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          <ActiveInvestorCard />
          <PerformanceCard />
        </div>

        {/* Minhas seeds */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Minhas seeds</h2>
          <div className="space-y-4">
            {mySeeds.map((seed) => (
              <MySeedsCard key={seed.id} seed={seed} />
            ))}
          </div>
        </section>

        {/* Oportunidades sugeridas */}
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Oportunidades sugeridas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        </section>
        </div>
      </main>
    </div>
  );
};

export default InvestorIndex;
