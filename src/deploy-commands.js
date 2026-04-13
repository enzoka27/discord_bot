/**
 * Command Deployment Script
 * Registers all slash commands with Discord's API
 * Run this script whenever new commands are added or modified
 */

require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Load all command files from the commands directory
const commands = [];
const commands_folder = path.join(__dirname, 'commands');

for (const subfolder of fs.readdirSync(commands_folder)) {
  const files = fs.readdirSync(path.join(commands_folder, subfolder)).filter(f => f.endsWith('.js'));
  for (const file of files) {
    const cmd = require(path.join(commands_folder, subfolder, file));
    commands.push(cmd.data.toJSON());
  }
}

// Initialize REST client for API communication
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// Deploy commands to Discord
(async () => {
  console.log('Registering commands...');
  await rest.put(
    Routes.applicationCommands(process.env.CLIENT_ID),
    { body: commands }
  );
  console.log('✅ Commands registered successfully!');
})();