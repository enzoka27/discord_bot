const { SlashCommandBuilder } = require('discord.js'); //importa o metodo slash... da biblioteca discordjs
require('dotenv').config();
const axios = require('axios');

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
          if (url == 'INVALID_LINK') { 
              await interaction.reply({content: 'Link inválido!', ephemeral: true});
              return;
            }
          if (url == 'NOT_FOUND'){
            await interaction.reply({content: 'Música não encontrada!', ephemeral: true});
            return;
          }
          if (url == 'LIMIT_REACHED'){
            await interaction.reply({content: 'Limite de requisições atingido!', ephemeral: true});
            return;
          }
          if (url == 'API_ERROR'){
            await interaction.reply({content: 'Erro ao buscar música!', ephemeral: true});
            return;
          }
            let in_fila = await interaction.client.distube.getQueue(interaction.guild)
            await interaction.deferReply();
            await interaction.client.distube.play(interaction.member.voice.channel, url);
            const queue = interaction.client.distube.getQueue(interaction.guild);
            if (in_fila){
              await interaction.editReply({content: `Adicionada à fila! ${queue.songs.length-1} músicas adiante!`});
            }
            else{
              await interaction.editReply({content: 'Tocando música!'});
            }
  }
}
function validate_link(link){ //valida o formato do link do youtube
  const link_pattern = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
  return link_pattern.test(link);
  }

async function fetch_music(music) {
  if (music.includes('spotify.com')) {
  return music;
}
  if (music.startsWith('http')) {
    if (!validate_link(music)) {
      return 'INVALID_LINK';
    }
    return music;
  }
  try {
    const url_api = 'https://www.googleapis.com/youtube/v3/search';
    const base_link = 'https://www.youtube.com/watch?v=';
    const resposta = await axios.get(url_api, {
    params: {
      q: music,
      part: 'snippet',
      type: 'video',
      maxResults: 1,
      key: process.env.YOUTUBE_TOKEN
    }
  })
  if (!resposta.data.items || resposta.data.items.length === 0) {
  return 'NOT_FOUND';
}
  const complement_link = resposta.data.items[0].id.videoId
  return base_link + complement_link;
  } 
  catch (error) {
    if (error.response.status == 403){
      return 'LIMIT_REACHED';
    }
    return 'API_ERROR';
  }
}