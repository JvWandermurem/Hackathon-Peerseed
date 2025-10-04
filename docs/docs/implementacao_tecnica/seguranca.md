---
sidebar_position: 5
title: Segurança
---
import Admonition from '@theme/Admonition';


## Introdução

&emsp; A segurança é o pilar fundamental que sustenta a confiança de agricultores e investidores na plataforma Reevo. **Nossa abordagem é proativa, não reativa**, e segue os princípios de Segurança por Design (Secure by Design) e Defesa em Profundidade (Defense in Depth). Isso significa que a segurança não é uma camada externa, mas uma responsabilidade integrada em cada componente da nossa arquitetura: desde a infraestrutura e a rede até o código da aplicação e os processos de DevOps.

---
## A Tríade CIA
&emsp; A nossa estratégia de segurança é construída sobre a Tríade CIA, um modelo que representa os três objetivos mais importantes da segurança da informação.

### Confidencialidade (Confidentiality)

- Garantir que os dados sejam acessíveis apenas por pessoas autorizadas.

- A proteção dos dados pessoais e financeiros de João e Marina é nossa maior prioridade.

Controles Implementados:

**Criptografia em Trânsito:** Toda a comunicação entre o usuário e a plataforma, bem como entre os microsserviços internos, é obrigatoriamente criptografada usando TLS 1.3. Isso impede a interceptação de dados `(RNF-S-01)`.

**Criptografia em Repouso:** Todos os dados armazenados em nossos bancos de dados (PostgreSQL) e sistemas de arquivos (Object Storage) são criptografados em nível de disco com o padrão AES-256, utilizando os recursos dos serviços gerenciados em nuvem `(RNF-S-01)`.

**Gestão de Segredos:** Credenciais de acesso a bancos de dados, chaves de API e outros segredos são gerenciados por um serviço de cofre de segredos (como AWS Secrets Manager ou Google Secret Manager). Eles nunca são expostos em código ou variáveis de ambiente não seguras.

**Controle de Acesso Rigoroso:** O acesso aos dados é governado pelo princípio do mínimo privilégio. Na aplicação, a validação de tokens JWT garante que um usuário só possa acessar seus próprios dados. Na infraestrutura, políticas de IAM (Identity and Access Management) garantem que cada serviço só possa acessar os recursos estritamente necessários.

**Mascaramento de Dados (LGPD):** Conforme definido em nosso plano de logging e em conformidade com a LGPD (RNF-S-04), dados sensíveis (como CPF) são automaticamente mascarados antes de serem escritos em qualquer log, prevenindo a exposição acidental.

### Integridade (Integrity)

- Garantir que os dados são precisos, consistentes e protegidos contra alterações não autorizadas.

- As transações financeiras e os contratos devem ser inalteráveis e precisos.

Controles Implementados:

**Transações Atômicas (ACID):** A escolha do PostgreSQL como banco de dados principal garante que todas as operações financeiras sigam as propriedades ACID. Um investimento, por exemplo, ou é concluído com sucesso por inteiro (débito na carteira do investidor, crédito na captação da CPR) ou é totalmente revertido, nunca deixando os dados em estado inconsistente `(RNF-S-02)`.

**Ledger com Hash Chaining:** A tabela ledger_eventos cria um registro de auditoria com evidência de adulteração. Cada evento crítico é criptograficamente encadeado ao anterior, tornando impossível alterar um registro passado sem invalidar toda a cadeia. Isso garante a integridade das operações mais importantes `(RNF-S-02)`.

**Validação de Dados na Entrada:** O uso do Pydantic no FastAPI garante que todos os dados recebidos pela API sejam validados contra um schema pré-definido, prevenindo a entrada de dados malformados ou maliciosos que poderiam corromper o estado do sistema.

**Assinaturas Digitais:** A integridade das sessões de usuário é garantida pela assinatura digital dos tokens JWT. A integridade jurídica dos contratos é garantida pela assinatura digital qualificada (ICP-Brasil) na CPR (`RF-AGR-003`, `RNF-S-03`).

### Disponibilidade (Availability)
- Garantir que a plataforma esteja operacional e acessível quando nossos usuários precisarem dela.

- O acesso ao crédito e aos investimentos é sensível ao tempo. A plataforma precisa ser confiável.

Controles Implementados:

**Infraestrutura de Alta Disponibilidade:** Conforme o documento de infraestrutura, utilizamos serviços gerenciados (Kubernetes, Bancos de Dados) configurados em múltiplas Zonas de Disponibilidade (Multi-AZ). Se um datacenter inteiro falhar, a plataforma continua operando a partir de outro, garantindo nossa meta de 99.9% de uptime `(RNF-CF-01)`.

**Escalabilidade Automática:** O Kubernetes é configurado para escalar horizontalmente, adicionando mais instâncias de um serviço conforme a demanda aumenta. Isso previne que picos de tráfego causem lentidão ou indisponibilidade `(RNF-ED-04)`.

**Backups e Recuperação de Desastres:** Nossos bancos de dados gerenciados realizam backups automáticos e contínuos, permitindo a recuperação do sistema a um ponto específico no tempo (Point-in-Time Recovery) em caso de uma falha catastrófica `(RNF-CF-03)`.

