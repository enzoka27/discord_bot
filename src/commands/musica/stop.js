const { SlashCommandBuilder } = require('discord.js'); //importa o metodo slash... da biblioteca discordjs
module.exports = {
    data: new SlashCommandBuilder()
          .setName('stop')
          .setDescription('Para a música atual'),
          async execute(interaction){
            await interaction.client.distube.stop(interaction.guild);
            await interaction.reply({content: 'Parei!', ephemeral: true});
          }
}