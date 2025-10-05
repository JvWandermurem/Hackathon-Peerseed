---
sidebar_position: 5
title: Modelagem de dados
---

## Introdução

&emsp; A base de dados é o pilar de qualquer aplicação robusta, especialmente em um projeto como a Reevo, onde a integridade, segurança e consistência dos dados são primordiais. Para o núcleo transacional do nosso sistema, optamos por um banco de dados relacional.

&emsp;Essa escolha se deve à sua conformidade com as propriedades **ACID (Atomicidade, Consistência, Isolamento e Durabilidade)**, que garantem que operações financeiras complexas (como um investimento ou a distribuição de um pagamento) sejam concluídas com sucesso por inteiro ou revertidas, nunca deixando os dados em um estado inconsistente.

O diagrama abaixo ilustra as principais entidades do nosso sistema e como elas se interligam para modelar o negócio do Reevo.

<p style={{textAlign: 'center'}}> Diagrama Entidade-Relacionamento (DER) Simples</p>
<div style={{margin: 15}}>
  <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/diagrama_entidade_relacionamento_simples.png").default} style={{width: 1024}} alt="Fluxo de Solicitação e Aprovação de Crédito" />
        <br/>
    </div>
</div>
<p style={{textAlign: 'center'}}> Fonte: Produzido pelos autores (2025).</p>

## Detalhamento das Entidades e Relacionamentos

&emsp; A seguir, justificamos a existência e a estrutura de cada tabela, com foco em suas chaves e nos relacionamentos que elas estabelecem.

<p style={{textAlign: 'center'}}> Diagrama Entidade-Relacionamento (DER) Simples</p>
<div style={{margin: 15}}>
  <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/diagrama_entidade_relacionamento.png").default} style={{width: 1024}} alt="Fluxo de Solicitação e Aprovação de Crédito" />
        <br/>
    </div>
</div>
<p style={{textAlign: 'center'}}> Fonte: Produzido pelos autores (2025).</p>

### Tabela: usuarios

Esta é a tabela central de identidade. Armazena as informações de login e perfil de todos os participantes da plataforma, sejam eles AGRICULTORES ou INVESTIDORES. A coluna `perfil` é o que distingue seus papéis e as funcionalidades que podem acessar.

<p style={{textAlign: 'center'}}> Diagrama Entidade-Relacionamento (DER) Simples</p>
<div style={{margin: 15}}>
  <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/tabela_user_diagrama.png").default} style={{width: 1024}} alt="Fluxo de Solicitação e Aprovação de Crédito" />
        <br/>
    </div>
</div>
<p style={{textAlign: 'center'}}> Fonte: Produzido pelos autores (2025).</p>

**Chaves e Relações:**

- **Chave Primária (PK):** id (UUID). É o identificador único e interno de cada usuário, usado para relacioná-lo a todas as outras tabelas.

- **Relações:** Esta tabela é o ponto de partida para a maioria das relações. Um usuário pode solicitar múltiplas cprs, realizar múltiplos investimentos e cadastrar múltiplas contas_bancarias.

### Tabela: carteiras

Representa a carteira digital de cada usuário na plataforma, onde seus saldos em stablecoin (USDC) são mantidos e gerenciados. A separação entre saldo_usdc e saldo_bloqueado_usdc é crucial para gerenciar fundos que estão comprometidos em uma transação (como um investimento em andamento) mas ainda não foram debitados.

<p style={{textAlign: 'center'}}> Diagrama Entidade-Relacionamento (DER) Simples</p>
<div style={{margin: 15}}>
  <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/tabela_carteiras_diagrama.png").default} style={{width: 1024}} alt="Fluxo de Solicitação e Aprovação de Crédito" />
        <br/>
    </div>
</div>
<p style={{textAlign: 'center'}}> Fonte: Produzido pelos autores (2025).</p>

**Chaves e Relações:**

 - **Chave Primária (PK):** id (UUID).

- **Chave Estrangeira (FK):** usuario_id referencia usuarios(id). A restrição UNIQUE nesta chave garante uma relação de um-para-um, assegurando que cada usuário tenha exatamente uma carteira.

### Tabela: cprs (Cédulas de Produtor Rural)

Modela a oportunidade de investimento. Cada linha representa uma solicitação de crédito feita por um agricultor que foi aprovada e está pronta para captação no marketplace. Contém todos os termos do empréstimo, como valor, taxa de juros e prazo.

<p style={{textAlign: 'center'}}> Diagrama Entidade-Relacionamento (DER) Simples</p>
<div style={{margin: 15}}>
  <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/tabela_cprs_diagrama.png").default} style={{width: 1024}} alt="Fluxo de Solicitação e Aprovação de Crédito" />
        <br/>
    </div>
</div>
<p style={{textAlign: 'center'}}> Fonte: Produzido pelos autores (2025).</p>

**Chaves e Relações:**

