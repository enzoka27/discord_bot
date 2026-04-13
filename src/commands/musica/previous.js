/**
 * Music Player - Previous Command Module
 * Plays the last song that was stopped
 * Requires the state.js module to store the last song
 */

const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const state = require("../../state.js");
module.exports = {
  // Command definition
  data: new SlashCommandBuilder()
    .setName("previous")
    .setDescription("Plays the previous song"),
  
  /**
   * Execute previous command
   * @param {Interaction} interaction - Discord interaction object
   */
  async execute(interaction) {
    // Verify a previous song exists
    if (!state.last_song) {
      await interaction.reply({
        content: "There was nothing playing!",
        ephemeral: true,
      });
      return;
    }
    
    // Defer reply for API call
    await interaction.deferReply();
    
    // Play the previous song
    await interaction.client.distube.play(
      interaction.member.voice.channel,
      state.last_song.url,
    );
    
    // Get updated queue and current song
    let queue = interaction.client.distube.getQueue(interaction.guild);
    const current_song = queue.songs[0];
    const thumbnail = current_song.thumbnail;
    const song_title = current_song.name;
    const song_url = current_song.url;
    
    // Create now playing embed
    const embed = new EmbedBuilder()
      .setColor("#ffffff")
      .setThumbnail(thumbnail)
      .setTitle(`Went back! Now playing: ${song_title}`)
      .setDescription(song_url);
    
    await interaction.editReply({ embeds: [embed] });
    
    // Clear the last song from state
    state.last_song = null;
  },
};