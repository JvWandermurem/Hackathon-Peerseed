import { apiContas } from "../lib/api"; // Caminho corrigido para evitar erro de alias

const authService = {
  /**
   * POST /signup
   * Registra um novo usuário.
   */
  async signup(data: any) {
    try {
        const response = await apiContas.post("/signup", data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.detail || 'Falha ao registrar usuário.');
    }
  },

  /**
   * POST /login ou /token
   * Realiza o login, armazena o token e o perfil do usuário.
   */
  async login(email: string, senha: string) {
      // -------------------------------------------------------------
      // CORREÇÃO CRÍTICA DO ERRO 422:
      // O FastAPI OAuth2PasswordRequestForm espera dados FORMULÁRIO (form-urlencoded),
      // não JSON. Usamos URLSearchParams para formatar os dados corretamente.
      // E usaremos 'username' e 'password', que são os nomes esperados.
      // -------------------------------------------------------------
      const loginFormData = new URLSearchParams();
      loginFormData.append('username', email); // FastAPI usa 'username' para o email
      loginFormData.append('password', senha); // FastAPI usa 'password' para a senha

      // Realiza a chamada POST para o endpoint de login/token
      // Configuramos explicitamente o Content-Type, embora o URLSearchParams geralmente o defina.
      const response = await apiContas.post(
          "/login", 
          loginFormData.toString(), 
          {
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
              }
          }
      );

      // Verifica se a resposta contém os dados esperados e se não está vazia
      if (!response.data || !response.data.access_token) {
        throw new Error("Resposta da API de Login inválida: 'access_token' ausente.");
      }
      
      const { access_token } = response.data;
      
      // Armazena o token no localStorage
      localStorage.setItem("access_token", access_token); 

      // Decodifica o payload do JWT para obter informações do usuário (id, perfil, etc.)
      const payloadBase64 = access_token.split(".")[1];
      const payload = JSON.parse(atob(payloadBase64));
      
      // Armazena o objeto de perfil do usuário
      localStorage.setItem("user", JSON.stringify(payload)); 

      return payload;
  },

  /**
   * Retorna as informações do usuário logado (perfil).
   */
  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  /**
   * Remove o token e o perfil para efetuar logout.
   */
  logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
  },
};

export default authService;
