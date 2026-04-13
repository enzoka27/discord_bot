const { SlashCommandBuilder } = require("discord.js"); //importa o metodo slash... da biblioteca discordjs
module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pausa a música atual"),
  async execute(interaction) {
    const queue = interaction.client.distube.getQueue(interaction.guild);
    if (!queue) {
      await interaction.reply({
        content: "Não tem nada tocando!",
        ephemeral: true,
      });
      return;
    }
    if (queue.paused) {
      await interaction.reply({ content: "Já está pausado!", ephemeral: true });
      return;
    }
    await interaction.client.distube.pause(interaction.guild);
    await interaction.reply({ content: "Pausei!" });
  },
};