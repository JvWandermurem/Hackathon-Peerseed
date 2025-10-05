import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { ActiveFarmerCard } from "@/components/ActiveFarmerCard";
import { CreditScoreCard } from "@/components/CreditScoreCard";
import { LoanStatusCard } from "@/components/LoanStatusCard";

const Index = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  
  return (
    <div className="min-h-screen bg-background">
      <Sidebar userType="farmer" onExpandedChange={setIsSidebarExpanded} />
      <Header userType="farmer" isSidebarExpanded={isSidebarExpanded} />
      
      <main className={`pt-20 transition-all duration-500 ml-0 ${isSidebarExpanded ? 'md:ml-64' : 'md:ml-20'}`}>
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {/* Welcome message */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Olá, João!</h1>
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

          <div className="space-y-4">
            <LoanStatusCard loanNumber="#02" currentStep={2} />
            <LoanStatusCard loanNumber="#01" currentStep={4} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
