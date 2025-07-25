# IFcode Backend
Este projeto é o backend para o IFcode, uma aplicação desenvolvida para gerenciar usuários, tarefas e funcionalidades relacionadas a código.

## Tecnologias Utilizadas
<ul>
    <li><b>Node.js:</b> Plataforma de execução JavaScript.</li>
    <li><b>Express:</b> Framework web para Node.js.</li>
    <li><b>TypeScript:</b> Superset tipado de JavaScript.</li>
    <li><b>MySQL:</b> Sistema de gerenciamento de banco de dados relacional.</li>
    <li><b>Docker:</b> Plataforma para desenvolver, enviar e executar aplicações em contêineres.</li>
    <li><b>Docker Compose:</b> Ferramenta para definir e executar aplicações Docker multi-contêiner.</li>
</ul>

## Estrutura do Projeto

<ul>
    <li><code>db.ts</code>: Configuração da conexão com o banco de dados MySQL.</li>
    <li><code>Dockerfile</code>: Define a imagem Docker para a aplicação backend.</li>
    <li><code>docker-compose.yml</code>: Define os serviços Docker para a aplicação (backend e banco de dados).</li>
    <li><code>init.sql</code>: Script SQL para inicializar o banco de dados e criar tabelas.</li>
    <li><code>package.json</code>: Gerenciador de pacotes e scripts do projeto.</li>
    <li><code>server.ts</code>: Ponto de entrada da aplicação Express, configurando rotas e middleware.</li>
    <li><code>Routes/</code>: Contém os arquivos de definição de rotas para diferentes funcionalidades (autenticação, código, tarefas, usuários).</li>
</ul>

## Como Instalar e Rodar
Você pode configurar e executar este projeto usando Docker e Docker Compose, o que simplifica o gerenciamento das dependências.

### Pré-requisitos
<ul>
    <li><a href="https://www.docker.com">Docker Desktop</a> (inclui Docker Engine e Docker Compose)</li>
</ul>

### Passos para Instalação e Execução
<ol>
    <li><strong>Clone o Repositório:</strong><br>
        <pre><code>git clone https://github.com/Elitinho123456/ifcode_backend
cd ifcode_backend</code></pre>
    </li>
    <li><strong>Crie o arquivo <code>.env</code>:</strong><br>
    Crie um arquivo chamado <code>.env</code> na raiz do projeto e adicione as seguintes variáveis de ambiente:
    <pre><code>MYSQL_HOST=db
MYSQL_USER=root
MYSQL_PASSWORD=secret
MYSQL_DATABASE=codespace
PORT=5001</code></pre>
        <ul>
            <li><code>MYSQL_HOST</code>: <code>db</code> é o nome do serviço do banco de dados definido no <code>docker-compose.yml</code>.</li>
            <li><code>MYSQL_USER</code>: O usuário do MySQL (definido como <code>root</code>).</li>
            <li><code>MYSQL_PASSWORD</code>: A senha do MySQL (definido como <code>secret</code>).</li>
            <li><code>MYSQL_DATABASE</code>: O nome do banco de dados (definido como <code>codespace</code>).</li>
            <li><code>PORT</code>: A porta em que o servidor Express será executado.</li>
        </ul>
    </li>
    <li><strong>Inicie os serviços com Docker Compose:</strong><br>
    No diretório raiz do projeto, execute:
    <pre><code>docker-compose up --build -d</code></pre>
        <ul>
            <li><code>--build</code>: Constrói as imagens Docker antes de iniciar os contêineres.</li>
            <li><code>-d</code>: Inicia os contêineres em modo "detached" (em segundo plano).</li>
        </ul>
    </li>
    <li><strong>Verifique se os contêineres estão rodando:</strong><br>
    Execute:
    <pre><code>docker-compose ps</code></pre>
    Você deverá ver os serviços <code>app</code> e <code>db</code> com status <code>Up</code>.
    </li>
    <li><strong>Acesse a Aplicação:</strong><br>
    O backend estará disponível em: <br>
    <a href="http://localhost:5001" target="_blank">http://localhost:5001</a>
    </li>
</ol>

## Endpoints da API

A API expõe os seguintes grupos de rotas:

<ul>
    <li><code>/api/auth</code>: Rotas para autenticação de usuários (registro, login, etc.).</li>
    <li><code>/api/code</code>: Rotas relacionadas a funcionalidades de código.</li>
    <li><code>/api/tarefas</code>: Rotas para gerenciamento de tarefas (CRUD de tarefas).</li>
    <li><code>/api/user</code>: Rotas para gerenciamento de usuários.</li>
</ul>

> Consulte os arquivos na pasta <code>Routes/</code> para detalhes específicos sobre cada endpoint.

## Desenvolvimento

### Instalação Manual (Alternativa ao Docker)
Se preferir rodar o projeto sem Docker (apenas para desenvolvimento e com MySQL já instalado localmente):

<ol>
    <li><strong>Instale as dependências:</strong><br>
        <pre><code>npm install</code></pre>
    </li>
    <li><strong>Configure o banco de dados:</strong><br>
    Certifique-se de que um servidor MySQL esteja rodando e que as variáveis de ambiente no seu <code>.env</code> apontem corretamente para ele (ex: <code>MYSQL_HOST=localhost</code>).<br>
    Execute o script <code>init.sql</code> no seu banco de dados para criar as tabelas necessárias.
    </li>
    <li><strong>Inicie o servidor de desenvolvimento:</strong><br>
        <pre><code>npm run dev</code></pre>
    O servidor será iniciado na porta especificada no seu arquivo <code>.env</code> (padrão: <code>5001</code>).
    </li>
</ol>

## Scripts Disponíveis

No arquivo <code>package.json</code>, você encontrará os seguintes scripts:

<ul>
    <li><code>npm run dev</code>: Inicia o servidor de desenvolvimento usando <code>tsx watch</code>, com recarregamento automático.</li>
    <li><code>npm test</code>: Script de testes (atualmente é apenas um placeholder).</li>
</ul>

## Contribuição

Sinta-se à vontade para contribuir com este projeto!  
Por favor, siga boas práticas de desenvolvimento e envie pull requests com melhorias ou correções de bugs.

## Licença

Este projeto está licenciado sob a licença <strong>ISC</strong>.