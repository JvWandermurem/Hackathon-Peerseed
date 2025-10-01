---
sidebar_position: 3
title: Blockchain
---

&emsp;A escolha da **Polygon (Matic)** para o PeerSeed é baseada na possibilidade de construir um modelo financeiro escalável que minimiza os custos do uso da Blockchain, mantendo a integridade do ativo. Esta decisão é baseada em um rigoroso *benchmarking* de redes *Layer 1 (L1)* e *Layer 2 (L2)* considerando fatores técnicos e de negócios.

---
## 1. Critérios de Avaliação Chave

&emsp;Para o PeerSeed, as prioridades na seleção da blockchain são:
1.  **Custo de Transação:** Deve ser quase zero para viabilizar as microtransações de **Distribuição de Pagamentos (RF-INV-005)**.
2.  **Maturidade EVM (Ethereum Virtual Machine):** Essencial para a segurança dos **Smart Contracts** e a facilidade de auditoria.
3.  **Velocidade (Finality):** Necessária para uma boa **UX** no **Mercado Secundário** e na liberação do Pool.
4.  **Segurança:** Alta, para atrair **Investidores Institucionais** e garantir a custódia do capital.

---
## 2. Benchmarking Expandido de Blockchains para Fintech

&emsp;A tabela abaixo compara a Polygon com seis *blockchains* relevantes, focando no **impacto financeiro e técnico** para o PeerSeed.

| Rede | Tipo | Custo de Transação | Maturidade EVM | Risco Técnico (Smart Contract) | Viabilidade para PeerSeed |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Polygon (Matic)** | L2 / Sidechain | **Quase Zero ($0.01)** | **Sim (Total)** | Baixo (Código maduro em Solidity) | **Ideal.** Melhor balanço Custo/Segurança/Velocidade. |
| **Ethereum (L1)** | L1 / Principal | **Alto e Volátil (>$5.00)** | Sim (Base) | Baixo | **Inviável para Operação.** Custo destrói a margem de Performance. |
| **Solana** | L1 Alto Desempenho | Baixo | Não (Linguagem Rust) | Alto (Curva de aprendizado e Custo de Engenharia elevado) | Viável, mas **custoso**. Aumenta o OPEX inicial drasticamente. |
| **BNB Smart Chain (BSC)** | L1 / EVM-Compatível | Baixo/Moderado | Sim | Moderado | **Razoável.** Risco de Centralização e menor confiança para o *compliance* de Fundos ESG. |
| **Avalanche (C-Chain)** | L1 / EVM-Compatível | Baixo/Moderado | Sim | Baixo | **Boa Alternativa.** Similar à Polygon, mas com ecossistema e liquidez em USDC ligeiramente menores. |
| **Arbitrum / Optimism** | L2 (Rollups) | Moderado (Mais caro que Polygon PoS) | Sim | Baixo | **Competitivo.** Excelente segurança, mas o *gas* (custo) ainda é maior, impactando a viabilidade das microtransações. |

---
## 3. Defesa Detalhada da Escolha da Polygon

A **Polygon (Matic)** é a única solução que permite ao PeerSeed cumprir a promessa de **agilidade P2P** com **viabilidade econômica**.

### 3.1. Viabilidade Financeira e Marginal

O maior diferencial está no **custo do gás (≈$0.01)**.
* **Distribuição de Lucros:** Se um Investidor (Marina) investir em 10 CPRs, o PeerSeed precisará fazer 10 microtransações mensais para pagar os rendimentos. Em **Ethereum (L1)**, isso custaria \$50 por mês. Na **Polygon**, custa $0.10. Isso é o que torna o **modelo *fee-based*** do PeerSeed lucrativo e escalável.
* **Aceleração do Mercado Secundário:** O custo de negociação é negligenciável, incentivando a **Marina a negociar ativamente seu Token de Crédito** sem que os custos de transação anulem seus pequenos lucros.

### 3.2. Mitigação de Risco Técnico e Jurídico (EVM)

* **Segurança Auditável:** A compatibilidade total com o **EVM** é o fator de segurança. Nossos **Smart Contracts** do Pool de Liquidez são escritos em **Solidity**, permitindo que sejam **auditados por firmas de segurança** (mitigando o Risco Financeiro). Se tivéssemos escolhido Solana (Rust), o custo da auditoria seria maior e o *pool* mais arriscado.
* **Infraestrutura Integrada:** A nossa arquitetura de *backend* (Python/FastAPI) e a infraestrutura (Kubernetes) são facilmente configuradas para interagir com os *endpoints* da Polygon, que já é amplamente adotada por todos os principais **Gateways de Pagamento (On/Off-Ramp)**.

### 3.3. Segurança de Nível Ethereum

* A Polygon não é totalmente L1, mas utiliza a segurança da Ethereum para registrar *checkpoints*. Essa segurança "herdada" oferece o nível de confiança que o PeerSeed precisa para lidar com ativos regulados (**CPR**) e atrair investidores de maior porte, sem o peso da burocracia do Ethereum L1.

<Details>
**Conclusão:** O PeerSeed exige eficiência. A Polygon oferece a **solução L2 mais madura e financeiramente coerente** para transformar o alto volume de transações em alta margem de lucro.
</Details>