import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  ArrowLeftRight, 
  Search, 
  Filter,
  TrendingUp,
  TrendingDown,
  Leaf,
  DollarSign,
  Clock,
  User,
  Tag,
  ShoppingCart,
  Send
} from "lucide-react";
import { toast } from "sonner";

interface SeedListing {
  id: string;
  seller: {
    name: string;
    rating: number;
    totalSales: number;
  };
  seedInfo: {
    projectName: string;
    farmerName: string;
    originalAmount: number;
    remainingMonths: number;
    totalMonths: number;
    expectedReturn: number;
    riskGrade: "A" | "B" | "C" | "D";
    sustainable: boolean;
  };
  listing: {
    quantity: number;
    unitPrice: number;
    totalValue: number;
    discount: number;
    listedDate: string;
  };
}

const SecondaryMarket = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterRisk, setFilterRisk] = useState("all");
  const [sellModalOpen, setSellModalOpen] = useState(false);

  const listings: SeedListing[] = [
    {
      id: "1",
      seller: {
        name: "Carlos M.",
        rating: 4.8,
        totalSales: 23
      },
      seedInfo: {
        projectName: "Expansão de Soja Orgânica - Goiás",
        farmerName: "João Silva",
        originalAmount: 50000,
        remainingMonths: 8,
        totalMonths: 12,
        expectedReturn: 14.5,
        riskGrade: "B",
        sustainable: true
      },
      listing: {
        quantity: 10,
        unitPrice: 480,
        totalValue: 4800,
        discount: 4,
        listedDate: "2024-10-01"
      }
    },
    {
      id: "2",
      seller: {
        name: "Maria P.",
        rating: 4.9,
        totalSales: 45
      },
      seedInfo: {
        projectName: "Cultivo de Café Especial - MG",
        farmerName: "Pedro Santos",
        originalAmount: 35000,
        remainingMonths: 5,
        totalMonths: 10,
        expectedReturn: 12.8,
        riskGrade: "A",
        sustainable: true
      },
      listing: {
        quantity: 5,
        unitPrice: 720,
        totalValue: 3600,
        discount: 2,
        listedDate: "2024-10-03"
      }
    },
    {
      id: "3",
      seller: {
        name: "Roberto L.",
        rating: 4.5,
        totalSales: 12
      },
      seedInfo: {
        projectName: "Milho Híbrido - Mato Grosso",
        farmerName: "Ana Costa",
        originalAmount: 80000,
        remainingMonths: 10,
        totalMonths: 12,
        expectedReturn: 16.2,
        riskGrade: "C",
        sustainable: false
      },
      listing: {
        quantity: 20,
        unitPrice: 390,
        totalValue: 7800,
        discount: 6.5,
        listedDate: "2024-09-28"
      }
    }
  ];

  const handleBuy = (listing: SeedListing) => {
    toast.success(`Compra iniciada! Seeds de "${listing.seedInfo.projectName}"`);
  };

  const handleSell = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Sua oferta foi publicada no mercado secundário!");
    setSellModalOpen(false);
  };

  const getRiskColor = (grade: string) => {
    switch (grade) {
      case "A": return "text-primary bg-primary/10 border-primary/20";
      case "B": return "text-blue-600 bg-blue-500/10 border-blue-500/20";
      case "C": return "text-yellow-600 bg-yellow-500/10 border-yellow-500/20";
      case "D": return "text-orange-600 bg-orange-500/10 border-orange-500/20";
      default: return "text-muted-foreground bg-muted border-muted";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userType="investor" onExpandedChange={setIsSidebarExpanded} />
      <Header userType="investor" isSidebarExpanded={isSidebarExpanded} />
      
      <main className={`pt-20 transition-all duration-500 ml-0 ${isSidebarExpanded ? 'md:ml-64' : 'md:ml-20'}`}>
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
              <div className="flex items-center gap-3">
                <ArrowLeftRight className="w-8 h-8 text-primary" />
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">Mercado Secundário</h1>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Compre e venda seeds com outros investidores
                  </p>
                </div>
              </div>
              <Dialog open={sellModalOpen} onOpenChange={setSellModalOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Tag className="w-4 h-4" />
                    Vender minhas seeds
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Colocar seeds à venda</DialogTitle>
                    <DialogDescription>
                      Defina o preço e a quantidade que deseja vender
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSell} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="seed-select">Selecione a seed</Label>
                      <Select required>
                        <SelectTrigger id="seed-select">
                          <SelectValue placeholder="Escolha uma seed" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Expansão Soja Orgânica (15 seeds)</SelectItem>
                          <SelectItem value="2">Café Especial MG (8 seeds)</SelectItem>
                          <SelectItem value="3">Milho Híbrido MT (22 seeds)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantidade</Label>
                      <Input 
                        id="quantity" 
                        type="number" 
                        min="1" 
                        placeholder="Quantas seeds?" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Preço unitário (R$)</Label>
                      <Input 
                        id="price" 
                        type="number" 
                        step="0.01" 
                        min="0.01"
                        placeholder="500.00" 
                        required 
                      />
                      <p className="text-xs text-muted-foreground">
                        Valor de face: R$ 500,00 · Desconto sugerido: 2-5%
                      </p>
                    </div>
                    <Button type="submit" className="w-full gap-2">
                      <Send className="w-4 h-4" />
                      Publicar oferta
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
            <Card>
              <CardContent className="pt-4 md:pt-6 pb-4 md:pb-6">
                <div className="text-center">
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">Volume 24h</p>
                  <p className="text-lg md:text-2xl font-bold text-foreground">R$ 142,5k</p>
                  <div className="flex items-center justify-center gap-1 text-primary text-xs mt-1">
                    <TrendingUp className="w-3 h-3" />
                    +12.5%
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 md:pt-6 pb-4 md:pb-6">
                <div className="text-center">
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">Ofertas ativas</p>
                  <p className="text-lg md:text-2xl font-bold text-foreground">127</p>
                  <p className="text-xs text-muted-foreground mt-1">seeds à venda</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 md:pt-6 pb-4 md:pb-6">
                <div className="text-center">
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">Desconto médio</p>
                  <p className="text-lg md:text-2xl font-bold text-primary">4.2%</p>
                  <p className="text-xs text-muted-foreground mt-1">abaixo do valor</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 md:pt-6 pb-4 md:pb-6">
                <div className="text-center">
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">Negociações</p>
                  <p className="text-lg md:text-2xl font-bold text-foreground">89</p>
                  <p className="text-xs text-muted-foreground mt-1">últimos 7 dias</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters & Search */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-5">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por projeto, agricultor..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="md:col-span-3">
                  <Select value={filterRisk} onValueChange={setFilterRisk}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrar por risco" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os riscos</SelectItem>
                      <SelectItem value="A">Grade A</SelectItem>
                      <SelectItem value="B">Grade B</SelectItem>
                      <SelectItem value="C">Grade C</SelectItem>
                      <SelectItem value="D">Grade D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-4">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Mais recentes</SelectItem>
                      <SelectItem value="discount">Maior desconto</SelectItem>
                      <SelectItem value="return">Maior retorno</SelectItem>
                      <SelectItem value="price-low">Menor preço</SelectItem>
                      <SelectItem value="price-high">Maior preço</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {listings.map((listing) => (
              <Card key={listing.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col gap-4">
                    {/* Seed Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base md:text-lg mb-1 break-words">
                            {listing.seedInfo.projectName}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-muted-foreground">
                            <div className="flex items-center gap-1 whitespace-nowrap">
                              <User className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{listing.seedInfo.farmerName}</span>
                            </div>
                            <span className="hidden sm:inline">•</span>
                            <div className="flex items-center gap-1 whitespace-nowrap">
                              <Clock className="w-3 h-3 flex-shrink-0" />
                              <span>{listing.seedInfo.remainingMonths} de {listing.seedInfo.totalMonths} meses</span>
                            </div>
                          </div>
                        </div>
                        {listing.seedInfo.sustainable && (
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 gap-1 flex-shrink-0 whitespace-nowrap self-start sm:self-auto">
                            <Leaf className="w-3 h-3 flex-shrink-0" />
                            <span className="hidden sm:inline">Sustentável</span>
                            <span className="sm:hidden">Sust.</span>
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className={`${getRiskColor(listing.seedInfo.riskGrade)} whitespace-nowrap flex-shrink-0`}>
                          Grade {listing.seedInfo.riskGrade}
                        </Badge>
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20 whitespace-nowrap flex-shrink-0">
                          <TrendingUp className="w-3 h-3 mr-1 flex-shrink-0" />
                          {listing.seedInfo.expectedReturn}% a.a.
                        </Badge>
                        <Badge variant="outline" className="bg-secondary whitespace-nowrap flex-shrink-0">
                          {listing.listing.quantity} seeds
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs md:text-sm text-muted-foreground pt-2 border-t">
                        <span className="whitespace-nowrap">Vendedor: {listing.seller.name}</span>
                        <span className="whitespace-nowrap">⭐ {listing.seller.rating}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="whitespace-nowrap">{listing.seller.totalSales} vendas</span>
                      </div>
                    </div>

                    {/* Pricing & Action */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:border-t sm:pt-4">
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-xs text-muted-foreground whitespace-nowrap">Preço unitário</span>
                          {listing.listing.discount > 0 && (
                            <Badge variant="destructive" className="text-xs px-1.5 py-0 whitespace-nowrap flex-shrink-0">
                              -{listing.listing.discount}%
                            </Badge>
                          )}
                        </div>
                        <p className="text-2xl md:text-3xl font-bold text-foreground">
                          R$ {listing.listing.unitPrice.toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Total: R$ {listing.listing.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 sm:w-auto w-full">
                        <Button 
                          onClick={() => handleBuy(listing)}
                          className="gap-2 w-full sm:w-auto"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span className="hidden sm:inline">Comprar agora</span>
                          <span className="sm:hidden">Comprar</span>
                        </Button>
                        <Button variant="outline" className="text-xs w-full sm:w-auto">
                          Ver detalhes
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {listings.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <ArrowLeftRight className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Nenhuma oferta encontrada</h3>
                <p className="text-sm text-muted-foreground">
                  Tente ajustar os filtros ou seja o primeiro a vender suas seeds!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default SecondaryMarket;
