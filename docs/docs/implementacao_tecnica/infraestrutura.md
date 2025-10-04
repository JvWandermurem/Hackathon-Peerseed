---
sidebar_position: 4
title: Planejamento Infraestrutura
---

## Introdução

&emsp; A infraestrutura do Reevo é projetada para ser a fundação sólida que sustenta a ponte entre agricultores e investidores. As decisões arquiteturais são guiadas por quatro princípios essenciais, sempre focados em gerar valor e confiança para nosso público-alvo e pautados nos nossos Requisitos Funcionais e Não funcionais:

 - **Alta Disponibilidade e Resiliência:** A plataforma precisa estar sempre acessível. Para o agricultor João, o acesso ao crédito é sensível ao tempo e alinhado à janela da safra. Para a investidora Marina, a indisponibilidade do sistema significa perda de confiança e de oportunidades. Nossa meta é uma disponibilidade de 99.9% `(RNF-CF-01)`.

- **Escalabilidade Elástica:** A plataforma deve performar com excelência tanto com cem quanto com cem mil usuários. A infraestrutura deve ser capaz de escalar seus recursos automaticamente para atender a picos de demanda, como no lançamento de uma nova safra de captações, garantindo tempos de resposta rápidos `(RNF-ED-01)`.

- **Segurança por Design:** A segurança dos dados financeiros e pessoais de nossos usuários é inegociável. A infraestrutura é desenhada com múltiplas camadas de proteção, desde a rede até a aplicação, para construir um ambiente seguro e em conformidade com a LGPD `(RNF-S-04)`.

- **Agnosticismo de Nuvem e Portabilidade:** A arquitetura é baseada em padrões de mercado e tecnologias de código aberto (como contêineres e Kubernetes) para garantir a portabilidade e evitar dependência excessiva de um único provedor de nuvem `(RNF-P-01)`.


## Provedor de Nuvem
&emsp;  Apesar de a arquitetura ser agnóstica, a implantação do MVP ocorrerá em um dos três principais provedores de nuvem globais: _Amazon Web Services (AWS), Google Cloud Platform (GCP) ou Microsoft Azure._

&emsp;  A escolha de um provedor de grande porte garante uma infraestrutura de rede global e de baixa latência, o que significa que a plataforma será rápida e acessível para usuários em qualquer região do Brasil. Seja João em uma área rural com internet de menor velocidade, ou Marina em um grande centro urbano, a experiência será otimizada. Todos os provedores oferecem um free tier (camada gratuita) robusto, permitindo o desenvolvimento e lançamento do MVP com custos operacionais mínimos.

### Arquitetura de Computação
&emsp;  O núcleo da nossa infraestrutura de computação é a orquestração de contêineres com Kubernetes (K8s). Cada microsserviço da nossa aplicação é empacotado em um **contêiner** e gerenciado pelo **Kubernetes**.

Importância e Impacto:
**Para João (Agricultor):** A principal vantagem é a confiabilidade. O Kubernetes possui mecanismos de self-healing (auto-recuperação). Se um dos nossos serviços falhar, ele é reiniciado automaticamente, garantindo que a plataforma esteja sempre no ar quando João precisar solicitar um crédito ou efetuar um pagamento. Isso é vital para cumprir o requisito de Disponibilidade `(RNF-CF-01)`.

**Para Marina (Investidora):** O benefício chave é a performance. Em momentos de alta demanda (ex: abertura de uma captação muito esperada), o Kubernetes pode escalar horizontalmente, adicionando mais "réplicas" dos nossos serviços para lidar com o tráfego. Isso garante que a plataforma permaneça rápida e responsiva, cumprindo os requisitos de Capacidade (RNF-ED-03) e Tempo de Resposta `(RNF-ED-01)`.


#### Opções de Mercado

