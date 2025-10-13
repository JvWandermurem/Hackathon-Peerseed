// src/services/contractService.ts

import axios, { AxiosInstance } from 'axios';
// O modelo AnaliseResponse é o que o backend retorna após a assinatura
import { AnaliseResponse } from '@/models/Analise'; 

// Cria uma instância Axios para o Serviço de Contratos (porta 8003)
const contractApi: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8003', // Porta do servico_contratos
    timeout: 10000,
});

// Interceptor para adicionar o token JWT
contractApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

class ContractService {
    /**
     * POST /contratos/{cpr_id}/assinar
     * Simula a assinatura da CPR, mudando o status de 'ANALISE' para 'CAPTAÇÃO'.
     */
    async signContract(cprId: string): Promise<AnaliseResponse> {
        try {
            // Usa AnaliseResponse como tipo de retorno, pois o backend retorna a CPR atualizada
            const response = await contractApi.post<AnaliseResponse>(`/contratos/${cprId}/assinar`);
            return response.data;
        } catch (error: any) {
            // Retorna a mensagem de erro detalhada do backend (403, 400, etc.)
            throw new Error(error.response?.data?.detail || 'Falha ao assinar o contrato. Verifique o status.');
        }
    }
}

export default new ContractService();