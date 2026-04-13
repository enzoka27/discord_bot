/**
 * Music Player - Play Command Module
 * Plays music from YouTube
 * Supports direct links and search queries
 * Uses DisTube for music playback management
 */

const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const axios = require("axios");
require("dotenv").config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Runs a search query or plays a YouTube link")
    .addStringOption((option) =>
      option
        .setName("search")
        .setDescription("Enter the music link here!")
        .setRequired(true),
    ),

  /**
   * Execute play command
   * @param {Interaction} interaction - Discord interaction object
   */
  async execute(interaction) {
    // Get music search query or link from user input
    const music = interaction.options.getString("search");
    
    // Verify user is in a voice channel
    if (!interaction.member.voice.channel) {
      await interaction.reply({
        content: "You are not in a voice channel!",
        ephemeral: true,
      });
      return;
    }

    // Fetch and validate music link
    const url = await fetch_music(music);
    
    // API error messages
    const api_responses = {
      INVALID_LINK: "Invalid link!",
      NOT_FOUND: "Music not found!",
      LIMIT_REACHED: "API request limit reached!",
      API_ERROR: "Error fetching music!",
    };
    
    // Return error if music fetch failed
    if (url in api_responses) {
      await interaction.reply({ content: api_responses[url], ephemeral: true });
      return;
    }

    // Check if queue already exists
    let in_queue = await interaction.client.distube.getQueue(interaction.guild);
    await interaction.deferReply();
    
    try {
      // Play the music
      await interaction.client.distube.play(
        interaction.member.voice.channel,
        url,
      );
    } catch (error) {
      // Handle age-restricted videos
      if (error.errorCode == "YTDLP_ERROR" && error.message.includes("age")) {
        await interaction.editReply({
          content: "This video is age-restricted and cannot be played!",
        });
      } else {
        await interaction.editReply({
          content: "Error playing music!",
        });
      }
      return;
    }
    
    // Get the queue and current song information
    const queue = interaction.client.distube.getQueue(interaction.guild);
    const current_song = queue.songs[0];
    const thumbnail = current_song.thumbnail;
    const song_title = current_song.name;
    
    // Create music playback embed
    const embed = new EmbedBuilder()
      .setColor("#ffffff")
      .setThumbnail(thumbnail)
      .setTitle(`Now Playing: ${song_title}`)
      .setDescription(url);
    
    // Reply based on whether song is queued or playing
    if (in_queue) {
      // Song was added to existing queue
      await interaction.editReply({
        content: `Added to queue! ${queue.songs.length - 1} songs ahead!`,
      });
    } else {
      // Playing first song in queue
      await interaction.editReply({ embeds: [embed] });
    }
  },
};

function validate_link(link) {
  // Validate YouTube link format
  const link_pattern =
    /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
  return link_pattern.test(link);
}

async function fetch_music(music) {
  // Search for music on YouTube and return complete link
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
    const api_url = "https://www.googleapis.com/youtube/v3/search";
    const base_link = "https://www.youtube.com/watch?v=";
    const response = await axios.get(api_url, {
      params: {
        q: music,
        part: "snippet",
        type: "video",
        maxResults: 1,
        key: process.env.YOUTUBE_TOKEN,
      },
    });

    if (!response.data.items || response.data.items.length === 0) {
      return "NOT_FOUND";
    }

    const video_id = response.data.items[0].id.videoId;
    return base_link + video_id;
  } catch (error) {
    if (error.response.status == 403) {
      return "LIMIT_REACHED";
    }
    return "API_ERROR";
  }
}