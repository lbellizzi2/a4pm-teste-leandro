# A4PM Teste - Projeto Integrado

Este repositório contém três projetos principais: `integrated-test`, `service` e `receitas-frontend`. Cada um deles desempenha um papel específico no ecossistema do projeto. Este documento explica como configurar e inicializar todos os projetos de forma integrada, além de como executar os testes.

## Estrutura do Projeto

- **integrated-test**: Contém os testes integrados para validar o funcionamento do backend.
- **service**: Backend principal do projeto, responsável pela lógica de negócios e comunicação com o banco de dados.
- **receitas-frontend**: Frontend do projeto, desenvolvido com Nuxt.js.

## Inicialização do Projeto

### Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

- **Node.js** (versão recomendada: 18.x ou superior)
- **Yarn** (gerenciador de pacotes)
- **Docker** e **Docker Compose**

### Passo a Passo

1. Clone o repositório e navegue até o diretório raiz do projeto.

2. Execute o script de configuração para inicializar todos os projetos.

#### No Linux/Mac (Bash)

```bash
./setup-projects.sh
```
./setup-projects.sh

#### No Windows (PowerShell)

```bash
bash setup-projects.sh
```

Durante a execução do script, será solicitado que você escolha a versão do vue-jest a ser instalada. Basta selecionar a primeira opção pressionando Enter.

O script irá:

Instalar as dependências de cada projeto usando yarn install.
Gerar os artefatos do Prisma nos projetos integrated-test e service.
Inicializar o backend (service) com o Docker.
Iniciar o servidor de desenvolvimento do frontend (receitas-frontend).
Execução dos Testes
Após a inicialização, você pode executar os testes integrados no projeto integrated-test. Para isso:

1. Navegue até o diretório integrated-test:
```bash
cd integrated-test
```

2. Execute os testes:
```bash
yarn test
```

Os testes validarão a integração entre os serviços e garantirão que o backend está funcionando corretamente.

Finalização
Após concluir os testes, você pode parar os containers do Docker com o seguinte comando:
```bash
docker-compose down
```


Dentro do projeto service existe um arquivo docker-init.sh que inicializa o backend caso deseje inicializar separadamente.

### Muito importante, na primeira execução, pode ocorrer do backend não ficar disponivel por não aguardar o tempo necessário para inicialização do database, então precisa reiniciar o serviço após o database estar online.

Reiniciando o Container do Backend
Caso seja necessário reiniciar o container do backend, você pode usar o seguinte comando:
```bash
docker restart <nome-do-container>
```

Substitua <nome-do-container> pelo nome do container do backend. Para verificar o nome do container, use:
```bash
docker ps
```

Visualizando os Logs do Container
Para visualizar os logs do container do backend, utilize o comando:
```bash
docker logs <nome-do-container>
```

Se quiser acompanhar os logs em tempo real, adicione a flag -f:
```bash
docker logs -f <nome-do-container>
```


### Observações
Certifique-se de que o Docker está em execução antes de iniciar o processo.
Caso encontre problemas, verifique os logs gerados pelo script ou pelos containers do Docker.
Com isso, o projeto estará configurado e pronto para uso!