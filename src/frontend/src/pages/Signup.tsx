import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Sprout } from "lucide-react";

const signupSchema = z.object({
  nome_completo: z.string().min(3, "Nome completo deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  cpf: z.string().regex(/^\d{11}$/, "CPF deve ter 11 dígitos"),
  celular: z.string().regex(/^\d{10,11}$/, "Celular deve ter 10 ou 11 dígitos"),
  perfil_prioritario: z.enum(["AGRICULTOR", "INVESTIDOR"], {
    required_error: "Selecione um perfil",
  }),
  data_nascimento: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Use o formato DD/MM/AAAA"),
});

type SignupForm = z.infer<typeof signupSchema>;

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true);
    
    // Simulação - aqui será a integração com backend
    console.log("Dados do cadastro:", data);
    
    setTimeout(() => {
      toast({
        title: "Cadastro realizado!",
        description: "Bem-vindo ao Reevo.",
      });
      setIsLoading(false);
      
      // Redireciona baseado no perfil
      if (data.perfil_prioritario === "AGRICULTOR") {
        navigate("/agricultor");
      } else {
        navigate("/investidor");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Sprout className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Criar conta</CardTitle>
          <CardDescription>
            Preencha seus dados para criar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome_completo">Nome Completo</Label>
                <Input
                  id="nome_completo"
                  placeholder="João da Silva"
                  {...register("nome_completo")}
                />
                {errors.nome_completo && (
                  <p className="text-sm text-destructive">{errors.nome_completo.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="joao.silva@email.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <Input
                  id="senha"
                  type="password"
                  placeholder="••••••••"
                  {...register("senha")}
                />
                {errors.senha && (
                  <p className="text-sm text-destructive">{errors.senha.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  placeholder="12345678900"
                  maxLength={11}
                  {...register("cpf")}
                />
                {errors.cpf && (
                  <p className="text-sm text-destructive">{errors.cpf.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="celular">Celular</Label>
                <Input
                  id="celular"
                  placeholder="11987654321"
                  maxLength={11}
                  {...register("celular")}
                />
                {errors.celular && (
                  <p className="text-sm text-destructive">{errors.celular.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_nascimento">Data de Nascimento</Label>
                <Input
                  id="data_nascimento"
                  placeholder="16/09/1970"
                  {...register("data_nascimento")}
                />
                {errors.data_nascimento && (
                  <p className="text-sm text-destructive">{errors.data_nascimento.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="perfil_prioritario">Perfil Prioritário</Label>
              <Select onValueChange={(value) => setValue("perfil_prioritario", value as "AGRICULTOR" | "INVESTIDOR")}>
                <SelectTrigger id="perfil_prioritario">
                  <SelectValue placeholder="Selecione seu perfil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AGRICULTOR">Agricultor</SelectItem>
                  <SelectItem value="INVESTIDOR">Investidor</SelectItem>
                </SelectContent>
              </Select>
              {errors.perfil_prioritario && (
                <p className="text-sm text-destructive">{errors.perfil_prioritario.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Cadastrando..." : "Cadastrar"}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Já tem uma conta? </span>
              <Link to="/login" className="text-primary hover:underline">
                Fazer login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
