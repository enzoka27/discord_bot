const { SlashCommandBuilder } = require("discord.js"); //importa o metodo slash... da biblioteca discordjs
const { EmbedBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Pula para a próxima música"),
  async execute(interaction) {
    let queue = interaction.client.distube.getQueue(interaction.guild);
    if (!queue) {
      await interaction.reply({
        content: "Não tem nada tocando!",
        ephemeral: true,
      });
      return;
    }
    if (queue.songs.length > 1) {
      await interaction.client.distube.skip(interaction.guild);
      queue = interaction.client.distube.getQueue(interaction.guild);
      const actual_song = queue.songs[0];
      const thumb = actual_song.thumbnail;
      const title = actual_song.name;
      const url = actual_song.url;
      const embed = new EmbedBuilder()
        .setColor("#ffffff")
        .setThumbnail(thumb)
        .setTitle(`Pulei! Agora tocando: ${title}`)
        .setDescription(url);
      await interaction.reply({ embeds: [embed] });
      return;
    }
    await interaction.reply({
      content: "Sem músicas na fila!",
      ephemeral: true,
    });
  },
};