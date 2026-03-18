const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Expulsa um usuário do servidor')
        .addUserOption(opt =>
         opt.setName('usuario')
            .setDescription('Quem expulsar')
            .setRequired(true))
        .addStringOption(opt =>
         opt.setName('motivo')
            .setDescription('Motivo do kick'))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async execute(interaction){
        if(!interaction.guild){
            return interaction.reply({
                content: 'Este comando só pode ser usado em servidores.  Me adicione em um servidor e poderá utilizar os comando devidamente!',
                ephemeral: true,
            });
        }

        const targetUser = interaction.options.getUser('usuario');
        const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);
        //.catch(() => null) -> se o .fetch() der erro, em vez de travar o bot, ele captura o erro silenciosamente e retorna null
        const reason = interaction.options.getString('motivo') ?? 'Sem motivo';

        //verifica se o membro esta no servidor
        if(!member){
            return interaction.reply({
                content: 'Esse usuário não está no servidor.',
                ephemeral: true,
            });
        }

        try{
            //expulsa o membro do servidor
            await member.kick(reason);

            await interaction.reply({
                content: `${targetUser.username} foi expulso.  Motivo: ${reason}`,
                ephemeral: false,
            });
        } catch (error){
            await interaction.reply({
                content: 'Não foi possível expulsar esse usuário.  Verifique se o cargo do bot é superior ao cargo do usuário.',
                ephemeral: true,
            });
        }
    }
}