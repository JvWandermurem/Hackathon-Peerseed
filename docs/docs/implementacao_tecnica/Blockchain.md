---
sidebar_position: 3
title: Blockchain
---  

## Critérios de escolha

&emsp;A escolha da **Polygon** para o Reevo é baseada na possibilidade de construir um modelo financeiro escalável que minimiza os custos do uso da Blockchain, mantendo a integridade do ativo. Esta decisão é baseada em um rigoroso *benchmarking* de redes *Layer 1 (L1)* e *Layer 2 (L2)* considerando fatores técnicos e de negócios.

---

## Critérios de Avaliação Chave

&emsp;Para o Reevo, as prioridades na seleção da blockchain são:

1. **Custo de Transação:** Deve ser quase zero para viabilizar as microtransações de **Distribuição de Pagamentos (RF-INV-005)**.

2. **Maturidade EVM (Ethereum Virtual Machine):** Essencial para a segurança dos **Smart Contracts** e a facilidade de auditoria.

3. **Velocidade (Finality):** Necessária para uma boa **UX**.

4. **Segurança:** Alta, para atrair **Investidores Institucionais** e garantir a custódia do capital.
  

---

## Benchmarking Expandido de Blockchains para Fintech

  

&emsp;A tabela abaixo compara a Polygon com seis *blockchains* relevantes, focando no **impacto financeiro e técnico** para o Reevo.

  

| Rede | Tipo | Custo de Transação | Maturidade EVM | Risco Técnico (Smart Contract) | Viabilidade para Reevo |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Polygon (Matic)** | L2 / Sidechain | **Quase Zero ($0.01)** | **Sim (Total)** | Baixo (Código maduro em Solidity) | **Ideal.** Melhor balanço Custo/Segurança/Velocidade. |
| **Ethereum (L1)** | L1 / Principal | **Alto e Volátil (>$5.00)** | Sim (Base) | Baixo | **Inviável para Operação.** Custo destrói a margem de Performance. |
| **Solana** | L1 Alto Desempenho | Baixo | Não (Linguagem Rust) | Alto (Curva de aprendizado e Custo de Engenharia elevado) | Viável, mas **custoso**. Aumenta o OPEX inicial drasticamente. |
| **BNB Smart Chain (BSC)** | L1 / EVM-Compatível | Baixo/Moderado | Sim | Moderado | **Razoável.** Risco de Centralização e menor confiança para o *compliance* de Fundos ESG. |
| **Avalanche (C-Chain)** | L1 / EVM-Compatível | Baixo/Moderado | Sim | Baixo | **Boa Alternativa.** Similar à Polygon, mas com ecossistema e liquidez em USDC ligeiramente menores. |
| **Arbitrum / Optimism** | L2 (Rollups) | Moderado (Mais caro que Polygon PoS) | Sim | Baixo | **Competitivo.** Excelente segurança, mas o *gas* (custo) ainda é maior, impactando a viabilidade das microtransações. |

---

  

## Fluxo Técnico da Blockchain

  

A operação é dividida em três momentos críticos, todos realizados na **EVM (Ethereum Virtual Machine)** da Polygon, aproveitando seu **baixo custo de gás** e **alta velocidade de *finality***.

  

### 1. Originação do Ativo e Escrow (Criando a Dívida)

  

Esta fase associa o documento legal (off-chain) ao token executável (on-chain).

  

| Termo Técnico | Ação Explicada | Impacto |
| :--- | :--- | :--- |
| **Minting (ERC-1155)** | O Serviço de Contratos executa a função *mint* no **Smart Contract de Tokens**, criando o **Token de Crédito** (o ativo digital que representa a CPR). | Cria o ativo negociável. O Token é transferido para a Carteira de Custódia (Escrow). |
| **EVM Execution (Solidity)** | O *backend* chama a função `createCPR()`. Isso dispara a criação do **Smart Contract de Regras (Waterfall)**, que codifica a hierarquia de pagamento. | Garante que as regras de juros, multas e deduções (RF-AGR-007) sejam imutáveis e executáveis pelo código. |
| **Polygon Gas Fee** | O **OPERATOR\_ROLE** (o *backend*) paga uma taxa mínima em **MATIC** para publicar o contrato e *mintar* o token. | Viabilidade: O custo é insignificante, viabilizando o alto volume de originação. |

  

### 2. Liquidez e Swap Atômico (Mercado Secundário)

  

Esta é a prova da liquidez, garantida pela segurança da execução atômica do Smart Contract.

  

