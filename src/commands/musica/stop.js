const { SlashCommandBuilder } = require("discord.js"); //importa o metodo slash... da biblioteca discordjs
const state = require("../../state.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Para a música atual"),
  async execute(interaction) {
    const queue = interaction.client.distube.getQueue(interaction.guild);
    if (!queue) {
      await interaction.reply({
        content: "Não tem nada tocando!",
        ephemeral: true,
      });
      return;
    }
    state.last_song = queue.songs[0];
    await interaction.client.distube.stop(interaction.guild);
    await interaction.reply({ content: "Parei!" });
  },
};