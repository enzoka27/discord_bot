const { SlashCommandBuilder } = require('discord.js'); //importa o metodo slash... da biblioteca discordjs
module.exports = {
    data: new SlashCommandBuilder()
          .setName('previous')
          .setDescription('Retorna para a música anterior'),
          async execute(interaction){
            const queue = interaction.client.distube.getQueue(interaction.guild);
            if (!queue || queue.previousSongs.length == 0){
                await interaction.reply({content: 'Não existem músicas anteriores!', ephemeral: true});
                return;
            }
            await interaction.client.distube.previous(interaction.guild);
            await interaction.reply({content: 'Voltei!', ephemeral: true});
          }
}