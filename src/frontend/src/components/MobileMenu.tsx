import { useState } from "react";
import { Menu, X, DollarSign, BarChart2, FileText, CreditCard, Settings, ShoppingBag, Sprout, Wallet, Home, ArrowLeftRight } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const farmerMenuItems = [
  { icon: Home, label: "Home", path: "/agricultor" },
  { icon: DollarSign, label: "Pedir um empréstimo", path: "/agricultor/novo-emprestimo" },
  { icon: BarChart2, label: "Score de crédito", path: "/agricultor/score" },
  { icon: FileText, label: "Meus contratos", path: "/agricultor/contratos" },
  { icon: CreditCard, label: "Pagamentos", path: "/agricultor/pagamentos" },
  { icon: Settings, label: "Configurações", path: "/configuracoes" },
];

const investorMenuItems = [
  { icon: Home, label: "Home", path: "/investidor" },
  { icon: ShoppingBag, label: "Marketplace", path: "/marketplace" },
  { icon: ArrowLeftRight, label: "Mercado Secundário", path: "/mercado-secundario" },
  { icon: Sprout, label: "Minhas seeds", path: "/minhas-seeds" },
  { icon: Wallet, label: "Carteira", path: "/carteira" },
  { icon: Settings, label: "Configurações", path: "/configuracoes" },
];

interface MobileMenuProps {
  userType?: "farmer" | "investor";
}

export const MobileMenu = ({ userType = "farmer" }: MobileMenuProps) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const isFarmer = userType === "farmer" || location.pathname.startsWith("/agricultor");
  const menuItems = isFarmer ? farmerMenuItems : investorMenuItems;

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0">
          <SheetHeader className="p-6 border-b">
            <SheetTitle className="flex items-center gap-2">
              <Sprout className="w-5 h-5 text-primary" />
              Menu
            </SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col p-4 space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/agricultor" || item.path === "/investidor"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                    "text-foreground/70 hover:bg-accent hover:text-foreground",
                    isActive && "bg-accent text-foreground font-medium"
                  )
                }
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};
