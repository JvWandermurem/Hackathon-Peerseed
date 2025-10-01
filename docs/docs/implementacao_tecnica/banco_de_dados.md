---
sidebar_position: 0
title: Arquitetura de Dados 
---

## Camada de Armazenamento

&emsp; A arquitetura de dados do Peerseed foi projetada sob o princípio de Persistência Poliglota, utilizando a tecnologia mais adequada para cada tipo de dado. A arquitetura garante a integridade transacional para operações financeiras, alta performance para consultas frequentes e observabilidade completa do sistema. A estrutura suporta o ciclo de vida completo do crédito P2P, desde o cadastro do usuário até a liquidação dos investimentos.

## 1. Banco de Dados Relacional (PostgreSQL)

&emsp;  O coração da persistência de dados é um banco de dados PostgreSQL, que serve como a fonte única da verdade para todos os dados estruturados e transacionais.

```SQL
-- Tipos Enumerados (Enums)
-- Utilizados para garantir a consistência e integridade dos dados em campos com valores pré-definidos.
CREATE TYPE perfil_enum AS ENUM ('AGRICULTOR', 'INVESTIDOR', 'ADMIN');
CREATE TYPE status_kyc_enum AS ENUM ('PENDENTE', 'VERIFICADO', 'REPROVADO', 'ANALISE_MANUAL');
CREATE TYPE tipo_transacao_enum AS ENUM ('DEPOSITO_PIX', 'DEPOSITO_CRYPTO', 'SAQUE_PIX', 'SAQUE_CRYPTO', 'INVESTIMENTO_PRIMARIO', 'INVESTIMENTO_SECUNDARIO', 'RECEBIMENTO_PARCELA', 'VENDA_SECUNDARIO', 'TAXA_PLATAFORMA');
CREATE TYPE status_transacao_enum AS ENUM ('PENDENTE', 'CONCLUIDA', 'FALHOU', 'CANCELADA');
CREATE TYPE status_cpr_enum AS ENUM ('ANALISE', 'CAPTAÇÃO', 'FINANCIADO', 'EM_PAGAMENTO', 'QUITADO', 'INADIMPLENTE');
CREATE TYPE risco_enum AS ENUM ('A', 'B', 'C', 'D', 'E');
CREATE TYPE status_parcela_enum AS ENUM ('PENDENTE', 'PAGA', 'ATRASADA');
CREATE TYPE status_investimento_enum AS ENUM ('ATIVO', 'VENDIDO', 'FINALIZADO');
CREATE TYPE status_oferta_enum AS ENUM ('ABERTA', 'VENDIDA', 'CANCELADA');
CREATE TYPE tipo_conta_enum AS ENUM ('CORRENTE', 'POUPANCA');
CREATE TYPE status_verificacao_enum AS ENUM ('PENDENTE', 'VERIFICADA', 'INVALIDA');

-- Usuários
-- Armazena as informações de login e perfil de todos os participantes da plataforma.
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_completo VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    celular VARCHAR(15) NOT NULL,
    perfil perfil_enum NOT NULL,
    status_kyc status_kyc_enum NOT NULL DEFAULT 'PENDENTE',
    data_criacao TIMESTAMPTZ NOT NULL DEFAULT now(),
    data_atualizacao TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Carteiras Digitais
-- Representa a carteira digital de cada usuário, onde os saldos em stablecoin (USDC) são mantidos.
CREATE TABLE carteiras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID UNIQUE NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    saldo_usdc DECIMAL(18, 8) NOT NULL DEFAULT 0.0,
    saldo_bloqueado_usdc DECIMAL(18, 8) NOT NULL DEFAULT 0.0,
    data_atualizacao TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CPRs (Cédulas de Produtor Rural)
-- Modela a oportunidade de investimento, contendo os termos do empréstimo solicitado pelo agricultor.
CREATE TABLE cprs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agricultor_id UUID NOT NULL REFERENCES usuarios(id),
    valor_solicitado DECIMAL(18, 2) NOT NULL,
    taxa_juros_anual DECIMAL(5, 2) NOT NULL,
    prazo_meses INT NOT NULL,
    status status_cpr_enum NOT NULL DEFAULT 'ANALISE',
    score_risco risco_enum NOT NULL,
    total_cotas INT NOT NULL,
    valor_por_cota_usdc DECIMAL(18, 8) NOT NULL, -- CORREÇÃO: Adicionada vírgula
    data_emissao DATE,
    data_vencimento_final DATE,
    data_criacao TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Parcelas
-- Detalha o cronograma de pagamentos de cada CPR.
CREATE TABLE parcelas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cpr_id UUID NOT NULL REFERENCES cprs(id) ON DELETE CASCADE,
    numero_parcela INT NOT NULL,
    valor_principal DECIMAL(18, 2) NOT NULL,
    valor_juros DECIMAL(18, 2) NOT NULL,
    data_vencimento DATE NOT NULL,
    status status_parcela_enum NOT NULL DEFAULT 'PENDENTE',
    valor_multa_paga DECIMAL(18, 2) DEFAULT 0.0,
    valor_juros_mora_pago DECIMAL(18, 2) DEFAULT 0.0,
    data_pagamento TIMESTAMPTZ, -- CORREÇÃO: Adicionada vírgula
    UNIQUE(cpr_id, numero_parcela) -- CORREÇÃO: Adicionada constraint de unicidade
);

-- Investimentos
-- Tabela de ligação que representa a participação de um investidor em uma CPR.
CREATE TABLE investimentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    investidor_id UUID NOT NULL REFERENCES usuarios(id),
    cpr_id UUID NOT NULL REFERENCES cprs(id),
    quantidade_cotas INT NOT NULL,
    valor_cota_compra DECIMAL(18, 8) NOT NULL,
    status status_investimento_enum NOT NULL DEFAULT 'ATIVO',
    data_investimento TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Transações
-- Funciona como o livro-razão (ledger), registrando toda e qualquer movimentação nas carteiras.
CREATE TABLE transacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    carteira_id UUID NOT NULL REFERENCES carteiras(id),
    valor DECIMAL(18, 8) NOT NULL,
    tipo tipo_transacao_enum NOT NULL,
    status status_transacao_enum NOT NULL DEFAULT 'PENDENTE',
    referencia_externa_id VARCHAR(255),
    descricao TEXT,
    data_transacao TIMESTAMPTZ NOT NULL DEFAULT now(), -- CORREÇÃO: Adicionada vírgula
    referencia_id UUID,
    referencia_tipo VARCHAR(50)
);

-- Mercado Secundário
-- Modela as ofertas de venda de cotas de investimento no mercado secundário.
CREATE TABLE ofertas_secundario (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    investimento_id UUID NOT NULL REFERENCES investimentos(id), -- SUGESTÃO: Avaliar se a constraint UNIQUE aqui é desejada
    quantidade_cotas_a_venda INT NOT NULL,
    preco_por_cota_usdc DECIMAL(18, 8) NOT NULL,
    status status_oferta_enum NOT NULL DEFAULT 'ABERTA',
    data_criacao TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Contas Bancárias
-- Armazena os dados bancários dos usuários para a operação de saque (off-ramp) via Pix.
CREATE TABLE contas_bancarias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    banco VARCHAR(100) NOT NULL,
    agencia VARCHAR(10) NOT NULL,
    conta VARCHAR(20) NOT NULL,
    tipo_conta tipo_conta_enum NOT NULL,
    status status_verificacao_enum NOT NULL DEFAULT 'PENDENTE',
    is_principal BOOLEAN NOT NULL DEFAULT false
);

-- Ledger de Eventos
-- Garante a imutabilidade e a auditoria de operações críticas através de uma cadeia de hashes criptográficos.
CREATE TABLE ledger_eventos (
    id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    tipo_evento VARCHAR(100) NOT NULL,
    ator_id UUID REFERENCES usuarios(id),
    ator_tipo VARCHAR(50),
    dados_evento JSONB NOT NULL, -- CORREÇÃO: Removido campo duplicado
    hash_anterior VARCHAR(64),
    hash_atual VARCHAR(64) UNIQUE NOT NULL
);

```
## 2. Cache em Memória (Redis)

