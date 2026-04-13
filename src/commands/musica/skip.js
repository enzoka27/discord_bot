/**
 * Music Player - Skip Command Module
 * Skips to the next song in the queue
 * Displays information about the new current song
 */

const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
module.exports = {
  // Command definition
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips to the next song"),
  
  /**
   * Execute skip command
   * @param {Interaction} interaction - Discord interaction object
   */
  async execute(interaction) {
    // Get the current music queue
    let queue = interaction.client.distube.getQueue(interaction.guild);
    
    // Verify music is currently playing
    if (!queue) {
      await interaction.reply({
        content: "There is nothing playing!",
        ephemeral: true,
      });
      return;
    }
    
    // Check if there are songs to skip to
    if (queue.songs.length > 1) {
      // Skip to next song
      await interaction.client.distube.skip(interaction.guild);
      queue = interaction.client.distube.getQueue(interaction.guild);
      
      // Get new current song information
      const current_song = queue.songs[0];
      const thumbnail = current_song.thumbnail;
      const song_title = current_song.name;
      const song_url = current_song.url;
      
      // Create now playing embed
      const embed = new EmbedBuilder()
        .setColor("#ffffff")
        .setThumbnail(thumbnail)
        .setTitle(`Skipped! Now playing: ${song_title}`)
        .setDescription(song_url);
      
      await interaction.reply({ embeds: [embed] });
      return;
    }
    
    // No songs in queue to skip to
    await interaction.reply({
      content: "No songs in queue!",
      ephemeral: true,
    });
  },
};