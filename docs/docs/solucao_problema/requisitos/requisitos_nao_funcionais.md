---
sidebar_position: 2
title: Requisitos Não Funcionais
---

## Contextualização
&emsp; Requisitos não funcionais (RNFs) definem como um sistema deve operar e não o que ele faz, abrangendo atributos de qualidade como desempenho, segurança e usabilidade, enquanto a **ISO/IEC 25010** é um padrão que fornece um modelo para categorizar e avaliar esses atributos de qualidade, dividindo-os em características de produto e de uso para garantir que o software atenda às expectativas dos utilizadores e stakeholders.

&emsp; A ISO 25010 fornece um vocabulário e uma estrutura para os requisitos não funcionais e utiliza um modelo com várias características e subcaracterísticas para classificar e organizar os diferentes atributos de qualidade (RNFs), como eficiência de desempenho, segurança, usabilidade, confiabilidade e compatibilidade. Ao usar a ISO 25010, as organizações podem garantir que estão a abordar todos os aspectos importantes da qualidade do software, tanto do ponto de vista do produto quanto da sua utilização.

---

### 1. Adequação Funcional (Functional Suitability)
Esta característica mede o grau em que o produto satisfaz as necessidades declaradas e implícitas.

#### RNF-AF-01 (Completude Funcional)
O sistema deve implementar todas as funcionalidades descritas nos módulos de Requisitos Funcionais (RF-CAD, RF-AGR, RF-INV, etc.).  
A ausência de qualquer requisito funcional listado será considerada um defeito.

---

### 2. Eficiência de Desempenho (Performance Efficiency)

#### RNF-ED-01 (Comportamento em Relação ao Tempo)
- **Carregamento de Páginas:** 95% das páginas interativas da plataforma devem carregar completamente em menos de 2,5 segundos em uma conexão de banda larga padrão (≥ 10 Mbps).  
- **Tempo de Resposta de APIs:** 99% de todas as chamadas de API devem ter um tempo de resposta (time to first byte) inferior a 400ms.  
- **Processamento Crítico:** A análise de crédito (RF-AGR-002) deve atender ao seu tempo de processamento (< 60s) mesmo sob carga de 50 análises concorrentes.

#### RNF-ED-02 (Utilização de Recursos)
A aplicação, sob carga nominal (definida em RNF-ED-03), não deve utilizar mais de 70% dos recursos de CPU ou memória dos servidores, garantindo uma margem de 30% para picos de uso.

#### RNF-ED-03 (Capacidade)
O sistema deve suportar, no lançamento, uma carga nominal de 1000 usuários simultâneos, na primeira versão do projeto, podendo atingir até 100x esse valor 1 ano após o lançamento do projeto. O sistema deve, também, processar um mínimo de 10 transações de investimento por segundo na primeira versão e 100x esse valor 1 ano após o lançamento do projeto.

#### RNF-ED-04 (Escalabilidade)
A arquitetura do sistema deve ser projetada para escalar horizontalmente.  
O sistema deve suportar um crescimento para até 10.000 usuários simultâneos e 100 transações por segundo com a adição de recursos computacionais (ex: mais instâncias de servidor), sem a necessidade de uma re-arquitetura fundamental.

---

### 3. Compatibilidade (Compatibility)

#### RNF-C-01 (Interoperabilidade)
O sistema deve se integrar de forma segura e eficiente com os seguintes serviços de terceiros via API:  
- Gateway de Pagamentos (Pix, On/Off-Ramp BRL/USDC)  
- Provedor de Assinatura Digital (ICP-Brasil)  
- Registradora da CPR  
- Serviço de disparo de SMS/Push  
- Fontes de dados para análise de crédito (Receita Federal, Serasa, SCR)

---

### 4. Usabilidade (Usability)

#### RNF-U-01 (Acessibilidade)
A interface web da plataforma deve seguir as diretrizes do WCAG 2.1, nível AA.

#### RNF-U-02 (Operabilidade)
O sistema deve ser totalmente funcional e renderizado corretamente nas duas últimas versões dos principais navegadores (Google Chrome, Mozilla Firefox, Apple Safari).

#### RNF-U-03 (Proteção Contra Erros)
Mensagens de erro devem ser claras, humanas e indicar como o usuário pode corrigir o problema.