&emsp; O Redis, um repositório de dados em memória de alta performance, será utilizado como uma camada de cache distribuído para armazenar dados voláteis e de acesso frequente, com o objetivo de acelerar a resposta da aplicação e reduzir a carga sobre o PostgreSQL.

### 2.1. Casos de Uso Detalhados
**Gerenciamento de Sessões:** Armazenar tokens de sessão de usuários logados `(RF-SEC-001)`, permitindo uma validação de sessão de baixíssima latência pela API Gateway e pelos microsserviços.

**Cache de Leituras (Cache-Aside):** Guardar cópias temporárias de dados que são lidos com frequência, como a lista de ofertas do marketplace (para usuários não logados), detalhes de CPRs públicas, e dados de perfil de usuários que não mudam constantemente.

**Rate Limiting (Limitação de Taxa):** Proteger endpoints sensíveis (como login ou envio de OTP) contra ataques de força bruta, controlando o número de requisições por IP ou por usuário em uma janela de tempo.

**Filas de Baixa Latência:** Para tarefas assíncronas simples que não exigem a robustez de um message broker completo (ex: "enviar notificação de boas-vindas após o cadastro").

### 2.2. Estratégias de Implementação

**Padrão de Cache (Cache-Aside / Lazy Loading):**

A aplicação seguirá o padrão Cache-Aside. 

