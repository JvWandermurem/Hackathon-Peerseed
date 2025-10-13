import { useState } from "react";
import { DollarSign, BarChart2, FileText, CreditCard, Settings, ShoppingBag, Sprout, Wallet, Home, ArrowLeftRight } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import reevoIcon from "@/assets/reevo-icon.svg";

const farmerMenuItems = [
  { icon: Home, label: "Home", path: "/agricultor" },
  { icon: DollarSign, label: "Pedir um empréstimo", path: "/agricultor/novo-emprestimo" },
  { icon: BarChart2, label: "Score de crédito", path: "/agricultor/score" },
  { icon: FileText, label: "Meus contratos", path: "/agricultor/contratos" },
  { icon: CreditCard, label: "Pagamentos", path: "/agricultor/pagamentos" },
];

const investorMenuItems = [
  { icon: Home, label: "Home", path: "/investidor" },
  { icon: ShoppingBag, label: "Marketplace", path: "/marketplace" },
  { icon: ArrowLeftRight, label: "Mercado Secundário", path: "/mercado-secundario" },
  { icon: Sprout, label: "Minhas seeds", path: "/minhas-seeds" },
  { icon: Wallet, label: "Carteira", path: "/carteira" },
];

interface SidebarProps {
  userType?: "farmer" | "investor";
  onExpandedChange?: (expanded: boolean) => void;
}

export const Sidebar = ({ userType = "farmer", onExpandedChange }: SidebarProps) => {
  const location = useLocation();
  const isFarmer = userType === "farmer" || location.pathname.startsWith("/agricultor");
  const menuItems = isFarmer ? farmerMenuItems : investorMenuItems;
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  
  return (
    <aside 
      className={cn(
        "bg-sidebar h-screen fixed left-0 top-0 flex flex-col border-r border-sidebar-border transition-all duration-500 ease-in-out z-50 hidden md:flex",
        isExpanded ? "w-64" : "w-20"
      )}
      onMouseEnter={() => {
        setIsExpanded(true);
        onExpandedChange?.(true);
      }}
      onMouseLeave={() => {
        setIsExpanded(false);
        setIsLocked(false);
        onExpandedChange?.(false);
      }}
      onClick={() => setIsLocked(true)}
    >
      {/* Logo */}
      <div className="h-20 flex items-center justify-center border-b border-sidebar-border px-4">
        <NavLink 
          to={isFarmer ? "/agricultor" : "/investidor"}
          className="flex items-center gap-0 hover:opacity-80 transition-opacity overflow-hidden"
        >
          <span 
            className={cn(
              "text-sidebar-foreground font-gotham text-2xl transition-all duration-500 ease-in-out",
              isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 absolute"
            )}
          >
            R
          </span>
          <img 
            src={reevoIcon} 
            alt="Reevo" 
            className="w-10 h-10 flex-shrink-0 object-contain"
          />
          <span 
            className={cn(
              "text-sidebar-foreground font-gotham text-2xl transition-all duration-500 ease-in-out",
              isExpanded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 absolute"
            )}
          >
            vo
          </span>
        </NavLink>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-hidden">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/agricultor" || item.path === "/investidor"}
            className={({ isActive }) =>
              cn(
                "flex items-center rounded-lg transition-all duration-200 group relative",
                "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                isActive && "bg-sidebar-accent text-sidebar-foreground font-medium",
                isExpanded ? "gap-3 px-3 py-3" : "justify-center py-3 px-0"
              )
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span 
              className={cn(
                "text-sm whitespace-nowrap transition-all duration-500 ease-in-out",
                isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 absolute"
              )}
            >
              {item.label}
            </span>
            
            {/* Tooltip for collapsed state */}
            {!isExpanded && (
              <div className="absolute left-full ml-2 px-3 py-2 bg-sidebar rounded-lg shadow-lg border border-sidebar-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none whitespace-nowrap z-50">
                <span className="text-sm text-sidebar-foreground">{item.label}</span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Settings at bottom */}
      <div className="px-2 py-4 border-t border-sidebar-border">
        <NavLink
          to="/configuracoes"
          className={({ isActive }) =>
            cn(
              "flex items-center rounded-lg transition-all duration-200 group relative",
              "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
              isActive && "bg-sidebar-accent text-sidebar-foreground font-medium",
              isExpanded ? "gap-3 px-3 py-3" : "justify-center py-3 px-0"
            )
          }
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          <span 
            className={cn(
              "text-sm whitespace-nowrap transition-all duration-500 ease-in-out",
              isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 absolute"
            )}
          >
            Configurações
          </span>
          
          {/* Tooltip for collapsed state */}
          {!isExpanded && (
            <div className="absolute left-full ml-2 px-3 py-2 bg-sidebar rounded-lg shadow-lg border border-sidebar-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none whitespace-nowrap z-50">
              <span className="text-sm text-sidebar-foreground">Configurações</span>
            </div>
          )}
        </NavLink>
      </div>
    </aside>
  );
};
