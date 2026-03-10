require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const comandos = [];
const pastaComandos = path.join(__dirname, 'commands');

for (const subpasta of fs.readdirSync(pastaComandos)) {
  const arquivos = fs.readdirSync(path.join(pastaComandos, subpasta)).filter(f => f.endsWith('.js'));
  for (const arquivo of arquivos) {
    const cmd = require(path.join(pastaComandos, subpasta, arquivo));
    comandos.push(cmd.data.toJSON());
  }
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
  console.log('Registrando comandos...');
  await rest.put(
    Routes.applicationCommands(process.env.CLIENT_ID),
    { body: comandos }
  );
  console.log('✅ Comandos registrados!');
})();