<details>
<summary> Fluxo</summary>

 1 - A aplicação tenta ler o dado do Redis.

 2 - Se o dado existir **(cache hit)**, ele é retornado imediatamente.

3 - Se o dado não existir **(cache miss)**, a aplicação busca a informação no PostgreSQL, a salva no Redis com um tempo de expiração (TTL), e então a retorna.

</details>

**Estratégia de Invalidação de Cache:**

Para garantir a consistência dos dados, duas estratégias serão usadas:

**TTL (Time-To-Live):** Todos os dados em cache terão um tempo de vida definido (ex: 5 minutos para a lista de ofertas do marketplace), garantindo que a informação seja periodicamente atualizada.

**Invalidação Ativa (Event-Driven):** Para dados críticos, quando um registro for alterado no PostgreSQL (ex: o status de uma CPR muda para "FINANCIADO"), a aplicação emitirá um evento para explicitamente deletar a chave correspondente no Redis, forçando uma nova leitura do banco na próxima requisição.

### 2.3. Considerações Operacionais

**Estrutura de Chaves:** Será adotada uma convenção de nomenclatura de chaves para evitar colisões e facilitar a depuração. Ex: `session:{userId}`, `cpr:{cprId}:details`, `marketplace:offers:page:{pageNumber}`.

**Política de Evicção:** Quando a memória do Redis estiver cheia, a política de evicção configurada será allkeys-lru (`Least Recently Used`), que remove as chaves menos utilizadas recentemente.

**Alta Disponibilidade:** Em produção, o Redis não será uma instância única. Será configurado em modo de alta disponibilidade usando Redis Sentinel ou um serviço gerenciado de nuvem (como AWS ElastiCache ou Google Memorystore) com replicação e failover automático, em conformidade com o RNF de disponibilidade **(RNF-CF-01)**.

## 3. Logs Estruturados e Observabilidade
A estratégia de observabilidade da Peerseed se baseia na emissão de logs estruturados em formato JSON para a saída padrão (stdout) de cada microsserviço. Esta abordagem desacopla os serviços da infraestrutura de logging, uma prática recomendada para garantir a manutenibilidade (RNF-M-03).

### 3.1. Padrão de Estrutura do Log (Schema JSON)
Para garantir que os logs sejam facilmente pesquisáveis e analisáveis, todo log gerado pela aplicação deve aderir a um schema comum:

```JSON
{
  "timestamp": "2025-09-30T14:40:00.123Z",
  "level": "INFO", // DEBUG, INFO, WARN, ERROR, CRITICAL
  "service": "servico-de-analise-de-credito",
  "correlation_id": "b1a4a233-1b2c-4b5c-8d6e-f7a8b9c0d1e2", // ID único que rastreia uma requisição através de múltiplos serviços
  "user_id": "f4a5b6c7-d8e9-f0a1-b2c3-d4e5f6a7b8c9", // Opcional
  "message": "Análise de crédito para a solicitação xyz concluída com sucesso.",
  "payload": { // Objeto com dados de contexto
    "solicitacao_id": "xyz-123",
    "score_gerado": 750,
    "tempo_de_processamento_ms": 450
  }
}
```
### 3.2. Arquitetura de Coleta e Armazenamento

&emsp; A aplicação em si é agnóstica ao armazenamento. Para o MVP local, os logs são exibidos no terminal e armazenos em um arquivo json. Em um ambiente de produção, um agente coletor (como Fluentd ou Vector) captura os logs de stdout e os encaminha para um sistema de gerenciamento de logs centralizado (como AWS CloudWatch, Google Cloud Logging ou uma stack ELK), que implementará as políticas de retenção e permitirá a criação de dashboards e alertas.

