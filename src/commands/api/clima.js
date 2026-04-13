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
const axios = require("axios"); //importa a biblioteca axios

module.exports = {
  //exporta o "data" e "execute", para ser usado em outros arquivos(como o index.js)

  data: new SlashCommandBuilder() //cria um novo comando e exporta ele para 'deploy-commands.js'
    .setName("clima") //escolhe o nome do comando(que vai ser o que o usuario terá que digitar para usa-lo)
    .setDescription("Mostra informações do clima de uma cidade") //escolhe a descrição(vai aparecer em baixo do nome)
    .addStringOption(
      (option) =>
        option // coloca opçao de escrever algo (obrigatorio nesse caso)
          .setName("cidade") // define o nome da opção
          .setDescription(
            "Digite o nome da cidade à qual será mostrado o clima",
          ) // define sua descrição
          .setRequired(true), // define que é obrigatoria prencher ela
    ),

  async execute(interaction) {
    // executa uma interação async (assincrona, ou seja, pode ter wait no meio e continuar rodando) e exporta tudo dentro dele para 'deplou-commands.js'

    await interaction.deferReply(); // espera até pegar a api

    const emojis = {
      //criando object com os emojis que variam conforme o clima
      Clear: "☀️",
      Clouds: "☁️",
      Rain: "🌧️",
      Drizzle: "🌦️",
      Thunderstorm: "⛈️",
      Snow: "❄️",
      Mist: "🌫️",
      Smoke: "🌫️",
      Haze: "🌫️",
      Dust: "🌪️",
      Fog: "🌫️",
      Sand: "🏖️",
      Ash: "🌋",
      Squall: "💨",
      Tornado: "🌪️",
    };
    let embed;
    let input;
    let linha_botao;
    let linha_input; // definindo variaveis
    let modal;
    let botao;
    let submit;
    let houveErro = false;

    try {
      //tenta pegar a opçao digita pelo usuario em 'cidade'

      async function mostrarClima(cidade) {
        // cria a função mostrarClima com a cidade como parametro

        const resposta = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${process.env.WEATHER_KEY}&units=metric&lang=pt_br`,
        ); // request na API
        const clima = resposta.data; // coloca as informações do request da API, na variavel clima

        const corAleatoria = Math.floor(Math.random() * 0xffffff); //cria variavel corAleatoria, com calculo para escolher um hexadecimal de cor aleatorio, para colocar a cor do card
        embed = new EmbedBuilder() //cria novo card
          .setColor(corAleatoria) // escolhe a cor do card (nesse caso, aleatoria)
          .setTitle("Informações de Clima") //escolhe o titulo do clima
          .setThumbnail(
            `https://openweathermap.org/img/wn/${clima.weather[0].icon}@2x.png`,
          ) // coloca uma imagem no canto superior direito (nesse caso é o icon do clima atual)
          .addFields(
            //adiciona fields no card (seria um campo, para mostrar algo digitado)
            { name: "🌍 Local", value: `${clima.name}, ${clima.sys.country} ` }, // informaões que vão ter dentro do card
            {
              name: `${emojis[clima.weather[0].main] || "🌡️"} Clima`,
              value: `${clima.weather[0].description.charAt(0).toUpperCase() + clima.weather[0].description.slice(1)}`,
            }, // aqui ele coloca o emoji de acord com clima, e da capitalize no clima dado pela API
            {
              name: "🌡️ Temperatura",
              value: `${clima.main.temp.toFixed(1)}°C`,
            },
            {
              name: "🤔 Sensação Térmica",
              value: `${clima.main.feels_like.toFixed(1)}°C`,
            },
            { name: "💧 Umidade", value: `${clima.main.humidity}%` },
            {
              name: "💨 Velocidade do vento",
              value: `${clima.wind.speed} m/s`,
            },
          );

        botao = new ButtonBuilder() // cria um botão para procurar clima de nova cidade
          .setCustomId("botao_novo_clima") // id do botao
          .setLabel("🔍 Buscar nova cidade") // nome que vai aparecer em cima do botao
          .setStyle(ButtonStyle.Primary); // estilo do botao

        linha_botao = new ActionRowBuilder().addComponents(botao); //adiciona uma linha com o botao embaixo do card
      }

      const cidade = interaction.options.getString("cidade"); // pega oque foi digitado pelo usuario na opção 'cidade' e guarda na variavel cidade
      await mostrarClima(cidade); // chama a função e coloca oque o usario digitou como parametro

      await interaction.editReply({
        embeds: [embed],
        components: [linha_botao],
      }); // mostrar o card com as informaões do cliam da cidade e o botao

      input = new TextInputBuilder() // cria nova area para usuario digitar
        .setCustomId("input_nova_cidade") // id do input
        .setLabel("Digite o nome da cidade") // o que vai aparecer em cima de onde o usario digita
        .setStyle(TextInputStyle.Short) // estilo do input
        .setRequired(true); // define que é obrigatorio digitar algo

      linha_input = new ActionRowBuilder().addComponents(input); // cria uma linha com o input

      modal = new ModalBuilder() // cria um modal (um pop-up que aparece ao apertar o botao, para o usario digitar nova cidade)
        .setCustomId("nova_cidade") // id do modal
        .setTitle("Buscar nova cidade") // titulo do modal
        .addComponents(linha_input); // adicona a linha com o input

      while (true) {
        // para sempre (até o usario nao clicar no botao em 30s ou nao mandar nada no modal em 15s)
        try {
          // tenta pegar a cidade digitada no modal e atualizar o card
          const mensagem = await interaction.fetchReply(); // pega a mensagem(card) enviado anteriormente

          const clique = await mensagem.awaitMessageComponent({ time: 30000 }); // espera o usuario interagir com algum compontente(nesse caso o botao) por 30 segundos antes de dar erro

          await clique.showModal(modal); // quando receber o clique, ele mostra o modal

          submit = await clique.awaitModalSubmit({ time: 15000 }); // espera o usuario responder o modal por 15 segundos antes de dar erro

          await submit.deferUpdate();

          await mostrarClima(
            submit.fields.getTextInputValue("input_nova_cidade"),
          ); // chama a função com a nova cidade digitada pelo usuario como parametro

          await interaction.editReply({
            content: "",
            embeds: [embed],
            components: [linha_botao],
          }); // mostra o novo card, com o botao (tira o content, para caso tenha mensagem de erro antiga)

          houveErro = false; // atualiza o houve erro para false
        } catch (erro) {
          // se de erro
          if (erro.response && erro.response.status === 404) {
            // se for erro de cidade invalida
            await interaction.editReply({
              content:
                "❌ Cidade não encontrada! Verifique o nome e tente novamente.",
              embeds: [],
              components: [linha_botao],
            }); // mostra 'cidade invalida', sem o embed antigo, mas com o botao(continua ativo para o usario digitar nova ciadade, volta pro inicio do loop)
            houveErro = true; // atualiza houve erro para true
          } else {
            throw erro; // se for outro erro ele joga o erro para o catch do final
          }
        }
      }
    } catch (erro) {
      // se der erro:

      if (erro.response && erro.response.status === 404) {
        // se for erro de cidade invalida
        await interaction.editReply(
          "❌ Cidade não encontrada! Verifique o nome e tente novamente.",
        ); // mostra 'cidade invalida', e usuario tem que usar novo comando (apenas se for a primeira interação)
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
          // se nao houve erro na ultima mensagem atualizada
          await interaction.editReply({
            embeds: [embed],
            components: [linha_botao],
          }); //mostra a mensagem com o botao desativado, e com o embed
        }
      } else {
        // se for qualquer outro erro
        await interaction.editReply(
          "😵 Algo deu errado ao buscar o clima. Tente novamente!",
        ); // no discord mostra que deu erro ao tentar pegar a opçao de cidade
        console.error(erro); // mostrar qual é o erro (no terminal)
      }
    }
  },
};
