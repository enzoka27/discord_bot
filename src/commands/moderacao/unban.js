const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Remove o ban de um usuário')
        //id do usuario a desbanir
        .addStringOption(opt =>
         opt.setName('id')
            .setDescription('ID do usuário a desbanir')
            .setRequired(true))
        .addStringOption(opt =>
         opt.setName('motivo')
            .setDescription('Motivo do unban'))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction){
        if(!interaction.guild){
            return interaction.reply({
                content: 'Este comando só pode ser usado em servidores.  Me adicione em um servidor e poderá utilizar os comandos devidamente!',
                ephemeral: true,
            });
        }

        const userID = interaction.options.getString('id');
        const reason = interaction.options.getString('motivo') ?? 'Não definido';

        try{
            //verifica se o usuario realmente esta banido
            const banned = await interaction.guild.bans.fetch(userID).catch(() => null);
            //.catch(() => null) -> se o .fetch() der erro, em vez de travar o bot, ele captura o erro silenciosamente e retorna null

            if(!banned){
                return interaction.reply({
                    content: 'Este usuário não está banido ou o ID é inválido.',
                    ephemeral: true,
                });
            }

            //remove o ban
            await interaction.guild.members.unban(userID, reason);

            await interaction.reply({
                content: `<@${userID}> foi desbanido.  Motivo: ${reason}.`,
                ephemeral: false,
            });
        } catch (error){
            await interaction.reply({
                content: 'Não foi possível desbanir este usuário.  Verifique se o ID está correto.',
                ephemeral: true,
            });
        }
    }
}