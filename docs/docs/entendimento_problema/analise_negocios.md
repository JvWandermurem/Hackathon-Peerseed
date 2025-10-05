---
sidebar_position: 2
title: Análise de Negócio
---

## Resumo Executivo
&emsp;O **Reevo** é uma **plataforma de crédito agrícola digital**, que atua no **modelo Peer-to-Peer (P2P) tokenizado**. Ele se destina primariamente a **Pequenos e Médios Produtores Rurais(PMEs)** - um público majoritariamente excluído do crédito formal - em busca de financiamento ágil e justo, e a **Investidores Pessoas Físicas** que buscam diversificação de seu portfólio de investimento. A plataforma busca promover a **democratização do acesso ao crédito**, eliminando a burocracia bancária através da análise automatizada e da formalização digital da Cédula de Produto Rural (CPR), enquanto oferece liquidez e transparência ao capital investido. 

---

## Contexto
&emsp;O cenário atual do mercado de crédito agrícola é marcado por uma profunda disparidade no acesso a financiamento. Embora o agronegócio represente uma locomotiva econômica, os Pequenos e Médios Produtores Rurais enfrentam problemas para ter acesso a esse recurso por conta da burocracia bancária, exigência excessiva de garantias e taxas inadequadas ao seu ciclo de safra, resultando em uma enorme parcela de crédito reprimido. 

&emsp;Embora atraente em termos de rentabilidade, esse setor carece de transparência e liquidez. Investidores buscam ativos que ofereçam rastreabilidade do uso do capital e dados claros sobre o risco e o impacto social/ambiental do empreendimento, algo que as modalidades de investimento tradicionais em títulos do agronegócio (como LCA/CRA) não conseguem prover com granularidade.

&emsp;Essa lacuna na eficiência e transparência justifica a ascensão de novas soluções fintech e agritech. A tendência é a desintermediação por meio de plataformas digitais, com destaque para o modelo peer-to-peer (P2P), que conecta diretamente a oferta e a demanda de capital. Essa inovação permite que investidores financiem operações específicas no campo, eliminando a margem da instituição bancária e direcionando os recursos de forma mais eficiente.


---

## Análise de Stakeholders
### Mapeamento, Expectativas e Resistências

&emsp;A tabela abaixo detalha os principais grupos de interesse e como o Reevo deve gerenciar suas interações.

