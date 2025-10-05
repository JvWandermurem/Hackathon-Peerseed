---
sidebar_position: 4
title: Fluxo de Dados
---

## Introdução

&emsp;O fluxo de dados descreve como as informações e valores circulam entre os diferentes atores (agricultores, investidores e administradores), os serviços internos da plataforma e os sistemas externos integrados (ex.: gateways de pagamento, registradoras de CPR, bureaus de crédito).

&emsp;Esses fluxos desenvolvidos pensados personas **João(Agricultor)** e **Mariana(Investidora)** para garantir que o sistema opere de forma consistente, segura e transparente, evitando falhas de comunicação e assegurando a rastreabilidade de cada operação.

&emsp;Para representar essas interações, foram elaborados seis fluxos principais: Solicitação e Aprovação de Crédito, Realização de Investimento, Pagamento de Parcela e Distribuição (Assíncrono), Venda no Mercado Secundário, Saque de Fundos (Off-Ramp) e Gestão de Inadimplência, cada um detalhando as etapas críticas de dados e integrações que sustentam a operação da plataforma.

## Fluxo de Solicitação e Aprovação de Crédito

&emsp;Este fluxo descreve a jornada do agricultor João desde o cadastro até ter sua proposta listada no marketplace. Ele demonstra a interação entre o usuário, o sistema automatizado e o "humano no loop" (Analista de Crédito).


<p style={{textAlign: 'center'}}> Fluxo de Solicitação e Aprovação de Crédito</p>
<div style={{margin: 15}}>
  <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/fluxo_solicitacao_credito_reevo.png").default} style={{width: 800}} alt="Fluxo de Solicitação e Aprovação de Crédito" />
        <br/>
    </div>
</div>
<p style={{textAlign: 'center'}}> Fonte: Produzido pelos autores (2025).</p>

> Nota: Para melhor visualização:

> https://www.canva.com/design/DAG0UzRCy5Q/w-yq85d-KYoxx_jXFQzDFA/edit?ui=e30 

<details>
  <summary>Fluxo de Solicitação e Aprovação de Crédito</summary>

```murmaid
sequenceDiagram
    participant João as Agricultor (Browser)
    participant FE as Frontend
    participant GW as API Gateway
    participant Contas as Serviço de Contas
    participant Analise as Serviço de Análise de Crédito
    participant Backoffice as Interface do Analista
    participant Analista as Analista de Crédito

    João->>FE: 1. Preenche cadastro e solicitação
    FE->>GW: 2. Envia dados e documentos
    GW->>Contas: 3. Cria/Autentica usuário
    GW->>Analise: 4. Inicia análise de crédito
    
    activate Analise
    Analise-->>GW: 5. Responde que a análise foi iniciada
    GW-->>FE: 6. Exibe "Análise em andamento"
    FE-->>João: Exibe "Análise em andamento"
    
    Analise->>Bureaus Externos: 7. Consulta score de mercado (API)
    Bureaus Externos-->>Analise: 8. Retorna score
    Analise->>Analise: 9. Combina dados e gera Score Reevo (ML)
    Analise->>Backoffice: 10. Cria tarefa de validação para o Analista
    deactivate Analise

    Note right of Analista: -- Processo Manual Paralelo (horas) --
    Analista->>Backoffice: 11. Acessa fila de tarefas
    Analista->>Backoffice: 12. Valida documentos e dados
    Analista->>Backoffice: 13. Clica em "Aprovar Crédito"

    Backoffice->>GW: 14. Notifica sistema sobre a aprovação
    GW->>Analise: 15. Finaliza o status da análise
    
    activate Analise
    Analise->>Contas: 16. Envia notificação de "Crédito Aprovado" para o usuário
    deactivate Analise
    
    Note over João, FE: -- Assinatura e Lançamento --
    FE->>João: 17. Exibe proposta e solicita assinatura da CPR
    João->>FE: 18. Assina a CPR com e-CPF
    FE->>GW: 19. Envia CPR assinada
    GW->>Serviço de Contratos: 20. Valida e envia para registradora (API)
    Serviço de Contratos-->>GW: 21. Confirma registro
    GW->>Serviço de Marketplace: 22. Lista a oportunidade de investimento
```
</details>

