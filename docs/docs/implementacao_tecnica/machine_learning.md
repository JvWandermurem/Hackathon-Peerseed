---
sidebar_position: 6
title: AgroScore
---

## Visão Geral e Objetivo
&emsp; O AgroScore é o motor de análise de crédito automatizada do Reevo e um dos nossos principais diferenciais competitivos. Seu objetivo é prover uma avaliação de risco de crédito rápida, justa e baseada em dados, atendendo diretamente ao requisito `RF-AGR-002`.

&emsp; Para o agricultor Sérgio, o AgroScore significa sair da subjetividade e da lentidão dos bancos tradicionais e receber uma resposta em horas, não semanas. 

&emsp; Para a investidora Marina, o AgroScore traduz a complexidade de um perfil agrícola em uma métrica de risco clara e padronizada (de A a E), permitindo que ela tome decisões de investimento informadas e confiantes.

---
## Foco em Interpretabilidade e Performance
&emsp; A escolha do tipo de modelo para o MVP é guiada por dois fatores críticos em sistemas de crédito, a **capacidade de explicar uma decisão** e a **velocidade da predição.**

**Tipos de Modelos de Machine Learning**

| Tipo de Modelo                               | Vantagens para o Reevo                                                                                                                                     | Desvantagens                                                                                                                 |
|----------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------|
| **Modelos Clássicos** (Regressão Logística, Gradient Boosting) | - **Alta Interpretabilidade**: Permitem analisar a importância de cada variável (ex: "o histórico de crédito foi o fator mais importante"). Essencial para conformidade e feedback ao usuário.- **Alta Performance**: Rápidos para treinar e fazer predições, ideal para APIs (**RNF-ED-01**). | Podem não capturar relações não-lineares extremamente complexas nos dados.                                                   |
| **Deep Learning** (Redes Neurais)            | - **Capacidade**: Aprende padrões muito complexos e não-lineares.                                                                                             | - **Baixa Interpretabilidade** ("Caixa-Preta"), dificultando explicação de decisões (risco regulatório e de negócio). **Mais Lento**: Exige mais dados e poder computacional para treinar e predizer. |


---
## Fontes de Dados (Features)
O AgroScore é alimentado por um conjunto diversificado de dados para criar um perfil de risco 360º do agricultor.

**Categorias de Features e Fontes de Dados**

| Categoria da Feature                  | Exemplos de Dados                                                      | Fonte                                                      |
|---------------------------------------|------------------------------------------------------------------------|-------------------------------------------------------------|
| **Dados Cadastrais**                  | Idade, região, estado civil.                                           | Tabela `usuarios` (PostgreSQL).                            |
| **Dados da Propriedade**              | Hectares, cultura principal, posse da terra (própria/arrendada).       | Formulário de Solicitação (**RF-AGR-001**).                |
| **Dados Históricos de Produção**      | Faturamento do último ciclo (baseado em Notas Fiscais).                | Upload de Documentos (**RF-AGR-001**).                     |
| **Dados de Crédito Externo**          | Score de crédito (Serasa/SPC), histórico de dívidas.                   | APIs de Bureaus de Crédito (**RNF-C-01**).                 |
| **Dados de Comportamento na Plataforma** | Histórico de pagamento de empréstimos anteriores no Reevo.          | Tabelas `cprs` e `parcelas` (PostgreSQL).                  |

## Ciclo de Vida do Modelo (MLOps) no MVP

Para o MVP, adotaremos um ciclo de vida semi-manual, focado na simplicidade e na validação rápida, com um caminho claro para automação futura.

**A. Coleta e Preparação de Dados**

Os dados das fontes acima são coletados em um processo em lote (batch). Um script extrai os dados do PostgreSQL e os combina com os dados de bureaus, gerando um dataset de treinamento consolidado.


**B. Treinamento e Avaliação do Modelo**

O treinamento é realizado em um ambiente de desenvolvimento, tipicamente um arquivo Python

Um dos devs do time de dados executa o arquivo python que realiza a limpeza dos dados, engenharia de features, treinamento do modelo de ML e sua avaliação rigorosa com métricas estatísticas (ex: AUC, Precisão, Recall). O resultado deste processo é um único arquivo de modelo treinado (ex: agro_score_model_v1.pkl).

**C. Versionamento e Armazenamento do Artefato**

- O arquivo do modelo (.pkl) e o arquivo python que o gerou são versionados com Git. O artefato do modelo em si é armazenado em um serviço de Object Storage (compatível com S3), seguindo uma nomenclatura clara de versionamento (ex: s3://Reevo-models/agro_score_model_v1.pkl).

**D. Implantação (Serving) do Modelo:**

- O microsserviço Serviço de Análise de Crédito é configurado (via variável de ambiente) com o caminho para o arquivo do modelo ativo no Object Storage.

- Ao iniciar, o serviço FastAPI faz o download do arquivo do modelo e o carrega em memória.

- Quando uma requisição de análise de crédito chega à API, o serviço simplesmente chama a função model.predict() com os dados da requisição.

> Justificativa: Este é o padrão de implantação de menor latência e menor complexidade para o MVP, garantindo que as análises de crédito sejam processadas em segundos, conforme o RF-AGR-002.

## Monitoramento e Retreinamento
Um modelo de ML pode se degradar com o tempo (model drift). Nossa estratégia de monitoramento no MVP será periódica e semi-manual.

**Monitoramento de Performance:** A cada ciclo (ex: trimestralmente), analisaremos a performance real dos empréstimos concedidos. Compararemos a taxa de inadimplência prevista pelo modelo com a taxa real. Se a acurácia do modelo cair abaixo de um limiar pré-definido, o processo de retreinamento é acionado.

**Retreinamento:** O processo de retreinamento segue o mesmo ciclo descrito no passo 4, utilizando um dataset atualizado com os dados mais recentes de performance dos empréstimos. Um novo artefato de modelo (agro_score_model_v2.pkl) é gerado e, após validação, a configuração do serviço em produção é atualizada para usar a nova versão.

## Evolução Futura (Pós-MVP)
Com a validação do negócio, o ciclo de MLOps evoluirá para uma pipeline mais automatizada:

**Feature Store:** Centralização dos dados de features para garantir consistência entre treinamento и predição.

**Pipeline de Treinamento Automatizado:** Uso de ferramentas como MLflow ou Kubeflow para automatizar o treinamento, o versionamento e o registro de performance dos modelos.

**Deploy Canário / Testes A/B:** Implantação de novas versões do modelo para uma pequena porcentagem do tráfego, comparando sua performance com a versão antiga antes de liberá-la para todos os usuários.