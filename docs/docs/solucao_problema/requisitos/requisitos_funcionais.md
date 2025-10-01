---
sidebar_position: 1
title: Requisitos Funcionais
---

## Contextualização  

Um **Requisito Funcional (RF)** descreve **o que o sistema deve fazer** para atender às necessidades dos usuários e atingir os objetivos do projeto. Ele define funcionalidades específicas, ações esperadas e o contexto em que devem ocorrer.  

Requisitos funcionais bem escritos e definidos:
- **Guiam o desenvolvimento** e ajudam na priorização.
- **Facilitam a validação** do que foi entregue.
- **Reduzem ambiguidades** nos objetivos.

---

## Módulo 1: Contas e Autenticação (RF-CAD)

### RF-CAD-001: Criação de Conta Unificada
O novo usuário deve poder criar uma conta única na plataforma para ter acesso ao ecossistema, considerando que:
- O formulário inicial solicitará Nome Completo, E-mail, criação de Senha (com regras de força[mín. 8 caracteres, 1 maiúscula, 1 número, 1 caractere especial]), Data de Nascimento e Número de Celular.
- O usuário deverá selecionar seu perfil principal: "Sou Agricultor" ou "Sou Investidor".
- A validação do cadastro exigirá a verificação do e-mail (via link) ou do celular (via código OTP).
- O processo incluirá uma etapa de verificação de identidade com envio de foto do rosto (selfie).

### RF-CAD-002: Autenticação de Usuário
O usuário cadastrado deve poder autenticar-se na plataforma para acessar seu painel de controle, considerando que:
- O método principal de login será E-mail e Senha.
- A plataforma oferecerá um método de login social opcional (Login com Google).

### RF-CAD-003: Gestão de Segurança (2FA)
O usuário logado deve poder ativar ou desativar a autenticação de dois fatores (2FA) para aumentar a segurança de sua conta, considerando que:
- A opção estará disponível na seção "Segurança" do perfil do usuário.
- Quando ativo, o 2FA solicitará um código OTP (via SMS) após a inserção correta de e-mail e senha.

---

## Módulo 2: Tomador de Crédito (Fluxo do João) (RF-AGR)

### RF-AGR-001: Solicitação de Crédito Guiada
O agricultor (João) deve poder preencher um formulário e enviar documentos para solicitar uma nova análise de crédito, considerando que:
- Os documentos obrigatórios são: Documento de Identidade (CNH/RG), Comprovante de Residência, CAR (Cadastro Ambiental Rural) e Notas Fiscais de Vendas do último ciclo(opcional, mas impactam no score).
- O upload de arquivos deve suportar os formatos PDF, JPG, PNG, com tamanho máximo de 10MB por arquivo.

### RF-AGR-002: Análise de Crédito Automatizada
O sistema deve poder processar os dados do agricultor para gerar um Score de Crédito para avaliar o risco da operação de forma ágil, considerando que:
- A análise deve ser concluída e o resultado apresentado em até 60 segundos para 95% dos casos.
- O Score será exibido de forma numérica (0–1000) e classificado nas faixas iniciais (default):
  - A = 800–1000
  - B = 700–799
  - C = 600–699
  - D = 500–599
  - E = < 500
- O Score será atualizado automaticamente sempre que um novo documento relevante for anexado ou atualizado pelo agricultor.

### RF-AGR-003: Geração e Assinatura da CPR
O agricultor (João) deve poder gerar e assinar a Cédula de Produtor Rural (CPR) digitalmente para formalizar a garantia do empréstimo, considerando que:
- O sistema deve preencher automaticamente a CPR com os dados da operação enviados pelo joão.
- A assinatura será realizada por meio de um serviço integrado que suporte Assinatura Digital qualificada (padrão ICP-Brasil) e validação biométrica (facial).
- A CPR só será enviada para registro após a assinatura.

### RF-AGR-004: Acompanhamento e Gestão da Captação
O agricultor (João) deve poder acompanhar o status de sua captação e tomar decisões para gerenciar sua solicitação, considerando que:
- O painel deve mostrar o percentual financiado, atualizado em tempo real (via websocket ou polling a cada 30 segundos).
- Caso o prazo de captação termine sem atingir 100%, o agricultor terá as opções de: 
  - receber o valor parcial; 
  - estender o prazo; 
  - cancelar.
- Uma solicitação ativa não pode ser editada; o agricultor deverá cancelá-la e criar uma nova se desejar alterar valores ou prazos.a taxa de juros segue proporcional.

### RF-AGR-005: Pagamento de juros e empréstimo
- Agricultor deve poder pagar via Pix, Boleto ou débito automático.
- O sistema deve gerar os boletos com código de barras + QR Code Pix.
- Os pagamentos precisam ser conciliados automaticamente e repassados para os investidores (menos taxas e impostos).
- A conciliação do pagamento deve ser processada em até D+1 e registrada no painel do agricultor.

