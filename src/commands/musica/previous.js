const { SlashCommandBuilder } = require("discord.js"); //importa o metodo slash... da biblioteca discordjs
const { EmbedBuilder } = require("discord.js");
const state = require("../../state.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("previous")
    .setDescription("Retorna para a música anterior"),
  async execute(interaction) {
    if (!state.last_song) {
      await interaction.reply({
        content: "Não tinha nada tocando!",
        ephemeral: true,
      });
      return;
    }
    await interaction.deferReply();
    await interaction.client.distube.play(
      interaction.member.voice.channel,
      state.last_song.url,
    );
    let queue = interaction.client.distube.getQueue(interaction.guild);
    const actual_song = queue.songs[0];
    const thumb = actual_song.thumbnail;
    const title = actual_song.name;
    const url = actual_song.url;
    const embed = new EmbedBuilder()
            .setColor("#ffffff")
            .setThumbnail(thumb)
            .setTitle(`Voltei! Agora tocando: ${title}`)
            .setDescription(url);
          await interaction.editReply({ embeds: [embed] });
    state.last_song=null;
  },
};