import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wallet, TrendingUp, Sprout, DollarSign, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const activeInvestments = [
  {
    id: 1,
    farmer: "João Silva – Fazenda São José",
    culture: "Milho",
    invested: 1000,
    rate: 15,
    received: 40,
    status: "Em Pagamento",
    duration: 12,
    startDate: "01/03/2024",
  },
  {
    id: 2,
    farmer: "Maria Santos – Sítio Boa Vista",
    culture: "Café",
    invested: 2500,
    rate: 12,
    received: 10,
    status: "Em Carência",
    duration: 18,
    startDate: "15/09/2024",
  },
  {
    id: 3,
    farmer: "Ana Costa – Fazenda Orgânica",
    culture: "Hortaliças",
    invested: 1500,
    rate: 14,
    received: 70,
    status: "Em Pagamento",
    duration: 15,
    startDate: "20/05/2024",
  },
  {
    id: 4,
    farmer: "Carlos Mendes – Cooperativa",
    culture: "Feijão",
    invested: 800,
    rate: 16,
    received: 25,
    status: "Ativo",
    duration: 20,
    startDate: "10/07/2024",
  },
];

const completedInvestments = [
  {
    id: 5,
    farmer: "Pedro Oliveira – Fazenda Horizonte",
    culture: "Soja",
    invested: 3000,
    rate: 18,
    totalReturn: 540,
    status: "Concluído",
    startDate: "05/01/2024",
    endDate: "05/01/2025",
    impact: "12 hectares financiados",
  },
  {
    id: 6,
    farmer: "Lucia Pereira – Vale Verde",
    culture: "Arroz",
    invested: 2000,
    rate: 13,
    totalReturn: 260,
    status: "Concluído",
    startDate: "20/02/2024",
    endDate: "20/02/2025",
    impact: "1 família apoiada",
  },
];

const MySeeds = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [selectedTab, setSelectedTab] = useState("active");

  const totalInvested = [...activeInvestments, ...completedInvestments].reduce(
    (sum, inv) => sum + inv.invested,
    0
  );

  const totalReturn = completedInvestments.reduce((sum, inv) => sum + inv.totalReturn, 0);
  const expectedReturn = activeInvestments.reduce(
    (sum, inv) => sum + (inv.invested * inv.rate * inv.duration) / 100 / 12,
    0
  );

  const totalReturnAmount = totalReturn + expectedReturn;
  const returnPercentage = ((totalReturnAmount / totalInvested) * 100).toFixed(1);

  const statusColors: Record<string, string> = {
    Ativo: "bg-primary/10 text-primary",
    "Em Carência": "bg-blue-500/10 text-blue-700 dark:text-blue-500",
    "Em Pagamento": "bg-primary/10 text-primary",
    Concluído: "bg-green-500/10 text-green-700 dark:text-green-500",
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userType="investor" onExpandedChange={setIsSidebarExpanded} />
      <div className={`transition-all duration-500 ml-0 ${isSidebarExpanded ? 'md:ml-64' : 'md:ml-20'}`}>
        <Header userType="investor" isSidebarExpanded={isSidebarExpanded} />
        <main className="pt-20">
          <div className="p-8 max-w-7xl mx-auto space-y-6">
            {/* Title */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-2">Minhas Seeds</h1>
              <p className="text-muted-foreground">Acompanhe seus investimentos e impacto gerado</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Total Investido
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-foreground">
                    R$ {totalInvested.toLocaleString("pt-BR")}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Retorno Acumulado
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary">
                    +R$ {totalReturnAmount.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">+{returnPercentage}%</p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Sprout className="w-4 h-4" />
                    Impacto Gerado
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-foreground">5 famílias</p>
                  <p className="text-sm text-muted-foreground mt-1">120 hectares financiados</p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Wallet className="w-4 h-4" />
                    Saldo Disponível
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-foreground">R$ 1.200,00</p>
                  <p className="text-sm text-muted-foreground mt-1">≈ 240 USDC</p>
                </CardContent>
              </Card>
            </div>

            {/* Investments Table */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="active">Ativos ({activeInvestments.length})</TabsTrigger>
                <TabsTrigger value="completed">Encerrados ({completedInvestments.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Investimentos Ativos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Agricultor</TableHead>
                          <TableHead>Cultura</TableHead>
                          <TableHead>Investido</TableHead>
                          <TableHead>Taxa</TableHead>
                          <TableHead>Progresso</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activeInvestments.map((investment) => (
                          <TableRow key={investment.id}>
                            <TableCell className="font-medium">{investment.farmer}</TableCell>
                            <TableCell>{investment.culture}</TableCell>
                            <TableCell>R$ {investment.invested.toLocaleString("pt-BR")}</TableCell>
                            <TableCell className="text-primary">{investment.rate}% a.a.</TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">{investment.received}%</span>
                                </div>
                                <Progress value={investment.received} className="h-2" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={statusColors[investment.status]}>
                                {investment.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4 mr-2" />
                                Ver detalhes
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="completed" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Investimentos Concluídos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Agricultor</TableHead>
                          <TableHead>Cultura</TableHead>
                          <TableHead>Investido</TableHead>
                          <TableHead>Retorno</TableHead>
                          <TableHead>Período</TableHead>
                          <TableHead>Impacto</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {completedInvestments.map((investment) => (
                          <TableRow key={investment.id}>
                            <TableCell className="font-medium">{investment.farmer}</TableCell>
                            <TableCell>{investment.culture}</TableCell>
                            <TableCell>R$ {investment.invested.toLocaleString("pt-BR")}</TableCell>
                            <TableCell className="text-primary font-semibold">
                              +R$ {investment.totalReturn.toLocaleString("pt-BR")}
                            </TableCell>
                            <TableCell className="text-sm">
                              <div>{investment.startDate}</div>
                              <div className="text-muted-foreground">{investment.endDate}</div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {investment.impact}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4 mr-2" />
                                Ver detalhes
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MySeeds;
