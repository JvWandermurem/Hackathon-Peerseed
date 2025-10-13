from .schemas import AnaliseRequest

def predict_simulado(dados: AnaliseRequest) -> float:
    print("--- SIMULADOR DE MODELO (v2) EXECUTANDO ---")
    probabilidade_base = 0.15

    if dados.valor_solicitado / (dados.hectares + 1) > 2000: # Relação dívida/hectare
        probabilidade_base += 0.10
    if dados.prazo_meses > 36:
        probabilidade_base += 0.10
    if dados.possui_car:
        probabilidade_base -= 0.05 # Bônus por ter CAR
    if dados.possui_certificacao:
        probabilidade_base -= 0.08 # Bônus maior por certificação

    return max(0.01, min(probabilidade_base, 0.99))

def traduzir_probabilidade_para_negocio(prob: float, dados: AnaliseRequest) -> dict:
    """
    TRADUZ a saída do modelo para a lógica de negócio, agora retornando um dicionário completo.
    """
    pontos_positivos = ["Bom histórico de crédito (simulado)"]
    sugestoes_melhora = ["Adicionar certificações de práticas sustentáveis pode reduzir sua taxa."]

    if dados.valor_solicitado <= 50000:
        pontos_positivos.append("Valor solicitado adequado para o perfil.")
    
    if prob < 0.10:
        score, taxa = "A", 12.5
    elif prob < 0.18:
        score, taxa = "B", 15.0
    elif prob < 0.25:
        score, taxa = "C", 18.5
    elif prob < 0.35:
        score, taxa = "D", 22.0
    else:
        score, taxa = "E", 25.0

    return {
        "score_risco": score,
        "taxa_juros_anual": taxa,
        "pontos_positivos": pontos_positivos,
        "sugestoes_melhora": sugestoes_melhora
    }