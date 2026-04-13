const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js"); // importa componentes da biblioteca 'discord.js'
const axios = require("axios"); // importa a blibioteca 'axios'

module.exports = {
  //exporta o "data" e "execute", para ser usado em outros arquivos(como o index.js)

  data: new SlashCommandBuilder() //cria um novo comando e exporta ele para 'deploy-commands.js'
    .setName("filme") //escolhe o nome do comando(que vai ser o que o usuario terá que digitar para usa-lo)
    .setDescription("Mostra informações de um filme") //escolhe a descrição(vai aparecer em baixo do nome)
    .addStringOption(
      (option) =>
        option // coloca opçao de escrever algo (obrigatorio nesse caso)
          .setName("titulo") // define o nome da opção
          .setDescription(
            "Digite o nome do filme à qual será mostrado as informações",
          ) // define sua descrição
          .setRequired(true), // define que é obrigatoria prencher ela
    ),

  async execute(interaction) {
    // executa uma interação async (assincrona, ou seja, pode ter wait no meio e continuar rodando) e exporta tudo dentro dele para 'deplou-commands.js'

    await interaction.deferReply(); // espera até pegar a api

    let embed;
    let input;
    let linha_botao;
    let linha_input; // definindo variaveis
    let modal;
    let botao;
    let submit;
    let houveErro = false;

    try {
      async function InfoFilme(nome_filme) {
        // cria a função InfoFilme com o nome_filme como parametro

        const resposta = await axios.get(
          `http://www.omdbapi.com/?t=${encodeURIComponent(nome_filme)}&apikey=${process.env.OMDB_API_KEY}`,
        ); // request na API
        const filme_dados = resposta.data; // coloca as informações do request da API, na variavel filme_dados

        if (filme_dados.Response === "False") {
          // se for erro de não encontrar o filme
          throw new Error("Filme não encontrado"); // joga o erro para o catch, com mensagem 'filme não encontrado'
        }

        const corAleatoria = Math.floor(Math.random() * 0xffffff); //cria variavel corAleatoria, com calculo para escolher um hexadecimal de cor aleatorio, para colocar a cor do card
        embed = new EmbedBuilder() //cria novo card
          .setColor(corAleatoria) // escolhe a cor do card (nesse caso, aleatoria)
          .setTitle("Informações do filme") //escolhe o titulo do filme
          .addFields(
            { name: "Título do Filme", value: `${filme_dados.Title}` }, // informaões que vão ter dentro do card
            {
              name: "Gênero",
              value:
                filme_dados.Genre !== "N/A"
                  ? filme_dados.Genre
                  : "Indisponível",
            },
            {
              name: "Duração",
              value:
                filme_dados.Runtime !== "N/A"
                  ? filme_dados.Runtime
                  : "Indisponível",
            },
            {
              name: "Diretor",
              value:
                filme_dados.Director !== "N/A"
                  ? filme_dados.Director
                  : "Indisponível",
            },
            {
              name: "Sinopse",
              value:
                filme_dados.Plot !== "N/A" ? filme_dados.Plot : "Indisponível",
            }, // caso venha sem sinopse, ele mostra 'Sinopse Indisponível', para não mostrar 'N/A'
            {
              name: "Nota",
              value:
                filme_dados.imdbRating !== "N/A"
                  ? filme_dados.imdbRating
                  : "Indisponível",
            },
            {
              name: "Data de lançamento",
              value:
                filme_dados.Released !== "N/A"
                  ? filme_dados.Released
                  : "Indisponível",
            },
          )
          .setImage(filme_dados.Poster !== "N/A" ? filme_dados.Poster : null); // caso venha sem foto ele não mostra nada, para não mostrar 'N/A'

        botao = new ButtonBuilder() // cria um botão para procurar informações de nova cidade
          .setCustomId("botao_novo_filme") // id do botao
          .setLabel("🔍 Buscar novo filme") // nome que vai aparecer em cima do botao
          .setStyle(ButtonStyle.Primary); // estilo do botao

        linha_botao = new ActionRowBuilder().addComponents(botao); //adiciona uma linha com o botao embaixo do card
      }

      const nome_filme = interaction.options.getString("titulo"); // pega oque foi digitado pelo usuario na opção 'titulo' e guarda na variavel nome_filme
      await InfoFilme(nome_filme); // chama a função e coloca oque o usario digitou como parametro

      await interaction.editReply({
        embeds: [embed],
        components: [linha_botao],
      }); // mostrar o card com as informaões do filme e o botao

      input = new TextInputBuilder() // cria nova area para usuario digitar
        .setCustomId("input_novo_filme") // id do input
        .setLabel("Digite o nome do filme") // o que vai aparecer em cima de onde o usario digita
        .setStyle(TextInputStyle.Short) // estilo do input
        .setRequired(true); // define que é obrigatorio digitar algo

      linha_input = new ActionRowBuilder().addComponents(input); // cria uma linha com o input

      modal = new ModalBuilder() // cria um modal (um pop-up que aparece ao apertar o botao, para o usario digitar novo filme)
        .setCustomId("novo_filme") // id do modal
        .setTitle("Buscar novo filme") // titulo do modal
        .addComponents(linha_input); // adicona a linha com o input

      while (true) {
        // para sempre (até o usario nao clicar no botao em 30s ou nao mandar nada no modal em 15s)
        try {
          // tenta pegar o filme digitado no modal e atualizar o card
          const mensagem = await interaction.fetchReply(); // pega a mensagem(card) enviado anteriormente

          const clique = await mensagem.awaitMessageComponent({ time: 30000 }); // espera o usuario interagir com algum compontente(nesse caso o botao) por 30 segundos antes de dar erro

          await clique.showModal(modal); // quando receber o clique, ele mostra o modal

          submit = await clique.awaitModalSubmit({ time: 15000 }); // espera o usuario responder o modal por 15 segundos antes de dar erro

          await submit.deferUpdate();

          await InfoFilme(submit.fields.getTextInputValue("input_novo_filme")); // chama a função com o novo filme digitada pelo usuario como parametro

          await interaction.editReply({
            content: "",
            embeds: [embed],
            components: [linha_botao],
          }); // mostra o novo card, com o botao (tira o content, para caso tenha mensagem de erro antiga)

          houveErro = false; // atualiza o houve erro para false
        } catch (erro) {
          if (submit && erro.message === "Filme não encontrado") {
            // se for erro de filme não encontrado
            await interaction.editReply({
              content:
                "❌ Filme não encontrado! Verifique o nome e tente novamente.",
              embeds: [],
              components: [linha_botao],
            }); // mostra 'filme não encontrado', sem o embed antigo, mas com o botao(continua ativo para o usario digitar novo filme, volta pro inicio do loop)
            houveErro = true;
          } else {
            throw erro; // se for outro erro ele joga o erro para o catch do final
          }
        }
      }
    } catch (erro) {
      // se der erro:

      if (erro.message === "Filme não encontrado") {
        // se for erro de filme não encontrado
        await interaction.editReply(
          "❌ Filme não encontrado! Verifique o nome e tente novamente.",
        ); // mostra 'filme não encontrado', sem o embed antigo, mas com o botao(continua ativo para o usario digitar novo filme, volta pro inicio do loop)
      } else if (erro.code === "InteractionCollectorError") {
        // se for erro de ter ultrapassado o tempo limite de espera de interação
        botao.setDisabled(true); //desativa o botao
        linha_botao = new ActionRowBuilder().addComponents(botao); //atualiza o botao na linha(com ele agora desativado)
        if (houveErro) {
          // se teve erro na ultima mensagem atualizada
          await interaction.editReply({
            embeds: [],
            components: [linha_botao],
          }); //mostra a mensagem com o botao desativado, e sem o embed, e com a mensagem de erro
        } else {
          await interaction.editReply({
            embeds: [embed],
            components: [linha_botao],
          }); //mostra a mensagem com o botao desativado, e com o embed
        }
      } else {
        await interaction.editReply(
          "😵 Algo deu errado ao buscar o filme. Tente novamente!",
        ); // no discord mostra que deu erro ao tentar pegar a opçao de filme
        console.error(erro); // mostrar qual é o erro (no terminal)
      }
    }
  },
};
