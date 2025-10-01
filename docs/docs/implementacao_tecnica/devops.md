---
sidebar_position: 6
title: DevOps
---
import Admonition from '@theme/Admonition';

## 1. Introdução

&emsp; DevOps no Peerseed é a ponte que conecta o desenvolvimento de software às operações de infraestrutura. Nosso objetivo é criar processos automatizados e integrados que nos permitam entregar valor aos nossos usuários, **João e Mariana**  de forma rápida, frequente e confiável.

Nossos principais objetivos são:

 - **Velocidade (Velocity):** Reduzir o tempo entre uma ideia e sua implantação em produção.

- **Confiabilidade (Reliability):** Garantir que novas implantações não degradem a estabilidade do sistema, em conformidade com o RNF-CF-01.

- **Escalabilidade (Scalability):** Ter processos que funcionem tanto para um quanto para dezenas de microsserviços.

- **Segurança (Security):** Integrar a segurança em cada etapa do ciclo de vida do software (Shift-Left Security).

---

## 2. Ferramentas e Tecnologias Principais
# Ferramentas e Padrões de Engenharia

| Área                          | Ferramenta / Padrão           | Justificativa                                                                                             |
|-------------------------------|--------------------------------|---------------------------------------------------------------------------------------------------------|
| **Repositório de Código**     | Git / GitHub                   | Padrão mundial para controle de versão, com excelentes ferramentas de colaboração e integração.         |
| **Pipeline de CI/CD**         | GitHub Actions                 | Solução gratuita e nativamente integrada ao GitHub, poderosa e altamente configurável.                  |
| **Infraestrutura como Código** | Terraform                      | Padrão de mercado para provisionamento de infraestrutura de forma agnóstica à nuvem e declarativa.      |
| **Containerização**           | Docker                         | Padrão de mercado para empacotar aplicações e dependências, garantindo consistência (**RNF-P-01**).     |
| **Orquestração**              | Kubernetes                     | Padrão de mercado para operar aplicações em contêineres de forma resiliente e escalável.                |
| **Observabilidade**           | Prometheus, Grafana, OpenTelemetry | Stack open source líder para métricas, dashboards e rastreamento distribuído.                          |


---
## 3. Detalhamento dos Processos DevOps

### 3.1. Controle de Versão e Estratégia de Branches (GitHub Flow)
&emsp; A disciplina no controle de versão é a base de todo o processo. Adotaremos o GitHub Flow, uma estratégia simples e eficaz para o desenvolvimento contínuo.

O `branch main`  sempre reflete o que está em produção. Ele é protegido e não permite pushes diretos.

Todo o desenvolvimento, seja uma nova feature ou uma correção de bug, é feito em branches descritivas criadas a partir do main

>ex: feat/mercado-secundario ou fix/calculo-juros.

Quando o trabalho está concluído, um Pull Request (PR) é aberto para mesclar o branch de volta ao main.

### 3.2. Infraestrutura como Código (IaC)
Toda a nossa infraestrutura de nuvem,  o cluster Kubernetes, os bancos de dados, as redes (VPCs), as regras de firewall, é definida como código usando `Terraform`.

Impactos:

**Repetibilidade:** Garante que os ambientes de homologação e produção sejam idênticos, eliminando o clássico problema "funcionava em staging".

**Versionamento e Auditoria:** As alterações na infraestrutura passam pelo mesmo processo de Pull Request e Code Review do código da aplicação, tornando o processo seguro e auditável.

**Recuperação de Desastres:** Em caso de uma falha catastrófica, podemos recriar toda a nossa infraestrutura do zero, de forma rápida e automática, a partir do código Terraform (RNF-CF-03).

### 3.3. Observabilidade

A observabilidade é como damos "olhos e ouvidos" ao nosso sistema em produção, em total conformidade com o RNF-M-03.

**Logs:** Conforme definido na documentação de dados, todos os serviços emitem logs estruturados (JSON) para stdout. Em nosso ambiente Kubernetes, um agente (como Fluentd) coleta esses logs e os centraliza em um serviço de logging (ex: AWS CloudWatch ou uma stack ELK), onde podem ser pesquisados e analisados.

**Métricas:** Cada microsserviço expõe métricas de saúde e de negócio (ex: latência de requisições, taxa de erros, número de transações por segundo) no formato Prometheus. Um servidor Prometheus central coleta essas métricas.

**Dashboards e Alertas:** O Grafana é conectado ao Prometheus para criar dashboards que nos dão uma visão em tempo real da saúde da plataforma. Alertas são configurados no Grafana para notificar a equipe automaticamente (via Slack ou PagerDuty) quando uma métrica crítica sai do padrão
> ex: "A taxa de erro do Serviço de Pagamentos excedeu 5%".

**Rastreamento (Tracing):** Para depurar problemas complexos em nossa arquitetura de microsserviços, planejamos a adoção do OpenTelemetry. Ele nos permitirá seguir uma única requisição (ex: um investimento da Marina) em sua jornada através de múltiplos serviços, identificando gargalos e pontos de falha.