## Fluxo de Realização de Investimento

&emsp;Este fluxo mostra a jornada da investidora Marina, desde o depósito de fundos (via Pix) até a alocação em uma oportunidade de crédito.

<p style={{textAlign: 'center'}}> Fluxo de Realização de Investimento</p>
<div style={{margin: 15}}>
  <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/fluxo_realizacao_investimento_reevo.png").default} style={{width: 800}} alt="Fluxo de Solicitação e Aprovação de Crédito" />
        <br/>
    </div>
</div>
<p style={{textAlign: 'center'}}> Fonte: Produzido pelos autores (2025).</p>

> Nota: Para melhor visualização:

> https://www.canva.com/design/DAG0UzRCy5Q/w-yq85d-KYoxx_jXFQzDFA/edit?ui=e30 

<Details>
  <summary>Murmaid Fluxo de Realização de Investimento</summary>

```murmaid
sequenceDiagram
    participant Marina as Investidora (Browser)
    participant FE as Frontend
    participant GW as API Gateway
    participant Marketplace as Serviço de Marketplace
    participant Carteira as Serviço de Carteira Digital
    participant Pagamentos as Gateway de Pagamento

    Marina->>FE: 1. Acessa marketplace e escolhe oportunidade
    FE->>GW: 2. Solicita detalhes da oportunidade
    GW->>Marketplace: 3. Busca dados
    Marketplace-->>GW: 4. Retorna dados
    GW-->>FE: 5. Exibe detalhes para Marina

    Marina->>FE: 6. Clica em "Investir" e define valor
    FE->>GW: 7. Tenta alocar investimento
    GW->>Carteira: 8. Verifica saldo de USDC
    
    alt Saldo Insuficiente
        Carteira-->>GW: 9a. Saldo insuficiente
        GW-->>FE: 10a. Informa saldo insuficiente
        FE->>Marina: 11a. Sugere depósito
        
        Marina->>FE: 12a. Solicita depósito via Pix
        FE->>GW: 13a. Gera cobrança Pix
        GW->>Pagamentos: 14a. Cria QR Code Pix
        Pagamentos-->>GW: 15a. Retorna QR Code
        GW-->>FE: 16a. Exibe QR Code
        FE->>Marina: 17a. Marina paga o Pix
        
        Pagamentos-->>GW: 18a. Webhook: Pagamento Confirmado!
        GW->>Carteira: 19a. Credita USDC na carteira da Marina
    end

    Note over Marina, FE: Marina agora tenta investir novamente com saldo
    FE->>GW: 9b. Tenta alocar investimento
    GW->>Carteira: 10b. Verifica saldo (agora suficiente)
    Carteira-->>GW: 11b. Saldo OK. Bloqueia valor.
    GW->>Marketplace: 12b. Confirma investimento na oportunidade
    Marketplace-->>GW: 13b. Investimento registrado
    GW-->>FE: 14b. Sucesso!
    FE-->>Marina: 15b. Exibe confirmação do investimento
```

</Details>

## Fluxo de Pagamento de Parcela e Distribuição (Assíncrono)

&emsp;Este é o fluxo mais crítico do ponto de vista financeiro. Ele mostra como o pagamento de uma parcela pelo agricultor dispara um processo assíncrono para calcular taxas/impostos e distribuir o valor líquido para os investidores de forma segura e escalável.

<p style={{textAlign: 'center'}}> Fluxo de Pagamento de Parcela e Distribuição</p>
<div style={{margin: 15}}>
  <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/fluxo_recebimento_investimento_reevo.png").default} style={{width: 800}} alt="Fluxo de Solicitação e Aprovação de Crédito" />
        <br/>
    </div>
