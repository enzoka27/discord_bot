/**
 * Help Command Module
 * Displays a complete list of all available bot commands
 * Shows command names and descriptions
 */

const {SlashCommandBuilder} = require('discord.js');
const {EmbedBuilder} = require('discord.js');

module.exports = {
    // Command definition
    data: new SlashCommandBuilder()
          .setName('help')
          .setDescription('Shows all available commands'),
    
    /**
     * Execute help command
     * @param {Interaction} interaction - Discord interaction object
     */
    async execute(interaction){
      // Map all commands from the bot's command collection
      const list = interaction.client.commands.map(cmd =>
          `/${cmd.data.name} >>>> ${cmd.data.description}`
      ).join('\n');
      
      // Create embedded command list
      const embed = new EmbedBuilder()
                      .setTitle('Commands')
                      .setColor('#ffffff')
                      .setDescription(list);
      
      // Reply with command list (visible only to user)
      await interaction.reply({embeds: [embed], ephemeral: true});
    }
}