| Stakeholder | Expectativas em Relação à Solução | Possíveis Resistências / Preocupações |
| :--- | :--- | :--- |
| **1. Clientes Finais** | | |
| **Agricultor PME** | **Crédito Rápido e Justo:** Processo de aprovação rápida e taxas alinhadas ao seu risco real (**AgroScore**). **Flexibilidade** para pagar de acordo com o ciclo de safra. | **Complexidade Digital:** Dificuldade em usar a plataforma (apesar de ser simples). **Custo Efetivo Total (CET):** Preocupação com a soma das Taxas de Originação (RF-TAX-001) e IOF. |
| **Investidor PF/Institucional** | **Segurança e Transparência:** na rastreabilidade do investimento. **Liquidez:** Capacidade de sair do investimento antes do vencimento. **Retorno Líquido:** Rendimentos superiores à renda fixa, com impostos retidos na fonte. | **Risco de Inadimplência** Preocupação com a efetividade da cobrança e a real qualidade dos ativos. **Risco Regulatório/Tecnológico:** Dúvidas sobre a validade legal da CPR digital e da *stablecoin*. |
| **2. Parceiros Estratégicos** | | |
| **Gateways de Pagamento / Conversão (Pix/USDC)** | **Alto Volume Transacional:** Geração de *fees* a partir do On/Off-Ramp (RF-INV-001/004) e dos pagamentos (Pix/Boleto RF-AGR-005). **Integração Técnica:** API robusta e estável. | **Custos Operacionais Elevados:** Taxas de câmbio desfavoráveis ou *fees* de Pix/Boleto que reduzem a margem. **Risco de Fraude:** Alto volume de Pix exigindo sistemas antifraude rigorosos. |
| **Serviços de Assinatura Digital (ICP-Brasil)** | **Volume de Formalização:** Alto número de emissões da CPR e documentos de garantia (RF-AGR-003). | **Conformidade Legal:** Exigência de que o processo de validação biométrica e assinatura siga rigorosamente o padrão ICP-Brasil e a legislação da CPR. |
| **Fornecedores** | | |
| **Provedores de Dados (APIs Públicas/Privadas)** | **Demanda Contínua:** Utilização constante para o **AgroScore** (CAR, dados fundiários, fiscais). **Qualidade da Informação:** Dados precisos e atualizados para mitigar o risco. | **Custo por Consulta:** O volume de consultas necessárias para o AgroScore e validação pode elevar os custos variáveis da plataforma. **Disponibilidade:** Falhas ou lentidão na API impactam diretamente o RF-AGR-002 (análise em 60 segundos). |
| **Serviços de Auditoria/Blockchain** | **Volume de Registros:** Garantia de que todas as transações financeiras e a emissão das CPRs sejam registradas corretamente (RF-SEC-002 - Log de Auditoria). | **Custo do Registro:** Custos variáveis para registrar cada CPR e transação financeira na rede de *blockchain*. **Segurança do Código:** Vulnerabilidades nos *Smart Contracts*. |
| **Reguladores / Órgãos de Interesse** | | |
| **Banco Central do Brasil (BACEN)** | **Conformidade Legal:** Adequação às regras do *Fundo Garantidor de Crédito* e às normativas sobre *fintechs* P2P. **Prevenção à Lavagem de Dinheiro (PLD/KYC):** Rigor no cadastro e verificação de identidade (RF-CAD-001). | **Risco Sistêmico:** Crescimento muito rápido que possa afetar o mercado de crédito rural tradicional. **Clareza Fiscal:** Dúvidas sobre o tratamento da **tokenização** da CPR. |
| **Receita Federal / Órgãos Fiscais** | **Conformidade Tributária:** Cálculo e retenção corretos do **IOF e Imposto de Renda** sobre as operações (RF-TAX-002). **Transparência:** Acesso a Informes de Rendimentos (RF-TAX-003) e relatórios de transações. | **Obrigações Acessórias:** Falha no reporte correto dos volumes transacionados e na retenção de impostos na fonte. |
| **Investidores Potenciais (VCs, Fundos de Impacto)** | | |
| **Fundos de Impacto / ESG** | **Retorno Financeiro e Social:** Prova de que o modelo apoia a **inclusão financeira** (Jornada de Sérgio) e que os **Relatórios de Impacto** são auditáveis. | **Métricas de Impacto:** Falha em comprovar o impacto *adicional* (além do retorno financeiro). **Gestão de Risco:** Incerteza sobre a escalabilidade do modelo sem aumentar o *default rate*. |
| **Venture Capital (VCs) Tradicionais** | **Escalabilidade (GMV):** Prova de que o modelo P2P pode escalar rapidamente no vasto mercado do agronegócio. **Unit Economics:** Margens de lucro atrativas após os custos de **Inadimplência** e **Tecnologia**. | **Barreira Legal:** Dificuldade de registro e validação da CPR em diferentes jurisdições cartorárias. **Concorrência:** Potenciais grandes *players* do agronegócio que lançam soluções internas. |


---

## Riscos e Mitigações
### Riscos e Mitigações do Projeto Reevo

&emsp;O Reevo, por ser uma plataforma inovadora de crédito P2P e tokenização no agronegócio, está sujeito a riscos financeiros, tecnológicos, de mercado e regulatórios. A tabela abaixo detalha os principais riscos e as estratégias de mitigação integradas aos Requisitos Funcionais (RFs) do projeto.

---

