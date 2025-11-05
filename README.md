# 🏦 Bank Project - Sistema Bancário Completo

Sistema bancário full-stack desenvolvido com **Spring Boot** (backend) e **Next.js** (frontend), oferecendo gerenciamento de contas correntes e poupança com rastreamento de despesas em tempo real.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Funcionalidades](#funcionalidades)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Como Usar](#como-usar)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [API Endpoints](#api-endpoints)
- [Licença](#licença)

## 🎯 Sobre o Projeto

O **Bank Project** é uma aplicação bancária completa que permite aos usuários gerenciar suas contas correntes e poupança, realizar operações bancárias (depósitos, saques, transferências) e acompanhar suas despesas através de um sistema de indicadores visuais com cores e animações.

### Principais Características

- 🔐 **Sistema de Autenticação**: Login separado para administradores e usuários comuns
- 💰 **Contas Bancárias**: Suporte para Conta Corrente e Conta Poupança
- 📊 **Rastreamento de Despesas**: Sistema inteligente que monitora gastos e exibe alertas visuais
- 🎨 **Interface Moderna**: Design responsivo com Tailwind CSS
- 🔄 **Transferências**: Possibilidade de transferir valores entre contas
- 👨‍💼 **Painel Administrativo**: Gerenciamento completo de usuários e contas

## 🚀 Tecnologias

### Backend
- **Java 17**
- **Spring Boot 3.x**
- **Spring Data JPA**
- **Oracle Database**
- **Maven**

### Frontend
- **Next.js 14**
- **React 18**
- **TypeScript**
- **Tailwind CSS**

## ✨ Funcionalidades

### Para Usuários
- ✅ Registro de novos usuários
- ✅ Login com email e senha
- ✅ Criação de Conta Corrente e Poupança
- ✅ Depósitos e Saques
- ✅ Transferências entre contas (Poupança → Corrente)
- ✅ Visualização de saldo em tempo real
- ✅ **Indicador de Despesas** com sistema de cores:
  - 🟢 Verde (0-10%): Despesas normais
  - 🟡 Amarelo (10-30%): Atenção aos gastos
  - 🔴 Vermelho (≥30%): Alerta crítico com animação pulsante

### Para Administradores
- ✅ Acesso via credenciais admin
- ✅ Listagem de todos os usuários
- ✅ Gerenciamento de Contas Correntes
- ✅ Gerenciamento de Contas Poupança
- ✅ Edição e exclusão de registros
- ✅ **Exclusão em Cascata**: Ao deletar um usuário, suas contas são removidas automaticamente

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Java JDK 17+**
- **Node.js 18+**
- **Maven 3.8+**
- **Oracle Database** (ou acesso a uma instância remota)
- **Git**

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/bank_project.git
cd bank_project
```

### 2. Configuração do Backend

#### 2.1. Configure o banco de dados

Edite o arquivo `bank_project_back-end/src/main/resources/application.properties`:

```properties
# Oracle Database Configuration
spring.datasource.url=jdbc:oracle:thin:@oracle.fiap.com.br:1521:orcl
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
spring.datasource.driver-class-name=oracle.jdbc.OracleDriver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Server Configuration
server.port=8080
```

#### 2.2. Instale as dependências e execute o backend

```bash
cd bank_project_back-end
mvn clean install
mvn spring-boot:run
```

O backend estará rodando em: `http://localhost:8080`

### 3. Configuração do Frontend

#### 3.1. Instale as dependências

```bash
cd bank_project-frontend
npm install
```

#### 3.2. Execute o frontend

```bash
npm run dev
```

O frontend estará rodando em: `http://localhost:3000`

## ⚙️ Configuração

### Variáveis de Ambiente (Opcional)

Você pode criar um arquivo `.env.local` no frontend para configurar variáveis:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### CORS

O backend já está configurado para aceitar requisições do frontend em `http://localhost:3000`. Para alterar, edite os arquivos:
- `bank_project_back-end/src/main/java/br/com/fiap/bank_project/config/CorsConfig.java`
- `bank_project_back-end/src/main/java/br/com/fiap/bank_project/config/WebConfig.java`

## 📖 Como Usar

### 1️⃣ Acesso Administrador

1. Acesse `http://localhost:3000`
2. Faça login com as credenciais de administrador:
   - **Email**: `adm@fiap.com.br`
   - **Senha**: `fiap2025`
3. Você será redirecionado para o painel administrativo

### 2️⃣ Registro de Novo Usuário

1. Na tela de login, clique em **"Não tem conta? Registre-se"**
2. Preencha os dados:
   - Nome completo
   - Email
   - CPF (formato: 000.000.000-00)
   - Senha
3. Clique em **"Registrar"**

### 3️⃣ Criando Contas Bancárias

Após o login como usuário:

1. Escolha o tipo de conta (**Corrente** ou **Poupança**)
2. Clique em **"Criar Conta"**
3. Informe o depósito inicial (valor > 0)
4. Confirme a criação

### 4️⃣ Operações Bancárias

#### Depósito
1. Selecione a conta (Corrente ou Poupança)
2. Clique em **"Depositar"**
3. Informe o valor
4. Confirme

#### Saque
1. Selecione a conta
2. Clique em **"Sacar"**
3. Informe o valor (deve ter saldo suficiente)
4. Confirme

#### Transferência (Poupança → Corrente)
1. Acesse a **Conta Poupança**
2. Clique em **"Transferir"**
3. Informe o **CPF da conta corrente de destino**
4. Informe o valor
5. Confirme

### 5️⃣ Monitoramento de Despesas

O sistema rastreia automaticamente todas as suas despesas (saques + transferências) e exibe um indicador colorido:

- **🟢 Verde**: Suas despesas estão abaixo de 10% dos seus depósitos totais
- **🟡 Amarelo**: Suas despesas atingiram 10-30% dos depósitos (atenção!)
- **🔴 Vermelho**: Suas despesas ultrapassaram 30% dos depósitos (alerta crítico com animação!)

O indicador aparece em:
- Página de escolha de conta
- Página da Conta Corrente
- Página da Conta Poupança

## 📁 Estrutura do Projeto

```
bank_project/
├── bank_project_back-end/          # Backend Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── br/com/fiap/bank_project/
│   │   │   │       ├── config/           # Configurações (CORS, etc)
│   │   │   │       ├── controller/       # Controllers REST
│   │   │   │       ├── entity/           # Entidades JPA
│   │   │   │       ├── repository/       # Repositórios
│   │   │   │       ├── service/          # Serviços
│   │   │   │       └── exception/        # Tratamento de exceções
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
│
├── bank_project-frontend/          # Frontend Next.js
│   ├── src/
│   │   └── app/
│   │       ├── page.tsx              # Página de login
│   │       ├── register/             # Página de registro
│   │       ├── account/              # Página de escolha de conta
│   │       ├── checking/             # Conta Corrente
│   │       ├── savings/              # Conta Poupança
│   │       ├── admin/                # Dashboard Admin
│   │       ├── users/                # Gerenciamento de Usuários
│   │       ├── checking-list/        # Lista de Contas Correntes
│   │       └── savings-list/         # Lista de Contas Poupança
│   ├── public/
│   ├── package.json
│   └── tailwind.config.ts
│
└── README.md
```

## 🔌 API Endpoints

### Usuários
- `POST /api/user` - Criar novo usuário
- `GET /api/user` - Listar todos os usuários
- `PUT /api/user/{cpf}` - Atualizar usuário
- `DELETE /api/user/{cpf}` - Deletar usuário (cascade)
- `POST /api/user/login` - Autenticar usuário
- `GET /api/user/{cpf}` - Buscar usuário por CPF

### Conta Corrente
- `POST /api/checking` - Criar conta corrente
- `GET /api/checking` - Listar todas as contas
- `GET /api/checking/{cpf}` - Buscar conta por CPF
- `PUT /api/checking/{cpf}` - Atualizar conta
- `DELETE /api/checking/{cpf}` - Deletar conta
- `PATCH /api/checking/{cpf}/deposit` - Realizar depósito
- `PATCH /api/checking/{cpf}/withdraw` - Realizar saque

### Conta Poupança
- `POST /api/savings` - Criar conta poupança
- `GET /api/savings` - Listar todas as contas
- `GET /api/savings/{cpf}` - Buscar conta por CPF
- `PUT /api/savings/{cpf}` - Atualizar conta
- `DELETE /api/savings/{cpf}` - Deletar conta
- `PATCH /api/savings/{cpf}/deposit` - Realizar depósito
- `PATCH /api/savings/{cpf}/withdraw` - Realizar saque

## 🎨 Recursos Visuais

### Animações e Transições
- ✨ Transições suaves de cores (500ms)
- 💓 Animação de pulso no indicador de despesas (quando ≥30%)
- 🎯 Feedback visual em todas as operações

### Responsividade
- 📱 Layout adaptativo para mobile
- 💻 Design otimizado para desktop
- 🖥️ Compatível com tablets

## 🛡️ Segurança

- ✅ Validação de CPF
- ✅ Senhas armazenadas (considere implementar hash em produção)
- ✅ Validação de saldo antes de saques
- ✅ Verificação de contas antes de transferências
- ✅ Tratamento de erros no backend e frontend

## 🐛 Troubleshooting

### Erro de Conexão com Banco de Dados
```
Verifique as credenciais no application.properties
Confirme se o banco Oracle está acessível
```

### Erro de CORS
```
Verifique se o backend está rodando na porta 8080
Confirme as configurações em CorsConfig.java e WebConfig.java
```

### Frontend não conecta ao Backend
```
Confirme se o backend está rodando em http://localhost:8080
Verifique se não há firewall bloqueando a porta
```

## 📝 Licença

Este projeto foi desenvolvido para fins educacionais na FIAP.

## 👥 Autores

- **Seu Nome** - Desenvolvimento Full Stack

## 🙏 Agradecimentos

- FIAP - Faculdade de Informática e Administração Paulista
- Professores e orientadores do curso

---

⭐ Se este projeto foi útil para você, considere dar uma estrela no GitHub!

🐛 Encontrou um bug? Abra uma [issue](https://github.com/seu-usuario/bank_project/issues)

💡 Tem uma sugestão? Contribua com um [pull request](https://github.com/seu-usuario/bank_project/pulls)