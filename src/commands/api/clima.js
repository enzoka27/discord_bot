const { SlashCommandBuilder , EmbedBuilder } = require('discord.js'); // importa componentes da biblioteca 'discord.js'
const axios = require('axios') //importa a biblioteca axios

module.exports = { //exporta o "data" e "execute", para ser usado em outros arquivos(como o index.js)

    data: new SlashCommandBuilder() //cria um novo comando e exporta ele para 'deploy-commands.js'
        .setName('clima') //escolhe o nome do comando(que vai ser o que o usuario terá que digitar para usa-lo)
        .setDescription('Mostra informações do clima de uma cidade') //escolhe a descrição(vai aparecer em baixo do nome)
        .addStringOption(option => option
            .setName('cidade')
            .setDescription('Digite o nome da cidade à qual será mostrado o clima')
            .setRequired(true)
        ),

    async execute(interaction){ // executa uma interação async (assincrona, ou seja, pode ter wait no meio e continuar rodando) e exporta tudo dentro dele para 'deplou-commands.js'

        await interaction.deferReply(); // espera até pegar a api

        try { //tenta pegar a opçao digita pelo usuario em 'cidade'

            const cidade = interaction.options.getString('cidade') // pega oque foi digitado pelo usuario na opção 'cidade' e guarda na variavel cidade

            const resposta = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${process.env.WEATHER_KEY}&units=metric&lang=pt_br`); // request na API
            const clima = resposta.data; // coloca as informações do request da API, na variavel clima

            const corAleatoria = Math.floor(Math.random() * 0xFFFFFF) //cria variavel corAleatoria, com calculo para escolher um hexadecimal de cor aleatorio, para colocar a cor do card
            const embed = new EmbedBuilder() //cria novo card
                .setColor(corAleatoria) // escolhe a cor do card (nesse caso, aleatoria)
                .setTitle('Informações de Clima') //escolhe o titulo do clima
                .addFields( //adiciona fields no card (seria um campo, para mostrar algo digitado)
                    {name: '🌍 Local', value: `${clima.name}, ${clima.sys.country} `},
                    {name: '🌤️ Clima', value: `${clima.weather[0].description}`},
                    {name: '🌡️ Temperatura', value: `${clima.main.temp}°C`},
                    {name: '🤔 Sensação Térmica', value: `${clima.main.feels_like}°C`},
                    {name: '💧 Umidade', value: `${clima.main.humidity}%`},
                    {name: '💨 Velocidade do vento', value: `${clima.wind.speed} m/s`},

                )

            await interaction.editReply({embeds: [embed]})



        } catch (erro){ // se de erro:
            if (erro.response.status === 404){
                await interaction.editReply('❌ Cidade não encontrada! Verifique o nome e tente novamente.')
            } else {
                await interaction.editReply('😵 Algo deu errado ao buscar o clima. Tente novamente!') // no discord mostra que deu erro ao tentar pegar a opçao de cidade(apenas para o usuario)
                console.error(erro); // mostrar qual é o erro (no terminal)
            }
        }

    }

};
