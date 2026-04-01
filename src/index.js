require('dotenv').config();
const state = require('./state.js');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { DisTube } = require('distube');
const ffmpeg = require('ffmpeg-static');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const { SpotifyPlugin } = require('@distube/spotify');

// Cria o cliente do bot
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ]
});

client.distube = new DisTube(client, {
  ffmpeg: { path: ffmpeg },
  plugins: [new SpotifyPlugin(), new YtDlpPlugin({
    update: false,
    ytdlOptions: {
      cookies: 'cookies.txt'
    }})]
});

client.distube.on('error', (error, queue) => {
  console.error('Erro no distube:', error.message);
  if (error.errorCode == 'YTDLP_ERROR' && error.message.includes('age')){
    console.log('queue:', queue)
    if (queue == null){
      return;
    }
    queue.textChannel.send('Este vídeo tem restrição de idade e não pode ser tocado!');
  }
});

client.distube.on('finishSong', (_, song) => {
  state.last_song = song;
});

// Coleção de comandos
client.commands = new Collection();

// Carrega todos os comandos automaticamente
const pastaComandos = path.join(__dirname, 'commands');
const subpastas = fs.readdirSync(pastaComandos);

for (const subpasta of subpastas) {
  const arquivos = fs.readdirSync(path.join(pastaComandos, subpasta)).filter(f => f.endsWith('.js'));
  for (const arquivo of arquivos) {
    const comando = require(path.join(pastaComandos, subpasta, arquivo));
    client.commands.set(comando.data.name, comando);
    console.log(`✅ Comando carregado: ${comando.data.name}`);
  }
}

// Carrega eventos
const pastaEventos = path.join(__dirname, 'events');
const arquivosEventos = fs.readdirSync(pastaEventos).filter(f => f.endsWith('.js'));
for (const arquivo of arquivosEventos) {
  const evento = require(path.join(pastaEventos, arquivo));
  client.on(evento.name, (...args) => evento.execute(...args));
}

// Bot online
client.once('ready', () => {
  console.log(`🤖 Bot online como ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);