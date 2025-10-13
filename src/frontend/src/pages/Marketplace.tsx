import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { OpportunityCard } from "@/components/OpportunityCard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Filter, Sparkles, Heart } from "lucide-react";

const opportunities = [
  // Produção Rural (prioridade)
  {
    id: 1,
    farmer: "João Silva – Fazenda São José",
    amount: 50000,
    rate: 15,
    duration: 12,
    purpose: "Milho",
    risk: "Médio" as const,
    category: "producao" as const,
    score: "C",
    funded: 70,
    impact: ["Práticas Sustentáveis"],
  },
  {
    id: 2,
    farmer: "Maria Santos – Sítio Boa Vista",
    amount: 80000,
    rate: 12,
    duration: 18,
    purpose: "Café",
    risk: "Baixo" as const,
    category: "producao" as const,
    score: "B",
    funded: 45,
    impact: ["Certificação Orgânica", "Boas Práticas"],
  },
  {
    id: 3,
    farmer: "Pedro Oliveira – Fazenda Horizonte",
    amount: 120000,
    rate: 18,
    duration: 24,
    purpose: "Soja",
    risk: "Alto" as const,
    category: "producao" as const,
    score: "D",
    funded: 30,
    impact: [],
  },
  {
    id: 4,
    farmer: "Ana Costa – Fazenda Orgânica Centro-Oeste",
    amount: 65000,
    rate: 14,
    duration: 15,
    purpose: "Hortaliças",
    risk: "Baixo" as const,
    category: "producao" as const,
    score: "A",
    funded: 85,
    impact: ["Certificação Orgânica", "Práticas Sustentáveis"],
  },
  {
    id: 5,
    farmer: "Carlos Mendes – Cooperativa Família Unida",
    amount: 95000,
    rate: 16,
    duration: 20,
    purpose: "Feijão",
    risk: "Médio" as const,
    category: "producao" as const,
    score: "C",
    funded: 55,
    impact: ["Impacto Social"],
  },
  {
    id: 6,
    farmer: "Lucia Pereira – Fazenda Vale Verde",
    amount: 75000,
    rate: 13,
    duration: 12,
    purpose: "Arroz",
    risk: "Baixo" as const,
    category: "producao" as const,
    score: "B",
    funded: 90,
    impact: ["Boas Práticas"],
  },
  // Eventos do Agro
  {
    id: 7,
    farmer: "Festival Agro Vale – Produtora Eventos Rurais",
    amount: 150000,
    rate: 16,
    duration: 6,
    purpose: "Festival de Agricultura Familiar",
    risk: "Médio" as const,
    category: "evento" as const,
    score: "B",
    funded: 40,
    impact: ["Impacto Social", "Agricultura Familiar"],
  },
  {
    id: 8,
    farmer: "Feira Orgânica SP – Associação Produtores",
    amount: 85000,
    rate: 15,
    duration: 8,
    purpose: "Feira de Produtos Orgânicos",
    risk: "Baixo" as const,
    category: "evento" as const,
    score: "A",
    funded: 65,
    impact: ["Certificação Orgânica", "Sustentabilidade"],
  },
];

const Marketplace = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [termFilter, setTermFilter] = useState("all");
  const [rateRange, setRateRange] = useState([10, 20]);

  // Ordena oportunidades: Produção Rural primeiro, depois Eventos
  const sortedOpportunities = [...opportunities].sort((a, b) => {
    if (a.category === "producao" && b.category === "evento") return -1;
    if (a.category === "evento" && b.category === "producao") return 1;
    return 0;
  });

  const filteredOpportunities = sortedOpportunities.filter((opp) => {
    if (categoryFilter !== "all" && opp.category !== categoryFilter) return false;
    if (riskFilter !== "all" && opp.score !== riskFilter) return false;
    if (termFilter === "short" && opp.duration > 12) return false;
    if (termFilter === "medium" && (opp.duration <= 12 || opp.duration > 18)) return false;
    if (termFilter === "long" && opp.duration <= 18) return false;
    if (opp.rate < rateRange[0] || opp.rate > rateRange[1]) return false;
    return true;
  });

  const highlightedOpportunities = opportunities.filter(
    (opp) => opp.impact.includes("Certificação Orgânica") || opp.impact.includes("Impacto Social")
  );

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userType="investor" onExpandedChange={setIsSidebarExpanded} />
      <div className={`transition-all duration-500 ml-0 ${isSidebarExpanded ? 'md:ml-64' : 'md:ml-20'}`}>
        <Header userType="investor" isSidebarExpanded={isSidebarExpanded} />
        <main className="pt-20">
          <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
            {/* Title */}
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-2">Oportunidades de Investimento</h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Explore e invista em propostas de crédito de agricultores verificados
              </p>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold">Filtros</h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="h-8"
                  >
                    {showFilters ? "Ocultar" : "Mostrar"}
                  </Button>
                </div>

                {showFilters && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Categoria</label>
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Todas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas</SelectItem>
                          <SelectItem value="producao">🌱 Produção Rural</SelectItem>
                          <SelectItem value="evento">🎪 Eventos do Agro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Score de Crédito</label>
                      <Select value={riskFilter} onValueChange={setRiskFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="A">A - Excelente</SelectItem>
                          <SelectItem value="B">B - Muito Bom</SelectItem>
                          <SelectItem value="C">C - Bom</SelectItem>
                          <SelectItem value="D">D - Regular</SelectItem>
                          <SelectItem value="E">E - Atenção</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Prazo</label>
                      <Select value={termFilter} onValueChange={setTermFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="short">Curto (até 12 meses)</SelectItem>
                          <SelectItem value="medium">Médio (12-18 meses)</SelectItem>
                          <SelectItem value="long">Longo (mais de 18 meses)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Taxa de Retorno: {rateRange[0]}% - {rateRange[1]}% a.a.
                      </label>
                      <Slider
                        min={10}
                        max={20}
                        step={1}
                        value={rateRange}
                        onValueChange={setRateRange}
                        className="mt-2"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Highlighted Opportunities */}
            {highlightedOpportunities.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h2 className="text-2xl font-bold text-foreground">Destaques</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {highlightedOpportunities.slice(0, 2).map((opp) => (
                    <div key={opp.id} className="relative">
                      <Badge className="absolute -top-2 -right-2 z-10 bg-primary">
                        Destaque
                      </Badge>
                      <OpportunityCard opportunity={opp} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Opportunities */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">
                  Todas as Oportunidades ({filteredOpportunities.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOpportunities.map((opp) => (
                  <OpportunityCard key={opp.id} opportunity={opp} />
                ))}
              </div>
              {filteredOpportunities.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">
                      Nenhuma oportunidade encontrada com os filtros selecionados.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Marketplace;
