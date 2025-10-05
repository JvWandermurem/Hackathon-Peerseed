// src/services/analiseService.ts
import { apiAnalise } from "@/lib/api";
import { AnaliseResponse } from "@/models/Analise";

const analiseService = {
  async getMeuScore(): Promise<AnaliseResponse> {
    const response = await apiAnalise.get<AnaliseResponse>("/analises/meu-score");
    return response.data;
  },

  async getMinhasAnalises(): Promise<AnaliseResponse[]> {
    const response = await apiAnalise.get<AnaliseResponse[]>("/analises/minhas");
    return response.data;
  },

  async criarAnalise(dados: any): Promise<AnaliseResponse> {
    const response = await apiAnalise.post<AnaliseResponse>("/analise", dados);
    return response.data;
  },
};

export default analiseService;