### RF-AGR-006: Gestão de Atrasos e Inadimplência
O sistema deve poder gerenciar automaticamente situações de atraso de pagamento do agricultor para reduzir risco da operação, considerando que:
- Atrasos de 1 dia (D+1) devem gerar notificação automática ao agricultor e aos investidores.
- Multa de 2% e juros de mora de 1% ao mês devem ser aplicados sobre parcelas vencidas.
- Agricultores com atraso superior a 30 dias não poderão criar novas solicitações de crédito até a regularização.
- O painel do administrador deve permitir registrar renegociações manuais do contrato.

---

## Módulo 3: Investidor (Fluxo da Mariana) (RF-INV)

### RF-INV-001: On-Ramp de Capital (BRL para Stablecoin)
A investidora (Mariana) deve poder depositar Reais (BRL) na plataforma para ter saldo para investir, considerando que:
- O depósito será realizado via Pix ou wallet
- O sistema, através de um gateway de pagamentos parceiro, converterá o valor em BRL para uma stablecoin baseada em Dólar (USDC) e creditará o saldo na carteira interna da usuária.
- A Taxa de Originação cobrada do agricultor, definida em RF-TAX-001, contempla todos os custos operacionais da transação, incluindo a taxa de conversão BRL/USDC do on-ramp.
- A taxa de câmbio BRL/USDC e a taxa de conversão serão exibidas de forma transparente antes da confirmação do depósito.

### RF-INV-002: Investimento em Oportunidades
A investidora (Mariana) deve poder usar seu saldo em stablecoin (USDC) para investir em uma oportunidade para financiar um agricultor, considerando que:
- O valor mínimo de investimento por oportunidade é de R$ 100,00 (convertido para USDC no momento da transação).
- Ao tentar alocar mais de 40% de seu portfólio total em um único ativo, o sistema deve exibir um pop-up de alerta solicitando a confirmação via digitação da frase "EU ENTENDO O RISCO".

### RF-INV-003: Mercado Secundário (Venda de Tokens)
A investidora (Mariana) deve poder ofertar seus tokens de investimento para outros investidores para ter liquidez antes do vencimento do contrato, considerando que:
- A negociação será realizada exclusivamente dentro da plataforma, trocando Tokens de Crédito por USDC.
- A plataforma calculará e sugerirá um "preço justo" para o token, baseado no tempo restante e no risco atual do ativo, mas a investidora terá autonomia para definir seu preço de venda.
- Caso a investidora opte por vender abaixo do valor de face, a diferença será assumida pela própria vendedora (exemplo: vende por USDC 950 um token cujo valor de face é USDC 1000). O contrato do agricultor não é alterado.
- O comprador assume integralmente o crédito original, recebendo os pagamentos de acordo com o contrato inicial.

### RF-INV-004: Off-Ramp de Capital (Stablecoin para BRL)
A investidora (Mariana) deve poder sacar seu saldo em stablecoin (USDC) para sua conta bancária para realizar seus lucros em Reais (BRL), considerando que:
- A usuária solicitará o saque em USDC.
- O sistema, através de um gateway parceiro, converterá o saldo para BRL e realizará a transferência para a conta bancária cadastrada via Pix.

### RF-INV-005: Distribuição Automática dos Pagamentos
O sistema deve poder dividir automaticamente os pagamentos realizados pelos agricultores entre todos os investidores participantes, considerando que:
- A distribuição deve ser proporcional à fração de tokens que cada investidor detém na operação.
- Impostos e taxas da plataforma devem ser deduzidos antes do crédito.
- O valor líquido deve ser creditado na carteira digital do investidor em até D+1 após a liquidação do pagamento.
- Cada repasse deve gerar registro no extrato do investidor.

### RF-INV-006: Gestão de Carteira Digital
O investidor logado deve poder gerenciar seu saldo em stablecoin para acompanhar suas operações financeiras, considerando que:
- A carteira deve exibir saldo disponível, saldo bloqueado (em investimentos em andamento) e saldo em processamento (ex: depósitos ou saques pendentes).
- O histórico deve listar todas as entradas e saídas, com filtros por data e tipo (depósito, saque, investimento, rendimento, taxa).
- Antes da confirmação de um investimento, o saldo correspondente deve ser bloqueado automaticamente até a efetivação da transação.

### RF-INV-007: Relatórios de Impacto
O investidor deve poder acessar relatórios periódicos sobre o impacto social e ambiental de seus investimentos, considerando que:
- O relatório deve consolidar indicadores como: número de agricultores apoiados, hectares financiados, percentual de operações sustentáveis e famílias beneficiadas.
- O relatório deve estar disponível em PDF e atualizado mensalmente.
- O painel deve permitir tanto a visão consolidada (portfólio total) quanto detalhada (por investimento individual).

