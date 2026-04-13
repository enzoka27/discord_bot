/**
 * Interaction Create Event Handler
 * Handles all Discord interactions (slash commands, buttons, modals, etc.)
 * Routes commands to their respective execute functions
 */

module.exports = {
  // Event name that triggers this handler
  name: 'interactionCreate',
  
  /**
   * Execute event handler
   * @param {Interaction} interaction - Discord interaction object
   */
  async execute(interaction) {
    // Handle autocomplete interactions
    if (interaction.isAutocomplete()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (command.autocomplete) {
        await command.autocomplete(interaction);
      }
      return;
    }

    // Only handle slash commands
    if (!interaction.isChatInputCommand()) return;
    
    // Fetch the command from the commands collection
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;

    // Execute the command with error handling
    try {
      await command.execute(interaction);
    } catch (error) {
      // Log command execution errors
      console.log('Command execution error: ' + error);    
    }
  }
};