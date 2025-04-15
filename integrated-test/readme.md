# Testes Integrados

## Passo a passo para executar os testes integrados

1. Certifique-se de que o Docker está instalado e em execução na sua máquina.
2. Suba o serviço do backend necessário utilizando o Docker:
   ```bash
   docker-compose up -d
   ```
3. Instale as dependências do projeto utilizando o Yarn:
   ```bash
   yarn install
   ```
4. Execute os testes integrados com o comando:
   ```bash
   yarn test
   ```
5. Após a execução dos testes, você pode parar os containers do Docker com:
   ```bash
   docker-compose down
   ```
