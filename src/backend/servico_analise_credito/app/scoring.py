from .schemas import AnaliseRequest

def predict_simulado(dados: AnaliseRequest) -> float:
    """
    SIMULA a predição de um modelo XGBoost.
    A saída é a probabilidade de inadimplência (0.0 a 1.0).
    Amanhã, você só precisará trocar o corpo desta função.
    """
    print("--- SIMULADOR DE MODELO EXECUTANDO ---")
    probabilidade_base = 0.10  # 10%

    if dados.valor_solicitado > 100000:
        probabilidade_base += 0.15 # +15% de risco

    if dados.prazo_meses > 24:
        probabilidade_base += 0.10 # +10% de risco
    
    if dados.cultura.lower() == 'soja':
        probabilidade_base -= 0.05 # -5% de risco (cultura segura)

    # Garante que a probabilidade fique entre 0 e 1
    return max(0.01, min(probabilidade_base, 0.99))


def traduzir_probabilidade_para_negocio(prob: float) -> tuple[str, float]:
    """
    TRADUZ a saída do modelo para a lógica de negócio (Score e Taxa).
    Esta função NÃO será alterada amanhã.
    """
    if prob < 0.10:
        return "A", 12.5
    elif prob < 0.18:
        return "B", 15.0
    elif prob < 0.25:
        return "C", 18.5
    elif prob < 0.35:
        return "D", 22.0
    else:
        return "E", 25.0