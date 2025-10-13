import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index";
import InvestorIndex from "./pages/InvestorIndex";
import Marketplace from "./pages/Marketplace";
import SecondaryMarket from "./pages/SecondaryMarket";
import MySeeds from "./pages/MySeeds";
import Wallet from "./pages/Wallet";
import NewLoan from "./pages/NewLoan";
import CreditScore from "./pages/CreditScore";
import MyContracts from "./pages/MyContracts";
import Payments from "./pages/Payments";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Signup />} />
            <Route path="/agricultor" element={<Index />} />
            <Route path="/agricultor/novo-emprestimo" element={<NewLoan />} />
            <Route path="/agricultor/score" element={<CreditScore />} />
            <Route path="/agricultor/contratos" element={<MyContracts />} />
            <Route path="/agricultor/pagamentos" element={<Payments />} />
            <Route path="/investidor" element={<InvestorIndex />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/mercado-secundario" element={<SecondaryMarket />} />
            <Route path="/minhas-seeds" element={<MySeeds />} />
            <Route path="/carteira" element={<Wallet />} />
            <Route path="/configuracoes" element={<Settings />} />
            <Route path="/ajuda" element={<Help />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
