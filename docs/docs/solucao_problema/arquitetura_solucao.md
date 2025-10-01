---
sidebar_position: 3
title: Arquitetura da Solução
---

## Introdução

&emsp; Para documentar e comunicar a arquitetura do Peerseed de forma eficaz, adotamos o Modelo C4. Este modelo não é uma nova forma de projetar software, mas sim uma maneira de visualizar e descrever uma arquitetura existente ou proposta em diferentes níveis de abstração.

&emsp; A principal vantagem do C4 é que ele oferece a "quantidade certa de detalhes para a audiência certa". Podemos pensar nele como o Google Maps para a nossa arquitetura:

**Nível 1 (Contexto): A visão do mundo.**

**Nível 2 (Contêineres): A visão do país ou da cidade.**

**Nível 3 (Componentes): A visão de um bairro ou de uma rua.**

**Nível 4 (Código): A visão de uma casa específica (geralmente coberto por diagramas de classe UML ou o próprio código).**

Para o nosso projeto, detalhamos os três primeiros níveis, que fornecem uma compreensão completa da estrutura e do funcionamento do Peerseed.



## Nível 1: Contexto do Sistema (A Visão do Helicóptero)
&emsp; O primeiro diagrama estabelece o cenário geral, mostrando como o nosso sistema se encaixa no mundo. Ele responde à pergunta: "O que é o sistema Peerseed, quem o utiliza e com quais outros sistemas ele interage?".

<p style={{textAlign: 'center'}}> Arquitetura Nível C1</p>
<div style={{margin: 15}}>
  <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/arquiteturaC1.png").default} style={{width: 800}} alt="Fluxo de Solicitação e Aprovação de Crédito" />
        <br/>
    </div>
</div>
<p style={{textAlign: 'center'}}> Fonte: Produzido pelos autores (2025).</p>

