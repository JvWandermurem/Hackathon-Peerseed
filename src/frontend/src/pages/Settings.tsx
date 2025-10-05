import { useState } from "react";
import { useTheme } from "next-themes";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import {
  User, 
  Shield, 
  Bell, 
  Palette, 
  BarChart3, 
  Lock, 
  Download, 
  Trash2,
  Smartphone,
  Mail,
  MessageSquare,
  HelpCircle,
  Eye,
  EyeOff,
  Globe,
  Sun,
  Moon,
  Monitor
} from "lucide-react";


export default function Settings() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [userType] = useState<"farmer" | "investor">("farmer");
  const [activeTab, setActiveTab] = useState("profile");
  const { theme, setTheme } = useTheme();
  
  // Profile & Security
  const [name, setName] = useState("João Silva");
  const [email, setEmail] = useState("joao.silva@email.com");
  const [phone, setPhone] = useState("+55 11 98765-4321");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorMethod, setTwoFactorMethod] = useState("sms");
  
  // Notifications
  const [emailNotifications, setEmailNotifications] = useState({
    transactional: true,
    investments: true,
    payments: true,
    marketing: false,
  });
  const [pushNotifications, setPushNotifications] = useState({
    transactional: true,
    investments: true,
    payments: false,
    marketing: false,
  });
  const [whatsappNotifications, setWhatsappNotifications] = useState({
    transactional: true,
    investments: false,
    payments: false,
    marketing: false,
  });
  const [notificationFrequency, setNotificationFrequency] = useState("immediate");
  
  // Appearance
  const [language, setLanguage] = useState("pt");
  
  // Credit Score Settings
  const [showScoreReasons, setShowScoreReasons] = useState(true);
  const [showImprovementTips, setShowImprovementTips] = useState(true);

  const handleSave = () => {
    toast({
      title: "Alterações salvas",
      description: "Suas configurações foram atualizadas com sucesso.",
    });
  };

  const handleDiscard = () => {
    toast({
      title: "Alterações descartadas",
      description: "As configurações foram revertidas.",
      variant: "destructive",
    });
  };

  const handleDownloadData = () => {
    toast({
      title: "Download iniciado",
      description: "Seus dados estão sendo preparados para download (LGPD).",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Exclusão bloqueada",
      description: "Você possui contratos ativos. Finalize-os antes de excluir sua conta.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userType={userType} onExpandedChange={setIsSidebarExpanded} />
      <Header userType={userType} isSidebarExpanded={isSidebarExpanded} />
      
      <main className={`pt-20 transition-all duration-500 ml-0 ${isSidebarExpanded ? 'md:ml-64' : 'md:ml-20'}`}>
        <div className="p-4 md:p-8 max-w-5xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6 md:mb-8">Configurações</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            {/* Mobile Dropdown */}
            <div className="lg:hidden">
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="profile">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Perfil
                    </div>
                  </SelectItem>
                  <SelectItem value="notifications">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      Notificações
                    </div>
                  </SelectItem>
                  <SelectItem value="appearance">
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      Aparência
                    </div>
                  </SelectItem>
                  <SelectItem value="score">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Score
                    </div>
                  </SelectItem>
                  <SelectItem value="privacy">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Privacidade
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Desktop Tabs */}
            <TabsList className="hidden lg:grid w-full grid-cols-5 gap-1">
              <TabsTrigger value="profile">
                <User className="w-4 h-4 mr-2" />
                Perfil
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="w-4 h-4 mr-2" />
                Notificações
              </TabsTrigger>
              <TabsTrigger value="appearance">
                <Palette className="w-4 h-4 mr-2" />
                Aparência
              </TabsTrigger>
              <TabsTrigger value="score">
                <BarChart3 className="w-4 h-4 mr-2" />
                Score
              </TabsTrigger>
              <TabsTrigger value="privacy">
                <Shield className="w-4 h-4 mr-2" />
                Privacidade
              </TabsTrigger>
            </TabsList>

            {/* Profile & Security */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Informações Pessoais
                  </CardTitle>
                  <CardDescription>
                    Atualize seus dados pessoais e informações de contato
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome completo</Label>
                      <Input 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Seu nome completo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input 
                      id="phone" 
                      type="tel"
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+55 11 98765-4321"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Segurança
                  </CardTitle>
                  <CardDescription>
                    Gerencie senha e autenticação de dois fatores
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Senha atual</Label>
                    <Input 
                      id="current-password" 
                      type="password"
                      placeholder="••••••••"
                    />
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nova senha</Label>
                      <Input 
                        id="new-password" 
                        type="password"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar senha</Label>
                      <Input 
                        id="confirm-password" 
                        type="password"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="2fa" className="text-base">
                          Autenticação de dois fatores (2FA)
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Adicione uma camada extra de segurança à sua conta
                        </p>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2">
                              <Switch 
                                id="2fa"
                                checked={twoFactorEnabled}
                                onCheckedChange={setTwoFactorEnabled}
                              />
                              <HelpCircle className="w-4 h-4 text-muted-foreground" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Proteja sua conta com verificação em duas etapas</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    {twoFactorEnabled && (
                      <div className="space-y-2 pl-4 border-l-2 border-primary">
                        <Label htmlFor="2fa-method">Método de autenticação</Label>
                        <Select value={twoFactorMethod} onValueChange={setTwoFactorMethod}>
                          <SelectTrigger id="2fa-method">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sms">
                              <div className="flex items-center gap-2">
                                <Smartphone className="w-4 h-4" />
                                SMS
                              </div>
                            </SelectItem>
                            <SelectItem value="authenticator">
                              <div className="flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                Authenticator App
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-sm font-medium mb-3">Sessões ativas</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="text-sm font-medium">Chrome – São Paulo, SP</p>
                          <p className="text-xs text-muted-foreground">Último acesso: agora</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Encerrar
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="text-sm font-medium">Safari – iPhone 13</p>
                          <p className="text-xs text-muted-foreground">Último acesso: há 2 horas</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Encerrar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications & Preferences */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Preferências de Notificações
                  </CardTitle>
                  <CardDescription>
                    Escolha como e quando deseja receber notificações
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Email Notifications */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-5 h-5 text-primary" />
                      <h4 className="font-medium">Notificações por E-mail</h4>
                    </div>
                    <div className="space-y-3 pl-7">
                      {Object.entries(emailNotifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <Label htmlFor={`email-${key}`} className="text-sm font-normal capitalize">
                            {key === 'transactional' ? 'Transacionais' :
                             key === 'investments' ? 'Investimentos' :
                             key === 'payments' ? 'Pagamentos' : 'Marketing'}
                          </Label>
                          <Switch 
                            id={`email-${key}`}
                            checked={value}
                            onCheckedChange={(checked) => 
                              setEmailNotifications(prev => ({ ...prev, [key]: checked }))
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Push Notifications */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-primary" />
                      <h4 className="font-medium">Notificações Push</h4>
                    </div>
                    <div className="space-y-3 pl-7">
                      {Object.entries(pushNotifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <Label htmlFor={`push-${key}`} className="text-sm font-normal capitalize">
                            {key === 'transactional' ? 'Transacionais' :
                             key === 'investments' ? 'Investimentos' :
                             key === 'payments' ? 'Pagamentos' : 'Marketing'}
                          </Label>
                          <Switch 
                            id={`push-${key}`}
                            checked={value}
                            onCheckedChange={(checked) => 
                              setPushNotifications(prev => ({ ...prev, [key]: checked }))
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* WhatsApp Notifications */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      <h4 className="font-medium">Notificações WhatsApp</h4>
                    </div>
                    <div className="space-y-3 pl-7">
                      {Object.entries(whatsappNotifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <Label htmlFor={`whatsapp-${key}`} className="text-sm font-normal capitalize">
                            {key === 'transactional' ? 'Transacionais' :
                             key === 'investments' ? 'Investimentos' :
                             key === 'payments' ? 'Pagamentos' : 'Marketing'}
                          </Label>
                          <Switch 
                            id={`whatsapp-${key}`}
                            checked={value}
                            onCheckedChange={(checked) => 
                              setWhatsappNotifications(prev => ({ ...prev, [key]: checked }))
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Notification Frequency */}
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequência de notificações</Label>
                    <Select value={notificationFrequency} onValueChange={setNotificationFrequency}>
                      <SelectTrigger id="frequency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Imediata</SelectItem>
                        <SelectItem value="daily">Resumo diário</SelectItem>
                        <SelectItem value="weekly">Resumo semanal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance & Language */}
            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Aparência e Idioma
                  </CardTitle>
                  <CardDescription>
                    Personalize a aparência da plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label>Tema</Label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => setTheme("light")}
                        className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-all ${
                          theme === "light" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Sun className="w-6 h-6" />
                        <span className="text-sm font-medium">Claro</span>
                      </button>
                      <button
                        onClick={() => setTheme("dark")}
                        className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-all ${
                          theme === "dark" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Moon className="w-6 h-6" />
                        <span className="text-sm font-medium">Escuro</span>
                      </button>
                      <button
                        onClick={() => setTheme("system")}
                        className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-all ${
                          theme === "system" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Monitor className="w-6 h-6" />
                        <span className="text-sm font-medium">Sistema</span>
                      </button>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="language">Idioma</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger id="language">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt">
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            Português (Brasil)
                          </div>
                        </SelectItem>
                        <SelectItem value="en">
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            English (US)
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Credit Score Settings */}
            <TabsContent value="score" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Configurações de Score de Crédito
                  </CardTitle>
                  <CardDescription>
                    Configure a visualização do seu score de crédito
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="show-reasons" className="text-base">
                          Mostrar motivos do score
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Exibir fatores que influenciam seu score
                        </p>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2">
                              <Switch 
                                id="show-reasons"
                                checked={showScoreReasons}
                                onCheckedChange={setShowScoreReasons}
                              />
                              {showScoreReasons ? (
                                <Eye className="w-4 h-4 text-muted-foreground" />
                              ) : (
                                <EyeOff className="w-4 h-4 text-muted-foreground" />
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Ver detalhes sobre o cálculo do score</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="show-tips" className="text-base">
                          Exibir dicas de melhoria
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Mostrar sugestões para aumentar seu score
                        </p>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2">
                              <Switch 
                                id="show-tips"
                                checked={showImprovementTips}
                                onCheckedChange={setShowImprovementTips}
                              />
                              <HelpCircle className="w-4 h-4 text-muted-foreground" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Receba orientações para melhorar seu score</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy & Data */}
            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Privacidade e Dados
                  </CardTitle>
                  <CardDescription>
                    Gerencie seus dados pessoais e privacidade (LGPD)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 border rounded-lg bg-muted/30">
                      <Download className="w-5 h-5 text-primary mt-1" />
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">Download dos seus dados</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Baixe uma cópia de todos os seus dados armazenados na plataforma, conforme previsto pela LGPD.
                        </p>
                        <Button onClick={handleDownloadData} variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Solicitar download
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-start gap-4 p-4 border border-destructive/50 rounded-lg bg-destructive/5">
                      <Trash2 className="w-5 h-5 text-destructive mt-1" />
                      <div className="flex-1">
                        <h4 className="font-medium mb-1 text-destructive">Excluir conta</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Esta ação é irreversível. Todos os seus dados serão permanentemente excluídos. 
                          <strong className="block mt-1">
                            Bloqueado caso haja contratos ou investimentos ativos.
                          </strong>
                        </p>
                        <Button 
                          onClick={handleDeleteAccount} 
                          variant="destructive" 
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir minha conta
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-8 pb-8">
            <Button variant="outline" onClick={handleDiscard}>
              Descartar
            </Button>
            <Button onClick={handleSave}>
              Salvar alterações
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
