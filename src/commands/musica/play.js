const {SlashCommandBuilder} = require('discord.js'); //importa o metodo slash... da biblioteca discordjs

module.exports = { //metodo embutido do nodejs que permite enviar dados pra outro arquivo com require
  data: new SlashCommandBuilder() //utiliza o metodo slashcb e define suas configurações dentro do método
        .setName('play')
        .setDescription('Toca músicas por link ou nome'),
        async execute(interaction) { 
          if (!interaction.member.voice.channel){
            //usuário não está em um canal de voz
            await interaction.reply({content: 'Você não está em um canal de voz!', ephemeral: true});
            //mensagem de erro
            return; //finaliza a execução
          }
          const music = interaction.options.getString('busca');
  }
}