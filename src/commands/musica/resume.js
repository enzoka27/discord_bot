const { SlashCommandBuilder } = require('discord.js'); //importa o metodo slash... da biblioteca discordjs

module.exports = {
    data: new SlashCommandBuilder()
          .setName('resume')
          .setDescription('Despausa a música atual'),
          async execute(interaction){
            const queue = interaction.client.distube.getQueue(interaction.guild);
            if (!queue.paused){
                await interaction.reply({content: 'Já está tocando!', ephemeral: true});
                return;
            }
            await interaction.client.distube.resume(interaction.guild);
            await interaction.reply({content: 'Despausei!', ephemeral: true});
          }
}