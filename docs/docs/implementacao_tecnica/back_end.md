---
sidebar_position: 1
title: Planejamento Backend
---

## Introdução
&emsp; A arquitetura de backend do Peerseed é baseada em um conjunto de microsserviços independentes, escritos em Python. A escolha por esta abordagem visa garantir alta escalabilidade, resiliência e manutenibilidade, permitindo que equipes possam desenvolver, implantar e escalar cada domínio de negócio de forma autônoma.

&emsp; Este documento estabelece a stack tecnológica padrão, a estrutura de diretórios e os padrões de comunicação que devem ser seguidos por todos os serviços de backend, a fim de manter a coesão e a qualidade técnica em todo o ecossistema.

## 1. Stack Tecnológica Principal

&emsp;Para garantir consistência e produtividade, todos os serviços de backend do Peerseed devem ser construídos utilizando a seguinte stack de tecnologias:

| Componente              | Tecnologia/Padrão Recomendado | Principal Vantagem |
|--------------------------|-------------------------------|--------------------|
| Framework API            | [FastAPI](https://fastapi.tiangolo.com/pt/)                       | Performance, async nativo, docs e validação automáticas |
| ORM (DB)                 | [SQLAlchemy 2.0+](https://www.sqlalchemy.org/)               | Padrão de mercado, produtivo e com suporte async |
| Migrações de Schema      | [Alembic](https://alembic.sqlalchemy.org/en/latest/)                       | Versionamento seguro do banco de dados |
| Validação/Serialização   | [Pydantic](https://docs.pydantic.dev/latest/)                      | Integrado ao FastAPI, garante a integridade dos dados |
| Autenticação             | JWT com OAuth2                | Padrão stateless e seguro para microsserviços |
| Dependências             | [Poetry](https://python-poetry.org/docs/)                        | Gerenciamento moderno e builds repetíveis |
| Testes                   | [Pytest](https://docs.pytest.org/en/stable/)                        | Padrão da comunidade Python, flexível e poderoso |

## 2. Detalhamento dos Componentes da Stack

### 2.1. Framework de API: FastAPI
&emsp; O FastAPI é a fundação de todos os nossos serviços. Sua alta performance e suporte nativo a operações assíncronas (async/await) são essenciais para construir uma plataforma responsiva e escalável, capaz de lidar com um grande volume de operações de I/O (consultas a banco de dados, chamadas a APIs externas), em conformidade com nossos requisitos de performance `(RNF-ED-01)`.

### 2.2. Interação com Banco de Dados: SQLAlchemy
&emsp; A comunicação com o banco de dados `PostgreSQL` é abstraída pelo `SQLAlchemy`, o ORM padrão da comunidade Python. Utilizamos exclusivamente seu motor assíncrono (create_async_engine), que se integra ao FastAPI. As tabelas do banco de dados são mapeadas para classes Python (models), o que aumenta a produtividade e a segurança do código.

### 2.3. Validação de Dados: Pydantic
&emsp; O Pydantic é utilizado para definir schemas de dados claros para todas as operações de API. Adotamos o padrão de ter schemas específicos para entrada (Request Models) e saída (Response Models), o que nos proporciona:

**Validação Automática:** Requisições com dados inválidos ou faltando são rejeitadas automaticamente pelo framework.

**Segurança:** Evita o vazamento acidental de dados internos, expondo apenas os campos definidos no schema de resposta.

**Documentação Automática:** Os schemas Pydantic são a fonte da verdade para a geração da documentação OpenAPI.

### 2.4. Migrações de Banco de Dados: Alembic
&emsp; Toda alteração no schema do banco de dados (modelos do SQLAlchemy) deve ser acompanhada por um script de migração gerado pelo Alembic. Isso garante que a evolução do banco de dados seja controlada, versionada e possa ser aplicada de forma segura e consistente em qualquer ambiente.

### 2.5. Autenticação e Autorização: JWT (OAuth2)
&emsp; A segurança entre os serviços é baseada em JSON Web Tokens. O Serviço de Contas atua como o provedor de identidade, emitindo um JWT para o usuário após um login bem-sucedido. Todas as chamadas subsequentes para qualquer microsserviço devem conter este token no cabeçalho Authorization. Cada serviço é responsável por validar a assinatura e as permissões do token antes de processar a requisição.

### 2.6. Gerenciamento de Dependências: Poetry
&emsp; Poetry é a ferramenta padrão para gerenciamento de dependências e ambientes virtuais em todos os projetos. O uso do `pyproject.toml`e do poetry.lock garante que todos os ambientes (desenvolvimento, teste, produção) sejam idênticos, eliminando problemas de consistência.

### 2.7. Testes: Pytest
&emsp;A qualidade do software é garantida através de uma suíte de testes automatizados escritos com Pytest. O FastAPI fornece um TestClient que facilita a escrita de testes de integração, permitindo simular requisições à API sem a necessidade de um servidor em execução.

## 3. Estrutura de Diretórios Padrão
Para assegurar a consistência e facilitar a navegação entre os projetos, todos os microsserviços devem seguir a estrutura de diretórios abaixo:

```md
/nome-do-servico
├── /alembic/                # Scripts de migração do banco de dados (Alembic)
├── /app/
│   ├── /api/                  # Endpoints/Routers da API, camada de entrada de requisições.
│   ├── /core/                 # Configurações centrais da aplicação (ex: settings).
│   ├── /crud/                 # Funções de acesso aos dados (lógica de banco de dados).
│   ├── /models/               # Classes que representam as tabelas do banco (SQLAlchemy).
│   ├── /schemas/              # Classes de validação de dados da API (Pydantic).
│   └── main.py                # Ponto de entrada da aplicação FastAPI.
├── /tests/                    # Testes automatizados (Pytest).
├── pyproject.toml             # Definição do projeto e dependências (Poetry).
└── poetry.lock                # Arquivo de lock das dependências.

```


## 4. Padrões de Comunicação entre Serviços

&emsp;A comunicação no ecossistema de microsserviços do Peerseed segue dois padrões principais:

### 4.1. Comunicação Síncrona (RESTful APIs)
**Quando usar:** Para interações de comando ou consulta que exigem uma resposta imediata.

> Exemplo: O Frontend solicita ao Serviço de Marketplace a lista de CPRs disponíveis. A requisição precisa ser respondida na hora com os dados.

**Mecanismo:** Chamadas HTTP/S diretas entre os serviços, geralmente orquestradas através de um API Gateway, que atua como o ponto de entrada único para todas as requisições externas.

### 4.2. Comunicação Assíncrona (Orientada a Eventos)
**Quando usar:** Para desacoplar os serviços e para processos que podem ser executados em background, sem que o solicitante precise esperar por uma resposta.

> Exemplo: Quando o Serviço de Carteira confirma o pagamento de uma parcela, ele publica um evento PagamentoConfirmado. O Serviço de Notificações e o Serviço de Distribuição escutam este evento e reagem a ele de forma independente, sem que o Serviço de Carteira precise saber de sua existência.

**Mecanismo:** Utilização de um Message Broker (como RabbitMQ ou AWS SQS), que já foi previsto em nossos diagramas de sequência.