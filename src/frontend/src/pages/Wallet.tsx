import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet as WalletIcon, Lock, Clock, TrendingUp, Download, Upload, Send } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const transactions = [
  {
    id: 1,
    date: "05/09/2025",
    type: "Depósito (Pix)",
    amount: "R$ 2.000,00",
    status: "Concluído",
    icon: "deposit",
  },
  {
    id: 2,
    date: "07/09/2025",
    type: "Investimento – João (Soja)",
    amount: "USDC 1.000",
    status: "Concluído",
    icon: "investment",
  },
  {
    id: 3,
    date: "10/09/2025",
    type: "Retorno Juros",
    amount: "R$ 150,00",
    status: "Concluído",
    icon: "return",
  },
  {
    id: 4,
    date: "15/09/2025",
    type: "Saque (Pix)",
    amount: "R$ 500,00",
    status: "Pendente",
    icon: "withdrawal",
  },
  {
    id: 5,
    date: "18/09/2025",
    type: "Taxa de Operação",
    amount: "R$ 5,00",
    status: "Concluído",
    icon: "fee",
  },
  {
    id: 6,
    date: "20/09/2025",
    type: "Investimento – Maria (Café)",
    amount: "USDC 2.500",
    status: "Concluído",
    icon: "investment",
  },
  {
    id: 7,
    date: "25/09/2025",
    type: "Retorno Juros",
    amount: "R$ 280,00",
    status: "Concluído",
    icon: "return",
  },
];

const walletEvolution = [
  { month: "Jan", balance: 5000 },
  { month: "Fev", balance: 6200 },
  { month: "Mar", balance: 7100 },
  { month: "Abr", balance: 7800 },
  { month: "Mai", balance: 8500 },
  { month: "Jun", balance: 9200 },
  { month: "Jul", balance: 10100 },
  { month: "Ago", balance: 11500 },
  { month: "Set", balance: 12800 },
];

const Wallet = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const availableBalance = 1200;
  const blockedBalance = 5800;
  const processingBalance = 500;
  const accumulatedReturn = 430;
  const returnPercentage = 6.8;

  const statusColors: Record<string, string> = {
    Concluído: "bg-primary/10 text-primary",
    Pendente: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-500",
    Cancelado: "bg-destructive/10 text-destructive",
  };

  const typeIcons: Record<string, string> = {
    deposit: "📥",
    investment: "🌱",
    return: "📈",
    withdrawal: "📤",
    fee: "💳",
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
              <h1 className="text-4xl font-bold text-foreground mb-2">Minha Carteira</h1>
              <p className="text-muted-foreground">Gerencie seus saldos e transações</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <WalletIcon className="w-4 h-4" />
                    Saldo Disponível
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-foreground">
                    R$ {availableBalance.toLocaleString("pt-BR")}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">≈ {(availableBalance / 5).toFixed(0)} USDC</p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Saldo Bloqueado
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-foreground">
                    R$ {blockedBalance.toLocaleString("pt-BR")}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Em investimentos ativos</p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Em Processamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-foreground">
                    R$ {processingBalance.toLocaleString("pt-BR")}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Transações pendentes</p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Rentabilidade
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary">
                    +R$ {accumulatedReturn.toLocaleString("pt-BR")}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">+{returnPercentage}% no período</p>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="h-16 text-base" size="lg">
                    <Download className="w-5 h-5 mr-2" />
                    Depositar (Pix)
                  </Button>
                  <Button className="h-16 text-base" size="lg" variant="secondary">
                    <Upload className="w-5 h-5 mr-2" />
                    Sacar (Pix)
                  </Button>
                  <Button className="h-16 text-base" size="lg" variant="outline">
                    <Send className="w-5 h-5 mr-2" />
                    Transferir
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Transactions Table */}
            <Card>
              <CardHeader>
                <CardTitle>Transações Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.date}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{typeIcons[transaction.icon]}</span>
                            <span>{transaction.type}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">{transaction.amount}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[transaction.status]}>
                            {transaction.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Wallet Evolution Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Evolução da Carteira</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={walletEvolution}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="month" 
                        className="text-xs"
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <YAxis 
                        className="text-xs"
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px',
                        }}
                        formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Saldo']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="balance" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--primary))' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Wallet;