**Proteção contra Ataques de Negação de Serviço (DDoS):** Utilizamos os serviços de proteção DDoS nativos do provedor de nuvem, implementados na camada de borda (API Gateway, Load Balancer), para mitigar ataques que visam tirar a plataforma do ar.

---
## Mitigação de Riscos: OWASP Top 10

Nossa arquitetura e processos de desenvolvimento são projetados para mitigar proativamente os riscos de segurança mais comuns identificados pelo OWASP (Open Web Application Security Project).

<Details>
  <summary> **A01 - Broken Access Control (Quebra de Controle de Acesso)** </summary>

&emsp; Além da autenticação via JWT, cada endpoint da API implementa verificações de autorização explícitas para garantir que um usuário só possa ver ou modificar os recursos que lhe pertencem.

> Ex: "O usuário que está tentando ver a CPR X é de fato o agricultor que a criou?".
</Details>

<Details>
  <summary> **A02 - Cryptographic Failures (Falhas Criptográficas)**</summary>

&emsp; Seguimos a regra de nunca "inventar" criptografia. Utilizamos padrões de mercado robustos e auditados (TLS 1.3, AES-256) e delegamos a complexidade da gestão de chaves para os serviços gerenciados da nuvem.
</Details>

<Details>
  <summary>**A03 - Injection (Injeção)**</summary>

&emsp; O uso do SQLAlchemy ORM com prepared statements elimina virtualmente o risco de SQL Injection. A validação rigorosa de dados de entrada pelo Pydantic serve como uma defesa adicional contra outros tipos de ataques de injeção.
</Details>


<Details>
  <summary>**A05 - Security Misconfiguration (Configuração Incorreta de Segurança)**</summary>

&emsp; O uso de Infraestrutura como Código (Terraform) garante que nossa infraestrutura seja provisionada de forma consistente e segura, a partir de templates auditados. Evitamos configurações manuais e propensas a erro.
</Details>

<Details>
  <summary>**A08 - Software and Data Integrity Failures (Falhas de Integridade de Software e Dados)**</summary>

&emsp; Nosso pipeline de CI/CD inclui análise de vulnerabilidades das dependências e das imagens Docker, garantindo que não estamos implantando software com falhas de segurança conhecidas. A integridade dos dados, como já mencionado, é garantida pelo nosso ledger com hash chaining.
</Details>

---

## Análise de Trade-offs Arquiteturais

&emsp; Toda arquitetura de software robusta é o resultado de uma série de decisões e, consequentemente, de trade-offs. Não existe uma solução "perfeita", mas sim uma solução ótima para um contexto específico. No Reevo, fizemos escolhas conscientes para priorizar os aspectos mais críticos para uma plataforma fintech de crédito: confiança, segurança e integridade.

### Segurança vs. Usabilidade: A Prioridade da Confiança
**O Trade-off:** Medidas de segurança mais rigorosas frequentemente introduzem etapas adicionais nos fluxos do usuário, criando uma fricção que pode impactar a simplicidade da experiência.

**Nossa Decisão:** Em todos os momentos, priorizamos a segurança em detrimento da conveniência marginal, pois a confiança é o ativo mais valioso da nossa plataforma.
<Admonition type="info" title="Exemplos">
Exemplo 1: Autenticação de Dois Fatores (2FA): O requisito RF-CAD-003 (2FA obrigatório ou fortemente incentivado) adiciona um passo ao processo de login. Para a investidora Marina, que gerencia seu capital na plataforma, essa pequena fricção é um preço baixo a se pagar pela garantia de que sua conta está protegida contra acessos não autorizados.

Exemplo 2: Verificação de Identidade (KYC): O processo de onboarding, que exige o envio de documentos e selfie (RF-CAD-001), é o maior ponto de atrito na jornada inicial do usuário. Poderíamos ter um cadastro mais simples, mas isso abriria a plataforma para fraudes e impediria a conformidade regulatória. Escolhemos conscientemente essa barreira inicial para garantir um ecossistema seguro e legal para todos os participantes, protegendo os investimentos de Marina e a legitimidade dos empréstimos de João.
</Admonition>

### Consistência Forte vs. Performance/Disponibilidade

**O Trade-off:** Em sistemas distribuídos, existe um trade-off clássico (descrito pelo Teorema CAP) entre garantir que todos os dados estejam sempre 100% consistentes e ter a latência mais baixa ou a maior disponibilidade possível.

**Nossa Decisão:** Para todas as operações financeiras e de negócio, optamos por consistência forte.

**Justificativa:** A escolha do PostgreSQL como nosso banco de dados principal e o uso de suas garantias ACID (`RNF-S-02`) é uma decisão deliberada. Quando Marina investe em uma CPR, é absolutamente inaceitável que seu saldo seja debitado sem que o investimento seja registrado, ou vice-versa. Preferimos arcar com alguns milissegundos a mais de latência em uma transação para ter a garantia matemática de que os dados financeiros estão sempre corretos e consistentes. Para uma fintech, a integridade dos dados prevalece sobre a performance bruta.