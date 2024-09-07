# UneCont: Teste

Teste para UneCont utilizando .NET 8.0 usando o padrão MVC. Ele apresenta indicadores e gráficos financeiros, além de uma listagem de notas assim como solicitado no teste técnico...

## Tecnologias Utilizadas

- **Back-End**: .NET 8.0 MVC
  - **Pacotes**: `Microsoft.EntityFrameworkCore.Design` e `Microsoft.EntityFrameworkCore.SqlServer` (versão 8.0.8)

- **Front-End**:
  - **ApexCharts**: Para gráficos interativos.
  - **DataTables**: Para tabelas.
  - **Bootstrap**: Para design responsivo. (solicitado)

## Configuração (Dotnet)

1. **Banco de Dados**: Atualize o arquivo `appsettings.json` com as credenciais do seu banco de dados:
    ```json
    {
      "ConnectionStrings": {
        "DefaultConnection": "Server=SEU_SERVIDOR;Database=SEU_BANCO;User Id=SEU_USUARIO;Password=SUA_SENHA;"
      }
    }
    ```

2. **Execução (dotnet)**:
    - Clone o repositório.
    - Instale as dependências com: `dotnet restore`
    - Configure o banco de dados no `appsettings.json`.
    - Renomeie o `appsettings.json` para `appsettings.Development.json` caso esteja rodando em dev.
    - Execute as migrações com: `dotnet ef database update`.
    - Inicie a aplicação com: `dotnet run`.

A aplicação estará disponível em `http://localhost:7255`.

## Execução (Docker) DEV

1. **Configure o IPv4**:
    - Abra o arquivo `docker-compose.yml` e substitua `YOU_IPV4` pelo seu endereço IPv4, que pode ser obtido usando o comando `ipconfig`.

2. **Crie o `appsettings.Development.json`**:
    - Crie o arquivo `appsettings.Development.json` com base no `appsettings.json`.

3. **Construa e inicie os contêineres**:
    ```bash
    docker-compose up --build
    ```

4. **Configure o banco de dados**:
    - Conecte-se ao banco de dados na porta `1400` com usuário `sa` e senha `YouPassword123` (Default).
    - Crie o banco de dados `unecont`.
    - Execute o script `init.sql`.

5. **Acesse a aplicação**:
    - Abra [http://localhost:5000](http://localhost:5000) no navegador.

