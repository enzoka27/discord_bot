const { SlashCommandBuilder } = require('discord.js');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('clima')
        .setDescription('Mostra informações de clima de uma cidade')
        .addStringOption(option => option // adiciona uma opção do tipo string ao comando, o segundo 'option' é o objeto que representa essa opção.(é uma função em apenas uma linha)
            .setName('cidade') // define
            .setDescription('Nome da cidade')
            .setRequired(true) // define que a opção é obrigatória (o usuario não consegue enviar o comando sem prencher ela)
        ),


    async execute(interaction) {

        const cidade = interaction.options.getString('cidade')
        await interaction.deferReply();
      
        



    }
};