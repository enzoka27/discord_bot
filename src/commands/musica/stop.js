/**
 * Music Player - Stop Command Module
 * Stops music playback and clears the queue
 * Saves the current song for the previous command
 */

const { SlashCommandBuilder } = require("discord.js");
const state = require("../../state.js");
module.exports = {
  // Command definition
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stops the current music"),
  
  /**
   * Execute stop command
   * @param {Interaction} interaction - Discord interaction object
   */
  async execute(interaction) {
    // Get the current music queue
    const queue = interaction.client.distube.getQueue(interaction.guild);
    
    // Verify music is currently playing
    if (!queue) {
      await interaction.reply({
        content: "There is nothing playing!",
        ephemeral: true,
      });
      return;
    }
    
    // Save current song for the /previous command
    state.last_song = queue.songs[0];
    
    // Stop music playback
    await interaction.client.distube.stop(interaction.guild);
    await interaction.reply({ content: "Stopped!" });
  },
};