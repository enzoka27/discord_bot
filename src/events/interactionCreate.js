module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {

    if (interaction.isAutocomplete()) {
      const comando = interaction.client.commands.get(interaction.commandName)
      if (comando.autocomplete) {
        await comando.autocomplete(interaction)
      }
      return
    }

    if (!interaction.isChatInputCommand()) return;
    const comando = interaction.client.commands.get(interaction.commandName);
    if (!comando) return;

    try {
      await comando.execute(interaction);
    } catch (erro) {
      console.log('TESTE ERRO:' + erro);    
    }
  }
};