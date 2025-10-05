import { useState } from "react";
import {
  User,
  Settings,
  HelpCircle,
  LogOut,
  BadgeCheck,
  Clock,
  TrendingUp,
  Wallet,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

export const ProfileMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isFarmer = location.pathname.startsWith("/agricultor");

  // Mock user data
  const user = {
    name: "João Silva",
    email: "joao.silva@email.com",
    avatar: "",
    initials: "JS",
    kycStatus: "approved" as "approved" | "pending",
    // Farmer specific
    creditScore: 782,
    creditGrade: "B" as "A" | "B" | "C" | "D" | "E",
    // Investor specific
    balance: 15420.50,
    totalReturn: 2840.75,
  };

  const handleLogout = () => {
    toast.success("Logout realizado com sucesso");
    navigate("/");
    setOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  const toggleProfile = () => {
    if (isFarmer) {
      navigate("/investidor");
    } else {
      navigate("/agricultor");
    }
    setOpen(false);
  };

  const getScoreColor = (grade: string) => {
    switch (grade) {
      case "A":
        return "text-primary";
      case "B":
        return "text-primary";
      case "C":
        return "text-yellow-600";
      case "D":
        return "text-orange-600";
      case "E":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full relative">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {user.initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80 mr-4"
        align="end"
        sideOffset={8}
      >
        {/* User Header */}
        <DropdownMenuLabel className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-sm truncate">{user.name}</p>
                {user.kycStatus === "approved" ? (
                  <Badge
                    variant="default"
                    className="bg-primary text-primary-foreground h-5 px-1.5 text-[10px] gap-1"
                  >
                    <BadgeCheck className="w-3 h-3" />
                    KYC
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-yellow-500 text-yellow-600 h-5 px-1.5 text-[10px] gap-1"
                  >
                    <Clock className="w-3 h-3" />
                    Pendente
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Quick Summary */}
        <div className="px-4 py-3 bg-secondary/50">
          {isFarmer ? (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Score de Crédito</span>
                <span className={`font-semibold ${getScoreColor(user.creditGrade)}`}>
                  {user.creditScore} · {user.creditGrade}
                </span>
              </div>
              <Button
                variant="link"
                size="sm"
                onClick={() => handleNavigation("/score")}
                className="h-auto p-0 text-xs text-primary hover:text-primary/80"
              >
                Ver detalhes do score
              </Button>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Saldo disponível</span>
                <span className="font-semibold text-foreground">
                  R$ {user.balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Retorno acumulado</span>
                <span className="font-semibold text-primary">
                  +R$ {user.totalReturn.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <Button
                variant="link"
                size="sm"
                onClick={() => handleNavigation("/carteira")}
                className="h-auto p-0 text-xs text-primary hover:text-primary/80"
              >
                Ver carteira
              </Button>
            </div>
          )}
        </div>

        <DropdownMenuSeparator />

        {/* Quick Actions */}
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={toggleProfile}
            className="cursor-pointer py-2.5"
          >
            <div className="flex items-center gap-3 w-full">
              <div className="flex items-center gap-1.5 text-sm">
                <span>{isFarmer ? "🌱" : "💰"}</span>
                <span>Trocar para {isFarmer ? "Investidor" : "Agricultor"}</span>
              </div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleNavigation("/configuracoes")}
            className="cursor-pointer py-2.5"
          >
            <Settings className="w-4 h-4 mr-3" />
            <span>Minha conta</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleNavigation("/ajuda")}
            className="cursor-pointer py-2.5"
          >
            <HelpCircle className="w-4 h-4 mr-3" />
            <span>Central de ajuda</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer py-2.5 text-destructive focus:text-destructive focus:bg-destructive/10"
        >
          <LogOut className="w-4 h-4 mr-3" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
