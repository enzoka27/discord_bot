const { SlashCommandBuilder } = require('discord.js'); //importa o metodo slash... da biblioteca discordjs
const state = require('../../state.js');
module.exports = {
    data: new SlashCommandBuilder()
          .setName('previous')
          .setDescription('Retorna para a música anterior'),
          async execute(interaction){
            if (!state.last_song){
                await interaction.reply({content: 'Não tinha nada tocando!', ephemeral: true});
                return;
            }
            await interaction.deferReply();
            await interaction.client.distube.play(interaction.member.voice.channel, state.last_song.url);
            await interaction.editReply({content: 'Voltei!', ephemeral: true});
          }
}