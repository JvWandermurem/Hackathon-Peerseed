import { useState } from "react";
import { Bell, CheckCheck, Settings, TrendingUp, Wallet, FileText, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type NotificationType = "Todos" | "Transacionais" | "Investimentos" | "Pagamentos" | "Sistema";

interface Notification {
  id: string;
  type: NotificationType;
  icon: typeof Bell;
  iconColor: string;
  title: string;
  description: string;
  timestamp: string;
  isNew: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NotificationsDrawer = ({ open, onOpenChange }: NotificationsDrawerProps) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<NotificationType>("Todos");
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "Pagamentos",
      icon: Wallet,
      iconColor: "text-primary",
      title: "Pagamento recebido",
      description: "R$ 450,00 creditados na carteira.",
      timestamp: "Há 5 minutos",
      isNew: true,
      action: {
        label: "Ver carteira",
        onClick: () => {
          navigate("/carteira");
          onOpenChange(false);
        },
      },
    },
    {
      id: "2",
      type: "Investimentos",
      icon: TrendingUp,
      iconColor: "text-primary",
      title: "Meta de captação atingida",
      description: "Sua captação atingiu 75%.",
      timestamp: "Há 2 horas",
      isNew: true,
      action: {
        label: "Ver investimento",
        onClick: () => {
          navigate("/meus-investimentos");
          onOpenChange(false);
        },
      },
    },
    {
      id: "3",
      type: "Pagamentos",
      icon: FileText,
      iconColor: "text-destructive",
      title: "Parcela próxima do vencimento",
      description: "Parcela vence em 3 dias.",
      timestamp: "Há 1 dia",
      isNew: false,
      action: {
        label: "Gerar boleto",
        onClick: () => {
          toast.success("Boleto gerado com sucesso!");
        },
      },
    },
    {
      id: "4",
      type: "Investimentos",
      icon: Leaf,
      iconColor: "text-primary",
      title: "Nova oportunidade disponível",
      description: "Nova oportunidade com selo sustentável disponível.",
      timestamp: "Há 2 dias",
      isNew: false,
      action: {
        label: "Ver oportunidade",
        onClick: () => {
          navigate("/marketplace");
          onOpenChange(false);
        },
      },
    },
    {
      id: "5",
      type: "Transacionais",
      icon: FileText,
      iconColor: "text-muted-foreground",
      title: "Contrato assinado",
      description: "Seu contrato de investimento foi assinado com sucesso.",
      timestamp: "Há 3 dias",
      isNew: false,
      action: {
        label: "Abrir contrato",
        onClick: () => {
          navigate("/meus-contratos");
          onOpenChange(false);
        },
      },
    },
    {
      id: "6",
      type: "Sistema",
      icon: Settings,
      iconColor: "text-muted-foreground",
      title: "Atualização de segurança",
      description: "Nova funcionalidade de autenticação em dois fatores disponível.",
      timestamp: "Há 1 semana",
      isNew: false,
      action: {
        label: "Configurar 2FA",
        onClick: () => {
          navigate("/configuracoes");
          onOpenChange(false);
        },
      },
    },
  ]);

  const filters: NotificationType[] = ["Todos", "Transacionais", "Investimentos", "Pagamentos", "Sistema"];

  const filteredNotifications = filter === "Todos" 
    ? notifications 
    : notifications.filter(n => n.type === filter);

  const newNotificationsCount = notifications.filter(n => n.isNew).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isNew: false })));
    toast.success("Todas as notificações marcadas como lidas");
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isNew: false } : n
    ));
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full relative">
          <Bell className="h-5 w-5" />
          {newNotificationsCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] rounded-full"
            >
              {newNotificationsCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-96 mr-4 p-0 z-[70]" 
        align="end" 
        sideOffset={8}
      >
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-sm">Notificações</h3>
              {newNotificationsCount > 0 && (
                <Badge variant="destructive" className="rounded-full h-5 px-2 text-[10px]">
                  {newNotificationsCount}
                </Badge>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              disabled={newNotificationsCount === 0}
              className="text-xs h-8"
            >
              <CheckCheck className="w-3 h-3 mr-1" />
              Marcar como lidas
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigate("/configuracoes");
                onOpenChange(false);
              }}
              className="text-xs h-8"
            >
              <Settings className="w-3 h-3 mr-1" />
              Preferências
            </Button>
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pt-3 no-scrollbar">
            {filters.map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f)}
                className="text-xs whitespace-nowrap h-7"
              >
                {f}
              </Button>
            ))}
          </div>
        </div>

        {/* Notifications List - Max 3 visible */}
        <ScrollArea className="max-h-[270px]">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <div className="w-16 h-16 mb-3 rounded-full bg-secondary flex items-center justify-center">
                <Bell className="w-8 h-8 text-muted-foreground" />
              </div>
              <h4 className="text-sm font-semibold mb-1">Nenhuma notificação</h4>
              <p className="text-xs text-muted-foreground max-w-[240px]">
                Você está em dia! Não há notificações {filter !== "Todos" && `de ${filter.toLowerCase()}`} no momento.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredNotifications.map((notification) => {
                const Icon = notification.icon;
                return (
                  <div
                    key={notification.id}
                    className={`p-3 hover:bg-accent/5 transition-colors cursor-pointer ${
                      notification.isNew ? "bg-accent/10" : ""
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex gap-3">
                      <div className={`w-9 h-9 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 ${notification.iconColor}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="text-xs font-medium leading-tight">
                            {notification.title}
                          </h4>
                          {notification.isNew && (
                            <Badge variant="default" className="rounded-full h-4 px-1.5 text-[9px]">
                              Novo
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-1.5 leading-snug">
                          {notification.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground">
                            {notification.timestamp}
                          </span>
                          {notification.action && (
                            <Button
                              variant="link"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                notification.action!.onClick();
                              }}
                              className="h-auto p-0 text-[10px] text-primary hover:text-primary/80"
                            >
                              {notification.action.label}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