**Coleta:** Em produção, um agente coletor de logs (como Fluentd ou Vector) será executado em cada nó/container. Ele será responsável por capturar os logs stdout, adicionar metadados (ex: nome do container, nó) e enviá-los de forma assíncrona para a camada de armazenamento.

**Armazenamento:** Conforme nossa decisão anterior, a camada de armazenamento para logs será o próprio sistema, para um MPV, com possibilidade de estensão para um serviço da AWS cmo o Dynamo. Isso centraliza o armazenamento e permite o uso de SQL para consultas e análises.



### 3.3. Estratégia de Retenção de Dados
Logs podem consumir um grande volume de armazenamento.

A seguinte política de retenção será aplicada:

**30 dias "Hot":** Logs dos últimos 30 dias serão mantidos localmente para consultas rápidas e depuração.

**1 ano "Cold":** Após 30 dias, os logs serão automaticamente exportados para um armazenamento de baixo custo (como AWS S3 Glacier ou Google Cloud Storage Archive) e mantidos por 1 ano para fins de auditoria e conformidade, sendo então permanentemente excluídos.

### 3.4. Segurança e Mascaramento de Dados (LGPD)
Para estar em conformidade com a LGPD `(RNF-S-04)`, a aplicação NÃO deve registrar dados sensíveis em texto claro.

**Ação:** As bibliotecas de logging da aplicação devem ser configuradas com filtros de mascaramento de dados para redigir automaticamente informações como CPF, senhas, tokens de acesso e dados de cartão/conta bancária antes de o log ser escrito. 

> Exemplo: _"cpf": "123.***.***-00"._

### 3.5. Monitoramento e Alertas
Os logs estruturados no TimescaleDB serão a base para o monitoramento e alertas `(RNF-M-03)`.

**Ação:** Ferramentas como o Grafana serão conectadas ao banco de dados para criar dashboards e configurar alertas baseados em consultas SQL. Por exemplo:

**ALERTAR SE:** O número de logs com 'level' = 'ERROR' no 'service' = 'servico-de-pagamentos' for > 10 nos últimos 5 minutos.

**CRIAR GRÁFICO:** Tempo de processamento médio da análise de crédito (extraído do 'payload.tempo_de_processamento_ms').

## 4. Conexão com os Requisitos Funcionais

Esta estrutura de armazenamento de dados foi projetada para atender diretamente aos requisitos funcionais e não funcionais:

| Requisito                                                               | Atendido por                   | Observação                                 |
| ----------------------------------------------------------------------- | ------------------------------ | ------------------------------------------ |
| **RF-CAD-001 / RF-CAD-002** (Cadastro e autenticação de usuários)       | `usuarios`                     | Campos de autenticação + status KYC        |
| **RF-USR-002** (Gestão de dados do usuário)                             | `usuarios`, `contas_bancarias` | Controle de perfis e dados bancários       |
| **RF-AGR-001 / RF-AGR-002** (Solicitação de crédito e análise de risco) | `cprs`                         | Campos de valor solicitado, status e score |
| **RF-AGR-005** (Pagamento de parcelas)                                  | `parcelas`                     | Cronograma e status de pagamentos          |
| **RF-AGR-006** (Gestão de inadimplência)                                | `parcelas` + `ledger_eventos`  | Registro imutável de inadimplências        |
| **RF-INV-001 / RF-INV-004** (On/Off-ramp)                               | `carteiras` + `transacoes`     | Movimentação e saldo separado              |
| **RF-INV-002 / RF-INV-005** (Investimento e distribuição)               | `investimentos` + `parcelas`   | Relação CPR ↔ Investidor                   |
| **RF-INV-003** (Mercado secundário)                                     | `ofertas_secundario`           | Venda antecipada de cotas                  |
| **RF-INV-006** (Extrato)                                                | `transacoes`                   | Ledger financeiro                          |
| **RNF-S-02 / RNF-S-03** (Segurança e transparência)                     | `ledger_eventos`               | Cadeia de hashes para imutabilidade        |
| **RNF-ED-01** (Performance)                                             | Redis                          | Cache de dados críticos                    |
| **RNF-M-03** (Observabilidade)                                          | Logs JSON stdout               | Monitoramento estruturado                  |

