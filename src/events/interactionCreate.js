module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
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