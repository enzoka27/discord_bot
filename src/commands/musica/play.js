const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const axios = require("axios");
require("dotenv").config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Roda músicas ou vídeos por link do youtube")
    .addStringOption((option) =>
      option
        .setName("busca")
        .setDescription("Coloque o link da música aqui!")
        .setRequired(true),
    ),

  async execute(interaction) {
    const music = interaction.options.getString("busca"); //resposta do usuário
    if (!interaction.member.voice.channel) {
      //usuário não está em um canal de voz
      await interaction.reply({
        content: "Você não está em um canal de voz!",
        ephemeral: true,
      });
      return;
    }

    const url = await fetch_music(music);
    const api_responses = {
      //armazena possíveis erros do fetch_music
      INVALID_LINK: "Link inválido!",
      NOT_FOUND: "Música não encontrada!",
      LIMIT_REACHED: "Limite de requisições atingido!",
      API_ERROR: "Erro ao buscar música!",
    };
    if (url in api_responses) {
      //retorna erros da api
      await interaction.reply({ content: api_responses[url], ephemeral: true });
      return;
    }

    let in_fila = await interaction.client.distube.getQueue(interaction.guild);
    await interaction.deferReply();
    try {
      await interaction.client.distube.play(
        interaction.member.voice.channel,
        url,
      ); //toca música
    } catch (error) {
      if (error.errorCode == "YTDLP_ERROR" && error.message.includes("age")) {
        await interaction.editReply({
          content: "Este vídeo tem restrição de idade e não pode ser tocado!",
        });
      } else {
        await interaction.editReply({
          content: "Erro ao tocar a música!",
        });
      }
      return;
    }
    const queue = interaction.client.distube.getQueue(interaction.guild);
    const actual_song = queue.songs[0];
    const thumb = actual_song.thumbnail;
    const title = actual_song.name;
    const embed = new EmbedBuilder()
      .setColor("#ffffff")
      .setThumbnail(thumb)
      .setTitle(`Tocando: ${title}`)
      .setDescription(url);
    if (in_fila) {
      //adiciona música na fila
      await interaction.editReply({
        content: `Adicionada à fila! ${queue.songs.length - 1} músicas adiante!`,
      });
    } else {
      //toca música (zero fila)
      await interaction.editReply({ embeds: [embed] });
    }
  },
};

function validate_link(link) {
  //valida o formato do link do youtube
  const link_pattern =
    /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
  return link_pattern.test(link);
}

async function fetch_music(music) {
  //busca música no youtube e retorna o link completo
  if (music.includes("spotify.com")) {
    return music;
  }

  if (music.startsWith("http")) {
    if (!validate_link(music)) {
      return "INVALID_LINK";
    }
    return music;
  }

  try {
    const url_api = "https://www.googleapis.com/youtube/v3/search";
    const base_link = "https://www.youtube.com/watch?v=";
    const resposta = await axios.get(url_api, {
      params: {
        q: music,
        part: "snippet",
        type: "video",
        maxResults: 1,
        key: process.env.YOUTUBE_TOKEN,
      },
    });

    if (!resposta.data.items || resposta.data.items.length === 0) {
      return "NOT_FOUND";
    }

    const complement_link = resposta.data.items[0].id.videoId;
    return base_link + complement_link;
  } catch (error) {
    if (error.response.status == 403) {
      return "LIMIT_REACHED";
    }
    return "API_ERROR";
  }
}