| Termo Técnico | Ação Explicada | Impacto |
| :--- | :--- | :--- |
| **transferFrom (USDC)** | O Smart Contract exige que o comprador (Carlos) tenha dado *approve* (aprovação) prévia. O contrato usa `transferFrom` para puxar o USDC da carteira do comprador. | Segurança de Fundos: Garante que o Smart Contract não tem permissão para roubar o dinheiro; ele só pode movimentar o valor exato autorizado. |
| **Atomic Swap** | O Smart Contract de Swap executa a troca Token ↔ USDC em uma única transação. | Não-Repúdio: Se o USDC falhar, o Token não se move (e vice-versa). Isso é fundamental para a confiança no Mercado Secundário (RF-INV-003). |
| **EVM Finality** | Após 2-3 segundos, a transação é finalizada e imutável. | UX: O Investidor tem a confirmação de que a venda ou compra foi liquidada instantaneamente. |

  

### 3. Fluxo Reverso: Waterfall

  

Esta é a execução da lógica financeira mais complexa, disparada após o pagamento em BRL ser conciliado.

  

| Termo Técnico | Ação Explicada | Impacto |
| :--- | :--- | :--- |
| **Transaction Call (Txn)** | O *backend* (com o TREASURY\_ROLE) envia uma transação para a função `executeWaterfall()`. | O Smart Contract é acionado para iniciar a distribuição de fundos que já foram convertidos para USDC (na carteira de distribuição). |
| **Waterfall Execution** | O código executa a lógica de prioridade: 1) Dedução de IR/IOF (se não for feita pelo Gateway), 2) Distribuição de Principal + Juros aos token holders, 3) Pagamento da Taxa de Performance para o Tesouro. | Compliance Imutável: Garante que a ordem fiduciária de pagamento seja seguida pelo código (RF-INV-005). |
| **Gas Optimization** | O código usa *calldata* e *cache* (Solidity) para reduzir o custo do *loop* de distribuição, mesmo processando centenas de Investidores. | Escalabilidade: Mantém o custo de gás da distribuição baixo, garantindo a lucratividade marginal da plataforma. |

  

### 4. Testes de Sanidade Críticos

  

Esta sessão garante aos *Auditors* e Investidores que a lógica financeira e de segurança do Smart Contract será rigorosamente validada *antes* de entrar em produção.

  

| Cenário de Teste Crítico | Objetivo de Negócio | Funções do Smart Contract Envolvidas |
| :--- | :--- | :--- |
| **Teste de Inadimplência (RF-AGR-006)** | Provar que a lógica de juros e multas é calculada corretamente, protegendo o **ROI** do Investidor. | `createCPR()`, `executeWaterfall()` |
| **Teste de Arredondamento (Dust)** | Provar que não há "dinheiro perdido" devido à aritmética da EVM no *loop* de distribuição, garantindo que o valor total distribuído seja exato. | `executeWaterfall()` |
| **Teste de Falha Atômica** | Provar que o **Swap Atômico** reverte completamente se o comprador não tiver o saldo, evitando o risco de o vendedor perder seu token. | `executeAtomicSwap()` |
| **Teste de Fraude (Controle de Acesso)** | Provar que a função `releaseFunds` (liberação do *Escrow*) só pode ser chamada pelo **`TREASURY_ROLE`** do *backend* e nunca por uma conta externa não autorizada. | `releaseFunds()` |

---

  

## Smart Contract

  

&emsp;O smart contracts é o núcleo imutável do Reevo na **Polygon**. Ele implementa o **modelo P2P Híbrido** e codifica as regras críticas de **Waterfall** e **Escrow**, garantindo **segurança institucional** e **liquidez**.

  

### 1. Governança e Risco

  

&emsp;A plataforma utiliza o padrão **AccessControl** para segregar funções, mitigando o risco de fraude interna e o ponto único de falha do *backend*.

  

| Role | Smart Contract Ação Permitida | Valor para o Negócio |
| :--- | :--- | :--- |
| **ADMIN\_ROLE** | Criar novos empréstimos (`createCPR`). | Controla a **originação** e o *compliance* de novos ativos na plataforma. |
| **OPERATOR\_ROLE** | Orquestra depósitos (`depositAndBuyToken`) e executa o **Swap Atômico** (`executeAtomicSwap`). | Garante que apenas o *backend* validado possa iniciar a **liquidação** e o registro de propriedade do ativo (**Token de Crédito**). |
| **TREASURY\_ROLE** | Dispara o **Waterfall** (`executeWaterfall`) e a **Liberação de Fundos** (`releaseFunds`). | **Proteção de Capital:** O Smart Contract isola a função de mover dinheiro (desembolso/distribuição) em uma única chave de alta segurança (HSM). |

  

### 2. Endereço do Smart Contract Final

  

&emsp;O contrato auditado e corrigido deve ser acessado por meio de seu endereço de *deployment* na rede Polygon Amoy Testnet.

  

| Nome do Contrato | Rede | Chain ID | Endereço (Exemplo para Documentação) |
| :--- | :--- | :--- | :--- |
| **PeerSeedCPR.sol** | **Polygon Amoy (Teste)** | `80002` | **[0x5bd4e0a1774385c0f2d679471f30c0e898f6d77dc5fcde831257534d8679ce78]** |