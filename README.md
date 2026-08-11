BOTautoPROMO

Sistema de linha de comando para monitoramento de preços: consulta um produto, recebe um novo valor, compara com o preço salvo anteriormente e atualiza o histórico no banco de dados.

Projeto de estudo prático de back-end com Node.js, aplicando banco de dados relacional, POO e operações assíncronas.

Funcionalidades
Consulta de produtos por nome
Atualização de preço com comparação automática (atual vs. anterior)
Persistência em banco SQLite local
Fluxo interativo contínuo via terminal
Tecnologias
Node.js
better-sqlite3 — leitura e escrita no banco SQLite
Inquirer.js — prompts interativos no terminal
Arquitetura
Produto — lógica de comparação de preços
BancoDeDados — acesso ao banco (busca, inserção, atualização)

Separação que isola a regra de negócio de como os dados são armazenados.

Como executar
bash
git clone https://github.com/seu-usuario/BOTautoPROMO
cd BOTautoPROMO
npm install
node CPU.js
Roadmap
 Alertas automáticos via Telegram
 Cadastro de novos produtos pelo terminal
 Testes automatizados
Autor

Desenvolvido por mim, como projeto de portfólio e estudo de back-end com Node.js.
