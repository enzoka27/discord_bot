# Discord Bot

A feature-rich Discord bot with music playback, moderation tools, and API integrations.

## Features

- **Music Commands**: Play, pause, resume, skip, stop, and previous track functionality
- **Moderation**: Ban, kick, mute, unmute, warn, view warn and clear commands
- **API Commands**: Weather, movie info, currency conversion, jokes, and translation
- **Utility**: Help command and interactive features
- **Music Streaming**: Support for YouTube through DisTube

## Prerequisites

Before running the bot, make sure you have:

- **Node.js** installed (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **FFmpeg** installed on your system - [Download here](https://ffmpeg.org/download.html)
- A **Discord bot token** from the [Discord Developer Portal](https://discord.com/developers/applications)
- A **Discord application/client ID** from the [Discord Developer Portal](https://discord.com/developers/applications)
- A **YouTube API key** from the [Google Cloud Console](https://console.cloud.google.com/)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/enzoka27/discord_bot.git
cd discord_bot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment variables

Create a `.env` file in the root directory of the project and add the following:

```env
DISCORD_TOKEN=your_discord_bot_token_here
CLIENT_ID=your_discord_application_client_id_here
YOUTUBE_TOKEN=your_youtube_api_key_here
WEATHER_KEY=your_weather_api_key_here
OMDB_API_KEY=your_movie_api_key_here
EXCHANGE_KEY=your_currency_api_key_here
```

#### Getting Your Credentials

- **DISCORD_TOKEN**: Go to [Discord Developer Portal](https://discord.com/developers/applications), select your application, go to "Bot" section, and copy the token
- **CLIENT_ID**: In the same application, go to "General Information" and copy the "Application ID"
- **YOUTUBE_TOKEN**: Go to [Google Cloud Console](https://console.cloud.google.com/), create a project, enable the YouTube Data API v3, and create an API key
- **WEATHER_KEY**: Get from [OpenWeatherMap](https://openweathermap.org/api) or similar weather API service
- **OMDB_API_KEY**: Get from [OMDb API](https://www.omdbapi.com/)
- **EXCHANGE_KEY**: Get from [Exchange Rate API](https://exchangerate-api.com/) or similar service

### 4. Deploy commands (First time only)

```bash
node src/deploy-commands.js
```

This registers all slash commands with Discord.

## Running the Bot

Start the bot with:

```bash
node src/index.js
```

The bot will connect to Discord and be ready to use. You should see a message in the console confirming the connection.

## Available Commands

### Music Commands
- `/play [song/url]` - Play a song from YouTube
- `/pause` - Pause the current song
- `/resume` - Resume the paused song
- `/skip` - Skip to the next song
- `/previous` - Play the previous song
- `/stop` - Stop the music player

### Moderation Commands
- `/warn [user]` - Warn a user
- `/viewwarn [user]` - View warnings for a user
- `/mute [user] [duration]` - Mute a user
- `/unmute [user]` - Unmute a user
- `/kick [user]` - Kick a user from the server
- `/ban [user]` - Ban a user from the server
- `/unban [user]` - Unban a user from the server
- `/clear [amount]` - Clear messages from the channel

### API Commands
- `/weather [city]` - Get weather information
- `/movie [title]` - Get movie information
- `/currency [amount] [from] [to]` - Convert currency
- `/joke` - Get a random joke
- `/translate [text] [language]` - Translate text

### Utility Commands
- `/help` - Show all available commands

## Troubleshooting

- **Bot not responding**: Make sure the token in `.env` is correct and the bot has the required permissions
- **Music not playing**: Ensure FFmpeg is installed and in your system PATH
- **Commands not showing**: Run `node src/deploy-commands.js` again
- **Permission errors**: Check that the bot has the necessary permissions in your Discord server

## License

ISC