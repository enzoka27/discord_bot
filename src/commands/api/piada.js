const { SlashCommandBuilder } = require('discord.js'); //cria função para slash command (comando / no discord)
const axios = require('axios')

module.exports = {
    data: new SlashCommandBuilder() //cria novo comando
        .setName('piada') // escolhe nome pro comando (nome que vai aparecer no discord pro usuario digitar)
        .setDescription('Mostra uma piada de programação'), // adiciona descrição do comando (vai aparecer embaixo do nome)

    async execute(interaction) { // executa uma interação
        await interaction.deferReply(); // espera até pegar a API

        const resposta = await axios.get('https://v2.jokeapi.dev/joke/Programming?type=twopart'); // request na API
        const piada = resposta.data; // coloca o resultado de quest na variavel piada

        await interaction.editReply(`Pergunta: ${piada.setup} Resposta: ${piada.delivery}`) // escreve a piada e a pergunta
    }
};