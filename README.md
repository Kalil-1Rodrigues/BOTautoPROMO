BOTautoPROMO (nome que vou substituir mais tarde)
Sistema de linha de comando para monitoramento e atualização de preços de produtos, com histórico de comparação entre o preço atual e o preço anterior.

Sobre o projeto

O BOTautoPROMO nasceu como um projeto de estudo prático de back-end com Node.js, evoluindo para uma ferramenta funcional de controle de preços. O sistema permite consultar um produto pelo nome, informar um novo preço e verificar automaticamente se houve queda em relação ao valor salvo anteriormente — persistindo o histórico em um banco de dados local.

Este projeto foi desenvolvido como parte do meu aprendizado em desenvolvimento back-end, aplicando conceitos de banco de dados relacional, programação orientada a objetos e operações assíncronas em JavaScript.

Funcionalidades
Cadastro e consulta de produtos por nome
Atualização de preços com comparação automática entre valor atual e anterior
Persistência de dados em banco SQLite local
Interface interativa via terminal, com fluxo contínuo de consultas
Alerta no console quando um produto sofre queda de preço
Tecnologias utilizadas
Node.js — ambiente de execução
better-sqlite3 — biblioteca para leitura e escrita no banco de dados SQLite
Inquirer.js — biblioteca para criação de prompts interativos no terminal
Arquitetura

O projeto segue uma separação simples de responsabilidades, dividida em duas classes principais:

Produto — responsável pela lógica de negócio (comparação de preços)
BancoDeDados — responsável exclusivamente pelo acesso ao banco de dados (busca, inserção e atualização de registros)

Essa separação mantém a lógica de comparação isolada de como os dados são armazenados, facilitando futuras mudanças de banco de dados sem impactar as regras de negócio.

Como executar

Pré-requisitos: Node.js instalado.

bash
# Clone o repositório
git clone https://github.com/seu-usuario/DBlack.Mercado.git

# Acesse a pasta do projeto
cd DBlack.Mercado

# Instale as dependências
npm install

# Execute o programa
node CPU.js

O programa vai solicitar o nome de um produto já cadastrado, o novo preço, e informará se houve queda de preço, salvando o novo valor no banco.

Roadmap
 Integração com a API do Telegram para envio automático de alertas de queda de preço
 Cadastro de novos produtos via terminal
 Testes automatizados
Autor

Desenvolvido por mim como projeto de portfólio e estudo prático de back-end com Node.js.
