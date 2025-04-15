#!/bin/bash

set -e  # Para o script em caso de erro

echo "Iniciando o processo de configuração dos projetos..."

# Função para verificar se um comando foi concluído com sucesso
wait_for_completion() {
  local command="$1"
  echo "Aguardando conclusão: $command"
  eval "$command"
  if [ $? -eq 0 ]; then
    echo "Concluído: $command"
  else
    echo "Erro ao executar: $command"
    exit 1
  fi
}

# Entrar em cada projeto e rodar yarn install
for project in integrated-test service receitas-frontend; do
  echo "Entrando no diretório $project..."
  cd "$project"
  
  echo "Instalando dependências com yarn..."
  wait_for_completion "yarn install"
  
  # Rodar npx prisma generate em integrated-test e service
  if [[ "$project" == "integrated-test" || "$project" == "service" ]]; then
    echo "Executando npx prisma generate em $project..."
    wait_for_completion "npx prisma generate"
  fi

  # Executar docker-init.sh dentro de service
  if [[ "$project" == "service" ]]; then
    echo "Executando docker-init.sh em $project..."
    wait_for_completion "./docker-init.sh"
  fi

  cd ..
done

# Executar yarn dev em receitas-frontend
echo "Iniciando o frontend em receitas-frontend..."
cd receitas-frontend
wait_for_completion "yarn dev"
cd ..

# Mensagem final
echo "Todos os processos foram concluídos com sucesso!"
