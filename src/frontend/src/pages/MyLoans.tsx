// src/components/MyLoans.tsx
import { useEffect, useState } from "react";
import loanService from "@/services/loanService";
import { LoanStatusCard } from "@/components/LoanStatusCard";
import { AnaliseResponse } from "@/models/Analise";
import { mapStatusToStep } from "@/utils/mapStatusToStep";

export const MyLoans = () => {
  const [loans, setLoans] = useState<AnaliseResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const data = await loanService.getMinhasAnalises();
        setLoans(data);
      } catch (err) {
        console.error("Erro ao buscar empréstimos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, []);

  if (loading) {
    return <p>Carregando empréstimos...</p>; // ou um skeleton
  }

  return (
    <div className="space-y-4">
      {loans.length === 0 ? (
        <p>Nenhum empréstimo encontrado</p>
      ) : (
        loans.map((loan, index) => (
          <LoanStatusCard
            key={loan.id}
            loanNumber={`#${index + 1}`}
            currentStep={mapStatusToStep(loan.status)}
          />
        ))
      )}
    </div>
  );
};
