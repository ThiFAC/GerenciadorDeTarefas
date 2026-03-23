//Seleção dos elementos do DOM
const formulario = document.querySelector('#formularioTarefa');
const lista = document.querySelector('#tarefaLista');
const busca = document.querySelector('#buscar');

// Recuperar tarefas do localStorage ou (||) iniciar com array vazio
let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

//Salvando tarefas no localStorage
function salvarLocalStorage() {
  localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

//função para mostrar as tarefas na tela
function renderizarTarefas(filtro = '') {

 //Limpa a lista antes de mostrar as tarefas filtradas
  lista.innerHTML = '';

//Filtra as tarefas com base no título usando o método filter e includes para busca parcial
  const filtradas = tarefas.filter(tarefa =>
    tarefa.titulo.toLowerCase().includes(filtro.toLowerCase())
  );

//Se não houver tarefas filtradas, exibe uma mensagem
  if (filtradas.length === 0) {
    lista.innerHTML = '<p>Nenhuma tarefa encontrada.</p>';
    return;
  }

  //percorre as tarefas filtradas e cria os elementos HTML para cada uma
  filtradas.forEach((tarefa) => {

    //Encontra o índice original da tarefa para uso na exclusão
    const indexOriginal = tarefas.indexOf(tarefa);

    const div = document.createElement('div');
    div.classList.add('tarefa');

    //Adiciona classe de estilo para tarefas concluídas
    if (tarefa.status === 'Concluída') {
      div.classList.add('concluida');
    }

    //Conteudo da tarefa
    div.innerHTML = `
      <strong>${tarefa.titulo}</strong>
      <span>${tarefa.descricao}</span>
      <small>Prioridade: ${tarefa.prioridade}</small>
      <small>Data: ${tarefa.data}</small>
      <small>Status: ${tarefa.status}</small>
    `;

    const acoes = document.createElement('div');
    acoes.classList.add('acoes');

    //Botão Concluir
    const btnConcluir = document.createElement('button');
    btnConcluir.textContent = 'Concluir';
    btnConcluir.onclick = () => {
      tarefa.status = 'Concluída';
      salvarLocalStorage();
      renderizarTarefas(busca.value);
    };

    //Botão Editar
    const btnEditar = document.createElement('button');
    btnEditar.textContent = 'Editar';
    btnEditar.onclick = () => {
      const novoTitulo = prompt('Novo título:', tarefa.titulo);
      const novaDesc = prompt('Nova descrição:', tarefa.descricao);

      if (novoTitulo && novaDesc) {
        tarefa.titulo = novoTitulo;
        tarefa.descricao = novaDesc;
        salvarLocalStorage();
        renderizarTarefas(busca.value);
      }
    };

    //Botão Excluir
    const btnExcluir = document.createElement('button');
    btnExcluir.textContent = 'Excluir';
    btnExcluir.onclick = () => {
      tarefas.splice(indexOriginal, 1);
      salvarLocalStorage();
      renderizarTarefas(busca.value);
    };

    //adicionar botões de ação à tarefa
    acoes.appendChild(btnConcluir);
    acoes.appendChild(btnEditar);
    acoes.appendChild(btnExcluir);

    div.appendChild(acoes);
    lista.appendChild(div);
  });
}

//Evento de Cadastro de nova tarefa
formulario.addEventListener('submit', (e) => {
  e.preventDefault();

  const titulo = document.querySelector('#titulo').value.trim();
  const descricao = document.querySelector('#descricao').value.trim();
  const prioridade = document.querySelector('#prioridade').value;

  //Validação
  if (!titulo || !descricao) {
    alert('Preencha todos os campos!');
    return;
  }

  //Cria nova tarefa e adiciona ao array de tarefas
  const novaTarefa = {
    titulo,
    descricao,
    prioridade,
    status: 'Pendente',
    data: new Date().toLocaleDateString()
  };

  tarefas.push(novaTarefa);
  salvarLocalStorage();
  formulario.reset();
  renderizarTarefas();
});

//Evento de Busca
busca.addEventListener('input', () => {
  renderizarTarefas(busca.value);
});

//inicializar a aplicação
renderizarTarefas();
