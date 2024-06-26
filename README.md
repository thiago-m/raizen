# Sobre o projeto Raizen
Este é um projeto utilizando Typescript, serverless-framework, nanoId, aws lambda, aws apiGateway, aws dynamoDB e dynamoose. Ele foi feito usando o clean architecture e contem testes unitários usando o Jest.

## Como Rodar o Projeto
1. Pré-requisitos:
* Node.js, npm, serverless-framework e aws_cli instalados e configurados.
* Rer a tabela `Raizen_Employee` no dynamodb criada na região de sa-east-1 com o `id` do tipo string como hashKey
* Caso não tenha o a tabela assim que executar uma api a tabela será criada, os requests podem falhar durante a criação da tabela

2. Clonar o Repositório:
```
git clone https://github.com/thiago-m/raizen.git
```
3. Instalar Dependências:
```
npm install
```
4. Executar Localmente:
```
sls offline
```
5. Deploy:
```
sls deploy
```

## Funcionalidades
__Cadastro de funcionários:__ O projeto oferece um endpoint POST para cadastro de funcionários
__Listar funcionários:__ O projeto oferece um endpoint GET para buscar todos os funcionários
__Retornar funcionário pelo id:__ O projeto oferece um endpoint GET para retornar um funcionário pelo id
__Atualizar funcionário:__ O projeto oferece um endpoint PUT para atualizar um funcionário
__Deletar funcionário:__ O projeto oferece um endpoint DELETE para deletar um funcionário

## Arquitetura
O projeto foi feito usando o clean architecture __Estrutura de pastas:__

````
src/
├── application/
│   ├── ports/
│   │   └── IdGenerator.ts
│   └── use-cases/
│       └── employee/
│           ├── Create.ts
│           ├── Delete.ts
│           ├── GetById.ts
│           ├── List.ts
│           └── Update.ts
├── domain/
│   ├── entities/
│   │   └── Employee.ts
│   └── repositories/
│       └── EmployeeRepository.ts
├── infrastructure/
│   ├── database/
│   │   └── dynamoose
│   │       └── EmployeeDBRepository.ts
│   ├── serverless/
│   │   └── EmployeeHandler.ts
│   ├── services/
│   │   └── NanoIdGenerator.ts
├── interfaces/
│   ├── controllers/
│   │   ├── EmployeeController.ts
│   ├── dtos/
│   │   └── EmployeeSchema.ts
│   └── utils/
└        └── response.ts
tests/
serverless.yml
````
### __src/application/__
Esta camada contém a lógica da aplicação e os casos de uso. Ela orquestra a interação entre as entidades e os repositórios.
- `ports/` Define interfaces que representam portas para comunicação entre a camada de aplicação e outras camadas.
	- `IdGenerator.ts` Interface para o gerador de IDs
- `use-cases/` Contém os casos de uso relacionado para cada funcionalidade
	- `employee/Create.ts` Caso de uso para criação de funcionários
	- `employee/Delete.ts` Caso de uso para Deletar funcionário
	- `employee/GetById.ts` Caso de uso para Buscar funcionário pelo id
	- `employee/List.ts` Caso de uso para listar funcionários
	- `employee/Update.ts` Caso de uso para atualizar funcionário

### __src/domain/__
Esta camada representa o domínio do negócio, contendo entidades e interfaces de repositórios.
- `entities/` Define as entidades de domínio
	- `Employee.ts` Entidade que representa um funcionário
- `repositories/` Define interfaces para os repositórios do domínio
	- `EmployeeRepository.ts` Interface para o repositório de funcionários

### __src/infrastructure/__
Esta camada contém implementações específicas de infraestrutura, como banco de dados e serviços externos
- `database/` Implementações de repósitorios usando tecnologias específicas
	- `dynamoose/EmployeeDBRepository.ts` Implementação do repositório de funcionários usando DynamoDB e dynamoose
- `serverless/` Configurações e implementações específicas do Serverless Framework
	- `EmployeeHandler.ts` Arquivo de configuração do Serverless Framework
- `services/` Serviços externos ou utilitários
	- `NanoIdGenerator.ts` Serviço para gerar IDs únicos usando NanoID

### __src/interfaces__
Esta camada define as interfaces do sistema com o mundo externo, como controladores de API e mapeamento de DTOs

- `controllers/` Controladores que lidam com as requisições HTTP
	- `EmployeeController.ts` Controlador para operações relacionadas a funcionários
- `dtos/` Define os DTOs usados na interface
	- `EmployeeSchema.ts` DTO e esquema de validação para a criação e atualização de funcionários
- `utils/` Utilitários usados na camada de interfaces
	- `response.ts` Utilitário para padronizar respostas HTTP

### __tests/__
Camada onde fica os testes

### __serverless.yml__
Onde fica as configurações do serverless framework, permissões do dynamodb dentre varias outras possíveis configurações na aws

## Contribuindo
Se você deseja contribuir com este projeto, por favor, siga estas etapas:

1. Faça um fork do repositório
2. Crie uma branch para a sua feature (`git checkout -b feature/NomeDaSuaFeature`)
3. Faça commit das suas mudanças (`git commit -am 'Adicionando uma nova feature`)
4. Faça push para a branch (`git push origin feature/NomeDaSuaFeature`)
5. Crie um novo `Pull Request`