</div>
<p style={{textAlign: 'center'}}> Fonte: Produzido pelos autores (2025).</p>

> Nota: Para melhor visualização:

> https://www.canva.com/design/DAG0UzRCy5Q/w-yq85d-KYoxx_jXFQzDFA/edit?ui=e30 

<Details>
  <summary>Murmaid Fluxo de Pagamento de Parcela e Distribuição (Assíncrono)</summary>

  ```murmaid
  sequenceDiagram
    participant João as Agricultor (Browser)
    participant FE as Frontend
    participant GW as API Gateway
    participant Pagamentos as Gateway de Pagamento
    participant Broker as Message Broker (Fila)
    participant Distribuidor as Serviço de Distribuição
    participant Carteira as Serviço de Carteira Digital

    João->>FE: 1. Acessa painel e clica em "Pagar Parcela"
    FE->>GW: 2. Solicita dados de pagamento
    GW->>Serviço de Contratos: 3. Gera cobrança (Pix/Boleto)
    Serviço de Contratos-->>GW: 4. Retorna dados
    GW-->>FE: 5. Exibe QR Code / Linha digitável
    
    Note right of João: João efetua o pagamento no seu banco...
    
    Pagamentos-->>GW: 6. Webhook: Pagamento Confirmado!
    
    activate GW
    GW->>Broker: 7. Publica evento "PagamentoRealizado" com os dados da transação
    GW-->>Pagamentos: 8. Confirma recebimento do webhook (HTTP 200 OK)
    deactivate GW
    
    Note over Broker, Distribuidor: -- Processamento em Background --
    
    Broker-->>Distribuidor: 9. Entrega o evento "PagamentoRealizado"
    
    activate Distribuidor
    Distribuidor->>Serviço de Contratos: 10. Busca detalhes do contrato e investidores
    Serviço de Contratos-->>Distribuidor: 11. Retorna lista de investidores e % de participação
    
    Distribuidor->>Distribuidor: 12. Calcula taxas da plataforma e impostos (IR)
    
    loop Para cada Investidor
        Distribuidor->>Distribuidor: 13. Calcula valor líquido a ser creditado
        Distribuidor->>Carteira: 14. Credita USDC na carteira do Investidor
    end
    
    Distribuidor->>Servipço de Notificações: 15. Envia notificações para os investidores
    deactivate Distribuidor
  ```
</Details>

## Fluxo de Venda no Mercado Secundário

&emsp;Este fluxo detalha como uma investidora (Marina, a vendedora) pode vender sua cota de investimento (Token de Crédito) para outro investidor (Carlos, o comprador) antes do vencimento do contrato. É um processo de troca dentro da plataforma que garante a transferência segura e atômica tanto da cota quanto do valor em USDC.

<p style={{textAlign: 'center'}}> Fluxo de Venda no Mercado Secundário</p>
<div style={{margin: 15}}>
  <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/fluxo_venda_token_mercado_secundario.png").default} style={{width: 800}} alt="Fluxo de Solicitação e Aprovação de Crédito" />
        <br/>
    </div>
</div>
<p style={{textAlign: 'center'}}> Fonte: Produzido pelos autores (2025).</p>

> Nota: Para melhor visualização:

> https://www.canva.com/design/DAG0UzRCy5Q/w-yq85d-KYoxx_jXFQzDFA/edit?ui=e30 

