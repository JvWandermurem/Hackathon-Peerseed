// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Sprout } from "lucide-react";
import authService from "@/services/authService";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  senha: z.string().min(1, "Senha é obrigatória"),
});

type LoginForm = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    
    try {
      // Faz login e recebe o token JWT
      await authService.login(data.email, data.senha);
      
      // Pega o usuário do localStorage (foi salvo pelo authService)
      const user = authService.getCurrentUser();
      
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo de volta, ${user?.sub || 'usuário'}!`,
      });
      
      // Redireciona baseado no perfil
      if (user?.perfil === "AGRICULTOR") {
        navigate("/agricultor");
      } else if (user?.perfil === "INVESTIDOR") {
        navigate("/investidor");
      } else {
        // Fallback caso o perfil não seja reconhecido
        navigate("/");
      }
    } catch (error: any) {
      console.error("Erro no login:", error);
      
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: error.message || "Email ou senha incorretos.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Sprout className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Bem-vindo de volta</CardTitle>
          <CardDescription>
            Entre com suas credenciais para acessar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="joao.silva@email.com"
                disabled={isLoading}
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
                disabled={isLoading}
                {...register("senha")}
              />
              {errors.senha && (
                <p className="text-sm text-destructive">{errors.senha.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Não tem uma conta? </span>
              <Link to="/cadastro" className="text-primary hover:underline">
                Cadastre-se
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;