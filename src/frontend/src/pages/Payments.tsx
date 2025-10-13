import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { FinancialSummary } from "@/components/payments/FinancialSummary";
import { PaymentsList } from "@/components/payments/PaymentsList";
import { PaymentHistory } from "@/components/payments/PaymentHistory";
import { PaymentModal } from "@/components/payments/PaymentModal";
import { EarlyPaymentModal } from "@/components/payments/EarlyPaymentModal";
import { Button } from "@/components/ui/button";
import { CreditCard, TrendingDown, AlertTriangle } from "lucide-react";

const Payments = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [earlyPaymentModalOpen, setEarlyPaymentModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  const financialData = {
    totalLoan: 50000,
    outstandingBalance: 32400,
    accumulatedInterest: 2400,
    nextPayment: {
      date: "15/11/2025",
      amount: 5200,
    },
  };

  const payments = [
    { id: 1, number: "01/12", amount: 5200, status: "pago" as const, dueDate: "15/05/2024", paymentMethod: "Pix", paidDate: "15/05/2024" },
    { id: 2, number: "02/12", amount: 5200, status: "pago" as const, dueDate: "15/06/2024", paymentMethod: "Boleto", paidDate: "16/06/2024" },
    { id: 3, number: "03/12", amount: 5200, status: "pago" as const, dueDate: "15/07/2024", paymentMethod: "Pix", paidDate: "14/07/2024" },
    { id: 4, number: "04/12", amount: 5200, status: "pago" as const, dueDate: "15/08/2024", paymentMethod: "Débito Automático", paidDate: "15/08/2024" },
    { id: 5, number: "05/12", amount: 5200, status: "pago" as const, dueDate: "15/09/2024", paymentMethod: "Pix", paidDate: "15/09/2024" },
    { id: 6, number: "06/12", amount: 5200, status: "pago" as const, dueDate: "15/10/2024", paymentMethod: "Pix", paidDate: "13/10/2024" },
    { id: 7, number: "07/12", amount: 5200, status: "pendente" as const, dueDate: "15/11/2024", paymentMethod: null, paidDate: null },
    { id: 8, number: "08/12", amount: 5200, status: "em_atraso" as const, dueDate: "15/09/2024", paymentMethod: null, paidDate: null, daysLate: 7 },
    { id: 9, number: "09/12", amount: 5200, status: "futuro" as const, dueDate: "15/12/2024", paymentMethod: null, paidDate: null },
    { id: 10, number: "10/12", amount: 5200, status: "futuro" as const, dueDate: "15/01/2025", paymentMethod: null, paidDate: null },
    { id: 11, number: "11/12", amount: 5200, status: "futuro" as const, dueDate: "15/02/2025", paymentMethod: null, paidDate: null },
    { id: 12, number: "12/12", amount: 5200, status: "futuro" as const, dueDate: "15/03/2025", paymentMethod: null, paidDate: null },
  ];

  const hasOverduePayments = payments.some(p => p.status === "em_atraso");

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userType="farmer" onExpandedChange={setIsSidebarExpanded} />
      <Header userType="farmer" isSidebarExpanded={isSidebarExpanded} />
      
      <main className={`pt-20 transition-all duration-500 ml-0 ${isSidebarExpanded ? 'md:ml-64' : 'md:ml-20'}`}>
        <div className="p-8 max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <CreditCard className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">Seus Pagamentos</h1>
            </div>
            <p className="text-muted-foreground">
              Gerencie suas parcelas e acompanhe seu histórico financeiro
            </p>
          </div>

          {/* Financial Summary */}
          <FinancialSummary data={financialData} />

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Button
              size="lg"
              className="gap-2 h-auto py-4"
              onClick={() => {
                setSelectedPayment(payments.find(p => p.status === "pendente"));
                setPaymentModalOpen(true);
              }}
            >
              <CreditCard className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold">Pagar agora</div>
                <div className="text-xs opacity-90">Pix ou Boleto</div>
              </div>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="gap-2 h-auto py-4"
              onClick={() => setEarlyPaymentModalOpen(true)}
            >
              <TrendingDown className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold">Pagamento antecipado</div>
                <div className="text-xs text-muted-foreground">Economize em juros</div>
              </div>
            </Button>

            {hasOverduePayments && (
              <Button
                variant="destructive"
                size="lg"
                className="gap-2 h-auto py-4"
              >
                <AlertTriangle className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">Solicitar renegociação</div>
                  <div className="text-xs opacity-90">Parcelas em atraso</div>
                </div>
              </Button>
            )}
          </div>

          {/* Payments List */}
          <PaymentsList
            payments={payments}
            onPayNow={(payment) => {
              setSelectedPayment(payment);
              setPaymentModalOpen(true);
            }}
          />

          {/* Payment History */}
          <PaymentHistory payments={payments} />
        </div>
      </main>

      {/* Payment Modal */}
      <PaymentModal
        open={paymentModalOpen}
        onClose={() => {
          setPaymentModalOpen(false);
          setSelectedPayment(null);
        }}
        payment={selectedPayment}
      />

      {/* Early Payment Modal */}
      <EarlyPaymentModal
        open={earlyPaymentModalOpen}
        onClose={() => setEarlyPaymentModalOpen(false)}
        outstandingBalance={financialData.outstandingBalance}
        remainingPayments={payments.filter(p => p.status === "futuro" || p.status === "pendente").length}
      />
    </div>
  );
};

export default Payments;