<Details>
  <summary>Murmaid Fluxo de Venda no Mercado Secundário</summary>

  ```murmaid
  sequenceDiagram
    participant Marina as Vendedora (Browser)
    participant Carlos as Comprador (Browser)
    participant FE as Frontend
    participant GW as API Gateway
    participant Marketplace as Serviço de Marketplace
    participant Carteira as Serviço de Carteira Digital

    Note over Marina, FE: -- Etapa de Venda --
    Marina->>FE: 1. Acessa portfólio e seleciona token para vender
    FE->>GW: 2. Solicita sugestão de preço justo
    GW->>Marketplace: 3. Calcula preço justo (baseado no risco/tempo)
    Marketplace-->>GW: 4. Retorna sugestão
    GW-->>FE: 5. Exibe sugestão para Marina

    Marina->>FE: 6. Define o preço de venda e clica em "Ofertar"
    FE->>GW: 7. Envia ordem de venda
    GW->>Marketplace: 8. Lista o token no mercado secundário
    GW->>Carteira: 9. Marca o token de Marina como "Ofertado" (bloqueado para outras ações)

    Note over Carlos, FE: -- Etapa de Compra --
    Carlos->>FE: 10. Navega no mercado secundário e vê a oferta de Marina
    Carlos->>FE: 11. Clica em "Comprar"
    FE->>GW: 12. Envia ordem de compra

    GW->>Carteira: 13. Verifica se Carlos tem saldo em USDC suficiente
    alt Saldo Suficiente
        Carteira-->>GW: 14. Saldo OK. Inicia transação atômica.
        
        activate Carteira
        Carteira->>Carteira: 15. Debita USDC da carteira de Carlos
        Carteira->>Carteira: 16. Credita USDC na carteira de Marina
        Carteira->>Carteira: 17. Transfere propriedade do Token de Crédito de Marina para Carlos
        deactivate Carteira

        Carteira-->>GW: 18. Confirma que a troca foi concluída
        GW->>Marketplace: 19. Remove a oferta do mercado
        GW-->>FE: 20. Confirma a compra para Carlos
        FE-->>Carlos: 21. Exibe "Compra realizada com sucesso!"
        
        Note right of GW: Notificações são enviadas para Marina e Carlos em background
    else Saldo Insuficiente
        Carteira-->>GW: 14b. Saldo insuficiente
        GW-->>FE: 15b. Informa erro
        FE-->>Carlos: 16b. Exibe "Saldo insuficiente para realizar a compra."
    end

  ```
</Details>

## Fluxo de Saque de Fundos (Off-Ramp)

<p style={{textAlign: 'center'}}> Fluxo de Saque de Fundos</p>
  <div style={{margin: 15}}>
    <div style={{textAlign: 'center'}}>
          <img src={require("../../static/img/fluxo_saque_fundos.png").default} style={{width: 800}} alt="Fluxo de Solicitação e Aprovação de Crédito" />
          <br/>
      </div>
  </div>
<p style={{textAlign: 'center'}}> Fonte: Produzido pelos autores (2025).</p>

&emsp;Este fluxo mostra os dois caminhos que um investidor pode seguir para retirar seu saldo em USDC da plataforma: convertendo para Reais (BRL) e recebendo via Pix, ou transferindo diretamente para uma carteira de criptomoedas externa.

> Nota: Para melhor visualização:

> https://www.canva.com/design/DAG0UzRCy5Q/w-yq85d-KYoxx_jXFQzDFA/edit?ui=e30 

