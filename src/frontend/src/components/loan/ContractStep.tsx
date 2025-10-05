import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FileText, Shield, Info } from "lucide-react";

interface ContractStepProps {
  loanData: any;
}

export const ContractStep = ({ loanData }: ContractStepProps) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedCpr, setAcceptedCpr] = useState(false);

  const amount = parseFloat(loanData.amount) || 50000;
  const duration = parseInt(loanData.duration) || 12;
  const rate = 1.8;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">Contrato e garantia (CPR)</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Revise os termos e assine digitalmente a Cédula de Produto Rural
        </p>
      </div>

      {/* Contract Summary */}
      <Card className="border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-primary" />
            <h4 className="font-semibold">Resumo da operação</h4>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Valor do empréstimo</span>
              <span className="font-semibold">R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Taxa de juros</span>
              <span className="font-semibold">{rate}% ao mês</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Prazo</span>
              <span className="font-semibold">{duration} meses</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Finalidade</span>
              <span className="font-semibold text-right max-w-[60%]">{loanData.purpose || "Não informado"}</span>
            </div>
            
            <Separator className="my-3" />
            
            <div className="flex justify-between">
              <span className="text-sm font-medium">Valor total a pagar</span>
              <span className="font-bold text-primary">
                R$ {(amount * (1 + (rate * duration / 100))).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CPR Information */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <h4 className="font-semibold">Cédula de Produto Rural (CPR)</h4>
          </div>

          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              A CPR é um título de crédito que representa a promessa de entrega futura de produtos rurais ou o pagamento em dinheiro. 
              Ela serve como garantia para o empréstimo e será registrada em cartório.
            </p>
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="font-medium text-foreground">A CPR garante:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Segurança jurídica para o investidor</li>
                <li>Taxas de juros mais competitivas</li>
                <li>Facilidade no acesso ao crédito</li>
                <li>Registro digital e rastreável</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms and Conditions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-primary" />
            <h4 className="font-semibold">Termos e condições</h4>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm cursor-pointer">
                Li e aceito os{" "}
                <a href="#" className="text-primary hover:underline">
                  termos de uso
                </a>{" "}
                e a{" "}
                <a href="#" className="text-primary hover:underline">
                  política de privacidade
                </a>{" "}
                da plataforma Reevo
              </Label>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="cpr"
                checked={acceptedCpr}
                onCheckedChange={(checked) => setAcceptedCpr(checked as boolean)}
              />
              <Label htmlFor="cpr" className="text-sm cursor-pointer">
                Autorizo a emissão e registro da Cédula de Produto Rural (CPR) em meu nome, 
                conforme os termos descritos acima, e estou ciente das obrigações legais envolvidas
              </Label>
            </div>
          </div>

          <div className="mt-6 p-4 bg-primary/10 rounded-lg">
            <p className="text-sm text-foreground">
              <strong>Próximo passo:</strong> Após o envio, sua solicitação será analisada e você 
              receberá uma resposta em até 48 horas úteis. A CPR digital será gerada automaticamente 
              após a aprovação e captação do valor total.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