- **Chave Primária (PK):** id (UUID).

- **Chave Estrangeira (FK):** agricultor_id referencia usuarios(id), criando uma relação de um-para-muitos (um agricultor pode ter várias CPRs ao longo do tempo).

### Tabela: parcelas
Detalha o cronograma de pagamentos de uma CPR. Ao criar uma CPR, esta tabela é populada com todas as parcelas futuras, seus valores e datas de vencimento. Isso é fundamental para a gestão de pagamentos e inadimplência.

<p style={{textAlign: 'center'}}> Diagrama Entidade-Relacionamento (DER) Simples</p>
<div style={{margin: 15}}>
  <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/tabela_parcelas_diagrama.png").default} style={{width: 1024}} alt="Fluxo de Solicitação e Aprovação de Crédito" />
        <br/>
    </div>
</div>
<p style={{textAlign: 'center'}}> Fonte: Produzido pelos autores (2025).</p>

**Chaves e Relações:**

- **Chave Primária (PK):** id (UUID).

- **Chave Estrangeira (FK):** cpr_id referencia cprs(id), criando uma relação de um-para-muitos (uma CPR é composta por múltiplas parcelas).

### Tabela: investimentos

Esta é uma tabela de ligação crucial que materializa a relação de muitos-para-muitos entre usuarios (investidores) e cprs. Cada linha significa que um investidor específico aportou um determinado valor em uma CPR específica.

<p style={{textAlign: 'center'}}> Diagrama Entidade-Relacionamento (DER) Simples</p>
<div style={{margin: 15}}>
  <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/tabela_investimentos_diagrama.png").default} style={{width: 1024}} alt="Fluxo de Solicitação e Aprovação de Crédito" />
        <br/>
    </div>
</div>
<p style={{textAlign: 'center'}}> Fonte: Produzido pelos autores (2025).</p>

**Chaves e Relações:**

- **Chave Primária (PK):** id (UUID).

- **Chaves Estrangeiras (FK):**

    - `investidor_id` referencia `usuarios(id)`.

    - `cpr_id` referencia `cprs(id)`.

### Tabela: transacoes
Funciona como o livro-razão (ledger) de todas as movimentações financeiras na plataforma. Seja um depósito, um saque, um investimento ou o recebimento de juros, cada operação gera um registro imutável nesta tabela, garantindo total rastreabilidade e auditoria.

<p style={{textAlign: 'center'}}> Diagrama Entidade-Relacionamento (DER) Simples</p>
<div style={{margin: 15}}>
  <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/tabela_transacoes_diagrama.png").default} style={{width: 1024}} alt="Fluxo de Solicitação e Aprovação de Crédito" />
        <br/>
    </div>
</div>
<p style={{textAlign: 'center'}}> Fonte: Produzido pelos autores (2025).</p>

**Chaves e Relações:**

- **Chave Primária (PK):** id (UUID).

- **Chave Estrangeira (FK):** `carteira_id` referencia `carteiras(id)`, ligando cada transação a uma carteira específica.

### Tabela: ofertas_secundario
Modela as ofertas de venda no mercado secundário. Quando um investidor decide vender sua cota (seu investimento), uma linha é criada aqui com o preço de venda. Isso permite que a plataforma funcione como um ambiente de negociação P2P.

<p style={{textAlign: 'center'}}> Diagrama Entidade-Relacionamento (DER) Simples</p>
<div style={{margin: 15}}>
  <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/tabela_ofertas_secun_diagrama.png").default} style={{width: 1024}} alt="Fluxo de Solicitação e Aprovação de Crédito" />
        <br/>
    </div>
</div>
<p style={{textAlign: 'center'}}> Fonte: Produzido pelos autores (2025).</p>

**Chaves e Relações:**

**Chave Primária (PK):** id (UUID).

**Chave Estrangeira (FK):** `investimento_id` referencia `investimentos(id)`. A restrição `UNIQUE` nesta chave garante que um mesmo investimento não possa ter mais de uma oferta de venda ativa ao mesmo tempo.

### Tabela: contas_bancarias
Armazena de forma segura os dados bancários dos usuários para a operação de saque (off-ramp) via Pix. Manter isso em uma tabela separada permite que um usuário tenha múltiplas contas cadastradas e escolha uma principal.

<p style={{textAlign: 'center'}}> Diagrama Entidade-Relacionamento (DER) Simples</p>
<div style={{margin: 15}}>
  <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/tabela_contas_banc_diagrama.png").default} style={{width: 1024}} alt="Fluxo de Solicitação e Aprovação de Crédito" />
        <br/>
    </div>
</div>
<p style={{textAlign: 'center'}}> Fonte: Produzido pelos autores (2025).</p>

**Chaves e Relações:**

- **Chave Primária (PK):** id (UUID).

 - **Chave Estrangeira (FK):** usuario_id referencia usuarios(id), criando uma relação de um-para-muitos.