---

## Módulo 4: Backoffice e Administração (RF-ADM)

### RF-ADM-001: Painel de Validação Manual de Contas
O analista de suporte deve poder acessar uma fila de cadastros com falha na validação automática para analisar e tomar uma decisão, considerando que:
- A interface deve exibir os dados do usuário, o motivo da falha, e um visualizador comparativo (selfie vs. foto do documento).
- O analista deve ter as ações de "Aprovar Manualmente", "Reprovar" e "Solicitar Novo Envio com Instruções".
- Todas as ações realizadas pelo analista devem ser registradas em um log de auditoria.

### RF-ADM-002: Gestão de Usuários
O administrador da plataforma deve poder buscar, visualizar e gerenciar contas de usuários para prestar suporte e realizar ações administrativas, considerando que:
- As funcionalidades devem incluir: visualizar perfil completo, ver histórico de logins, suspender temporariamente uma conta e reativar uma conta suspensa.

### RF-ADM-003: Dashboard de Transações
O administrador da plataforma deve poder visualizar um painel com todas as transações financeiras para realizar a conciliação e auditoria, considerando que:
- O painel deve listar todos os depósitos, investimentos, pagamentos, saques e taxas cobradas.
- Deve ser possível filtrar as transações por data, tipo, status e usuário.

### RF-ADM-004: Gestão de Parâmetros da Plataforma
O administrador da plataforma deve poder configurar os principais parâmetros de negócio do sistema para ajustar a estratégia sem a necessidade de novo desenvolvimento, considerando que:
- Os parâmetros configuráveis devem incluir: % da Taxa de Originação, % da Taxa de Performance, valor mínimo de investimento (R$), e limites dos intervalos de Score (A-E).

---

## Módulo 5: Conformidade e Tributário (RF-TAX)

### RF-TAX-001: Aplicação das Taxas da Plataforma
O sistema deve poder calcular e aplicar as taxas da plataforma sobre as operações para gerar receita para o negócio, considerando que:
- Uma Taxa de Originação (percentual definido no painel admin) será calculada sobre o valor total do empréstimo e deduzida do valor a ser recebido pelo agricultor.
- Uma Taxa de Performance (percentual definido no painel admin) será calculada sobre os rendimentos de cada investidor e deduzida de cada parcela de juros/principal paga.

### RF-TAX-002: Retenção e Cálculo de Impostos
O sistema deve poder calcular e reter os impostos obrigatórios (IOF e IR) para cumprir as obrigações fiscais e regulatórias, considerando que:
- O IOF será calculado sobre cada empréstimo e deduzido do valor a ser recebido pelo agricultor.
- O Imposto de Renda (IR) será calculado sobre os rendimentos de cada investidor a cada pagamento recebido, aplicando a tabela regressiva, e retido diretamente na fonte.
- O investidor visualizará sempre os valores líquidos de impostos em sua conta.

### RF-TAX-003: Geração de Informes de Rendimentos
A investidora deve poder gerar seu Informe de Rendimentos anual para realizar sua declaração de Imposto de Renda, considerando que:
- O documento estará disponível para download em PDF na sua área logada, consolidando todos os rendimentos e impostos retidos no ano fiscal anterior.

---

## Módulo 6: Comunicação e Notificações (RF-COM)

### RF-COM-001: Gatilhos de Notificação para o Agricultor
O sistema deve poder enviar notificações automáticas para o agricultor para mantê-lo informado sobre eventos críticos em sua jornada, considerando que:
- Notificações devem ser disparadas para: 
  1. Confirmação de recebimento da solicitação
  2. Aprovação/Reprovação da análise de crédito
  3. Início da captação no marketplace
  4. Atingimento de marcos de captação (50%, 75%)
  5. Sucesso no financiamento
  6. Lembrete de vencimento de parcela (D-3)
  7. Confirmação de recebimento de pagamento
  8. Alerta de parcela em atraso (D+1)

### RF-COM-002: Gatilhos de Notificação para a Investidora
O sistema deve poder enviar notificações automáticas para a investidora para mantê-la informada sobre seus investimentos e conta, considerando que:
- Notificações devem ser disparadas para: 
  1. Confirmação de depósito (On-Ramp)
  2. Confirmação de investimento realizado
  3. Recebimento de pagamento de juros/principal
  4. Venda de um token no mercado secundário
  5. Confirmação de saque (Off-Ramp)
  6. Alerta sobre um ativo em seu portfólio que entrou em inadimplência

