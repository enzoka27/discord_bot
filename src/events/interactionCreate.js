module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
<<<<<<< HEAD
=======
    
>>>>>>> modulo-musicas
    if (!interaction.isChatInputCommand()) return;

    const comando = interaction.client.commands.get(interaction.commandName);
    if (!comando) return;

    try {
      await comando.execute(interaction);
    } catch (erro) {
      console.error(erro);
<<<<<<< HEAD
      await interaction.reply({ content: '❌ Erro ao executar o comando.', ephemeral: true });
=======
      if (interaction.deferred) {
        await interaction.editReply({ content: '❌ Erro ao executar o comando.' });
      } 
      else {
        await interaction.reply({ content: '❌ Erro ao executar o comando.', ephemeral: true });
}
>>>>>>> modulo-musicas
    }
  }
};