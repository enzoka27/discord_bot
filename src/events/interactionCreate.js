module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const comando = interaction.client.commands.get(interaction.commandName);
    if (!comando) return;

    try {
      await comando.execute(interaction);
    } catch (erro) {
      if (interaction.deferred) {
        await interaction.editReply({ content: '❌ Erro ao executar o comando.' });
      } 
      else {
        await interaction.reply({ content: '❌ Erro ao executar o comando.', ephemeral: true });
}
    }
  }
};