### RF-COM-003: Central de Notificações e Preferências
O usuário logado (ambos perfis) deve poder visualizar um histórico de notificações e gerenciar suas preferências para ter controle sobre como é contatado, considerando que:
- Deve existir uma área de "Notificações" na plataforma com todo o histórico.
- O usuário deve poder habilitar/desabilitar canais de notificação (E-mail, Push Notification) para diferentes categorias de alertas (ex: Transacionais, Marketing).

---

## Módulo 7: Gestão de Usuário e Perfil (RF-USR)

### RF-USR-001: Recuperação de Senha
O usuário (ambos perfis) deve poder iniciar um fluxo de recuperação de senha para recuperar o acesso à sua conta caso tenha esquecido a senha, considerando que:
- O fluxo será iniciado a partir do e-mail cadastrado.
- O sistema enviará um link de redefinição com validade de 1 hora.
- A nova senha deverá seguir as mesmas regras de força da senha de cadastro.

### RF-USR-002: Gestão de Dados Cadastrais
O usuário logado deve poder visualizar e editar seus dados cadastrais para manter suas informações atualizadas, considerando que:
- Campos como Nome e CPF, uma vez verificados, não poderão ser alterados.
- Campos como Endereço e Telefone de Contato poderão ser editados.

### RF-USR-003: Gestão de Contas Bancárias (Investidor)
A investidora (Mariana) deve poder cadastrar e validar uma ou mais contas bancárias em seu nome para realizar saques (Off-Ramp), considerando que:
- A conta deve ser da mesma titularidade (CPF) da conta da plataforma.
- A validação da conta pode ser feita via um micro-depósito de verificação.

### RF-USR-004: Encerramento de Conta
O usuário logado deve poder solicitar o encerramento de sua conta para exercer seu direito à exclusão de dados (LGPD), considerando que:
- A conta não poderá ser encerrada se houver empréstimos ativos (para o agricultor) ou investimentos não liquidados (para a investidora).
- O sistema deve informar claramente as condições e o prazo para a exclusão efetiva dos dados.

---

## Módulo 8: Painel Administrativo (Backoffice - Expansão) (RF-ADM)

### RF-ADM-002: Gestão de Usuários
O administrador da plataforma deve poder buscar, visualizar e gerenciar contas de usuários para prestar suporte e realizar ações administrativas, considerando que:
- As funcionalidades devem incluir: visualizar perfil completo, ver histórico de logins, suspender temporariamente uma conta e reativar uma conta suspensa.

### RF-ADM-003: Dashboard de Transações
O administrador da plataforma deve poder visualizar um painel com todas as transações financeiras para realizar a conciliação e auditoria, considerando que:
- O painel deve listar todos os depósitos, investimentos, pagamentos, saques e taxas cobradas.
- Deve ser possível filtrar as transações por data, tipo, status e usuário.

### RF-ADM-004: Gestão de Parâmetros da Plataforma
O administrador da plataforma deve poder configurar os principais parâmetros de negócio do sistema para ajustar a estratégia sem a necessidade de novo desenvolvimento, considerando que:
- Os parâmetros configuráveis devem incluir: % da Taxa de Originação, % da Taxa de Performance, valor mínimo de investimento (R$), e limites dos intervalos de Score (A-E).

---

## Módulo 9: Segurança e Conformidade (RF-SEC)

### RF-SEC-001: Gerenciamento de Sessão
O sistema deve poder gerenciar a sessão dos usuários logados para proteger contra acesso não autorizado, considerando que:
- A sessão deve expirar automaticamente após 30 minutos de inatividade.
- O usuário deve ser desconectado de todas as outras sessões ativas ao alterar sua senha.

### RF-SEC-002: Log de Auditoria Abrangente
O sistema deve poder registrar um log detalhado de todas as ações sensíveis para permitir a rastreabilidade e investigação de incidentes, considerando que:
- As ações a serem registradas incluem (mas não se limitam a): logins (sucesso e falha), alterações de senha, alterações de dados cadastrais, todas as transações financeiras, e todas as ações realizadas por administradores no backoffice.
- Cada log deve conter: quem (ID do usuário), o quê (ação realizada), quando (timestamp) e de onde (endereço IP).

---

## Módulo 10: Suporte ao Usuário (RF-SUP)

### RF-SUP-001: Suporte e Atendimento
O usuário logado (agricultor ou investidor) deve poder abrir chamados de suporte para resolver dúvidas ou problemas, considerando que:
- O suporte será oferecido via chatbot integrado, com escalonamento para atendimento humano.
- O usuário poderá acompanhar o status de cada chamado (aberto, em andamento, resolvido).
- O administrador poderá responder e encerrar chamados pelo painel de backoffice.
- O histórico de chamados ficará registrado no perfil do usuário.
