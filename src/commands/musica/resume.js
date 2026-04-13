/**
 * Music Player - Resume Command Module
 * Resumes previously paused music
 * Uses DisTube's resume functionality
 */

const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  // Command definition
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resumes the paused music"),
  
  /**
   * Execute resume command
   * @param {Interaction} interaction - Discord interaction object
   */
  async execute(interaction) {
    // Get the current music queue
    const queue = interaction.client.distube.getQueue(interaction.guild);
    
    // Verify music queue exists
    if (!queue) {
      await interaction.reply({
        content: "There is nothing playing!",
        ephemeral: true,
      });
      return;
    }
    
    // Verify music is actually paused
    if (!queue.paused) {
      await interaction.reply({ content: "Music is already playing!", ephemeral: true });
      return;
    }
    
    // Resume music playback
    await interaction.client.distube.resume(interaction.guild);
    await interaction.reply({ content: "Resumed!", ephemeral: true });
  },
};