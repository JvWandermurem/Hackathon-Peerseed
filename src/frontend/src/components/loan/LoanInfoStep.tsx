import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface LoanInfoStepProps {
  loanData: any;
  setLoanData: (data: any) => void;
}

export const LoanInfoStep = ({ loanData, setLoanData }: LoanInfoStepProps) => {
  const isEventCategory = loanData.category === "evento";

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">Informações do empréstimo</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Informe o valor e as condições do empréstimo que você precisa
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoria *</Label>
        <Select
          value={loanData.category || "producao"}
          onValueChange={(value) => setLoanData({ ...loanData, category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="producao">Produção Rural</SelectItem>
            <SelectItem value="evento">Eventos do Agro</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          {isEventCategory ? "Festivais, feiras, workshops e outros eventos do agronegócio" : "Crédito para produção agrícola tradicional"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="amount">Valor desejado (R$) *</Label>
          <Input
            id="amount"
            type="number"
            placeholder="Ex: 50.000"
            value={loanData.amount}
            onChange={(e) => setLoanData({ ...loanData, amount: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Prazo de pagamento (meses) *</Label>
          <Select
            value={loanData.duration}
            onValueChange={(value) => setLoanData({ ...loanData, duration: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o prazo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">6 meses</SelectItem>
              <SelectItem value="12">12 meses</SelectItem>
              <SelectItem value="18">18 meses</SelectItem>
              <SelectItem value="24">24 meses</SelectItem>
              <SelectItem value="36">36 meses</SelectItem>
            </SelectContent>
          </Select>
          {isEventCategory && (
            <p className="text-xs text-muted-foreground">
              Prazo ajustável conforme fluxo de receita do evento
            </p>
          )}
        </div>
      </div>

      {/* Campos específicos para Eventos do Agro */}
      {isEventCategory && (
        <div className="space-y-6 p-4 border rounded-lg bg-muted/20">
          <h4 className="font-medium text-sm">Informações do Evento</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="eventType">Tipo de evento *</Label>
              <Select
                value={loanData.eventType}
                onValueChange={(value) => setLoanData({ ...loanData, eventType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="festival">Festival</SelectItem>
                  <SelectItem value="feira">Feira</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="exposicao">Exposição</SelectItem>
                  <SelectItem value="congresso">Congresso</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventDate">Data do evento *</Label>
              <Input
                id="eventDate"
                type="date"
                value={loanData.eventDate}
                onChange={(e) => setLoanData({ ...loanData, eventDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventDuration">Duração (dias) *</Label>
              <Input
                id="eventDuration"
                type="number"
                placeholder="Ex: 3"
                value={loanData.eventDuration}
                onChange={(e) => setLoanData({ ...loanData, eventDuration: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedAttendees">Público esperado *</Label>
              <Input
                id="expectedAttendees"
                type="number"
                placeholder="Ex: 5000"
                value={loanData.expectedAttendees}
                onChange={(e) => setLoanData({ ...loanData, expectedAttendees: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventLocation">Localização *</Label>
            <Input
              id="eventLocation"
              placeholder="Ex: Centro de Convenções - São Paulo, SP"
              value={loanData.eventLocation}
              onChange={(e) => setLoanData({ ...loanData, eventLocation: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventBudget">Orçamento detalhado *</Label>
            <Textarea
              id="eventBudget"
              placeholder="Detalhe os principais custos: infraestrutura, equipe, marketing, logística, etc."
              value={loanData.eventBudget}
              onChange={(e) => setLoanData({ ...loanData, eventBudget: e.target.value })}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectedRevenue">Projeção de retorno *</Label>
            <Textarea
              id="projectedRevenue"
              placeholder="Estimativa de arrecadação: venda de ingressos, patrocínios, stands, etc."
              value={loanData.projectedRevenue}
              onChange={(e) => setLoanData({ ...loanData, projectedRevenue: e.target.value })}
              rows={3}
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="purpose">
          {isEventCategory ? "Descrição do evento *" : "Finalidade do empréstimo *"}
        </Label>
        <Textarea
          id="purpose"
          placeholder={
            isEventCategory 
              ? "Descreva o evento, seus objetivos e impacto esperado..."
              : "Ex: Compra de insumos agrícolas, maquinário, irrigação..."
          }
          value={loanData.purpose}
          onChange={(e) => setLoanData({ ...loanData, purpose: e.target.value })}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="captation">Prazo de captação *</Label>
        <Select
          value={loanData.captationPeriod}
          onValueChange={(value) => setLoanData({ ...loanData, captationPeriod: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Quanto tempo deseja deixar a oferta aberta?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">7 dias</SelectItem>
            <SelectItem value="15">15 dias</SelectItem>
            <SelectItem value="30">30 dias</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Durante este período, investidores poderão financiar sua solicitação
        </p>
      </div>
    </div>
  );
};