<Details>
  <summary>Murmaid Fluxo de Venda no Mercado Secundário</summary>

  ```murmaid
  sequenceDiagram
    participant Investidor as Investidor(a) (Browser)
    participant FE as Frontend
    participant GW as API Gateway
    participant Contas as Serviço de Contas
    participant Carteira as Serviço de Carteira Digital
    participant Pagamentos as Gateway de Pagamento

    Investidor->>FE: 1. Solicita saque e escolhe o método

    alt Método: Saque para Conta Bancária (Pix)
        Investidor->>FE: 2a. Informa valor do saque em USDC
        FE->>GW: 3a. Inicia saque para BRL
        
        GW->>Contas: 4a. Busca dados da conta bancária (mesma titularidade)
        Contas-->>GW: 5a. Retorna dados bancários
        
        GW->>Carteira: 6a. Solicita bloqueio do saldo em USDC
        Carteira-->>GW: 7a. Saldo verificado e bloqueado
        
        GW->>Pagamentos: 8a. Requisita conversão USDC -> BRL e envio de Pix
        Pagamentos-->>GW: 9a. Confirma recebimento da ordem de saque
        
        Note right of Pagamentos: Processo de conversão e PIX leva alguns minutos...
        
        Pagamentos-->>GW: 10a. Webhook: Transferência Pix concluída!
        GW->>Carteira: 11a. Debita o saldo em USDC que estava bloqueado
        GW->>Serviço de Notificações: 12a. Envia notificação de sucesso
    end

    alt Método: Saque para Carteira Cripto
        Investidor->>FE: 2b. Informa valor do saque e endereço da carteira externa
        FE->>GW: 3b. Inicia saque de cripto
        
        GW->>Carteira: 4b. Solicita transação de saque para endereço externo
        
        activate Carteira
        Carteira->>Carteira: 5b. Verifica saldo e bloqueia valor
        Carteira->>Carteira: 6b. Constrói e assina a transação (com chaves seguras)
        Carteira->>Blockchain: 7b. Transmite a transação para a rede (ex: Polygon)
        deactivate Carteira
        
        Note right of Blockchain: Transação sendo confirmada na rede...
        
        Blockchain-->>Carteira: 8b. Evento: Transação confirmada!
        Carteira->>Carteira: 9b. Debita o saldo que estava bloqueado
        Carteira->>Serviço de Notificações: 10b. Envia notificação de sucesso
    end

  ```
</Details>

## Fluxo de Gestão de Inadimplência

&emsp;Este é um fluxo de sistema, que não é iniciado diretamente por um usuário. Ele descreve o processo automático que a plataforma executa diariamente para identificar parcelas em atraso, aplicar as devidas penalidades e notificar todas as partes envolvidas, garantindo a gestão de risco do portfólio.

<p style={{textAlign: 'center'}}> Fluxo de Gestão de Inadimplência</p>
  <div style={{margin: 15}}>
    <div style={{textAlign: 'center'}}>
          <img src={require("../../static/img/fluxo_inadimplencia.png").default} style={{width: 800}} alt="Fluxo de Solicitação e Aprovação de Crédito" />
          <br/>
      </div>
  </div>
<p style={{textAlign: 'center'}}> Fonte: Produzido pelos autores (2025).</p>

> Nota: Para melhor visualização:

> https://www.canva.com/design/DAG0UzRCy5Q/w-yq85d-KYoxx_jXFQzDFA/edit?ui=e30 

<Details>
  <summary>Murmaid Fluxo de Gestão de Inadimplência</summary>

  ```murmaid

sequenceDiagram
    participant Scheduler as Agendador (Cron Job)
    participant Contratos as Serviço de Contratos
    participant Notificacoes as Serviço de Notificações
    participant Backoffice as Interface do Admin

    Scheduler->>Contratos: 1. Gatilho diário: "Verificar parcelas vencidas"
    
    activate Contratos
    Contratos->>Contratos: 2. Busca no DB por parcelas com data_vencimento < hoje E status != "Paga"
    
    loop Para cada Parcela em Atraso encontrada
        Contratos->>Contratos: 3. Atualiza status da parcela para "Em Atraso"
        Contratos->>Contratos: 4. Calcula multa (2%) e juros de mora (1%/mês)
        Contratos->>Contratos: 5. Salva o novo valor atualizado da parcela
        
        Contratos->>Notificacoes: 6. Envia notificação de atraso para o Agricultor
        Contratos->>Notificacoes: 7. Envia notificação de inadimplência para os Investidores daquela CPR
        
        Contratos->>Backoffice: 8. Cria um alerta no painel de risco do administrador
    end
    deactivate Contratos
  ```
</Details>
