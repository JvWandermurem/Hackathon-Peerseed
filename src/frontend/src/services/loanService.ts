// src/services/loanService.ts

import axios, { AxiosInstance } from 'axios';
import { AnaliseResponse, Risco, StatusCpr } from '@/models/Analise';

// 1. Interfaces de Request (Baseada no schemas.py do backend)
export interface NewLoanRequest {
    valor_solicitado: number;
    prazo_meses: number;
    cultura: string;
    finalidade: string;
    hectares: number;
    possui_car: boolean;
    possui_certificacao: boolean;
}

// 2. Cria uma instância Axios para o Serviço de Análise de Crédito
// ATENÇÃO: A porta 8002 é usada.
const loanApi: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8002', 
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

// 3. Adiciona o Interceptor para o Token JWT
loanApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`; 
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

class LoanService {
    /**
     * POST /analise: Solicita uma nova análise de crédito (cria uma CPR).
     */
    async solicitarAnalise(data: NewLoanRequest): Promise<AnaliseResponse> {
        try {
            const response = await loanApi.post<AnaliseResponse>('/analise', data);
            return response.data;
        } catch (error: any) {
            // Captura o erro detalhado enviado pelo FastAPI
            throw new Error(error.response?.data?.detail || 'Erro ao solicitar análise de crédito. Verifique os dados.');
        }
    }
    
    /**
     * GET /analises/minhas: Busca todas as análises/empréstimos do usuário logado.
     * (Usado no Index.tsx e MyContracts.tsx)
     */
    async getMinhasAnalises(): Promise<AnaliseResponse[]> {
        try {
            const response = await loanApi.get<AnaliseResponse[]>('/analises/minhas'); 
            return response.data;
        } catch (error: any) {
             // Retorna array vazio em caso de 404/não encontrado (melhor para lista)
            if (error.response?.status === 404) return []; 
            throw new Error(error.response?.data?.detail || 'Erro ao buscar suas análises de crédito.');
        }
    }
}

export default new LoanService();