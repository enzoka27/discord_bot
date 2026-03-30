const {SlashCommandBuilder} = require('discord.js');
const {EmbedBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
          .setName('help')
          .setDescription('Mostra todos os comandos'),
          async execute(interaction){
            const lista = interaction.client.commands.map(cmd =>
                `/${cmd.data.name} >>>> ${cmd.data.description}`
            ).join('\n')
            const embed = new EmbedBuilder()
                          .setTitle('Comandos')
                          .setColor('#ffffff')
                          .setDescription(lista)
            await interaction.reply({embeds: [embed], ephemeral: true});
          }
}