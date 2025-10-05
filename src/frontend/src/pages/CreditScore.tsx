import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { ScoreGauge } from "@/components/score/ScoreGauge";
import { ScoreFactors } from "@/components/score/ScoreFactors";
import { ScoreSimulation } from "@/components/score/ScoreSimulation";
import { ScoreHistory } from "@/components/score/ScoreHistory";
import { Button } from "@/components/ui/button";
import { DollarSign, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreditScore = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const navigate = useNavigate();
  const currentScore = 720;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userType="farmer" onExpandedChange={setIsSidebarExpanded} />
      <Header userType="farmer" isSidebarExpanded={isSidebarExpanded} />
      
      <main className={`pt-20 transition-all duration-500 ml-0 ${isSidebarExpanded ? 'md:ml-64' : 'md:ml-20'}`}>
        <div className="p-8 max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Seu Score de Crédito</h1>
            <p className="text-muted-foreground">
              Acompanhe sua pontuação e saiba como melhorá-la
            </p>
          </div>

          {/* Score Gauge */}
          <ScoreGauge score={currentScore} />

          {/* Factors and Simulation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <ScoreFactors />
            <ScoreSimulation currentScore={currentScore} />
          </div>

          {/* History */}
          <ScoreHistory />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button
              size="lg"
              className="gap-2"
              onClick={() => navigate("/agricultor/novo-emprestimo")}
            >
              <DollarSign className="w-5 h-5" />
              Solicitar novo empréstimo com este score
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              <RefreshCw className="w-5 h-5" />
              Atualizar informações
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreditScore;