| Opção de Implementação                  | Descrição                                                                                   | Vantagens para o Reevo                                                                                                          | Desvantagens                                                                                     |
|-----------------------------------------|---------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|
| **Managed Kubernetes (EKS, GKE, AKS)**  | O provedor de nuvem gerencia o *control plane* (o "cérebro" do K8s). Nós gerenciamos apenas os nós de trabalho e nossas aplicações. | **Foco no Produto**: Reduz a carga operacional, liberando a equipe para desenvolver funcionalidades para João e Marina. **Confiabilidade**: Alta disponibilidade garantida pelo provedor. | - Curva de aprendizado inicial da ferramenta.                                                    |
| **Serverless Containers (AWS Fargate, Cloud Run)** | Abstrai completamente a noção de servidores: apenas enviamos o contêiner e ele roda.          | **Simplicidade Máxima**: Ideal para equipes pequenas- **Custo Otimizado**: Pagamento apenas pelo tempo real de computação, ótimo para um MVP com tráfego variável. | - Menor flexibilidade em redes complexas.- Possível dependência do provedor.                 |


> Decisão de Arquitetura: Iniciar com Managed Kubernetes como a base principal, pois oferece o melhor balanço entre controle, portabilidade e padrão de mercado.

### Arquitetura de Dados

&emsp; A estratégia é utilizar serviços gerenciados para todos os nossos armazenamentos de dados, seguindo o princípio de terceirizar a complexidade operacional para focar na segurança e integridade dos dados.

**Banco de Dados PostgreSQL Gerenciado (AWS RDS, Google Cloud SQL)**

&emsp; A integridade dos dados financeiros de **João e Marina** é o ativo mais precioso da plataforma. Utilizar um serviço gerenciado para o PostgreSQL nos oferece, de forma nativa:

- **Backups Automatizados e Recuperação Point-in-Time:** Garante que, em caso de desastre, possamos recuperar os dados com perda mínima ou zero `(RNF-CF-03 - Recuperabilidade)`.

- **Replicação Multi-AZ (Multi-Availability Zone):** O banco de dados é replicado em diferentes datacenters. Se um falhar, o outro assume automaticamente, sendo a base da nossa alta disponibilidade `(RNF-CF-01)`.

- **Criptografia em Repouso:** Os dados são criptografados no disco por padrão, um pilar da nossa estratégia de segurança e conformidade com a LGPD `(RNF-S-01, RNF-S-04)`.

**Cache Redis Gerenciado (AWS ElastiCache, Google Memorystore)**
A velocidade percebida pelo usuário é um fator chave para a confiança. Para Marina, que explora dezenas de oportunidades no marketplace, cada milissegundo conta. O cache gerenciado garante que essas leituras frequentes sejam quase instantâneas, ajudando a cumprir o requisito de Tempo de Resposta da API `(RNF-ED-01)`.

### Arquitetura de Rede
&emsp; Utilizaremos o padrão de Virtual Private Cloud (VPC) com uma segmentação rigorosa de sub-redes.

Este design é fundamental para a segurança.

- **Sub-redes Privadas:** Nossos microsserviços e, mais importante, nossos bancos de dados, residirão aqui. Eles não possuem nenhum acesso direto à internet.

- **Sub-redes Públicas:** Apenas os componentes que precisam falar com o mundo exterior, como Load Balancers e o API Gateway, vivem aqui.

Este modelo  garante a `João e Marina` que seus dados mais sensíveis (documentos, histórico financeiro, dados pessoais) estão protegidos em uma camada profunda da nossa infraestrutura, isolados de ameaças externas. Isso é uma implementação direta do princípio de `Segurança` por Design.

### API Gateway

&emsp;Nenhuma requisição externa acessa nossos serviços diretamente. Todo o tráfego passa por um API Gateway Gerenciado.

&emsp; O API Gateway funciona como o portão principal e a equipe de segurança da nossa plataforma.

 - **Centralização da Segurança:** Ele é responsável por validar a autenticação de cada requisição `(RF-CAD-002)`, garantindo que apenas usuários logados acessem dados privados.

- **Proteção:** Oferece proteção nativa contra ataques comuns, como _DDoS e injeção de código_.

Para os usuários, isso é uma camada de proteção invisível, mas vital. Garante que a plataforma que eles usam para gerenciar suas finanças e negócios é resiliente, segura e profissional, fortalecendo a confiança, que é a moeda mais importante em uma fintech.