#### RNF-U-04 (Responsividade)
A aplicação deve ser totalmente responsiva e utilizável em dispositivos móveis (smartphones e tablets), adaptando-se a larguras de tela de no mínimo 360 pixels.

---

### 5. Confiabilidade (Reliability)

#### RNF-CF-01 (Disponibilidade)
- A plataforma deve ter uma disponibilidade de 99.9% ("três noves"), medida mensalmente. Isso se traduz em um tempo máximo de inatividade de aproximadamente 43 minutos por mês.  
- Janelas de manutenção devem ser comunicadas com 48 horas de antecedência e realizadas em horários de baixo tráfego.

#### RNF-CF-02 (Tolerância a Falhas)
O sistema deve lidar de forma controlada com falhas de serviços externos (ex: API de terceiros indisponível), registrando o erro e informando o usuário, sem causar instabilidade geral na plataforma.

#### RNF-CF-03 (Recuperabilidade)
- **RPO (Recovery Point Objective):** A perda máxima de dados de transações aceitável é de zero. Para dados não-transacionais, o RPO é de 15 minutos.  
- **RTO (Recovery Time Objective):** O tempo máximo para restaurar o sistema a um estado operacional após uma falha total de uma região é de 2 horas. A recuperação de uma falha de AZ deve ser automática e ocorrer em menos de 5 minutos.

---

### 6. Segurança (Security)

#### RNF-S-01 (Confidencialidade)
Toda a comunicação deve ser criptografada via TLS 1.3. Dados sensíveis em repouso devem ser criptografados com AES-256. Dados sensíveis não devem ser expostos em ambientes de teste (data masking).

#### RNF-S-02 (Integridade)
Todas as transações financeiras devem seguir as propriedades ACID. O log de auditoria (RF-SEC-002) deve ser protegido contra adulteração.

#### RNF-S-03 (Não Repúdio e Prestação de Contas)
A combinação da assinatura digital (RF-AGR-003) e do log de auditoria (RF-SEC-002) deve garantir a irrefutabilidade das ações críticas.

#### RNF-S-04 (Conformidade Regulatória)
O sistema e seus processos operacionais devem ser projetados para estar em total conformidade com a Lei Geral de Proteção de Dados (LGPD) e com os regulamentos do Banco Central (Bacen) aplicáveis às Sociedades de Empréstimo entre Pessoas (SEP).

#### RNF-S-05 (Testes de Segurança Proativos)
- O sistema deve passar por testes de intrusão (Pentest) externos realizados por uma empresa especializada ao menos uma vez por semestre, ou antes de cada release major.  
- Análises estáticas (SAST) e dinâmicas (DAST) de segurança de código devem ser integradas ao pipeline de CI/CD para identificar vulnerabilidades de forma contínua.

---

### 7. Manutenibilidade (Maintainability)

#### RNF-M-01 (Modularidade)
A arquitetura do software deve ser modular, permitindo que as equipes trabalhem de forma independente em diferentes partes do sistema.

#### RNF-M-02 (Testabilidade)
O código-fonte deve ter uma cobertura de testes unitários de no mínimo 85% para as lógicas de negócio críticas.

#### RNF-M-03 (Observabilidade)
- O sistema deve expor métricas de saúde técnica (latência de APIs, uso de CPU/memória, taxa de erros 5xx) e de negócio (cadastros/hora, investimentos/hora, pagamentos processados) em um formato padrão (ex: Prometheus).  
- Devem ser configurados dashboards (ex: Grafana) e alertas automáticos (ex: via Alertmanager, PagerDuty) para notificar a equipe de operações quando métricas críticas ultrapassarem thresholds pré-definidos.

---

### 8. Portabilidade (Portability)

#### RNF-P-01 (Adaptabilidade)
A aplicação deve ser totalmente containerizada (Docker), orquestrada (Kubernetes) e agnóstica em relação ao provedor de nuvem, evitando dependência excessiva de serviços proprietários.

#### RNF-P-02 (Instalabilidade)
O processo de implantação deve ser totalmente automatizado via pipeline de CI/CD, permitindo deploys em produção com zero downtime (blue-green ou canary deployment).
