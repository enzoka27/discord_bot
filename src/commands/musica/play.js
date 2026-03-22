const { SlashCommandBuilder } = require('discord.js'); //importa o metodo slash... da biblioteca discordjs
require('dotenv').config();

module.exports = { //metodo embutido do nodejs que permite enviar dados pra outro arquivo com require
  data: new SlashCommandBuilder() //utiliza o metodo slashcb e define suas configurações dentro do método
        .setName('play')
        .setDescription('Roda músicas ou vídeos por link do youtube')
        .addStringOption(option=> option.setName('busca').setDescription('Coloque o link da música aqui!').setRequired(true)),
        async execute(interaction) { 
          const music = interaction.options.getString('busca'); //resposta do usuário
          if (!interaction.member.voice.channel){
            //usuário não está em um canal de voz
            await interaction.reply({content: 'Você não está em um canal de voz!', ephemeral: true});
            //mensagem de erro
            return;
          }
          const url = await fetch_music(music);
          if (!url) { 
              await interaction.reply({ content: 'Link inválido!', ephemeral: true });
              return;
            }
            await interaction.deferReply();
            await interaction.client.distube.play(interaction.member.voice.channel, url);
            await interaction.editReply({ content: 'Tocando música!' });
  }
}
function validate_link(link){ //valida o formato do link do youtube
  const link_pattern = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
  return link_pattern.test(link);
  }

async function fetch_music(music) {
  if (music.startsWith('http')) {
    if (!validate_link(music)) {
      return;
    }
  }
  return music;
}