>Para Melhor visualização [clique aqui](https://www.canva.com/design/DAG0SgLAcT8/hKnnOkM1vyxHNdrywB5QxA/edit?utm_content=DAG0SgLAcT8&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

**Os Atores:** Três atores principais interagem com o sistema:

    - Agricultor(a): O tomador de crédito que busca financiamento de forma ágil e justa.

    - Investidor(a): A pessoa física que oferece capital em busca de rentabilidade e impacto.

    - Admin: O operador da plataforma, responsável pela gestão, suporte e validação manual de processos.


**O Sistema PeerSeeD:** No coração do diagrama está o Sistema Central, nossa plataforma de crédito P2P para o agronegócio.


**Os Sistemas Externos:** O Peerseed não opera isoladamente. Ele depende de integrações críticas com sistemas externos para funcionar, incluindo:

 - Autoridade Certificadora (ICP-Brasil): Para a assinatura digital e validação jurídica da Cédula de Produtor Rural (CPR).

- Gateway de Pagamento: Para processar o fluxo financeiro (on/off-ramp) entre Reais (BRL) e a stablecoin (USDC).

- Registradora de CPR: Para registrar oficialmente os contratos de crédito, conferindo-lhes validade legal.

- Governo e Bureaus de Crédito: Para consultar dados externos que alimentam nosso motor de análise de risco.

Este diagrama é fundamental para que qualquer pessoa, técnica ou não, entenda o propósito e as fronteiras do nosso projeto.

## Nível 2: Contêineres (A Estrutura da Solução)

&emsp; Dando um zoom no "Sistema Peerseed", o diagrama de contêineres expõe a arquitetura de alto nível da aplicação. Ele responde à pergunta: "Quais são os principais blocos de construção do sistema e como eles se comunicam?".

>Para Melhor visualização [clique aqui](https://www.canva.com/design/DAG0SgLAcT8/hKnnOkM1vyxHNdrywB5QxA/edit?utm_content=DAG0SgLAcT8&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

<p style={{textAlign: 'center'}}> Arquitetura Nível C2</p>
<div style={{margin: 15}}>
  <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/arquiteturaC2.png").default} style={{width: 800}} alt="Fluxo de Solicitação e Aprovação de Crédito" />
        <br/>
    </div>
</div>
<p style={{textAlign: 'center'}}> Fonte: Produzido pelos autores (2025).</p>

> Nota: "Contêiner" aqui é um termo do C4 para um bloco de construção executável ou um armazenamento de dados, não necessariamente um contêiner Docker.

A arquitetura do Peerseed é dividida em quatro camadas principais:

**Aplicação Web (Frontend):** A porta de entrada para nossos usuários. É uma série de páginas web/mobile que proporciona uma experiência de usuário fluida e responsiva para Agricultores e Investidores.

**Serviços de Backend (Microsserviços):** O cérebro da plataforma. Adotamos uma arquitetura de microsserviços para garantir escalabilidade, modularidade e manutenibilidade. Cada serviço tem uma responsabilidade única e bem definida, como:

- **Serviço de Contas:** Gerencia identidade e autenticação.

- **Serviço de Análise de Crédito:** Orquestra o cálculo do AgroScore.

- **Serviço de Marketplace:** Gerencia as oportunidades de investimento.

- **Serviço de Carteira Digital:** Controla os saldos e transações.

- **Serviço de Contratos:** Gerencia o ciclo de vida da CPR.

- **Serviço de Notificações:** Centraliza o envio de comunicações.

**Armazenamento:** Utilizamos diferentes tecnologias de armazenamento para diferentes necessidades, uma abordagem conhecida como "persistência poliglota":

  - **Database SQL:** Para dados transacionais e estruturados que exigem consistência.

  - **Database NoSQL:** Para dados semi-estruturados, como documentos de usuários e logs de auditoria.

  - **Cache:** Para dados voláteis e de acesso rápido, melhorando a performance.

  - **Ledger Blockchain:** Para garantir a imutabilidade e transparência das transações de investimento (tokens).

  - **Logs:** Para centralizar os logs de todos os serviços, garantindo a observabilidade.

  Este diagrama mostra a decomposição lógica e tecnológica da nossa solução, servindo como o mapa principal para a equipe de desenvolvimento.

---
## Nível 3: Componentes (O Interior dos Microsserviços)

&emsp; No nível mais profundo de detalhe, damos um zoom nos nossos contêineres (microsserviços) mais críticos para expor seus Componentes internos. Estes diagramas respondem à pergunta: "Como cada serviço é projetado por dentro e como ele cumpre sua responsabilidade?".

&emsp; Este nível é o mapa que guia o desenvolvedor na organização do código e na implementação das funcionalidades de um serviço específico. A seguir, detalhamos os componentes de seis dos nossos serviços mais importantes.

### Serviço Contas

&emsp; Este serviço é a fundação da identidade e segurança do usuário na plataforma. Ele é a fonte da verdade para todos os dados cadastrais e de autenticação. Seus componentes internos são divididos por responsabilidade:

`Gerenciador de Autenticação`: lida com a segurança do acesso (login, senhas, 2FA).

`Gerenciador de Perfil`: permite a gestão dos dados cadastrais do usuário.

`Gerenciador de Onboarding/KYC`: orquestra o processo de verificação de identidade. Para comunicações essenciais, como o envio de e-mails de boas-vindas ou de redefinição de senha, ele utiliza um `Integrador de Notificações.`

<p style={{textAlign: 'center'}}> Serviço Contas</p>
<div style={{margin: 15}}>
  <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/servico_contas.png").default} style={{width: 800}} alt="Fluxo de Solicitação e Aprovação de Crédito" />
        <br/>
    </div>
</div>
<p style={{textAlign: 'center'}}> Fonte: Produzido pelos autores (2025).</p>


### Serviço Análise de Crédito

&emsp; Este serviço orquestra o complexo processo de análise de risco. Seus componentes internos incluem:

`API Controller` como porta de entrada.

`Coordenador de Análise` para gerenciar o fluxo.

`Integradores` para se comunicar com sistemas externos (Bureaus e Backoffice).

`Motor de Score (ML)` que contém a lógica de cálculo.

`Repositório` para persistir os dados da análise.

<p style={{textAlign: 'center'}}> Serviço Analise Credito</p>
<div style={{margin: 15}}>
  <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/servico_analise_credito.png").default} style={{width: 800}} alt="Fluxo de Solicitação e Aprovação de Crédito" />
        <br/>
    </div>
</div>
<p style={{textAlign: 'center'}}> Fonte: Produzido pelos autores (2025).</p>

### Serviço Contratos
&emsp; Focado na dimensão jurídica da plataforma, este serviço gerencia o ativo legal mais importante: a Cédula de Produtor Rural (CPR).

`Gerador de CPR`cria o documento a partir dos dados da análise de crédito.

`Coordenador de Assinatura Digital` gerencia a integração com o provedor ICP-Brasil para a coleta da assinatura do agricultor.

 Uma vez assinado, o `Coordenador de Registro de Ativos` assume, comunicando-se com a registradora oficial `(B3/CERC)` para garantir a validade e a conformidade legal do título.
<p style={{textAlign: 'center'}}> Serviço Contratos</p>
<div style={{margin: 15}}>
  <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/servico_contratos.png").default} style={{width: 800}} alt="Fluxo de Solicitação e Aprovação de Crédito" />
        <br/>
    </div>
</div>
<p style={{textAlign: 'center'}}> Fonte: Produzido pelos autores (2025).</p>

### Serviço Carteira Digital

&emsp; Este serviço é o cofre digital da plataforma, atuando como um serviço de custódia completo e seguro. Sua responsabilidade é gerenciar todos os ativos financeiros dos usuários. Seus componentes incluem:

`API Controller` como interface.

`Gerenciador de Carteira` para a lógica de negócio (saldos, transferências).

`Repositório de Ledger` para registrar todas as transações de forma imutável.

Para operações com criptomoedas, ele conta com um `Monitor de Blockchain` para detectar depósitos e um `Transmissor de Transação` para processar saques, que por sua vez interage com o componente mais crítico e isolado, o Gerenciador de Chaves (HSM), o único responsável por assinar transações e garantir a segurança dos fundos.

<p style={{textAlign: 'center'}}> Serviço Carteira Digital</p>
<div style={{margin: 15}}>
  <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/servico_carteira_digital.png").default} style={{width: 800}} alt="Fluxo de Solicitação e Aprovação de Crédito" />
        <br/>
    </div>
</div>
<p style={{textAlign: 'center'}}> Fonte: Produzido pelos autores (2025).</p>

### Serviço Marketplace

&emsp; Atuando como a vitrine e o ambiente de negociação do Peerseed, este serviço gerencia o ciclo de vida completo das oportunidades de investimento. É composto por:

`API Controller` para a interação com o frontend e por dois componentes lógicos principais
  - `Gerenciador de Ofertas Primárias`: que cuida da listagem e captação das novas CPRs.
  
  - `Gerenciador de Ofertas Secundárias`: que habilita a negociação P2P entre investidores.
  
  Para garantir a integridade financeira das operações, o `Coordenador de Transações` orquestra a comunicação com o **Serviço de Carteira Digital**, assegurando que as transferências de fundos e ativos ocorram de forma atômica e segura.

<p style={{textAlign: 'center'}}> Serviço Marketplace</p>
<div style={{margin: 15}}>
  <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/servico_marketplace.png").default} style={{width: 800}} alt="Fluxo de Solicitação e Aprovação de Crédito" />
        <br/>
    </div>
</div>
<p style={{textAlign: 'center'}}> Fonte: Produzido pelos autores (2025).</p>

### Serviço Notificações

&emsp; Projetado para ser o centro de comunicação da plataforma, este serviço funciona de forma desacoplada e assíncrona.Sua principal porta de entrada é um `Message Consumer`, que escuta eventos de outros serviços (ex: UsuarioCadastrado, PagamentoRecebido) publicados em um Message Broker.

 Ao receber um evento, o `Gerenciador de Templates` popula a mensagem apropriada, e o `Orquestrador de Canais` decide como enviá-la _(Email, Push Notification, SMS)_ com base nas preferências do usuário, utilizando Gateways específicos para cada canal de comunicação. Essa arquitetura garante que o sistema de notificações seja resiliente e não atrase as operações principais da plataforma.

<p style={{textAlign: 'center'}}> Serviço Notificações</p>
<div style={{margin: 15}}>
  <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/servico_notificacoes.png").default} style={{width: 800}} alt="Fluxo de Solicitação e Aprovação de Crédito" />
        <br/>
    </div>
</div>
<p style={{textAlign: 'center'}}> Fonte: Produzido pelos autores (2025).</p>
