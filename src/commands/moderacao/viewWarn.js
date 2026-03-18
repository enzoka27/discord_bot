const { SlashCommandBuilder } = require('discord.js');
const { warnings } = require('./warn'); //exportar o Map no warn.js para acessar os mesmos dados

module.exports = {
    data: new SlashCommandBuilder()
        .setName('veravisos')
        .setDescription('Ver avisos de um usuário')
        .addUserOption(opt =>
            opt.setName('usuario')
            .setDescription('Usuário')
            .setRequired(true)),
    
    async execute(interaction){
        const user = interaction.options.getUser('usuario');
        //a mesma chave usada no warn.js para salvar os avisos
        const key = `${interaction.guild.id}-${user.id}`;
        //busca a lista de avisos desse usuário no Map
        const list = warnings.get(key);

        //se n achou nd ou a lista está vazia, responde que n tem avisos e para aqui
        if(!list || list.length === 0){
            return interaction.reply({
                content: `${user.username} não tem avisos`,
                ephemeral: true,
            });
        }

        //transforma a lista de avisos em texto formatado
        //w = cada aviso, i = índice(0, 1, 2, ...)
        //i + 1 pq o índice começa em 0, mas precisa mostrar 1, 2, 3, ...
        const text = list.map((w, i) =>
            `${i + 1}. Motivo: '${w.reason}'\n   data: '${w.data}'\n   Aplicado por: '${w.aplicadoPor}'`
        ).join('\n\n');

        //responde com o texto formatado dentro de ``` ``` (bloco de codigo no dc)
        // \` é um backtick escapado (necessário dentro de template strings)
        await interaction.reply({
            content: `Avisos de ${user.username}:\`\`\`\n${text}\`\`\``,
            ephemeral: true,
        });
    }
};