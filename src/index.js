/**
 * Main entry point for the Discord bot
 * Initializes the bot client, loads commands, events, and configures music playback
 */

require('dotenv').config();
const state = require('./state.js');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { DisTube } = require('distube');
const ffmpeg = require('ffmpeg-static');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const { SpotifyPlugin } = require('@distube/spotify');

// Initialize Discord bot client with required intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,           // Access to guild events
    GatewayIntentBits.GuildMessages,    // Access to message events
    GatewayIntentBits.GuildMembers,     // Access to member events
    GatewayIntentBits.GuildVoiceStates, // Access to voice state changes
    GatewayIntentBits.MessageContent,   // Access to message content
  ]
});

// Configure DisTube for music playback with Spotify and YouTube support
client.distube = new DisTube(client, {
  ffmpeg: { path: ffmpeg },
  plugins: [new SpotifyPlugin(), new YtDlpPlugin({
    update: false
  })]
});

// Handle DisTube errors
client.distube.on('error', (error, queue, song) => {
  console.error('DisTube Error:', error.message);
  // Handle age-restricted videos
  if (error.errorCode == 'YTDLP_ERROR' && error.message.includes('age')){
    if (queue && queue.textChannel){
      queue.textChannel.send('This video is age-restricted and cannot be played!');
    }
  }
});

// Store the last song played for the previous command
client.distube.on('finishSong', (_, song) => {
  state.last_song = song;
});

// Initialize commands collection
client.commands = new Collection();

// Automatically load all command files from the commands directory
const commands_folder = path.join(__dirname, 'commands');
const subfolders = fs.readdirSync(commands_folder);

for (const subfolder of subfolders) {
  const files = fs.readdirSync(path.join(commands_folder, subfolder)).filter(f => f.endsWith('.js'));
  for (const file of files) {
    const command = require(path.join(commands_folder, subfolder, file));
    client.commands.set(command.data.name, command);
    console.log(`✅ Command loaded: ${command.data.name}`);
  }
}

// Load all event listeners from the events directory
const events_folder = path.join(__dirname, 'events');
const event_files = fs.readdirSync(events_folder).filter(f => f.endsWith('.js'));
for (const file of event_files) {
  const event = require(path.join(events_folder, file));
  client.on(event.name, (...args) => event.execute(...args));
}

// Log when bot successfully connects to Discord
client.once('ready', () => {
  console.log(`🤖 Bot online as ${client.user.tag}`);
});

// Login to Discord using the token from environment variables
client.login(process.env.DISCORD_TOKEN);