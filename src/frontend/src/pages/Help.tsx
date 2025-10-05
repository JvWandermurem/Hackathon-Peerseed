import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  HelpCircle, 
  Search, 
  BookOpen, 
  MessageCircle, 
  Phone, 
  Mail,
  FileText,
  CreditCard,
  Wallet,
  TrendingUp,
  Shield,
  Send
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

const Help = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const isFarmer = location.pathname.startsWith("/agricultor");

  const farmerFaqs = [
    {
      category: "Empréstimos",
      icon: CreditCard,
      questions: [
        {
          q: "Como solicitar um empréstimo?",
          a: "Para solicitar um empréstimo, acesse 'Pedir um empréstimo' no menu, preencha as informações sobre o valor desejado, prazo e finalidade. Após a simulação, você pode seguir com a documentação e assinatura do contrato."
        },
        {
          q: "Qual o valor máximo que posso solicitar?",
          a: "O valor máximo depende do seu score de crédito, histórico e garantias oferecidas. Geralmente varia entre R$ 10.000 e R$ 500.000 para agricultores."
        },
        {
          q: "Quanto tempo leva para aprovação?",
          a: "A análise geralmente leva de 24 a 48 horas úteis. Você receberá notificações sobre o status da sua solicitação."
        },
        {
          q: "Posso quitar antecipadamente?",
          a: "Sim! Você pode fazer o pagamento antecipado total ou parcial e economizar em juros. Acesse a aba 'Pagamentos' e clique em 'Pagamento antecipado'."
        }
      ]
    },
    {
      category: "Score de Crédito",
      icon: TrendingUp,
      questions: [
        {
          q: "Como é calculado meu score?",
          a: "Seu score é baseado em fatores como histórico de pagamentos, tempo de relacionamento, diversificação de culturas, uso de tecnologias sustentáveis e saúde financeira."
        },
        {
          q: "Como melhorar meu score?",
          a: "Pague suas parcelas em dia, mantenha bom relacionamento com fornecedores, adote práticas sustentáveis e mantenha suas informações atualizadas."
        },
        {
          q: "Com que frequência o score é atualizado?",
          a: "Seu score é atualizado mensalmente, mas pode ter atualizações mais frequentes após pagamentos ou novos eventos relevantes."
        }
      ]
    },
    {
      category: "Pagamentos",
      icon: Wallet,
      questions: [
        {
          q: "Quais formas de pagamento são aceitas?",
          a: "Aceitamos Pix, boleto bancário, débito automático e transferência bancária. Você pode escolher na hora do pagamento."
        },
        {
          q: "O que acontece se atrasar uma parcela?",
          a: "Haverá incidência de juros de mora e multa conforme contrato. Além disso, pode impactar negativamente seu score de crédito."
        },
        {
          q: "Posso renegociar parcelas em atraso?",
          a: "Sim, entre em contato conosco através da central de ajuda ou clique em 'Solicitar renegociação' na tela de pagamentos."
        }
      ]
    },
    {
      category: "Segurança",
      icon: Shield,
      questions: [
        {
          q: "Meus dados estão seguros?",
          a: "Sim, utilizamos criptografia de ponta e seguimos todas as normas da LGPD para proteção dos seus dados pessoais e financeiros."
        },
        {
          q: "Como ativar a autenticação em dois fatores?",
          a: "Acesse Configurações > Segurança e ative a opção '2FA'. Você receberá um código no seu celular a cada login."
        }
      ]
    }
  ];

  const investorFaqs = [
    {
      category: "Investimentos",
      icon: TrendingUp,
      questions: [
        {
          q: "Como funciona o investimento em crédito agrícola?",
          a: "Você empresta dinheiro para agricultores através da nossa plataforma e recebe retorno com juros. Escolha oportunidades com diferentes perfis de risco e retorno."
        },
        {
          q: "Qual o investimento mínimo?",
          a: "O investimento mínimo é de R$ 100,00 por oportunidade. Você pode diversificar investindo em múltiplas oportunidades."
        },
        {
          q: "Quando recebo meus retornos?",
          a: "Os retornos são mensais, conforme o pagamento das parcelas pelos agricultores. Você pode acompanhar na aba 'Minhas seeds'."
        },
        {
          q: "Posso retirar meu investimento antes do prazo?",
          a: "O investimento tem prazo determinado. Para liquidez antecipada, consulte as condições específicas de cada oportunidade ou entre em contato conosco."
        }
      ]
    },
    {
      category: "Carteira",
      icon: Wallet,
      questions: [
        {
          q: "Como adicionar saldo?",
          a: "Acesse 'Carteira' e clique em 'Adicionar saldo'. Você pode transferir via Pix ou TED."
        },
        {
          q: "Como sacar meus rendimentos?",
          a: "Na aba 'Carteira', clique em 'Sacar' e escolha sua conta bancária cadastrada. O saque é processado em até 1 dia útil."
        },
        {
          q: "Há taxa para saque?",
          a: "Não cobramos taxa para saques acima de R$ 100,00. Saques menores têm taxa de R$ 2,00."
        }
      ]
    },
    {
      category: "Marketplace",
      icon: FileText,
      questions: [
        {
          q: "Como escolher uma boa oportunidade?",
          a: "Analise o score do agricultor, histórico de pagamentos, tipo de cultura, garantias oferecidas e diversifique seus investimentos."
        },
        {
          q: "O que significa o selo de sustentabilidade?",
          a: "Indica que o projeto segue práticas sustentáveis certificadas, como agricultura orgânica ou regenerativa."
        }
      ]
    }
  ];

  const faqs = isFarmer ? farmerFaqs : investorFaqs;

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
           q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Mensagem enviada com sucesso! Nossa equipe responderá em breve.");
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userType={isFarmer ? "farmer" : "investor"} onExpandedChange={setIsSidebarExpanded} />
      <Header userType={isFarmer ? "farmer" : "investor"} isSidebarExpanded={isSidebarExpanded} />
      
      <main className={`pt-20 transition-all duration-500 ml-0 ${isSidebarExpanded ? 'md:ml-64' : 'md:ml-20'}`}>
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <HelpCircle className="w-8 h-8 text-primary" />
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Central de Ajuda</h1>
            </div>
            <p className="text-sm md:text-base text-muted-foreground">
              Encontre respostas para suas dúvidas ou entre em contato conosco
            </p>
          </div>

          {/* Search */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por palavra-chave..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="faq" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="faq" className="gap-2">
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Perguntas Frequentes</span>
                <span className="sm:hidden">FAQ</span>
              </TabsTrigger>
              <TabsTrigger value="contact" className="gap-2">
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Fale Conosco</span>
                <span className="sm:hidden">Contato</span>
              </TabsTrigger>
            </TabsList>

            {/* FAQs Tab */}
            <TabsContent value="faq" className="space-y-6">
              {filteredFaqs.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">Nenhum resultado encontrado para "{searchQuery}"</p>
                  </CardContent>
                </Card>
              ) : (
                filteredFaqs.map((category, idx) => {
                  const Icon = category.icon;
                  return (
                    <Card key={idx}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Icon className="w-5 h-5 text-primary" />
                          {category.category}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                          {category.questions.map((item, qIdx) => (
                            <AccordionItem key={qIdx} value={`item-${idx}-${qIdx}`}>
                              <AccordionTrigger className="text-left text-sm md:text-base">
                                {item.q}
                              </AccordionTrigger>
                              <AccordionContent className="text-sm text-muted-foreground">
                                {item.a}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>

            {/* Contact Tab */}
            <TabsContent value="contact" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Phone className="w-5 h-5 text-primary" />
                      Telefone
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">Segunda a Sexta, 8h às 18h</p>
                    <a href="tel:08005550123" className="text-sm font-semibold text-primary hover:underline">
                      0800 555 0123
                    </a>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Mail className="w-5 h-5 text-primary" />
                      E-mail
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">Respondemos em até 24h</p>
                    <a href="mailto:suporte@reevo.com.br" className="text-sm font-semibold text-primary hover:underline">
                      suporte@reevo.com.br
                    </a>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <MessageCircle className="w-5 h-5 text-primary" />
                      WhatsApp
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">Atendimento rápido</p>
                    <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary hover:underline">
                      (11) 99999-9999
                    </a>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Envie sua mensagem</CardTitle>
                  <CardDescription>
                    Nossa equipe responderá o mais breve possível
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitContact} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome completo</Label>
                        <Input id="name" placeholder="Seu nome" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input id="email" type="email" placeholder="seu@email.com" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Assunto</Label>
                      <Input id="subject" placeholder="Sobre o que você precisa de ajuda?" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Mensagem</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Descreva sua dúvida ou problema em detalhes..." 
                        className="min-h-[150px]"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full md:w-auto gap-2">
                      <Send className="w-4 h-4" />
                      Enviar mensagem
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Help;
