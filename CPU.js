const inquirer = require('inquirer').default;

// Importa a biblioteca que permite o JS conversa com o banco SQLite

const Database = require('better-sqlite3');

// Abre o arquivo precos.db (ou cria, se ainda não existi) e guarda a conexão em "db"

const db = new Database('precos.db');

// Garante que a tabela "produtos" existe, com essas 4 colunas (só cria na 1ª vez, depois ignora)
// Ou seja acaba criando de qualquer jeito
db.exec(`
  CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY,
    nome TEXT,
    precoAtual REAL,
    precoAnterior REAL
  )
`);
// Classe responsável só pela LÓGICA de comparar preços (não mexe em banco nem no Telegram)
// (em "Constructor") Roda automaticamente quando criamos um "new Produto(...)", preenchendo os 3 dados do objeto
class Produto {
    constructor(nome, precoAtual, precoAnterior) {
        this.nome = nome;
        this.precoAtual = precoAtual;
        this.precoAnterior = precoAnterior;
  }
// F - Retorna true se o preço atual for menor que o preço anterior (ou seja, se caiu)
  caiuDePreco() {
    return this.precoAtual < this.precoAnterior;
  }
}
// Classe responsável só por LER e ESCREVER no banco (não decide nada, só executa os comandos)
// Em "Constructor" Recebe a conexão "db" já aberta (não cria uma nova aqui) e guarda pra usar nos métodos abaixo
class BancoDeDados {
  constructor(conexao) {
    this.db = conexao;
  }
// Busca TODOS os produtos salvos na tabela, sem filtro nenhum
  buscarProdutos() {
    return this.db.prepare('SELECT * FROM produtos').all();
}
  
// Adiciona um produto novo na tabela (usado só na primeira vez, pra popular o banco)
// Os "?" são preenchidos com segurança pelos valores passados no .run() logo abaixo
// E os "?" tambem são de segurança, pra evitar SQL Injection 
  inserirProduto(nome, precoAtual, precoAnterior) {
    const comando = this.db.prepare(
      'INSERT INTO produtos (nome, precoAtual, precoAnterior) VALUES (?, ?, ?)'
  );
    comando.run(nome, precoAtual, precoAnterior);
}

// Atualiza o preço de um produto específico (usa o "id" pra saber qual linha mudar)
//NO SQL
  atualizarPreco(id, novoPreco, precoAtualAntigo) {
    const comando = this.db.prepare(
      'UPDATE produtos SET precoAnterior = ?, precoAtual = ? WHERE id = ?'
  );
    comando.run(precoAtualAntigo, novoPreco, id);
}

// pesquisa de produto
// Busca UM produto específico pelo id (usado quando já sabemos exatamente qual produto queremos)
  buscarProdutoPorId(id) {
    // busca SÓ UM produto específico, filtrado pelo id
    return this.db.prepare('SELECT * FROM produtos WHERE id = ?').get(id);
}

  buscarProdutoPorNome(nome) {
    // busca SÓ UM produto específico, filtrado pelo nome
    return this.db.prepare('SELECT * FROM produtos WHERE nome = ?').get(nome);
  }

}

// Cria o objeto "banco", que agora tem acesso aos métodos de buscar/inserir/atualizar
const banco = new BancoDeDados(db);

// Pega a lista real de produtos salvos no banco, pra comparar os preços a seguir
const todosOsProdutos = banco.buscarProdutos();

// Só pra averiguar que os dados vieram certos do banco (n é mt importante)
console.log(todosOsProdutos);

// Bloco do input
// Inserir o preço do produto novo
let continuar = true;

async function pedidoProduto() {
  while (continuar) {
    // perguntar nome primeiro
    const respostaNome = await inquirer.prompt([
      {
        type: 'input',
        name: 'nomeProduto',
        message: 'Digite o nome do produto:',
      }
    ]);

    const produtoSalvo = banco.buscarProdutoPorNome(respostaNome.nomeProduto);

    if (!produtoSalvo) {
      console.log(`Produto "${respostaNome.nomeProduto}" não encontrado no banco de dados.`);

      const continuarReposta = await inquirer.prompt([
        {
          type: 'confirm',
          name: 's',
          message: 'Deseja verificar outro produto? (s/n)',
        }
      ]);

      continuar = continuarReposta.s;
      continue;
    }

    console.log(`Produto encontrado: ${produtoSalvo.nome}, preço atual: R$${produtoSalvo.precoAtual}`);

    const respostaPreco = await inquirer.prompt([
      {
        type: 'number',
        name: 'precoPNovo',
        message: 'Digite o preço NOVO deste produto:',
      }
    ]);

    const produto = new Produto(
      produtoSalvo.nome,
      respostaPreco.precoPNovo,
      produtoSalvo.precoAtual
    );

    if (produto.caiuDePreco()) {
      console.log(`${produto.nome} caiu de preço! De R$${produto.precoAnterior} para R$${produto.precoAtual}`);
      banco.atualizarPreco(produtoSalvo.id, produto.precoAtual, produto.precoAnterior);
    } else {
      console.log(`${produto.nome} não caiu de preço.`);
    }

    const continuarReposta = await inquirer.prompt([
      {
        type: 'confirm',
        name: 's',
        message: 'Deseja verificar outro produto? (s/n)',
      }
    ]);

    continuar = continuarReposta.s;
  }

  console.log('Programa encerrado.');
}

pedidoProduto();

// Percorre cada produto salvo, um de cada vez, pra comparar com o preço novo
// Cria um objeto Produto "de teste", misturando o preço novo com o preço que já tava salvo

// Se caiu de preço, mostra o alerta (depois isso vai virar o envio pro Telegram)
 
