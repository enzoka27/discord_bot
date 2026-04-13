/**
 * Music Player - Pause Command Module
 * Pauses the currently playing music
 * Uses DisTube's pause functionality
 */

const { SlashCommandBuilder } = require("discord.js");
module.exports = {
  // Command definition
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pauses the current music"),
  
  /**
   * Execute pause command
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
    
    // Verify music is not already paused
    if (queue.paused) {
      await interaction.reply({ content: "Music is already paused!", ephemeral: true });
      return;
    }
    
    // Pause the music
    await interaction.client.distube.pause(interaction.guild);
    await interaction.reply({ content: "Paused!" });
  },
};