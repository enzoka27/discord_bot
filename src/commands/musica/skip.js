const { SlashCommandBuilder } = require('discord.js'); //importa o metodo slash... da biblioteca discordjs
module.exports = {
    data: new SlashCommandBuilder()
          .setName('skip')
          .setDescription('Pula para a próxima música'),
          async execute(interaction){
            await interaction.client.distube.skip(interaction.guild);
            await interaction.reply({content: 'Pulei!', ephemeral: true});
          }
}