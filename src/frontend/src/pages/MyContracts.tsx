import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { ContractCard } from "@/components/contracts/ContractCard";
import { ContractDetails } from "@/components/contracts/ContractDetails";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText } from "lucide-react";

const MyContracts = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState("todos");
  const [sortBy, setSortBy] = useState("recentes");

  const contracts = [
    {
      id: "2025-01",
      amount: 50000,
      status: "ativo" as const,
      rate: 1.8,
      duration: 12,
      progress: 58,
      nextPayment: { date: "15/11/2025", amount: 5200 },
      startDate: "15/05/2024",
      investorsCount: 8,
      payments: [
        { date: "15/05/2024", amount: 5200, status: "pago" as const },
        { date: "15/06/2024", amount: 5200, status: "pago" as const },
        { date: "15/07/2024", amount: 5200, status: "pago" as const },
        { date: "15/08/2024", amount: 5200, status: "pago" as const },
        { date: "15/09/2024", amount: 5200, status: "pago" as const },
        { date: "15/10/2024", amount: 5200, status: "pago" as const },
        { date: "15/11/2024", amount: 5200, status: "pago" as const },
        { date: "15/12/2024", amount: 5200, status: "pendente" as const },
      ],
    },
    {
      id: "2024-12",
      amount: 30000,
      status: "quitado" as const,
      rate: 1.5,
      duration: 6,
      progress: 100,
      nextPayment: null,
      startDate: "10/01/2024",
      investorsCount: 5,
      payments: [
        { date: "10/01/2024", amount: 5300, status: "pago" as const },
        { date: "10/02/2024", amount: 5300, status: "pago" as const },
        { date: "10/03/2024", amount: 5300, status: "pago" as const },
        { date: "10/04/2024", amount: 5300, status: "pago" as const },
        { date: "10/05/2024", amount: 5300, status: "pago" as const },
        { date: "10/06/2024", amount: 5300, status: "pago" as const },
      ],
    },
    {
      id: "2024-08",
      amount: 75000,
      status: "em_atraso" as const,
      rate: 2.2,
      duration: 18,
      progress: 22,
      nextPayment: { date: "05/10/2024", amount: 5800 },
      startDate: "05/04/2024",
      investorsCount: 12,
      payments: [
        { date: "05/04/2024", amount: 5800, status: "pago" as const },
        { date: "05/05/2024", amount: 5800, status: "pago" as const },
        { date: "05/06/2024", amount: 5800, status: "pago" as const },
        { date: "05/07/2024", amount: 5800, status: "pago" as const },
        { date: "05/08/2024", amount: 5800, status: "atrasado" as const },
        { date: "05/09/2024", amount: 5800, status: "atrasado" as const },
      ],
    },
  ];

  const filteredContracts = contracts
    .filter((contract) => {
      if (statusFilter === "todos") return true;
      return contract.status === statusFilter;
    })
    .sort((a, b) => {
      if (sortBy === "recentes") return b.id.localeCompare(a.id);
      if (sortBy === "maior_valor") return b.amount - a.amount;
      if (sortBy === "vencimento") {
        if (!a.nextPayment) return 1;
        if (!b.nextPayment) return -1;
        return new Date(a.nextPayment.date.split("/").reverse().join("-")).getTime() -
               new Date(b.nextPayment.date.split("/").reverse().join("-")).getTime();
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userType="farmer" onExpandedChange={setIsSidebarExpanded} />
      <Header userType="farmer" isSidebarExpanded={isSidebarExpanded} />
      
      <main className={`pt-20 transition-all duration-500 ml-0 ${isSidebarExpanded ? 'md:ml-64' : 'md:ml-20'}`}>
        <div className="p-8 max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">Seus Contratos Ativos e Finalizados</h1>
            </div>
            <p className="text-muted-foreground">
              Gerencie e acompanhe todos os seus contratos de empréstimo
            </p>
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Tabs value={statusFilter} onValueChange={setStatusFilter} className="flex-1">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="todos">Todos</TabsTrigger>
                <TabsTrigger value="ativo">Ativos</TabsTrigger>
                <TabsTrigger value="quitado">Quitados</TabsTrigger>
                <TabsTrigger value="em_atraso">Em atraso</TabsTrigger>
              </TabsList>
            </Tabs>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recentes">Mais recentes</SelectItem>
                <SelectItem value="maior_valor">Maior valor</SelectItem>
                <SelectItem value="vencimento">Próximo vencimento</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Contracts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredContracts.map((contract) => (
              <ContractCard
                key={contract.id}
                contract={contract}
                onViewDetails={() => setSelectedContract(contract)}
              />
            ))}
          </div>

          {filteredContracts.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">
                Nenhum contrato encontrado com os filtros selecionados
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Contract Details Dialog */}
      {selectedContract && (
        <ContractDetails
          contract={selectedContract}
          open={!!selectedContract}
          onClose={() => setSelectedContract(null)}
        />
      )}
    </div>
  );
};

export default MyContracts;