| Categoria | Risco | Estratégia de Mitigação |
| :--- | :--- | :--- |
| **Financeiros** | **Inadimplência Elevada (Default Rate)**: O risco de os Agricultores PMEs não pagarem os empréstimos, afetando a rentabilidade dos Investidores e a confiança na plataforma. | **Análise de Risco Multifatorial (AgroScore - RF-AGR-002):** Implementação de um score preditivo que cruza dados ambientais e fiscais para precificar o risco de forma precisa. **Gestão de Atrasos (RF-AGR-006):** Aplicação automática de multas, juros de mora e bloqueio de novas solicitações em caso de atraso, com painel para renegociações manuais. |
| **Financeiros** | **Risco de Fluxo de Caixa / Capital Inicial**: Falha em captar volume de recursos suficiente dos Investidores para atender a demanda de crédito dos Agricultores. | **Modelo de Receita Múltipla (RF-TAX-001):** Sustentabilidade financeira baseada em duas taxas (Originação e Performance). **Mercado Secundário (RF-INV-003):** Aumento da atratividade para Investidores ao oferecer liquidez, garantindo um *pipeline* contínuo de capital. |
| **Técnicos** | **Vulnerabilidades nos Contratos Inteligentes**: Erros no código do *Smart Contract* podem levar à alocação incorreta de fundos ou falhas na distribuição automática de pagamentos (RF-INV-005). | **Auditoria e Testes Rigorosos**: Realização de **auditoria de segurança** por terceiros especializados antes do *deployment* e testes extensivos de estresse e *edge cases* em ambiente de *sandbox*. |
| **Técnicos** | **Cibersegurança e Vazamento de Dados Pessoais**: Exposição de dados sensíveis (identidade, AgroScore, dados fiscais) armazenados na plataforma. | **Segurança e Conformidade (RF-SEC-002):** Criptografia de ponta a ponta, **Log de Auditoria Abrangente** para todas as ações sensíveis e **Gestão Rigorosa de Sessão** (RF-SEC-001, expiração em 30 min). |
| **Adoção/Usuários** | **Baixa Adoção do Agricultor**: Produtores evitam a plataforma por desconfiança em relação ao digital ou preferência por canais tradicionais. | **Foco na Usabilidade e Educação (Jornada de Sérgio):** Interface **simples, guiada** e acessível via smartphone. **Módulo de Suporte (RF-SUP-001):** Chatbot integrado e atendimento escalonado para resolver dúvidas rapidamente e construir confiança. |
| **Adoção/Usuários** | **Falta de Engajamento do Investidor**: Investidores não encontram oportunidades suficientes ou têm baixa confiança na liquidez do Mercado Secundário. | **Transparência e Impacto (RF-INV-007):** Uso dos **Relatórios de Impacto** como diferencial de atração. **Melhoria Contínua do Mercado Secundário:** Garantir a funcionalidade para que a Marina possa **vender a cota** de forma eficiente, comprovando a liquidez. |
| **Adoção/Usuários** | **Risco de Validação Manual (Backoffice):** Atrasos no processo de validação manual (RF-ADM-001) devido a falhas de OCR ou documentos ilegíveis, frustrando a expectativa de rapidez do usuário. | **Definição de SLA:** Estabelecer um **SLA** (Acordo de Nível de Serviço) rigoroso para a validação manual. **Tecnologia de OCR Otimizada:** Investir em ferramentas de OCR mais precisas para reduzir o volume de documentos que chegam à fila manual. |
| **Legais/Regulatórios** | **Não Conformidade com a Lei da CPR Digital**: Rejeição da CPR digital por Cartórios de Registro ou outros *stakeholders* pela falta de conformidade legal. | **Padrão ICP-Brasil Obrigatório (RF-AGR-003):** Utilização estrita da **Assinatura Digital qualificada (ICP-Brasil)**, que garante plena validade jurídica ao documento, conforme legislação. |
| **Legais/Regulatórios** | **Alterações na Regulamentação de Fintechs P2P**: Novas regras do BACEN que restrinjam a operação de P2P, ou a forma como a receita é contabilizada. | **Consultoria Jurídica Contínua:** Manter uma assessoria jurídica especializada em *fintech* e agronegócio para monitorar e adaptar os **Parâmetros da Plataforma (RF-ADM-004)** e as taxas (RF-TAX) imediatamente. |
| **Legais/Regulatórios** | **Violação da LGPD**: Exposição ou tratamento inadequado dos dados pessoais do Agricultor (Sérgio) e do Investidor (Marina). | **Gestão de Dados e Perfil (RF-USR-004):** Garantir o direito de exclusão de conta e o tratamento de dados de acordo com a LGPD. **Criptografia** e o **Log de Auditoria Abrangente** (RF-SEC-002). |
---



