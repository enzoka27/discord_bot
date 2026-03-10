const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Verifica se o bot está online'),

  async execute(interaction) {
    const latencia = Date.now() - interaction.createdTimestamp;
    await interaction.reply(`🏓 Pong! Latência: **${latencia}ms**`);
  }
};
```

**src/commands/moderacao/.gitkeep** — arquivo vazio mesmo

**src/commands/musica/.gitkeep** — arquivo vazio mesmo

Depois cria também o **src/deploy-commands.js** com o código que passei anteriormente.

Quando tiver tudo criado, faz o push:
```