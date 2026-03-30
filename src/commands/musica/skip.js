const { SlashCommandBuilder } = require('discord.js'); //importa o metodo slash... da biblioteca discordjs
module.exports = {
    data: new SlashCommandBuilder()
          .setName('skip')
          .setDescription('Pula para a próxima música'),
          async execute(interaction){
            const queue = interaction.client.distube.getQueue(interaction.guild);
            if (!queue){
              await interaction.reply({content: 'Não tem nada tocando!', ephemeral: true});
              return;
            }
            if (queue.songs.length > 1){
              await interaction.client.distube.skip(interaction.guild);
              await interaction.reply({content: 'Pulei!', ephemeral: true});
              return;
            }
            await interaction.reply({content: 'Sem músicas na fila!', ephemeral: true});
          }
}